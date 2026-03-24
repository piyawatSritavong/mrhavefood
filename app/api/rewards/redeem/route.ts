import { getAuthSession } from "@/lib/auth";
import { redeemMockReward } from "@/lib/mock-product-service";

export async function POST(request: Request) {
  const session = await getAuthSession();

  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if (!body?.rewardId) {
    return Response.json({ error: "Missing rewardId" }, { status: 400 });
  }

  const redemption = redeemMockReward({
    rewardId: String(body.rewardId),
    memberKey: session.user.id,
  });

  if (!redemption) {
    return Response.json({ error: "Reward not found" }, { status: 404 });
  }

  return Response.json({ redemption }, { status: 200 });
}
