import { getAuthSession } from "@/lib/auth";
import { listRewardRedemptions } from "@/lib/mock-product-service";

export async function GET() {
  const session = await getAuthSession();

  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  return Response.json({ redemptions: listRewardRedemptions() }, { status: 200 });
}
