# HalfCourt Shoe Store

The customer storefront and the admin dashboard are two views of the same website:

- Customers open `/`.
- Admins open `/#admin` and sign in with Supabase Auth.

Both views use the same Supabase project and database. Customer accounts and admin accounts are separate. Admin access is restricted to the two Supabase Auth user IDs assigned to slots 1 and 2 in `public.store_admins`.

## What is deployed

The Vercel entry point is the PHP storefront and API: `index.html`, `script.js`, and `api.php`, packaged by `Dockerfile.vercel` and served by FrankenPHP/Caddy. This is one Vercel site, not separate customer and admin deployments.

The `app/` and `lib/` folders contain source from the earlier Next.js dashboard. They are included in this repository, but are not the current Vercel entry point. The current admin UI is embedded in `index.html`.

## Supabase database setup

In the SQL Editor of the Supabase project that will be used by the store, review and run these files in order:

1. `supabase-schema.sql` creates the store tables and initial catalog/shipping rows.
2. `sql/optional-signin-audit.sql` optionally records customer sign-ins for the admin dashboard. Without this table, the dashboard reports that sign-in tracking is not configured; it does not invent a count.
3. `sql/admin-access-realtime.sql` creates the two-slot admin allowlist, admin read policies, and enables product updates for Supabase Realtime.

Vercel does not execute these SQL files. Run them manually in Supabase SQL Editor. Running the files against a production database changes its schema; review them and confirm the target project first.

### Create the two admin accounts

1. In Supabase, open **Authentication → Users** and create the two admin users. Use strong, unique passwords and enable MFA where available.
2. Copy each user's UUID.
3. After running `sql/admin-access-realtime.sql`, insert the two UUIDs in Supabase SQL Editor:

```sql
INSERT INTO public.store_admins (slot, user_id)
VALUES
  (1, 'FIRST-ADMIN-AUTH-USER-UUID'),
  (2, 'SECOND-ADMIN-AUTH-USER-UUID')
ON CONFLICT (slot) DO UPDATE SET user_id = EXCLUDED.user_id;
```

Replace both example UUIDs before running the query. Only users in these two slots can access admin data. Do not add customer accounts to this table.

## Configure Vercel

Connect this repository to one Vercel project using the repository root as the project root. The `Dockerfile.vercel` and `vercel.json` select the Container framework instead of treating `app/` as a separate Next.js deployment. After deployment, open `/api.php?action=health`; a working PHP deployment returns `{"status":"ok","service":"store-api"}`.

In **Vercel → Project Settings → Environment Variables**, set:

| Variable | Value |
| --- | --- |
| `DATABASE_URL` | Server-only PostgreSQL connection URL for this Supabase database. Use TLS and a least-privilege database role. |
| `NEXT_PUBLIC_SUPABASE_URL` | The Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | The Supabase anon/public key. Never use a service-role key here. |

Set the variables for each Vercel environment you use, then redeploy. Keep `DATABASE_URL` private: do not add it to frontend code, use a `NEXT_PUBLIC_` prefix, or commit it to GitHub. Do not add a Supabase service-role key to this project.

In Supabase **Authentication → URL Configuration**, set the production Site URL to your storefront's HTTPS origin and allow the origin for redirects. The admin view uses the same origin with `/#admin`.

## Local development

The PHP API requires PHP with the `pdo_pgsql` extension and a reachable PostgreSQL database. Set the three environment variables above in your local shell, then start the PHP development server from the repository root:

```sh
php -S 127.0.0.1:8000
```

Open `http://127.0.0.1:8000/` for the store or `http://127.0.0.1:8000/#admin` for admin sign-in.

## Real inventory and checkout

The catalog, inventory, and orders are read from the database; the site does not use sample dashboard statistics. Checkout validates current prices and stock and updates inventory and order records in a database transaction. To see checkout stock changes in the admin view, run `sql/admin-access-realtime.sql`; product changes arrive through Supabase Realtime, with a periodic refresh as a fallback.

The site does not process real payments. Test checkout with non-production data before opening the store.

## Production security notes

- Customer login uses PHP file-backed sessions in `/tmp`. Vercel instances do not share local files, so use a shared session store before relying on customer sign-in across multiple instances.
- Add rate limiting for the PHP customer login and registration endpoints before public launch. Supabase Auth protections do not rate-limit those separate endpoints.
- Use a least-privilege database role, keep dependencies and PHP updated, enable MFA for both admins, and verify that an Auth user not listed in `store_admins` cannot read admin data.
- No setup can guarantee a site is unhackable. Treat database credentials, customer information, and admin accounts as sensitive.

## Repository contents

- `index.html`, `script.js`, `api.php` — combined storefront/admin page and server API.
- `supabase-schema.sql`, `sql/` — database schema and optional/admin setup SQL.
- `Dockerfile.vercel`, `Caddyfile`, `.dockerignore`, `vercel.json` — Vercel PHP container configuration; SQL, documentation, ERD files, local config, and unused Next.js source are excluded from the deployed image.
- `app/`, `lib/` — retained Next.js dashboard source; not selected by the current deployment configuration.
- `images/` — storefront image assets.
