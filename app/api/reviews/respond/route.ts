import { getAuthSession } from "@/lib/auth";
import { replyToReview } from "@/lib/mock-product-service";

export async function POST(request: Request) {
  const session = await getAuthSession();

  if (!session?.user || session.user.role !== "merchant-admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();

  if (!body?.reviewId || !body?.reply) {
    return Response.json({ error: "Invalid reply payload" }, { status: 400 });
  }

  const review = replyToReview({
    reviewId: String(body.reviewId),
    reply: String(body.reply),
  });

  if (!review) {
    return Response.json({ error: "Review not found" }, { status: 404 });
  }

  return Response.json({ review }, { status: 200 });
}
