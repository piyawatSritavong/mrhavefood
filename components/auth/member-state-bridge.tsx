"use client";

import { useEffect, useMemo, useRef } from "react";
import { useSession } from "next-auth/react";

import {
  createPersistedMemberStateFromStore,
  normalizePersistedMemberState,
} from "@/lib/stores/member-state";
import type { PersistedMemberState } from "@/lib/stores/home-store-types";
import { useHomeStore } from "@/lib/stores/use-home-store";

type MemberStateResponse = {
  memberKey: string;
  state: PersistedMemberState;
};

export function MemberStateBridge() {
  const { status } = useSession();
  const memberStateOwnerKey = useHomeStore((state) => state.memberStateOwnerKey);
  const memberStateResolved = useHomeStore((state) => state.memberStateResolved);
  const favoriteScenarioIds = useHomeStore((state) => state.favoriteScenarioIds);
  const priceAlerts = useHomeStore((state) => state.priceAlerts);
  const rewardPoints = useHomeStore((state) => state.rewardPoints);
  const latestReceipt = useHomeStore((state) => state.latestReceipt);
  const receiptHistory = useHomeStore((state) => state.receiptHistory);
  const applyPersistedMemberState = useHomeStore(
    (state) => state.applyPersistedMemberState,
  );
  const resetMemberStateToGuest = useHomeStore(
    (state) => state.resetMemberStateToGuest,
  );
  const setMemberSyncStatus = useHomeStore((state) => state.setMemberSyncStatus);
  const lastSyncedPayloadRef = useRef<string | null>(null);

  const serializedSnapshot = useMemo(
    () =>
      JSON.stringify(
        createPersistedMemberStateFromStore({
          favoriteScenarioIds,
          priceAlerts,
          rewardPoints,
          latestReceipt,
          receiptHistory,
        }),
      ),
    [
      favoriteScenarioIds,
      priceAlerts,
      rewardPoints,
      latestReceipt,
      receiptHistory,
    ],
  );

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status === "unauthenticated") {
      lastSyncedPayloadRef.current = null;
      resetMemberStateToGuest();
      return;
    }

    let cancelled = false;
    setMemberSyncStatus("loading");

    void (async () => {
      try {
        const response = await fetch("/api/member/state", { cache: "no-store" });

        if (!response.ok) {
          throw new Error(`Unexpected response: ${response.status}`);
        }

        const payload = (await response.json()) as MemberStateResponse;

        if (cancelled) {
          return;
        }

        const normalizedState = normalizePersistedMemberState(payload.state);
        lastSyncedPayloadRef.current = JSON.stringify(normalizedState);
        applyPersistedMemberState({
          ownerKey: payload.memberKey,
          state: normalizedState,
        });
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to hydrate member state", error);
          setMemberSyncStatus("error");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    applyPersistedMemberState,
    resetMemberStateToGuest,
    setMemberSyncStatus,
    status,
  ]);

  useEffect(() => {
    if (
      status !== "authenticated" ||
      !memberStateResolved ||
      !memberStateOwnerKey
    ) {
      return;
    }

    if (serializedSnapshot === lastSyncedPayloadRef.current) {
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      void (async () => {
        try {
          setMemberSyncStatus("saving");

          const response = await fetch("/api/member/state", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: serializedSnapshot,
            signal: controller.signal,
          });

          if (!response.ok) {
            throw new Error(`Unexpected response: ${response.status}`);
          }

          const payload = (await response.json()) as MemberStateResponse;
          const normalizedState = normalizePersistedMemberState(payload.state);

          lastSyncedPayloadRef.current = JSON.stringify(normalizedState);
          applyPersistedMemberState({
            ownerKey: payload.memberKey,
            state: normalizedState,
          });
        } catch (error) {
          if (!controller.signal.aborted) {
            console.error("Failed to sync member state", error);
            setMemberSyncStatus("error");
          }
        }
      })();
    }, 450);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [
    applyPersistedMemberState,
    memberStateOwnerKey,
    memberStateResolved,
    serializedSnapshot,
    setMemberSyncStatus,
    status,
  ]);

  return null;
}
