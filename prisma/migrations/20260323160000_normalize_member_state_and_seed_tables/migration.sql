-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('grab', 'line-man', 'shopeefood');

-- CreateEnum
CREATE TYPE "ReceiptStatus" AS ENUM ('processing', 'verified');

-- CreateTable
CREATE TABLE "member_profiles" (
    "member_key" TEXT NOT NULL,
    "email" TEXT,
    "name" TEXT,
    "reward_points" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "member_profiles_pkey" PRIMARY KEY ("member_key")
);

-- CreateTable
CREATE TABLE "member_favorites" (
    "member_key" TEXT NOT NULL,
    "scenario_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "member_favorites_pkey" PRIMARY KEY ("member_key", "scenario_id")
);

-- CreateTable
CREATE TABLE "member_price_alerts" (
    "id" TEXT NOT NULL,
    "member_key" TEXT NOT NULL,
    "scenario_id" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "target_price" INTEGER NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "member_price_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member_receipts" (
    "id" TEXT NOT NULL,
    "member_key" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "scenario_id" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "restaurant" TEXT NOT NULL,
    "item_name" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "total_price" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "verified_at" TIMESTAMP(3),
    "status" "ReceiptStatus" NOT NULL,
    "points_awarded" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "member_receipts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compare_scenarios" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "restaurant" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "distance_km" DOUBLE PRECISION NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "cuisine" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "tags" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "compare_scenarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scenario_offers" (
    "scenario_id" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "total_price" INTEGER NOT NULL,
    "food_price" INTEGER NOT NULL,
    "delivery_fee" INTEGER NOT NULL,
    "service_fee" INTEGER NOT NULL,
    "discount" INTEGER NOT NULL,
    "eta_minutes" INTEGER NOT NULL,
    "note" TEXT NOT NULL,

    CONSTRAINT "scenario_offers_pkey" PRIMARY KEY ("scenario_id", "platform")
);

-- CreateIndex
CREATE INDEX "member_profiles_email_idx" ON "member_profiles"("email");

-- CreateIndex
CREATE INDEX "member_favorites_member_key_idx" ON "member_favorites"("member_key");

-- CreateIndex
CREATE INDEX "member_price_alerts_member_key_idx" ON "member_price_alerts"("member_key");

-- CreateIndex
CREATE INDEX "member_receipts_member_key_created_at_idx" ON "member_receipts"("member_key", "created_at" DESC);

-- CreateIndex
CREATE INDEX "compare_scenarios_district_idx" ON "compare_scenarios"("district");

-- AddForeignKey
ALTER TABLE "member_favorites" ADD CONSTRAINT "member_favorites_member_key_fkey" FOREIGN KEY ("member_key") REFERENCES "member_profiles"("member_key") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_price_alerts" ADD CONSTRAINT "member_price_alerts_member_key_fkey" FOREIGN KEY ("member_key") REFERENCES "member_profiles"("member_key") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_receipts" ADD CONSTRAINT "member_receipts_member_key_fkey" FOREIGN KEY ("member_key") REFERENCES "member_profiles"("member_key") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scenario_offers" ADD CONSTRAINT "scenario_offers_scenario_id_fkey" FOREIGN KEY ("scenario_id") REFERENCES "compare_scenarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'member_states'
  ) THEN
    INSERT INTO "member_profiles" (
      "member_key",
      "email",
      "name",
      "reward_points",
      "created_at",
      "updated_at"
    )
    SELECT
      "member_key",
      "email",
      "name",
      COALESCE("reward_points", 0),
      COALESCE("created_at", CURRENT_TIMESTAMP),
      COALESCE("updated_at", CURRENT_TIMESTAMP)
    FROM "member_states"
    ON CONFLICT ("member_key") DO UPDATE SET
      "email" = EXCLUDED."email",
      "name" = EXCLUDED."name",
      "reward_points" = EXCLUDED."reward_points",
      "updated_at" = EXCLUDED."updated_at";

    INSERT INTO "member_favorites" (
      "member_key",
      "scenario_id",
      "created_at"
    )
    SELECT
      ms."member_key",
      favorite.value,
      COALESCE(ms."updated_at", CURRENT_TIMESTAMP)
    FROM "member_states" ms
    CROSS JOIN LATERAL jsonb_array_elements_text(
      COALESCE(ms."favorite_scenario_ids"::jsonb, '[]'::jsonb)
    ) AS favorite(value)
    ON CONFLICT ("member_key", "scenario_id") DO NOTHING;

    INSERT INTO "member_price_alerts" (
      "id",
      "member_key",
      "scenario_id",
      "platform",
      "target_price",
      "enabled",
      "created_at"
    )
    SELECT
      alert.value ->> 'id',
      ms."member_key",
      alert.value ->> 'scenarioId',
      CASE alert.value ->> 'platform'
        WHEN 'grab' THEN 'grab'::"Platform"
        WHEN 'line-man' THEN 'line-man'::"Platform"
        WHEN 'shopeefood' THEN 'shopeefood'::"Platform"
      END,
      COALESCE((alert.value ->> 'targetPrice')::INTEGER, 0),
      COALESCE((alert.value ->> 'enabled')::BOOLEAN, true),
      CASE
        WHEN alert.value ? 'createdAt' THEN to_timestamp((alert.value ->> 'createdAt')::DOUBLE PRECISION / 1000.0)
        ELSE COALESCE(ms."updated_at", CURRENT_TIMESTAMP)
      END
    FROM "member_states" ms
    CROSS JOIN LATERAL jsonb_array_elements(
      COALESCE(ms."price_alerts"::jsonb, '[]'::jsonb)
    ) AS alert(value)
    WHERE (alert.value ->> 'platform') IN ('grab', 'line-man', 'shopeefood')
    ON CONFLICT ("id") DO NOTHING;

    INSERT INTO "member_receipts" (
      "id",
      "member_key",
      "file_name",
      "scenario_id",
      "platform",
      "restaurant",
      "item_name",
      "district",
      "total_price",
      "created_at",
      "verified_at",
      "status",
      "points_awarded"
    )
    SELECT
      receipt.value ->> 'id',
      ms."member_key",
      receipt.value ->> 'fileName',
      receipt.value ->> 'scenarioId',
      CASE receipt.value ->> 'platform'
        WHEN 'grab' THEN 'grab'::"Platform"
        WHEN 'line-man' THEN 'line-man'::"Platform"
        WHEN 'shopeefood' THEN 'shopeefood'::"Platform"
      END,
      receipt.value ->> 'restaurant',
      receipt.value ->> 'itemName',
      receipt.value ->> 'district',
      COALESCE((receipt.value ->> 'totalPrice')::INTEGER, 0),
      CASE
        WHEN receipt.value ? 'createdAt' THEN to_timestamp((receipt.value ->> 'createdAt')::DOUBLE PRECISION / 1000.0)
        ELSE COALESCE(ms."created_at", CURRENT_TIMESTAMP)
      END,
      CASE
        WHEN receipt.value ? 'verifiedAt'
          AND receipt.value ->> 'verifiedAt' IS NOT NULL
          AND receipt.value ->> 'verifiedAt' <> 'null'
        THEN to_timestamp((receipt.value ->> 'verifiedAt')::DOUBLE PRECISION / 1000.0)
        ELSE NULL
      END,
      CASE receipt.value ->> 'status'
        WHEN 'processing' THEN 'processing'::"ReceiptStatus"
        WHEN 'verified' THEN 'verified'::"ReceiptStatus"
      END,
      COALESCE((receipt.value ->> 'pointsAwarded')::INTEGER, 0)
    FROM "member_states" ms
    CROSS JOIN LATERAL jsonb_array_elements(
      CASE
        WHEN ms."latest_receipt" IS NULL THEN COALESCE(ms."receipt_history"::jsonb, '[]'::jsonb)
        WHEN COALESCE(ms."receipt_history"::jsonb, '[]'::jsonb) @> jsonb_build_array(ms."latest_receipt"::jsonb)
          THEN COALESCE(ms."receipt_history"::jsonb, '[]'::jsonb)
        ELSE jsonb_build_array(ms."latest_receipt"::jsonb) || COALESCE(ms."receipt_history"::jsonb, '[]'::jsonb)
      END
    ) AS receipt(value)
    WHERE (receipt.value ->> 'platform') IN ('grab', 'line-man', 'shopeefood')
      AND (receipt.value ->> 'status') IN ('processing', 'verified')
    ON CONFLICT ("id") DO NOTHING;

    DROP TABLE "member_states";
  END IF;
END $$;
