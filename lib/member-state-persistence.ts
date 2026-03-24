import { Platform, Prisma, ReceiptStatus } from "@prisma/client";
import type { Session } from "next-auth";

import { prisma } from "@/lib/prisma";
import {
  createEmptyPersistedMemberState,
  normalizePersistedMemberState,
} from "@/lib/stores/member-state";
import type {
  PersistedMemberState,
  ReceiptRecord,
} from "@/lib/stores/home-store-types";

type LoadedMemberProfile = Prisma.MemberProfileGetPayload<{
  include: {
    favorites: {
      orderBy: {
        createdAt: "desc";
      };
    };
    alerts: {
      orderBy: {
        createdAt: "desc";
      };
    };
    receipts: {
      orderBy: {
        createdAt: "desc";
      };
      take: 12;
    };
  };
}>;

function toPlatformEnum(platform: ReceiptRecord["platform"]) {
  switch (platform) {
    case "grab":
      return Platform.GRAB;
    case "line-man":
      return Platform.LINE_MAN;
    case "shopeefood":
      return Platform.SHOPEEFOOD;
  }
}

function fromPlatformEnum(platform: Platform): ReceiptRecord["platform"] {
  switch (platform) {
    case Platform.GRAB:
      return "grab";
    case Platform.LINE_MAN:
      return "line-man";
    case Platform.SHOPEEFOOD:
      return "shopeefood";
  }
}

function toReceiptStatusEnum(status: ReceiptRecord["status"]) {
  switch (status) {
    case "processing":
      return ReceiptStatus.PROCESSING;
    case "verified":
      return ReceiptStatus.VERIFIED;
  }
}

function fromReceiptStatusEnum(
  status: ReceiptStatus,
): ReceiptRecord["status"] {
  switch (status) {
    case ReceiptStatus.PROCESSING:
      return "processing";
    case ReceiptStatus.VERIFIED:
      return "verified";
  }
}

function mapProfileToState(profile: LoadedMemberProfile): PersistedMemberState {
  const receiptHistory: ReceiptRecord[] = profile.receipts.map((receipt) => ({
    id: receipt.id,
    fileName: receipt.fileName,
    scenarioId: receipt.scenarioId,
    platform: fromPlatformEnum(receipt.platform),
    restaurant: receipt.restaurant,
    itemName: receipt.itemName,
    district: receipt.district,
    totalPrice: receipt.totalPrice,
    createdAt: receipt.createdAt.getTime(),
    verifiedAt: receipt.verifiedAt?.getTime() ?? null,
    status: fromReceiptStatusEnum(receipt.status),
    pointsAwarded: receipt.pointsAwarded,
    ocrConfidence: receipt.status === ReceiptStatus.VERIFIED ? 96 : null,
    truthScore: receipt.status === ReceiptStatus.VERIFIED ? 92 : null,
    fraudSignals: [],
    reviewStatus:
      receipt.status === ReceiptStatus.VERIFIED
        ? "auto-approved"
        : "queued",
  }));

  return {
    favoriteScenarioIds: profile.favorites.map((favorite) => favorite.scenarioId),
    priceAlerts: profile.alerts.map((alert) => ({
      id: alert.id,
      scenarioId: alert.scenarioId,
      platform: fromPlatformEnum(alert.platform),
      targetPrice: alert.targetPrice,
      enabled: alert.enabled,
      createdAt: alert.createdAt.getTime(),
    })),
    rewardPoints: profile.rewardPoints,
    latestReceipt: receiptHistory[0] ?? null,
    receiptHistory,
  };
}

async function loadMemberProfile(memberKey: string) {
  return prisma.memberProfile.findUnique({
    where: { memberKey },
    include: {
      favorites: {
        orderBy: { createdAt: "desc" },
      },
      alerts: {
        orderBy: { createdAt: "desc" },
      },
      receipts: {
        orderBy: { createdAt: "desc" },
        take: 12,
      },
    },
  });
}

function collectReceipts(state: PersistedMemberState) {
  const receiptsById = new Map<string, ReceiptRecord>();

  if (state.latestReceipt) {
    receiptsById.set(state.latestReceipt.id, state.latestReceipt);
  }

  for (const receipt of state.receiptHistory) {
    if (!receiptsById.has(receipt.id)) {
      receiptsById.set(receipt.id, receipt);
    }
  }

  return [...receiptsById.values()]
    .sort((receiptA, receiptB) => receiptB.createdAt - receiptA.createdAt)
    .slice(0, 12);
}

