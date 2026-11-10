# Cloudflare Worker + D1 edition

The hosted edition uses a real D1 SQL database. It supports separately scoped workspaces, account registration/login, technicians, job records, checklists, evidence, scope changes, bearer client links, approvals and reports. The original Node/SQLite edition remains available through npm start.

A public visitor can choose **Try live portfolio demo** to get a new isolated server-backed workspace seeded with fictional jobs. The seven-day HttpOnly session cookie identifies that workspace. Reloading retains changes; another browser starts separately. Account registration starts empty and allows signing in across browsers. Demo workspaces are not automatically deleted yet. Use sample information, not confidential client records. This remains a portfolio release: no email verification, password reset, verified signatures, billing, or commercial operational guarantees.

## Build and test

```
npm ci
npm run build:cloudflare
npm run test:cloudflare
```

## Independent Cloudflare account deployment

Workers and D1 offer limited free tiers; inspect current limits before launch. No paid R2 storage is needed by this edition. Evidence is stored as base64 in D1, limited to roughly 700 KB per image, 20 evidence entries per job, and 100 jobs per workspace. API rate limits apply to authentication and demo creation. For heavier usage, implement quotas/cleanup and a separate object store.

1. Authenticate the Wrangler CLI to your own Cloudflare account.
2. Run `npx wrangler d1 create siteproof` and replace the placeholder database ID in cloudflare/wrangler.json with the returned database ID.
3. Run `npm run build:cloudflare`.
4. Apply the schema once: `npx wrangler d1 execute DB --remote --config cloudflare/wrangler.json --file drizzle/0000_siteproof_cloud.sql`.
5. Run `npx wrangler deploy --config cloudflare/wrangler.json`.
6. Open the returned URL and choose Try live portfolio demo or Create a private workspace.

Do not reapply the initial schema to an existing database. Append versioned migrations for schema changes. Back up D1 before migrations. No provider secrets belong in the repository. The hosted Sites deployment provisions its own D1 binding and applies the same committed migration during publication.
