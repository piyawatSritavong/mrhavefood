import { getAuthSession } from "@/lib/auth";
import {
  createScenarioReview,
  listScenarioReviews,
} from "@/lib/mock-product-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const scenarioId = searchParams.get("scenarioId");

  if (!scenarioId) {
    return Response.json({ error: "Missing scenarioId" }, { status: 400 });
  }

  return Response.json({ reviews: listScenarioReviews(scenarioId) }, { status: 200 });
}

export async function POST(request: Request) {
  const session = await getAuthSession();
  const body = await request.json();

  if (!body?.scenarioId || !body?.headline || !body?.body || !body?.rating) {
    return Response.json({ error: "Invalid review payload" }, { status: 400 });
  }

  const review = createScenarioReview({
    scenarioId: body.scenarioId,
    authorName: session?.user?.name ?? "Guest reviewer",
    authorRole: session?.user?.role ?? "guest",
    rating: Number(body.rating),
    headline: String(body.headline),
    body: String(body.body),
    verified: Boolean(body.verified),
  });

  return Response.json({ review }, { status: 201 });
}
