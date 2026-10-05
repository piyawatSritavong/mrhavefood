import { HomePage } from "@/components/home-page";
import { fallbackPromotions, filterActivePromotions } from "@/lib/promotions-data";
import { createSupabaseAdmin, type Promotion, type Restaurant } from "@/lib/supabase";

// Re-render at most every 5 minutes instead of querying Supabase on every request.
export const revalidate = 300;

async function fetchPromotions(): Promise<Promotion[]> {
  try {
    const { data, error } = await createSupabaseAdmin()
      .from("promotions")
      .select("*")
      .eq("is_active", true)
      .order("fetched_at", { ascending: false });

    if (error) throw error;

    const active = filterActivePromotions(data ?? []);
    if (active.length > 0) return active;
    console.warn("[home] promotions table has no active rows; serving fallback list");
  } catch (err) {
    console.error("[home] failed to load promotions:", err);
  }
  // The fallback list is curated by hand, so it must be date-filtered too.
  return filterActivePromotions(fallbackPromotions);
}

async function fetchRestaurants(): Promise<Restaurant[]> {
  try {
    const { data, error } = await createSupabaseAdmin()
      .from("restaurants")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error("[home] failed to load restaurants:", err);
    return [];
  }
}

export default async function Page() {
  const [promotions, restaurants] = await Promise.all([fetchPromotions(), fetchRestaurants()]);

  return <HomePage promotions={promotions} restaurants={restaurants} />;
}
