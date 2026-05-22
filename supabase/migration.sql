-- ============================================================
-- Ripple Orders — Supabase Migration
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- 1. Create enum for order status
CREATE TYPE order_status AS ENUM (
  'pending',
  'confirmed',
  'preparing',
  'out_for_delivery',
  'delivered',
  'cancelled'
);

-- 2. Create the orders table
CREATE TABLE IF NOT EXISTS orders (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  item        TEXT NOT NULL,
  quantity    INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  status      order_status NOT NULL DEFAULT 'pending',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Index for common queries
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at DESC);

-- 4. Auto-update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- 5. Enable Realtime for the orders table
-- This is CRITICAL for the SSE streaming to work
ALTER PUBLICATION supabase_realtime ADD TABLE orders;

-- 6. Enable Row Level Security (optional but recommended)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated & anon users (adjust as needed)
CREATE POLICY "Allow all access to orders" ON orders
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 7. Seed some sample data (optional — remove in production)
INSERT INTO orders (customer_name, item, quantity, status) VALUES
  ('Alice Chen',    'Margherita Pizza',    2, 'pending'),
  ('Bob Smith',     'Caesar Salad',        1, 'confirmed'),
  ('Carol Davis',   'Spaghetti Carbonara', 1, 'preparing'),
  ('Dave Wilson',   'Grilled Salmon',      3, 'out_for_delivery'),
  ('Eve Johnson',   'Tiramisu',            2, 'delivered');
