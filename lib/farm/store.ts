import { createSupabaseAdmin, type Promotion } from "@/lib/supabase";

export type PromotionInsert = Omit<Promotion, "id">;
export type PromotionPatch = Partial<PromotionInsert>;

export interface PromotionsStore {
  listAll(): Promise<Promotion[]>;
  insert(rows: PromotionInsert[]): Promise<void>;
  update(id: string, patch: PromotionPatch): Promise<void>;
  deactivate(ids: string[]): Promise<void>;
}

function supabaseStore(): PromotionsStore {
  const db = createSupabaseAdmin();
  return {
    async listAll() {
      const { data, error } = await db.from("promotions").select("*");
      if (error) throw error;
      return (data ?? []) as Promotion[];
    },
    async insert(rows) {
      if (rows.length === 0) return;
      const { error } = await db.from("promotions").insert(rows);
      if (error) throw error;
    },
    async update(id, patch) {
      const { error } = await db.from("promotions").update(patch).eq("id", id);
      if (error) throw error;
    },
    async deactivate(ids) {
      if (ids.length === 0) return;
      const { error } = await db.from("promotions").update({ is_active: false }).in("id", ids);
      if (error) throw error;
    },
  };
}

// ── Local test mode ────────────────────────────────────────────────────────────
// PROMOTIONS_TEST_MODE=1 swaps Gemini for a fixture and Supabase for this in-memory
// table, so the farm contract can be exercised without spending or touching data.
// It is refused on Vercel production.

// On globalThis so every route bundle in the same server process shares one table.
const g = globalThis as typeof globalThis & { __mrhfMemoryPromotions?: Promotion[] };
const memory: Promotion[] = (g.__mrhfMemoryPromotions ??= []);

function memoryStore(): PromotionsStore {
  return {
    async listAll() {
      return memory.map((p) => ({ ...p }));
    },
    async insert(rows) {
      for (const r of rows) memory.push({ ...r, id: crypto.randomUUID() });
    },
    async update(id, patch) {
      const row = memory.find((p) => p.id === id);
      if (row) Object.assign(row, patch);
    },
    async deactivate(ids) {
      for (const row of memory) if (ids.includes(row.id)) row.is_active = false;
    },
  };
}

export function isTestMode(): boolean {
  return process.env.PROMOTIONS_TEST_MODE === "1" && process.env.VERCEL_ENV !== "production";
}

export function getPromotionsStore(): PromotionsStore {
  return isTestMode() ? memoryStore() : supabaseStore();
}
