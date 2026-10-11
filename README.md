# Protect Fayette County

A responsive community information site for Fayette County, Texas. Built with standard Next.js and deployable to Azure or another Node.js host.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. In development, `/admin` accepts the temporary password `local-admin` when `ADMIN_PASSWORD` is not configured. Local event records are stored in `data/events.json`.

## Production configuration

Copy the keys from `.env.example` into the hosting provider's environment-variable settings:

- `DATABASE_URL`: PostgreSQL connection string
- `ADMIN_PASSWORD`: long, unique administrator password
- `SESSION_SECRET`: random string of at least 32 characters

In production, the app refuses to use file storage and requires PostgreSQL. The events table is created automatically on first use.

## Azure deployment

Recommended stack:

- Azure App Service with Node.js 20+
- Azure Database for PostgreSQL Flexible Server
- GitHub Actions deployment configured from the App Service Deployment Center

Build command: `npm ci && npm run build`

Start command: `npm start`

Add all three production variables in App Service → Environment variables. Configure the custom domain and managed certificate in App Service after the first successful deployment.
