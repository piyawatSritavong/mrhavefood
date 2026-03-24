import { getAuthSession } from "@/lib/auth";
import {
  listOperationsSnapshot,
  updateOperationStatus,
} from "@/lib/mock-product-service";

export async function GET() {
  const session = await getAuthSession();

  if (!session?.user || session.user.role !== "platform-admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  return Response.json(listOperationsSnapshot(), { status: 200 });
}

export async function POST(request: Request) {
  const session = await getAuthSession();

  if (!session?.user || session.user.role !== "platform-admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();

  if (!body?.entity || !body?.id || !body?.status) {
    return Response.json({ error: "Invalid ops payload" }, { status: 400 });
  }

  const updated = updateOperationStatus({
    entity: body.entity,
    id: String(body.id),
    status: String(body.status),
  });

  if (!updated) {
    return Response.json({ error: "Record not found" }, { status: 404 });
  }

  return Response.json({ updated, snapshot: listOperationsSnapshot() }, { status: 200 });
}
