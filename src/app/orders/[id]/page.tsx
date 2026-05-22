"use client";

import { useParams } from "next/navigation";
import { useOrders } from "@/hooks/useOrders";
import Link from "next/link";
import { StatusBadge } from "@/components/OrderComponents";
import { useEffect, useState } from "react";

export default function OrderDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { orders, updateOrder } = useOrders();
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const order = orders.find(o => o.id === id);

  if (!mounted) return null;

  if (!order) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <p>Order not found.</p>
          <Link href="/orders" className="empty-cta" style={{ textDecoration: "none" }}>Back to Orders</Link>
        </div>
      </div>
    );
  }

  // Mock timeline based on current status
  const statuses = ["pending", "confirmed", "preparing", "out_for_delivery", "delivered"];
  const currentIndex = statuses.indexOf(order.status);
  const timeline = statuses.map((status, index) => ({
    status,
    completed: index <= currentIndex || order.status === "delivered",
    current: index === currentIndex && order.status !== "delivered",
    cancelled: order.status === "cancelled"
  }));

  return (
    <div className="page-container">
      <header className="dashboard-header" style={{ marginBottom: "8px" }}>
        <div className="header-left">
          <Link href="/orders" style={{ color: "var(--text-muted)", marginRight: "12px", textDecoration: "none" }}>&larr;</Link>
          <h1 style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--text-primary)" }}>Order #{order.id.slice(0, 8)}</h1>
          <StatusBadge status={order.status} />
        </div>
        {order.status !== "cancelled" && order.status !== "delivered" && (
          <button 
            className="btn-cancel" 
            onClick={() => updateOrder(order.id, { status: "cancelled" })}
          >
            Cancel Order
          </button>
        )}
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <section className="create-order-form">
            <h2 className="form-title">Order Details</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "16px" }}>
              <div>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>Customer</p>
                <p style={{ fontSize: "0.95rem", color: "var(--text-primary)", fontWeight: 500 }}>{order.customer_name}</p>
              </div>
              <div>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>Date</p>
                <p style={{ fontSize: "0.95rem", color: "var(--text-primary)", fontWeight: 500 }}>{new Date(order.created_at).toLocaleString()}</p>
              </div>
            </div>
          </section>

          <section className="create-order-form">
            <h2 className="form-title">Items</h2>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", background: "var(--background)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "40px", height: "40px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>
                </div>
                <div>
                  <p style={{ fontSize: "0.95rem", fontWeight: 500, color: "var(--text-primary)" }}>{order.item}</p>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Qty: {order.quantity}</p>
                </div>
              </div>
              <p style={{ fontWeight: 600, color: "var(--text-primary)" }}>TBD</p>
            </div>
          </section>
        </div>

        <div>
          <section className="create-order-form">
            <h2 className="form-title">Timeline</h2>
            {order.status === "cancelled" ? (
              <div style={{ padding: "16px", background: "var(--danger-bg)", borderRadius: "var(--radius-sm)", color: "var(--danger)", fontSize: "0.85rem", fontWeight: 500 }}>
                This order was cancelled.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "16px", position: "relative" }}>
                <div style={{ position: "absolute", left: "9px", top: "10px", bottom: "10px", width: "2px", background: "var(--border)", zIndex: 0 }}></div>
                {timeline.map((step, i) => (
                  <div key={step.status} style={{ display: "flex", gap: "16px", alignItems: "center", position: "relative", zIndex: 1 }}>
                    <div style={{ 
                      width: "20px", height: "20px", borderRadius: "50%", 
                      background: step.completed ? "var(--success)" : step.current ? "var(--primary)" : "var(--surface)",
                      border: `2px solid ${step.completed ? "var(--success)" : step.current ? "var(--primary)" : "var(--border)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                      {step.completed && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                    </div>
                    <div>
                      <p style={{ fontSize: "0.85rem", fontWeight: step.current ? 600 : 500, color: step.completed || step.current ? "var(--text-primary)" : "var(--text-muted)", textTransform: "capitalize" }}>
                        {step.status.replace("_", " ")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
