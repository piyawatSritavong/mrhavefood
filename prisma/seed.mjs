import { PrismaClient, Platform, ReceiptStatus } from "@prisma/client";

const prisma = new PrismaClient();

const compareScenarios = [
  {
    id: "krapao-thonglor",
    title: "กะเพราเนื้อ + ไข่ดาว",
    restaurant: "กะเพราโคตรดึก",
    district: "Thonglor",
    distanceKm: 1.8,
    rating: 4.8,
    cuisine: "Thai street food",
    summary: "ร้านดึกยอดนิยมสำหรับสายเผ็ดที่อยากได้จานไวและรสแรง",
    tags: ["late-night", "beef", "spicy", "rice"],
    offers: [
      {
        platform: Platform.GRAB,
        totalPrice: 182,
        foodPrice: 149,
        deliveryFee: 21,
        serviceFee: 12,
        discount: 0,
        etaMinutes: 24,
        note: "ETA เร็วสุด",
      },
      {
        platform: Platform.LINE_MAN,
        totalPrice: 169,
        foodPrice: 149,
        deliveryFee: 17,
        serviceFee: 8,
        discount: 5,
        etaMinutes: 31,
        note: "คุ้มที่สุดวันนี้",
      },
      {
        platform: Platform.SHOPEEFOOD,
        totalPrice: 176,
        foodPrice: 149,
        deliveryFee: 18,
        serviceFee: 9,
        discount: 0,
        etaMinutes: 28,
        note: "โค้ดส่งฟรีพร้อมใช้",
      },
    ],
  },
  {
    id: "boat-noodle-onnut",
    title: "ก๋วยเตี๋ยวเรือ + เกี๊ยวทอด",
    restaurant: "เรือเข้มท่าอ่อนนุช",
    district: "Onnut",
    distanceKm: 2.4,
    rating: 4.7,
    cuisine: "Boat noodle",
    summary: "เหมาะกับมื้อเย็นคุ้ม ๆ ที่อยากได้ของทอดเพิ่มโดยราคาไม่โดด",
    tags: ["noodle", "thai", "budget", "fried"],
    offers: [
      {
        platform: Platform.GRAB,
        totalPrice: 158,
        foodPrice: 124,
        deliveryFee: 22,
        serviceFee: 12,
        discount: 0,
        etaMinutes: 27,
        note: "ระยะใกล้สุด",
      },
      {
        platform: Platform.LINE_MAN,
        totalPrice: 152,
        foodPrice: 124,
        deliveryFee: 19,
        serviceFee: 9,
        discount: 0,
        etaMinutes: 30,
        note: "สมดุลสุด",
      },
      {
        platform: Platform.SHOPEEFOOD,
        totalPrice: 145,
        foodPrice: 124,
        deliveryFee: 16,
        serviceFee: 8,
        discount: 3,
        etaMinutes: 33,
        note: "สุทธิต่ำสุด",
      },
    ],
  },
  {
    id: "chicken-rice-ari",
    title: "ข้าวมันไก่ + ชาเย็น",
    restaurant: "เฮียช้าง ข้าวมันไก่อารีย์",
    district: "Ari",
    distanceKm: 1.1,
    rating: 4.9,
    cuisine: "Chicken rice",
    summary: "ร้านกลางวันยอดนิยมที่ราคาแข่งกันแรง โดยเฉพาะช่วงคูปองส่งฟรี",
    tags: ["lunch", "chicken-rice", "ari", "drink"],
    offers: [
      {
        platform: Platform.GRAB,
        totalPrice: 134,
        foodPrice: 109,
        deliveryFee: 13,
        serviceFee: 12,
        discount: 0,
        etaMinutes: 18,
        note: "ไวและนิ่ง",
      },
      {
        platform: Platform.LINE_MAN,
        totalPrice: 128,
        foodPrice: 109,
        deliveryFee: 12,
        serviceFee: 8,
        discount: 1,
        etaMinutes: 24,
        note: "คุ้มจากค่าส่ง",
      },
      {
        platform: Platform.SHOPEEFOOD,
        totalPrice: 139,
        foodPrice: 109,
        deliveryFee: 14,
        serviceFee: 8,
        discount: 0,
        etaMinutes: 22,
        note: "ราคาคงที่",
      },
    ],
  },
  {
    id: "roti-ekkamai",
    title: "โรตี + นมสด",
    restaurant: "โรตีหน้าโค้งเอกมัย",
    district: "Ekkamai",
    distanceKm: 2.9,
    rating: 4.6,
    cuisine: "Dessert",
    summary: "ของหวานปลายวันสำหรับสายคอนเทนต์และสายกินเล่นหลังเลิกงาน",
    tags: ["dessert", "roti", "night", "milk"],
    offers: [
      {
        platform: Platform.GRAB,
        totalPrice: 112,
        foodPrice: 84,
        deliveryFee: 16,
        serviceFee: 12,
        discount: 0,
        etaMinutes: 19,
        note: "ไวสุดหลังงาน",
      },
      {
        platform: Platform.LINE_MAN,
        totalPrice: 104,
        foodPrice: 84,
        deliveryFee: 14,
        serviceFee: 8,
        discount: 2,
        etaMinutes: 26,
        note: "ถูกสุดชัดเจน",
      },
      {
        platform: Platform.SHOPEEFOOD,
        totalPrice: 107,
        foodPrice: 84,
        deliveryFee: 13,
        serviceFee: 8,
        discount: 2,
        etaMinutes: 23,
        note: "มีโค้ดหมุนเวียน",
      },
    ],
  },
];

