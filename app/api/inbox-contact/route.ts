import { NextResponse } from "next/server";

import {
  sendAddContactRequestToDiscord,
  validateAddContactRequestPayload,
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

  if (typeof body === "object" && body !== null) {
    const website = (body as Record<string, unknown>).website;

    if (typeof website === "string" && website.trim()) {
      return NextResponse.json({ ok: true, delivered: false, absorbed: true });
    }
  }

  const parsed = validateAddContactRequestPayload(body);

  if (!parsed.ok) {
    return NextResponse.json(
      { ok: false, delivered: false, error: parsed.error },
      { status: 400 },
    );
  }

  const payload = {
    ...parsed.value,
    timestamp: parsed.value.timestamp ?? new Date().toISOString(),
    userAgent: parsed.value.userAgent ?? request.headers.get("user-agent") ?? undefined,
  };

  try {
    const result = await sendAddContactRequestToDiscord(payload);

    if (!result.delivered) {
      return NextResponse.json(
        {
          ok: true,
          delivered: false,
          configured: false,
        },
      );
    }

    return NextResponse.json({ ok: true, delivered: true });
  } catch (error) {
    console.error("Inbox contact request delivery failed.", error);

    return NextResponse.json(
      {
        ok: false,
        delivered: false,
        error: "Could not send the contact request.",
      },
      { status: 502 },
    );
  }
}
