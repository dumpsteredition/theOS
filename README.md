# BrumbleyOS

BrumbleyOS is Kyle Brumbley's personal site built as a premium app-like Next.js surface.

## Local Development

```bash
npm install
npm run dev
```

## Deployment

BrumbleyOS is ready for Vercel as a standard Next.js app.

1. Import `https://github.com/dumpsteredition/theOS` into Vercel.
2. Keep the default framework preset as `Next.js`.
3. Use the default build command:

```bash
npm run build
```

4. Add environment variables in Vercel Project Settings, then deploy.

## Environment Variables

No environment variable is required for the app to build.

For production behavior, configure:

| Variable | Required | Notes |
| --- | --- | --- |
| `BRUMBLEYOS_SITE_URL` | Recommended | Absolute production URL for metadata/social previews. If omitted, Vercel URL env vars are used when available. |
| `BRUMBLEYOS_DISCORD_WEBHOOK_URL` | Optional | Discord incoming webhook for Add Contact submissions. If omitted, the route accepts requests without delivery. |
| `BRUMBLEYOS_INBOX_WEBHOOK_MODE` | Optional | `generic`, `slack`, or `discord`. Defaults to `generic`. |
| `BRUMBLEYOS_INBOX_WEBHOOK_URL` | Optional | Webhook target for inbox chat/message forwarding. If omitted, inbox forwarding reports local-only behavior. |
| `BRUMBLEYOS_INBOX_WEBHOOK_BEARER_TOKEN` | Optional | Bearer token for generic inbox webhook targets that require authorization. |

Webhook values are read only in server-side route/helper code. Do not expose them with `NEXT_PUBLIC_` prefixes.

## Pre-Deploy Checks

```bash
npm run lint
npm run typecheck
npm run build
```
