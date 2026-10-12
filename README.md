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
    portfolio/index.ts  Portfolio content
  migrations/           Postgres migrations (committed)
  payload.config.ts
```

## Adding content for a project

1. Put the project's collections/globals in `src/projects/<project>/` (one file per collection is fine) and list them in that project's `index.ts`.
2. Every slug must start with `<project>-` (e.g. `portfolio-projects`, `suite-settings`). `defineProject` throws otherwise and groups the project in the admin sidebar.
3. Content read by a public site needs `access: { read: () => true }`; anything else requires a logged-in admin.
4. Images/files go in the shared `media` collection (`relationTo: 'media'`); set its `project` field to tag them.
5. New project: create `src/projects/<project>/index.ts`, add it to `src/projects/index.ts`.
6. Generate a migration and types, and commit all of it:

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
| `NEXT_PUBLIC_SERVER_URL`                    | Public URL of this CMS                                          |
| `CORS_ORIGINS`                              | Comma-separated frontend origins allowed to call the API        |
| `SUPABASE_URL`                              | `https://<project-ref>.supabase.co`, used for public media URLs |
| `S3_BUCKET`                                 | Supabase Storage bucket for media (`media`); empty = local disk |
| `S3_ENDPOINT`                               | `https://<project-ref>.storage.supabase.co/storage/v1/s3`       |
| `S3_REGION`                                 | Supabase project region, e.g. `ap-northeast-1`                  |
| `S3_ACCESS_KEY_ID` / `S3_SECRET_ACCESS_KEY` | Storage > S3 Connection > New access key                        |

All Payload tables live in the `payload` Postgres schema, so they don't mix with anything in `public`. Media files go to the public `media` bucket in Supabase Storage and are served straight from Supabase. Uploads through the admin on Vercel are capped at about 4.5 MB per file.

## Deploying to Vercel

1. Import the repo in Vercel (framework: Next.js; `vercel.json` sets `pnpm run ci` as the build command, which migrates then builds).
2. Add the environment variables above for Production and Preview.
3. Deploy, then open `/admin` to create the first admin user.
