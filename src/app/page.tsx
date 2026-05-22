"use client";

import { useOrders } from "@/hooks/useOrders";
import Link from "next/link";
import { StatsBar, ConnectionIndicator } from "@/components/OrderComponents";
import { DashboardCharts } from "@/components/DashboardCharts";

export default function HomePage() {
  const { orders, connected } = useOrders();

  const recentOrders = [...orders].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);

  return (
    <div className="page-container">
      <header className="dashboard-header">
        <div className="header-left">
          <h1 style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--text-primary)" }}>Overview</h1>
          <ConnectionIndicator connected={connected} />
        </div>
        <Link href="/orders" className="new-order-btn" style={{ textDecoration: "none" }}>
          Go to Orders
        </Link>
      </header>

      <section>
        <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "12px", color: "var(--text-secondary)" }}>At a Glance</h2>
        <StatsBar orders={orders} />
      </section>

      <section style={{ marginTop: "8px" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "12px", color: "var(--text-secondary)" }}>Analytics</h2>
        <DashboardCharts />
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginTop: "8px" }}>
        <section className="create-order-form" style={{ padding: "24px" }}>
          <h2 className="form-title" style={{ marginBottom: "16px" }}>Recent Activity</h2>
          {recentOrders.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>No recent activity.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {recentOrders.map(order => (
                <div key={order.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "12px", borderBottom: "1px solid var(--border)" }}>
                  <div>
                    <p style={{ fontSize: "0.88rem", fontWeight: 500, color: "var(--text-primary)" }}>{order.customer_name}</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{order.item} x{order.quantity}</p>
                  </div>
                  <Link href={`/orders/${order.id}`} style={{ fontSize: "0.8rem", color: "var(--primary)", textDecoration: "none", fontWeight: 500 }}>
                    View &rarr;
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="create-order-form" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
           <h2 className="form-title">Quick Links</h2>
           <Link href="/products" style={{ display: "block", padding: "16px", background: "var(--background)", borderRadius: "var(--radius)", border: "1px solid var(--border)", textDecoration: "none" }}>
             <p style={{ fontSize: "0.9rem", fontWeight: 500, color: "var(--text-primary)", marginBottom: "4px" }}>Manage Inventory</p>
             <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>View and update product stock levels.</p>
           </Link>
           <Link href="/orders" style={{ display: "block", padding: "16px", background: "var(--background)", borderRadius: "var(--radius)", border: "1px solid var(--border)", textDecoration: "none" }}>
             <p style={{ fontSize: "0.9rem", fontWeight: 500, color: "var(--text-primary)", marginBottom: "4px" }}>Process Orders</p>
             <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Handle incoming requests and update statuses.</p>
           </Link>
        </section>
      </div>
    </div>
  );
}