export function getMemberIdentityFromSession(session: Session) {
  const email = session.user?.email?.trim().toLowerCase() ?? null;
  const name = session.user?.name?.trim() ?? null;
  const fallbackId = session.user?.id?.trim() ?? "member";

  return {
    email,
    name,
    memberKey: email ? `email:${email}` : `user:${fallbackId}`,
  };
}

export async function getOrCreateMemberState(session: Session) {
  const identity = getMemberIdentityFromSession(session);
  const existingRecord = await loadMemberProfile(identity.memberKey);

  if (existingRecord) {
    return {
      memberKey: identity.memberKey,
      state: mapProfileToState(existingRecord),
    };
  }

  await prisma.memberProfile.create({
    data: {
      memberKey: identity.memberKey,
      email: identity.email,
      name: identity.name,
      rewardPoints: 0,
    },
  });

  const createdRecord = await loadMemberProfile(identity.memberKey);

  if (!createdRecord) {
    return {
      memberKey: identity.memberKey,
      state: createEmptyPersistedMemberState(),
    };
  }

  return {
    memberKey: identity.memberKey,
    state: mapProfileToState(createdRecord),
  };
}

export async function saveMemberState(
  session: Session,
  input: PersistedMemberState,
) {
  const identity = getMemberIdentityFromSession(session);
  const normalizedState = normalizePersistedMemberState(input);
  const favoriteScenarioIds = [...new Set(normalizedState.favoriteScenarioIds)];
  const priceAlerts = [
    ...new Map(
      normalizedState.priceAlerts.map((alert) => [alert.id, alert] as const),
    ).values(),
  ];
  const receipts = collectReceipts(normalizedState);
  const favoriteBaseTimestamp = Date.now();

  await prisma.$transaction(async (transaction) => {
    await transaction.memberProfile.upsert({
      where: { memberKey: identity.memberKey },
      update: {
        email: identity.email,
        name: identity.name,
        rewardPoints: normalizedState.rewardPoints,
      },
      create: {
        memberKey: identity.memberKey,
        email: identity.email,
        name: identity.name,
        rewardPoints: normalizedState.rewardPoints,
      },
    });

    await transaction.memberFavorite.deleteMany({
      where: { memberKey: identity.memberKey },
    });

    if (favoriteScenarioIds.length) {
      await transaction.memberFavorite.createMany({
        data: favoriteScenarioIds.map((scenarioId, index) => ({
          memberKey: identity.memberKey,
          scenarioId,
          createdAt: new Date(favoriteBaseTimestamp - index * 1_000),
        })),
      });
    }

    await transaction.memberPriceAlert.deleteMany({
      where: { memberKey: identity.memberKey },
    });

    if (priceAlerts.length) {
      await transaction.memberPriceAlert.createMany({
        data: priceAlerts.map((alert) => ({
          id: alert.id,
          memberKey: identity.memberKey,
          scenarioId: alert.scenarioId,
          platform: toPlatformEnum(alert.platform),
          targetPrice: alert.targetPrice,
          enabled: alert.enabled,
          createdAt: new Date(alert.createdAt),
        })),
      });
    }

    await transaction.memberReceipt.deleteMany({
      where: { memberKey: identity.memberKey },
    });

    if (receipts.length) {
      await transaction.memberReceipt.createMany({
        data: receipts.map((receipt) => ({
          id: receipt.id,
          memberKey: identity.memberKey,
          fileName: receipt.fileName,
          scenarioId: receipt.scenarioId,
          platform: toPlatformEnum(receipt.platform),
          restaurant: receipt.restaurant,
          itemName: receipt.itemName,
          district: receipt.district,
          totalPrice: receipt.totalPrice,
          createdAt: new Date(receipt.createdAt),
          verifiedAt: receipt.verifiedAt ? new Date(receipt.verifiedAt) : null,
          status: toReceiptStatusEnum(receipt.status),
          pointsAwarded: receipt.pointsAwarded,
        })),
      });
    }
  });

  const savedRecord = await loadMemberProfile(identity.memberKey);

  if (!savedRecord) {
    return {
      memberKey: identity.memberKey,
      state: createEmptyPersistedMemberState(),
    };
  }

  return {
    memberKey: identity.memberKey,
    state: mapProfileToState(savedRecord),
  };
}
