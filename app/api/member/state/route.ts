import { getAuthSession } from "@/lib/auth";
import {
  getOrCreateMemberState,
  saveMemberState,
} from "@/lib/member-state-persistence";
import { normalizePersistedMemberState } from "@/lib/stores/member-state";

export async function GET() {
  const session = await getAuthSession();

  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const memberState = await getOrCreateMemberState(session);

    return Response.json(memberState, { status: 200 });
  } catch (error) {
    console.error("Failed to load member state", error);

    return Response.json(
      { error: "Failed to load member state" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  const session = await getAuthSession();

  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const memberState = await saveMemberState(
      session,
      normalizePersistedMemberState(body),
    );

    return Response.json(memberState, { status: 200 });
  } catch (error) {
    console.error("Failed to save member state", error);

    return Response.json(
      { error: "Failed to save member state" },
      { status: 500 },
    );
  }
}
