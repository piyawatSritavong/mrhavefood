import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side client with service role key (for admin operations)
export function createSupabaseAdmin() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  return createClient(supabaseUrl, serviceKey);
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
*/
