import { isTestMode } from "@/lib/farm/store";
import { memoryMedia } from "@/lib/autopost/store";

// Serves images stored by the in-memory test store. In production images live in Supabase Storage.
export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  if (!isTestMode()) return new Response("not found", { status: 404 });
  const media = memoryMedia((await params).path.join("/"));
  if (!media) return new Response("not found", { status: 404 });
  return new Response(new Uint8Array(media.bytes), {
    headers: { "Content-Type": media.type, "X-Content-Type-Options": "nosniff", "Cache-Control": "no-store" },
  });
}
