import { createClient } from "@supabase/supabase-js";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

// Server-only client with the service role key (bypasses RLS).
// Never import this from a client component.
export function createSupabaseAdmin() {
  return createClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { persistSession: false } },
  );
}

export type Promotion = {
  id: string;
  platform: string;
  campaign_name: string;
  promo_code: string | null;
  conditions: string | null;
  start_date: string | null;
  end_date: string | null;
  reference_link: string | null;
  fetched_at: string;
  is_active: boolean;
};

export type Restaurant = {
  id: string;
  name: string;
  category: string | null;
  image_url: string | null;
  line_oa_url: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
};

/*
-- Supabase SQL to create tables:

CREATE TABLE promotions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL,
  campaign_name TEXT NOT NULL,
  promo_code TEXT,
  conditions TEXT,
  start_date DATE,
  end_date DATE,
  reference_link TEXT,
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE restaurants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  image_url TEXT,
  line_oa_url TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- restaurant_applications: see supabase/restaurant_applications.sql
*/
