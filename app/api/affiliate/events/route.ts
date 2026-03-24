import { getAuthSession } from "@/lib/auth";
import { listAffiliateEvents } from "@/lib/mock-product-service";

export async function GET() {
  const session = await getAuthSession();

  if (!session?.user || session.user.role !== "platform-admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  return Response.json({ events: listAffiliateEvents() }, { status: 200 });
}
