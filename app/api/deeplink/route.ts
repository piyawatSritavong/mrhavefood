import { trackAffiliateEvent } from "@/lib/mock-product-service";

export async function POST(request: Request) {
  const body = await request.json();

  if (!body?.scenarioId || !body?.platform || !body?.surface) {
    return Response.json({ error: "Invalid deeplink payload" }, { status: 400 });
  }

  const event = trackAffiliateEvent({
    scenarioId: String(body.scenarioId),
    platform: body.platform,
    surface: body.surface,
  });

  if (!event) {
    return Response.json({ error: "Scenario not found" }, { status: 404 });
  }

  return Response.json(
    {
      trackingId: event.id,
      href: event.targetUrl,
      label: event.label,
    },
    { status: 200 },
  );
}