const demoMember = {
  memberKey: "email:member@mrhavefood.com",
  email: "member@mrhavefood.com",
  name: "MrHaveFood Member",
  rewardPoints: 240,
  favorites: [
    { scenarioId: "krapao-thonglor", createdAt: new Date("2026-03-23T08:00:00.000Z") },
    { scenarioId: "chicken-rice-ari", createdAt: new Date("2026-03-23T07:40:00.000Z") },
  ],
  alerts: [
    {
      id: "krapao-thonglor-line-man-149",
      scenarioId: "krapao-thonglor",
      platform: Platform.LINE_MAN,
      targetPrice: 149,
      enabled: true,
      createdAt: new Date("2026-03-23T08:00:00.000Z"),
    },
    {
      id: "roti-ekkamai-shopeefood-103",
      scenarioId: "roti-ekkamai",
      platform: Platform.SHOPEEFOOD,
      targetPrice: 103,
      enabled: true,
      createdAt: new Date("2026-03-23T09:15:00.000Z"),
    },
  ],
  receipts: [
    {
      id: "chicken-rice-ari-line-man-1742712900000",
      fileName: "ari-lunch-proof.jpg",
      scenarioId: "chicken-rice-ari",
      platform: Platform.LINE_MAN,
      restaurant: "เฮียช้าง ข้าวมันไก่อารีย์",
      itemName: "ข้าวมันไก่ + ชาเย็น",
      district: "Ari",
      totalPrice: 128,
      createdAt: new Date("2026-03-22T12:15:00.000Z"),
      verifiedAt: new Date("2026-03-22T12:15:45.000Z"),
      status: ReceiptStatus.VERIFIED,
      pointsAwarded: 120,
    },
    {
      id: "krapao-thonglor-grab-1742806800000",
      fileName: "thonglor-night-run.png",
      scenarioId: "krapao-thonglor",
      platform: Platform.GRAB,
      restaurant: "กะเพราโคตรดึก",
      itemName: "กะเพราเนื้อ + ไข่ดาว",
      district: "Thonglor",
      totalPrice: 182,
      createdAt: new Date("2026-03-23T14:20:00.000Z"),
      verifiedAt: null,
      status: ReceiptStatus.PROCESSING,
      pointsAwarded: 0,
    },
  ],
};

async function seedCompareScenarios() {
  for (const scenario of compareScenarios) {
    await prisma.compareScenario.upsert({
      where: { id: scenario.id },
      update: {
        title: scenario.title,
        restaurant: scenario.restaurant,
        district: scenario.district,
        distanceKm: scenario.distanceKm,
        rating: scenario.rating,
        cuisine: scenario.cuisine,
        summary: scenario.summary,
        tags: scenario.tags,
      },
      create: {
        id: scenario.id,
        title: scenario.title,
        restaurant: scenario.restaurant,
        district: scenario.district,
        distanceKm: scenario.distanceKm,
        rating: scenario.rating,
        cuisine: scenario.cuisine,
        summary: scenario.summary,
        tags: scenario.tags,
      },
    });

    await prisma.scenarioOffer.deleteMany({
      where: { scenarioId: scenario.id },
    });

    await prisma.scenarioOffer.createMany({
      data: scenario.offers.map((offer) => ({
        scenarioId: scenario.id,
        platform: offer.platform,
        totalPrice: offer.totalPrice,
        foodPrice: offer.foodPrice,
        deliveryFee: offer.deliveryFee,
        serviceFee: offer.serviceFee,
        discount: offer.discount,
        etaMinutes: offer.etaMinutes,
        note: offer.note,
      })),
    });
  }
}

async function seedDemoMember() {
  await prisma.memberProfile.upsert({
    where: { memberKey: demoMember.memberKey },
    update: {
      email: demoMember.email,
      name: demoMember.name,
      rewardPoints: demoMember.rewardPoints,
    },
    create: {
      memberKey: demoMember.memberKey,
      email: demoMember.email,
      name: demoMember.name,
      rewardPoints: demoMember.rewardPoints,
    },
  });

  await prisma.memberFavorite.deleteMany({
    where: { memberKey: demoMember.memberKey },
  });
  await prisma.memberPriceAlert.deleteMany({
    where: { memberKey: demoMember.memberKey },
  });
  await prisma.memberReceipt.deleteMany({
    where: { memberKey: demoMember.memberKey },
  });

  await prisma.memberFavorite.createMany({
    data: demoMember.favorites.map((favorite) => ({
      memberKey: demoMember.memberKey,
      scenarioId: favorite.scenarioId,
      createdAt: favorite.createdAt,
    })),
  });

  await prisma.memberPriceAlert.createMany({
    data: demoMember.alerts.map((alert) => ({
      id: alert.id,
      memberKey: demoMember.memberKey,
      scenarioId: alert.scenarioId,
      platform: alert.platform,
      targetPrice: alert.targetPrice,
      enabled: alert.enabled,
      createdAt: alert.createdAt,
    })),
  });

  await prisma.memberReceipt.createMany({
    data: demoMember.receipts.map((receipt) => ({
      id: receipt.id,
      memberKey: demoMember.memberKey,
      fileName: receipt.fileName,
      scenarioId: receipt.scenarioId,
      platform: receipt.platform,
      restaurant: receipt.restaurant,
      itemName: receipt.itemName,
      district: receipt.district,
      totalPrice: receipt.totalPrice,
      createdAt: receipt.createdAt,
      verifiedAt: receipt.verifiedAt,
      status: receipt.status,
      pointsAwarded: receipt.pointsAwarded,
    })),
  });
}

async function main() {
  await seedCompareScenarios();
  await seedDemoMember();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
