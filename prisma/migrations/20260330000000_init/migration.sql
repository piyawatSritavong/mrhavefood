-- ============================================================
-- MrHaveFood — Fresh database setup
-- ============================================================

-- Promotions table
CREATE TABLE IF NOT EXISTS promotions (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  platform      TEXT        NOT NULL,
  campaign_name TEXT        NOT NULL,
  promo_code    TEXT,
  conditions    TEXT,
  start_date    DATE,
  end_date      DATE,
  reference_link TEXT,
  fetched_at    TIMESTAMPTZ DEFAULT NOW(),
  is_active     BOOLEAN     DEFAULT true
);

CREATE INDEX IF NOT EXISTS promotions_platform_idx   ON promotions (platform);
CREATE INDEX IF NOT EXISTS promotions_is_active_idx  ON promotions (is_active);
CREATE INDEX IF NOT EXISTS promotions_end_date_idx   ON promotions (end_date);
CREATE INDEX IF NOT EXISTS promotions_fetched_at_idx ON promotions (fetched_at DESC);

-- Restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT        NOT NULL,
  category    TEXT,
  image_url   TEXT,
  line_oa_url TEXT        NOT NULL DEFAULT '',
  description TEXT,
  is_active   BOOLEAN     DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS restaurants_is_active_idx ON restaurants (is_active);
CREATE INDEX IF NOT EXISTS restaurants_created_at_idx ON restaurants (created_at DESC);
