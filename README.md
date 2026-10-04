# Daddy James Birthday Book

A small private birthday experience for Daddy James and the COT family.

## What it does

- Public member page for an optional name, birthday wish, picture and/or video.
- Pictures and videos upload directly to Cloudinary with a server-generated signature.
- Convex stores only the submission text and Cloudinary metadata/URLs.
- Daddy James gets a private album at `/daddy-james/<ADMIN_ACCESS_TOKEN>`.
- The admin token is checked by both Next.js and Convex.

## Local setup

```bash
pnpm install
pnpm convex dev
```

Convex will walk you through creating/linking the deployment. Copy the generated
`NEXT_PUBLIC_CONVEX_URL` to Vercel.

Create a strong random `ADMIN_ACCESS_TOKEN`, then set the **same** value in:

1. Vercel as `ADMIN_ACCESS_TOKEN`.
2. Convex with:

```bash
pnpm convex env set ADMIN_ACCESS_TOKEN your-secret-token
```

Add these Vercel environment variables:

```text
NEXT_PUBLIC_CONVEX_URL
ADMIN_ACCESS_TOKEN
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

Then deploy. Daddy James' link will be:

```text
https://<your-domain>/daddy-james/<ADMIN_ACCESS_TOKEN>
```

## CI

GitHub Actions runs install, lint, TypeScript and the production Next.js build.
