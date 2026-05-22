# Ripple

Ripple is an operational, real-time orders dashboard built for SaaS workflows. It's designed with a focus on readability and utility, providing instant state synchronization without relying on client-side polling.

## Architecture Stack

- **Next.js 14+ (App Router)**: Handles routing, API endpoints, and server-side rendering.
- **Supabase (PostgreSQL)**: Serves as the primary data store.
- **Server-Sent Events (SSE)**: Streams live database mutations (inserts, updates, deletes) via `pg_notify` directly to the client.
- **Recharts**: Powers the data visualization and analytics on the overview page.

## Project Structure

- **Home Page (`/`)**: High-level analytics and quick actions.
- **Orders List (`/orders`)**: Primary working view with real-time status updates and CRUD actions.
- **Order Details (`/orders/[id]`)**: Deep view for single-order tracking and timelines.
- **Products (`/products`)**: Inventory and catalog management view.
- **SSE Endpoint (`/api/orders/stream`)**: Pushes database events to the client.

## Running Locally

1. Configure your `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```
2. Apply the schema provided in `supabase/migration.sql` to set up the necessary tables, enums, and triggers.
3. Install dependencies and start the development server:
   ```bash
   npm install
   npm run dev
   ```

To monitor the raw event stream from the terminal, you can run the included CLI watcher:
```bash
npx tsx cli/watch.ts
```

## API Routes

The backend exposes a standard REST interface in addition to the SSE stream:
- `GET /api/orders`
- `POST /api/orders`
- `PATCH /api/orders`
- `DELETE /api/orders`
- `GET /api/orders/stream` (Persistent SSE connection)
