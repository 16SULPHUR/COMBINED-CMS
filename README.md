# Combined CMS

One [Payload 3](https://payloadcms.com) CMS (Next.js + Postgres on Supabase) that manages content for several projects. Hosted on Vercel.

- Admin: `/admin`
- REST API: `/api/<collection-slug>`
- GraphQL: `/api/graphql`

## Layout

```
src/
  collections/shared/   Users (admin auth) and Media, used by every project
  projects/
    types.ts            defineProject() helper
    index.ts            registry of all projects
    suite/index.ts      Suite content
    portfolio/index.ts  Portfolio content, Site settings and monitoring
  migrations/           Postgres migrations (committed)
  payload.config.ts
```

## Adding content for a project

1. Put the project's collections/globals in `src/projects/<project>/` (one file per collection is fine) and list them in that project's `index.ts`.
2. Every slug must start with `<project>-` (e.g. `portfolio-projects`, `suite-settings`). `defineProject` throws otherwise and groups the project in the admin sidebar.
3. Content read by a public site needs `access: { read: () => true }`; anything else requires a logged-in admin.
4. Images/files go in the shared `media` collection (`relationTo: 'media'`); set its `project` field to tag them.
5. New project: create `src/projects/<project>/index.ts`, add it to `src/projects/index.ts`.
6. Custom API routes go in the project's `endpoints` (paths must start with `/<project>/` and are served under `/api`); admin pages and dashboard widgets go in its `admin`.
7. Generate a migration and types, and commit all of it:

   ```bash
   pnpm migrate:create <short-name>
   pnpm generate:types
   ```

Schema changes only reach the database through migrations (`push` is off), and Vercel runs `payload migrate` before each build.

## Portfolio content

`src/projects/portfolio/` holds the portfolio's content: collections `portfolio-projects`, `portfolio-roles`, `portfolio-internships`, `portfolio-skills`, `portfolio-articles` (drag to reorder in the admin; sort by `_order` in the API) and globals `portfolio-profile`, `portfolio-resume`, `portfolio-education`, `portfolio-contact`.

`seed/data/*.json` is the content exported from the portfolio's `src/data`. Load it with:

```bash
pnpm migrate
pnpm seed:portfolio
```

Re-running updates existing entries (matched by slug, company, name or href) instead of duplicating them.

**Site settings** (`portfolio-site`) holds everything else a visitor sees: the name tag, which cards hang on the main line and in what order, card text, the resume popup's buttons and PDF, music, sky and clock, the Cards/Island switch and its postcard, a notice banner, the 404 page, SEO and tracking. The site falls back to its own defaults for anything left empty.

**Island game** (`portfolio-game`) holds the text of the island game at `/island`: title screen, creatures, trainers and their battles, the health check, battle lines and changes to bugs. Its fields start with the island's own text (`globals/gameDefaults.ts`, generated from the portfolio's `src/components/localhost/content.ts`), and the island keeps its built-in text until the global is saved once. Map positions and creature keys stay in the portfolio's code.

Every portfolio entry has a **Hide on the site** toggle (hidden entries stay in the admin but leave the public API), keeps its last 50 versions, and opens a live preview of the portfolio while you edit. Set `PORTFOLIO_URL` to preview another copy of the site, e.g. `http://localhost:5173`.

## Portfolio monitoring

The portfolio batches what visitors do and sends it to `POST /api/portfolio/postcard`. It lands in three read-only collections in the Portfolio group: visits (one per browser tab session), events (page views, opened cards, followed links, resume and contact actions, style switches, island game moves, page speed) and errors (grouped by message).

- No cookies and no IP addresses are stored. A visitor is a hash of the day, IP and browser salted with `PAYLOAD_SECRET`, so repeat visits only link up within the same day.
- Bots, origins missing from Site settings → Tracking → "Sites allowed to send data", and floods (over 90 beacons a minute from one IP) are dropped. Rows older than the retention setting (365 days by default) are swept.
- **Insights** (`/admin/portfolio/insights`): visitors, views, time on site, sources, places, what they opened, links, resume and contact, cards or island, the island game, devices, page speed, latest visits and errors, for today, 7, 30 or 90 days. Days follow `INSIGHTS_TIMEZONE`.
- **Health** (`/admin/portfolio/health`): checks the site, content through the site's proxy, the database, storage, incoming tracking and the old Cloudflare tracker, lists stored data, and checks every link in the portfolio content. With `PORTFOLIO_DEPLOY_HOOK` set, **Rebuild** redeploys the portfolio so its bundled snapshot and SEO tags pick up your edits.
- The dashboard shows a short summary, and `GET /api/portfolio/status` is a public uptime check.

## Suite content

`src/projects/suite/` holds the content for the VH Billing Suite showcase site: one global, `suite-copy` ("Site copy" in the admin), with a group for each section of the page plus lists for scenes, tabs, shelf swatches, hardware, price plans and questions. The site reads `/api/globals/suite-copy` and keeps its own bundled copy as a fallback.

```bash
pnpm migrate
pnpm seed:suite
```

`seed/data/copy.json` is the site's current copy; re-running it overwrites the global. Add the site's address (e.g. `https://vhsuit.vercel.app`) to `CORS_ORIGINS` so the browser may fetch it. Scene slugs and icon names are drop-downs because the site draws those visuals in code.

## Local development

```bash
cp .env.example .env   # fill in DATABASE_URL and PAYLOAD_SECRET
pnpm install
pnpm migrate
pnpm dev               # http://localhost:3000/admin, create the first admin user
```

## Environment variables

| Name                                        | Purpose                                                         |
| ------------------------------------------- | --------------------------------------------------------------- |
| `DATABASE_URL`                              | Supabase **transaction pooler** URI (port 6543)                 |
| `PAYLOAD_SECRET`                            | Long random string used to sign auth tokens                     |
| `NEXT_PUBLIC_SERVER_URL`                    | Public URL of this CMS, no trailing slash (e.g. `https://cms.ankit.ninja`) |
| `CORS_ORIGINS`                              | Comma-separated frontend origins allowed to call the API        |
| `SUPABASE_URL`                              | `https://<project-ref>.supabase.co`, used for public media URLs |
| `S3_BUCKET`                                 | Supabase Storage bucket for media (`media`); empty = local disk |
| `S3_ENDPOINT`                               | `https://<project-ref>.storage.supabase.co/storage/v1/s3`       |
| `S3_REGION`                                 | Supabase project region, e.g. `ap-northeast-1`                  |
| `S3_ACCESS_KEY_ID` / `S3_SECRET_ACCESS_KEY` | Storage > S3 Connection > New access key                        |
| `PORTFOLIO_URL`                             | Optional. Portfolio address for live preview and health checks (default `https://ankit.varietyheaven.in`) |
| `PORTFOLIO_DEPLOY_HOOK`                     | Optional. Vercel deploy hook URL of the portfolio, enables Health → Rebuild |
| `INSIGHTS_TIMEZONE`                         | Optional. Time zone that Insights counts days in (default `Asia/Kolkata`) |

All Payload tables live in the `payload` Postgres schema, so they don't mix with anything in `public`. Media files go to the public `media` bucket in Supabase Storage and are served straight from Supabase. Uploads through the admin on Vercel are capped at about 4.5 MB per file.

## Deploying to Vercel

1. Import the repo in Vercel (framework: Next.js; `vercel.json` sets `pnpm run ci` as the build command, which migrates then builds).
2. Add the environment variables above for Production and Preview.
3. Deploy, then open `/admin` to create the first admin user.
