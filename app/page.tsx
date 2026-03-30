import { Suspense } from "react";
import { HomePage } from "@/components/home-page";
import { fallbackPromotions } from "@/lib/promotions-data";
import type { Promotion, Restaurant } from "@/lib/supabase";

export const dynamic = "force-dynamic";

async function fetchPromotions(): Promise<Promotion[]> {
  try {
    const { createSupabaseAdmin } = await import("@/lib/supabase");
    const supabase = createSupabaseAdmin();
    const today = new Date().toISOString().split("T")[0];
    const { data } = await supabase
      .from("promotions")
      .select("*")
      .eq("is_active", true)
      .order("fetched_at", { ascending: false });

    const filtered = (data ?? []).filter(
      (p: Promotion) => !p.end_date || p.end_date >= today
    );
    return filtered.length > 0 ? filtered : fallbackPromotions;
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
