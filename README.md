# 🌊 Ripple Orders — Real-Time Order Tracking

A production-ready, Vercel-deployable real-time order tracking system built with **Next.js 16**, **Supabase**, and **Server-Sent Events (SSE)**.

![Dashboard](https://img.shields.io/badge/Status-Production_Ready-brightgreen) ![Next.js](https://img.shields.io/badge/Next.js-16-black) ![Supabase](https://img.shields.io/badge/Supabase-Realtime-3ecf8e) ![SSE](https://img.shields.io/badge/Streaming-SSE-blue)

## ✨ Features

- **Real-time streaming** — Orders appear/update/disappear instantly via SSE (no polling)
- **Premium dark-mode UI** — Glassmorphism, animated gradients, micro-interactions
- **Full CRUD API** — REST endpoints for creating, reading, updating, and deleting orders
- **Status workflow** — Orders flow through: Pending → Confirmed → Preparing → Out for Delivery → Delivered
- **CLI watcher** — Terminal client for monitoring live order events
- **Vercel-ready** — Zero extra infrastructure needed

## 🚀 Quick Start

### 1. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of [`supabase/migration.sql`](./supabase/migration.sql)
3. Go to **Settings → API** and copy your Project URL and Service Role Key

### 2. Configure Environment

```bash
cp .env.local.example .env.local
# OR edit .env.local directly:
```

Fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 3. Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you should see the Ripple Orders dashboard.

### 4. (Optional) CLI Watcher

In a separate terminal:

```bash
npx tsx cli/watch.ts
# Or connect to a deployed instance:
npx tsx cli/watch.ts https://your-app.vercel.app
```

## 📡 API Reference

### `GET /api/orders`
List all orders. Optional query params: `?status=pending&limit=50`

### `POST /api/orders`
Create a new order.
```json
{ "customer_name": "Alice", "item": "Pizza", "quantity": 2 }
```

### `PATCH /api/orders`
Update an order.
```json
{ "id": "uuid-here", "status": "confirmed" }
```

### `DELETE /api/orders`
Delete an order.
```json
{ "id": "uuid-here" }
```

### `GET /api/orders/stream`
SSE endpoint. Connect with `EventSource` to receive real-time `INSERT`, `UPDATE`, and `DELETE` events.

## 🏗 Architecture

```
Browser Dashboard ──► EventSource ──► /api/orders/stream (SSE)
                                              │
CLI Client ─────────► EventSource ─────────────┘
                                              │
                                    Supabase Realtime
                                              │
                                    PostgreSQL (orders table)
```

## 🚢 Deploy to Vercel

1. Push to GitHub
2. Import in [Vercel](https://vercel.com)
3. Add environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`)
4. Deploy!

## 📁 Project Structure

```
realtime-orders/
├── src/
│   ├── app/
│   │   ├── api/orders/
│   │   │   ├── route.ts          # CRUD endpoints
│   │   │   └── stream/route.ts   # SSE streaming
│   │   ├── globals.css           # Premium design system
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Dashboard page
│   ├── components/
│   │   └── OrderComponents.tsx   # All UI components
│   ├── hooks/
│   │   └── useOrders.ts          # SSE + state management hook
│   ├── lib/
│   │   └── supabase.ts           # Supabase client
│   └── types/
│       └── order.ts              # TypeScript types
├── cli/
│   └── watch.ts                  # CLI watcher client
├── supabase/
│   └── migration.sql             # Database schema + seed data
└── .env.local                    # Environment variables
```

## License

MIT
