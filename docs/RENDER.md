# Deploy SiteProof on Render from a phone

This configuration deploys the real Node/SQLite backend and shared frontend, not the browser-only preview.

## Cost before deployment

The Blueprint selects a Starter web service and a 1 GB persistent disk. Render requires a paid service for persistent disks. Review the current total in Render before creating resources. No resource has been created by adding this file.

## Deploy

1. Sign in to Render using GitHub and grant access to this repository.
2. Open https://dashboard.render.com/select-repo?type=blueprint and select sandesh1664/SiteProof-UAE.
3. Render reads render.yaml. Review the selected service and disk, then deploy when you accept the displayed cost.
4. Wait for Live, then open the service's generated HTTPS URL.
5. In the service Environment page, reveal ADMIN_PASSWORD privately. Sign in as admin@siteproof.ae with that generated value. The technician account is tech@siteproof.ae with TECH_PASSWORD.
6. Start with an empty workspace. Create a job, complete checklist items, attach evidence, request approval and test the client link from a second browser.

## Configuration

Node 24 is selected explicitly. The database and uploaded evidence are kept in /var/data/siteproof.db on the persistent disk. PUBLIC_ORIGIN is populated from the service's generated URL, so HTTPS origin checks and Secure cookies work without editing source. For a custom domain, update PUBLIC_ORIGIN to that exact HTTPS origin.

Passwords initialise accounts on the first database creation only. Changing an environment password afterwards does not rotate an existing account. Do not lose the generated initial passwords. Never place them in a GitHub issue or commit.

Keep one instance with SQLite. Back up the database using a SQLite-aware method; see README.md. Do not delete the disk to fix a deployment because it contains all records. The health check verifies the homepage responds; the live workflow must still be checked after deployment.
