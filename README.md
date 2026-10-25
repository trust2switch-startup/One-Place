# OnePlace starter

A responsive OnePlace landing page and a signup service backed by PostgreSQL. The signup flow collects channel partner, college, worker, business and customer enquiries. It stores the minimum details needed to follow up and records consent time.

## Files and placement in a GitHub repository

This starter is laid out for a simple Vercel project. If you already have a GitHub repository, add these files on a new branch and merge dependencies and scripts into its existing `package.json`. Do not replace an existing app or package file until you know its framework. For an existing Next.js or other framework app, move the page and API into that app's established routes instead of installing this Express entry point beside it.

```text
your-repository/
  public/
    index.html          Landing page and signup form
    signup.html         Dedicated signup page
    styles.css          Responsive layout and visual styling
    app.js              Menu behavior and signup request
  server/
    server.js           Express API and static file server
  index.js              Vercel Express application entry point
  db/
    schema.sql          PostgreSQL signup table and indexes
  package.json          Node dependencies and start scripts
  docker-compose.yml    Local PostgreSQL for development
  .env.example          Environment variable template
  .gitignore            Excludes secrets and generated files
  README.md             Setup and deployment instructions
```

The backend serves `public` and handles `POST /api/signups`. The browser never connects directly to PostgreSQL. The API validates fields, requires the contact consent checkbox, uses a parameterized insert, and limits repeated signup requests. No public API reads signup records.

## Use the existing Vercel and GitHub project

Keep the current GitHub repository and Vercel project connected. Work on a branch, add the site within the existing app structure, and push that branch. Vercel can create a Preview Deployment for review before you merge to the production branch. For a simple Express project, the root `index.js` exports the Express app, while files under `public` are served by Vercel's CDN. Vercel does not use Express `express.static()` to serve those public files in production. The app redirects `/` to `/index.html` for the homepage.

Before production, add a PostgreSQL provider through the Vercel Marketplace, set its database connection string as a secret environment variable for Preview and Production, and apply `db/schema.sql` once to that database. Vercel Postgres is no longer offered as a new product; current integrations include providers such as Neon and Supabase. Do not commit a real connection string or use the local Compose password in production.

## Run locally

Requirements: Node.js 20 or newer and Docker with Docker Compose.

1. Start the local database from this directory:

   ```sh
   docker compose up -d db
   ```

2. Create your local environment file and install dependencies:

   ```sh
   cp .env.example .env
   npm install
   ```

3. Start the site and API:

   ```sh
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000). The API health check is at `/api/health`.

The Compose database applies `db/schema.sql` on first creation of its volume. To reapply schema changes, use a migration tool or deliberately recreate the local database volume. Do not remove a production database volume to apply a schema update.

## Signup data

The `signups` table contains:

| Column | Purpose |
| --- | --- |
| `id` | Internal signup identifier |
| `role` | Channel partner, college, worker, business or customer |
| `full_name` | Contact name |
| `phone` | Contact phone |
| `email` | Optional contact email |
| `city` | City for matching and follow up |
| `details` | Optional free text about the request, limited to 2,000 characters |
| `consent_at` | Time the person agreed to be contacted |
| `created_at` | Time the record was created |

For a live deployment, provision PostgreSQL with your hosting provider, apply `db/schema.sql` through a migration step, and configure `DATABASE_URL` in the backend environment. Set `DATABASE_SSL=true` when required by the provider. Keep `.env` out of GitHub and use the host's secret manager. Use HTTPS, restrict database network access, back up the database, and grant database access only to authorized staff through protected admin tooling. The local Compose password is for development only.

## Suggested next steps

Add real contact and service matching workflows after confirming the operating cities, service coverage, verification process and terms. Before collecting live personal data, publish a privacy notice, define retention and deletion processes, and restrict staff access to signup records.
