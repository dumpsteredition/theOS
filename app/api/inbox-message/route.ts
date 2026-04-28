import { NextResponse } from "next/server";

import {
  sendInboxCaptureNotification,
  validateInboxMessageCapturePayload,
} from "@/lib/inbox-capture";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, delivered: false, error: "Invalid JSON payload." },
      { status: 400 },
    );
  }

  const parsed = validateInboxMessageCapturePayload(body);

  if (!parsed.ok) {
    return NextResponse.json(
      { ok: false, delivered: false, error: parsed.error },
      { status: 400 },
    );
  }

  const payload = {
    ...parsed.value,
    userAgent: parsed.value.userAgent ?? request.headers.get("user-agent") ?? undefined,
  };

  try {
    const result = await sendInboxCaptureNotification(payload);

    if (!result.delivered) {
      return NextResponse.json(
        {
          ok: false,
          delivered: false,
          error: "Inbox notification target is not configured.",
        },
        { status: 503 },
      );
    }

    return NextResponse.json({ ok: true, delivered: true });
  } catch (error) {
    console.error("Inbox message capture failed.", error);

    return NextResponse.json(
      {
        ok: false,
        delivered: false,
        error: "Failed to forward the inbox message.",
      },
      { status: 502 },
    );
  }
}
