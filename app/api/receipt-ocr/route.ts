import { analyzeMockReceipt } from "@/lib/mock-product-service";

export async function POST(request: Request) {
  const body = await request.json();

  if (!body?.receiptId || !body?.scenarioId || !body?.platform || !body?.fileName) {
    return Response.json({ error: "Invalid receipt payload" }, { status: 400 });
  }

  const job = analyzeMockReceipt({
    receiptId: String(body.receiptId),
    scenarioId: String(body.scenarioId),
    platform: body.platform,
    fileName: String(body.fileName),
  });

  if (!job) {
    return Response.json({ error: "Scenario not found" }, { status: 404 });
  }

  return Response.json(
    {
      receiptId: body.receiptId,
      confidence: job.confidence,
      truthScore: job.truthScore,
      fraudSignals: job.fraudSignals,
      reviewStatus: job.status === "auto-approved" ? "auto-approved" : "human-review",
      pointsAwarded: job.status === "auto-approved" ? 120 : 0,
      ocrJobId: job.id,
    },
    { status: 200 },
  );
}
