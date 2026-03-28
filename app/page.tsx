import { Suspense } from "react";
import { HomePage } from "@/components/home-page";
import { fallbackPromotions } from "@/lib/promotions-data";
import type { Promotion, Restaurant } from "@/lib/supabase";

async function fetchPromotions(): Promise<Promotion[]> {
  try {
    const { createSupabaseAdmin } = await import("@/lib/supabase");
    const supabase = createSupabaseAdmin();
    const { data } = await supabase
      .from("promotions")
      .select("*")
      .eq("is_active", true)
      .order("fetched_at", { ascending: false });

    return (data && data.length > 0) ? data : fallbackPromotions;
  } catch {
    return fallbackPromotions;
  }
}

async function fetchRestaurants(): Promise<Restaurant[]> {
  try {
    const { createSupabaseAdmin } = await import("@/lib/supabase");
    const supabase = createSupabaseAdmin();
    const { data } = await supabase
      .from("restaurants")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    return data ?? [];
  } catch {
    return [];
  }
}

export default async function Page() {
  const [promotions, restaurants] = await Promise.all([
    fetchPromotions(),
    fetchRestaurants(),
  ]);

  return (
    <Suspense>
      <HomePage promotions={promotions} restaurants={restaurants} />
    </Suspense>
  );
}
