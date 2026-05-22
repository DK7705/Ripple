import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { OrderStatus } from "@/types/order";

export const dynamic = "force-dynamic";

/**
 * GET /api/orders — List all orders, newest first.
 * Optional query params: ?status=pending&limit=50
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") as OrderStatus | null;
  const limit = parseInt(searchParams.get("limit") ?? "100", 10);

  let query = supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

/**
 * POST /api/orders — Create a new order.
 * Body: { customer_name, item, quantity, status? }
 */
export async function POST(request: NextRequest) {
  const body = await request.json();

  const { customer_name, item, quantity, status = "pending" } = body;

  if (!customer_name || !item || !quantity) {
    return NextResponse.json(
      { error: "customer_name, item, and quantity are required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("orders")
    .insert({
      customer_name,
      item,
      quantity: parseInt(quantity, 10),
      status,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

/**
 * PATCH /api/orders — Update an order's status.
 * Body: { id, status }
 */
export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { id, ...updates } = body;

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("orders")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

/**
 * DELETE /api/orders — Delete an order.
 * Body: { id }
 */
export async function DELETE(request: NextRequest) {
  const body = await request.json();
  const { id } = body;

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const { error } = await supabase.from("orders").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
