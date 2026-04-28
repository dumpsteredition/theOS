export type InboxMessageCapturePayload = {
  source: "inbox-chat";
  threadId: string;
  threadName: string;
  visitorMessage: string;
  timestamp: string;
  pagePath?: string;
  userAgent?: string;
};

export type InboxContactCapturePayload = {
  source: "inbox-contact";
  contactName: string;
  contactChannel: string;
  companyOrRole?: string;
  buildOrFix: string;
  currentProblem?: string;
  timestamp: string;
  pagePath?: string;
  userAgent?: string;
};

export type AddContactRequestPayload = {
  source: "add-contact";
  name: string;
  email: string;
  companyOrProject?: string;
  whatWorkingOn: string;
  helpNeeded: string;
  bestWayToReach?: string;
  timestamp?: string;
  pagePath?: string;
  userAgent?: string;
  website?: string;
};

export type InboxCapturePayload =
  | InboxMessageCapturePayload
  | InboxContactCapturePayload;

type InboxCaptureConfig = {
  mode: "generic" | "slack" | "discord";
  url: string | null;
  bearerToken?: string;
};

type ParseResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

function getRequiredString(
  input: unknown,
  label: string,
  maxLength: number,
): ParseResult<string> {
  if (typeof input !== "string") {
    return { ok: false, error: `${label} must be a string.` };
  }

  const value = input.trim();

  if (!value) {
    return { ok: false, error: `${label} is required.` };
  }

  if (value.length > maxLength) {
    return { ok: false, error: `${label} must be ${maxLength} characters or fewer.` };
  }

  return { ok: true, value };
}

function getOptionalString(
  input: unknown,
  label: string,
  maxLength: number,
): ParseResult<string | undefined> {
  if (input == null || input === "") {
    return { ok: true, value: undefined };
  }

  if (typeof input !== "string") {
    return { ok: false, error: `${label} must be a string.` };
  }

  const value = input.trim();

  if (!value) {
    return { ok: true, value: undefined };
  }

  if (value.length > maxLength) {
    return { ok: false, error: `${label} must be ${maxLength} characters or fewer.` };
  }

  return { ok: true, value };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isBasicEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function truncate(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 3)}...`;
}

export function getInboxCaptureConfig(): InboxCaptureConfig {
  const modeValue = process.env.BRUMBLEYOS_INBOX_WEBHOOK_MODE?.toLowerCase();
  const mode =
    modeValue === "slack" || modeValue === "discord" ? modeValue : "generic";

  return {
    mode,
    url: process.env.BRUMBLEYOS_INBOX_WEBHOOK_URL?.trim() || null,
    bearerToken: process.env.BRUMBLEYOS_INBOX_WEBHOOK_BEARER_TOKEN?.trim() || undefined,
  };
}

export function validateAddContactRequestPayload(
  input: unknown,
): ParseResult<AddContactRequestPayload> {
  if (!isRecord(input)) {
    return { ok: false, error: "Contact request payload must be an object." };
  }

  if (input.source !== "add-contact") {
    return { ok: false, error: "source must be add-contact." };
  }

  const website = getOptionalString(input.website, "website", 200);
  if (!website.ok) {
    return website;
  }

  const name = getRequiredString(input.name, "name", 120);
  if (!name.ok) {
    return name;
  }

  const email = getRequiredString(input.email, "email", 200);
  if (!email.ok) {
    return email;
  }

  if (!isBasicEmail(email.value)) {
    return { ok: false, error: "email must be a valid email address." };
  }

  const companyOrProject = getOptionalString(
    input.companyOrProject,
    "companyOrProject",
    200,
  );
  if (!companyOrProject.ok) {
    return companyOrProject;
  }

  const whatWorkingOn = getRequiredString(input.whatWorkingOn, "whatWorkingOn", 1000);
  if (!whatWorkingOn.ok) {
    return whatWorkingOn;
  }

  const helpNeeded = getRequiredString(input.helpNeeded, "helpNeeded", 1000);
  if (!helpNeeded.ok) {
    return helpNeeded;
  }

  const bestWayToReach = getOptionalString(
    input.bestWayToReach,
    "bestWayToReach",
    300,
  );
  if (!bestWayToReach.ok) {
    return bestWayToReach;
  }

  const timestamp = getOptionalString(input.timestamp, "timestamp", 120);
  if (!timestamp.ok) {
    return timestamp;
  }

  const pagePath = getOptionalString(input.pagePath, "pagePath", 240);
  if (!pagePath.ok) {
    return pagePath;
  }

  const userAgent = getOptionalString(input.userAgent, "userAgent", 800);
  if (!userAgent.ok) {
    return userAgent;
  }

  return {
    ok: true,
    value: {
      source: "add-contact",
      name: name.value,
      email: email.value,
      companyOrProject: companyOrProject.value,
      whatWorkingOn: whatWorkingOn.value,
      helpNeeded: helpNeeded.value,
      bestWayToReach: bestWayToReach.value,
      timestamp: timestamp.value,
      pagePath: pagePath.value,
      userAgent: userAgent.value,
      website: website.value,
    },
  };
}

export function validateInboxMessageCapturePayload(
  input: unknown,
): ParseResult<InboxMessageCapturePayload> {
  if (!isRecord(input)) {
    return { ok: false, error: "Inbox message payload must be an object." };
  }

  if (input.source !== "inbox-chat") {
    return { ok: false, error: "source must be inbox-chat." };
  }

  const threadId = getRequiredString(input.threadId, "threadId", 120);
  if (!threadId.ok) {
    return threadId;
  }

  const threadName = getRequiredString(input.threadName, "threadName", 140);
  if (!threadName.ok) {
    return threadName;
  }

  const visitorMessage = getRequiredString(input.visitorMessage, "visitorMessage", 5000);
  if (!visitorMessage.ok) {
    return visitorMessage;
  }

  const timestamp = getRequiredString(input.timestamp, "timestamp", 120);
  if (!timestamp.ok) {
    return timestamp;
  }

  const pagePath = getOptionalString(input.pagePath, "pagePath", 240);
  if (!pagePath.ok) {
    return pagePath;
  }

  const userAgent = getOptionalString(input.userAgent, "userAgent", 800);
  if (!userAgent.ok) {
    return userAgent;
  }

  return {
    ok: true,
    value: {
      source: "inbox-chat",
      threadId: threadId.value,
      threadName: threadName.value,
      visitorMessage: visitorMessage.value,
      timestamp: timestamp.value,
      pagePath: pagePath.value,
      userAgent: userAgent.value,
    },
  };
}

export function validateInboxContactCapturePayload(
  input: unknown,
): ParseResult<InboxContactCapturePayload> {
  if (!isRecord(input)) {
    return { ok: false, error: "Inbox contact payload must be an object." };
  }

  if (input.source !== "inbox-contact") {
    return { ok: false, error: "source must be inbox-contact." };
  }

  const contactName = getRequiredString(input.contactName, "contactName", 140);
  if (!contactName.ok) {
    return contactName;
  }

  const contactChannel = getRequiredString(input.contactChannel, "contactChannel", 240);
  if (!contactChannel.ok) {
    return contactChannel;
  }

  const companyOrRole = getOptionalString(input.companyOrRole, "companyOrRole", 180);
  if (!companyOrRole.ok) {
    return companyOrRole;
  }

  const buildOrFix = getRequiredString(input.buildOrFix, "buildOrFix", 2400);
  if (!buildOrFix.ok) {
    return buildOrFix;
  }

  const currentProblem = getOptionalString(input.currentProblem, "currentProblem", 3000);
  if (!currentProblem.ok) {
    return currentProblem;
  }

  const timestamp = getRequiredString(input.timestamp, "timestamp", 120);
  if (!timestamp.ok) {
    return timestamp;
  }

  const pagePath = getOptionalString(input.pagePath, "pagePath", 240);
  if (!pagePath.ok) {
    return pagePath;
  }

  const userAgent = getOptionalString(input.userAgent, "userAgent", 800);
  if (!userAgent.ok) {
    return userAgent;
  }

  return {
    ok: true,
    value: {
      source: "inbox-contact",
      contactName: contactName.value,
      contactChannel: contactChannel.value,
      companyOrRole: companyOrRole.value,
      buildOrFix: buildOrFix.value,
      currentProblem: currentProblem.value,
      timestamp: timestamp.value,
      pagePath: pagePath.value,
      userAgent: userAgent.value,
    },
  };
}

function discordFieldValue(value: string | undefined, fallback = "Not provided") {
  const normalized = value?.trim() || fallback;

  return truncate(normalized, 1024);
}

function buildAddContactDiscordBody(payload: AddContactRequestPayload) {
  const submitted = payload.timestamp || new Date().toISOString();

  return {
    username: "BrumbleyOS Inbox",
    allowed_mentions: { parse: [] },
    content: "📬 New BrumbleyOS contact request",
    embeds: [
      {
        title: "New contact request",
        color: 6018760,
        fields: [
          { name: "Name", value: discordFieldValue(payload.name) },
          { name: "Email", value: discordFieldValue(payload.email) },
          {
            name: "Company / Project",
            value: discordFieldValue(payload.companyOrProject),
          },
          { name: "Working on", value: discordFieldValue(payload.whatWorkingOn) },
          { name: "Help needed", value: discordFieldValue(payload.helpNeeded) },
          {
            name: "Best way to reach",
            value: discordFieldValue(payload.bestWayToReach),
          },
          { name: "Source", value: discordFieldValue(payload.source) },
          { name: "Page", value: discordFieldValue(payload.pagePath, "Unknown") },
          { name: "Submitted", value: discordFieldValue(submitted) },
        ],
        footer: { text: "BrumbleyOS Add Contact" },
      },
    ],
  };
}

export async function sendAddContactRequestToDiscord(
  payload: AddContactRequestPayload,
) {
  const webhookUrl = process.env.BRUMBLEYOS_DISCORD_WEBHOOK_URL?.trim();

  if (!webhookUrl) {
    console.warn(
      "BRUMBLEYOS_DISCORD_WEBHOOK_URL is not configured; contact request was accepted without Discord delivery.",
    );

    return { delivered: false as const, reason: "not-configured" as const };
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buildAddContactDiscordBody(payload)),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Discord webhook responded with ${response.status}.`);
  }

  return { delivered: true as const };
}

function buildNotificationSubject(payload: InboxCapturePayload) {
  if (payload.source === "inbox-chat") {
    return `BrumbleyOS inbox message from ${payload.threadName}`;
  }

  return `BrumbleyOS new contact: ${payload.contactName}`;
}

function buildNotificationSummary(payload: InboxCapturePayload) {
  if (payload.source === "inbox-chat") {
    return truncate(payload.visitorMessage, 240);
  }

  return truncate(payload.buildOrFix, 240);
}

function buildSlackBody(payload: InboxCapturePayload) {
  const subject = buildNotificationSubject(payload);
  const summary = buildNotificationSummary(payload);
  const metaRows =
    payload.source === "inbox-chat"
      ? [
          `Thread: ${payload.threadName} (${payload.threadId})`,
          `Sent: ${payload.timestamp}`,
          payload.pagePath ? `Path: ${payload.pagePath}` : null,
        ]
      : [
          `Contact: ${payload.contactName}`,
          `Best contact: ${payload.contactChannel}`,
          payload.companyOrRole ? `Role/company: ${payload.companyOrRole}` : null,
          `Sent: ${payload.timestamp}`,
          payload.pagePath ? `Path: ${payload.pagePath}` : null,
        ];

  return {
    text: `${subject}\n${summary}`,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: truncate(subject, 140),
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: truncate(summary, 2900),
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: metaRows.filter(Boolean).map((row) => `• ${row}`).join("\n"),
        },
      },
    ],
  };
}

function buildDiscordBody(payload: InboxCapturePayload) {
  const subject = buildNotificationSubject(payload);
  const description =
    payload.source === "inbox-chat"
      ? payload.visitorMessage
      : [payload.buildOrFix, payload.currentProblem].filter(Boolean).join("\n\n");

  const fields =
    payload.source === "inbox-chat"
      ? [
          { name: "Thread", value: truncate(payload.threadName, 1024), inline: true },
          { name: "Thread ID", value: truncate(payload.threadId, 1024), inline: true },
          { name: "Sent", value: truncate(payload.timestamp, 1024), inline: true },
        ]
      : [
          { name: "Contact", value: truncate(payload.contactName, 1024), inline: true },
          { name: "Best contact", value: truncate(payload.contactChannel, 1024), inline: true },
          {
            name: "Role/company",
            value: truncate(payload.companyOrRole || "Not provided", 1024),
            inline: true,
          },
        ];

  return {
    content: truncate(subject, 1800),
    embeds: [
      {
        title: truncate(subject, 256),
        description: truncate(description, 4096),
        fields,
      },
    ],
  };
}

function buildGenericBody(payload: InboxCapturePayload) {
  return {
    event: "brumbleyos.inbox.capture",
    subject: buildNotificationSubject(payload),
    summary: buildNotificationSummary(payload),
    payload,
  };
}

function buildNotificationBody(
  payload: InboxCapturePayload,
  mode: InboxCaptureConfig["mode"],
) {
  if (mode === "slack") {
    return buildSlackBody(payload);
  }

  if (mode === "discord") {
    return buildDiscordBody(payload);
  }

  return buildGenericBody(payload);
}

export async function sendInboxCaptureNotification(payload: InboxCapturePayload) {
  const config = getInboxCaptureConfig();

  if (!config.url) {
    return { delivered: false as const, reason: "not-configured" as const };
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (config.bearerToken) {
    headers.Authorization = `Bearer ${config.bearerToken}`;
  }

  const response = await fetch(config.url, {
    method: "POST",
    headers,
    body: JSON.stringify(buildNotificationBody(payload, config.mode)),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Inbox capture target responded with ${response.status}.`);
  }

  return { delivered: true as const };
}
