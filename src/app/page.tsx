"use client";

import { useOrders } from "@/hooks/useOrders";
import {
  CreateOrderForm,
  OrderCard,
  ConnectionIndicator,
  EventToast,
  StatsBar,
} from "@/components/OrderComponents";
import { useState, useEffect, useRef } from "react";
import type { OrderStatus } from "@/types/order";

const STATUS_FILTERS: { label: string; value: OrderStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Preparing", value: "preparing" },
  { label: "Out for Delivery", value: "out_for_delivery" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

export default function Dashboard() {
  const {
    orders,
    loading,
    connected,
    lastEvent,
    createOrder,
    updateOrder,
    deleteOrder,
  } = useOrders();

  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [showForm, setShowForm] = useState(false);
  const [newOrderIds, setNewOrderIds] = useState<Set<string>>(new Set());
  const [toastEvent, setToastEvent] = useState(lastEvent);
  const toastTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Show toast for 4 seconds on new events
  useEffect(() => {
    if (lastEvent) {
      setToastEvent(lastEvent);

      // Highlight new inserts
      if (lastEvent.type === "INSERT") {
        setNewOrderIds((prev) => new Set(prev).add(lastEvent.record.id));
        setTimeout(() => {
          setNewOrderIds((prev) => {
            const next = new Set(prev);
            next.delete(lastEvent.record.id);
            return next;
          });
        }, 3000);
      }

      clearTimeout(toastTimeout.current);
      toastTimeout.current = setTimeout(() => setToastEvent(null), 4000);
    }
  }, [lastEvent]);

  const filteredOrders =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const handleCreate = async (order: {
    customer_name: string;
    item: string;
    quantity: number;
  }) => {
    await createOrder(order);
    setShowForm(false);
  };

  const handleUpdateStatus = async (id: string, status: OrderStatus) => {
    await updateOrder(id, { status });
  };

  const handleDelete = async (id: string) => {
    await deleteOrder(id);
  };

  return (
    <div className="dashboard">
      {/* Background gradient orbs */}
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />

      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="logo">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="url(#logo-grad)" />
              <path
                d="M10 16l4 4 8-8"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32">
                  <stop stopColor="#6366f1" />
                  <stop offset="1" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
            <h1>Ripple Orders</h1>
          </div>
          <ConnectionIndicator connected={connected} />
        </div>
        <button
          className="new-order-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? (
            <>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Close
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              New Order
            </>
          )}
        </button>
      </header>

      {/* Toast */}
      <EventToast event={toastEvent} />

      {/* Stats */}
      <StatsBar orders={orders} />

      {/* Create Form */}
      {showForm && (
        <div className="form-container">
          <CreateOrderForm onSubmit={handleCreate} />
        </div>
      )}

      {/* Filters */}
      <div className="filter-bar">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            className={`filter-btn ${filter === f.value ? "filter-active" : ""}`}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
            {f.value !== "all" && (
              <span className="filter-count">
                {orders.filter((o) =>
                  f.value === "all" ? true : o.status === f.value
                ).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders Grid */}
      <main className="orders-grid">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner" />
            <p>Loading orders…</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="empty-state">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect x="8" y="12" width="32" height="24" rx="4" stroke="currentColor" strokeWidth="2" opacity="0.3" />
              <path d="M16 22h16M16 28h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
            </svg>
            <p>No orders {filter !== "all" ? `with status "${filter}"` : "yet"}</p>
            <button className="empty-cta" onClick={() => setShowForm(true)}>
              Create your first order
            </button>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onUpdateStatus={handleUpdateStatus}
              onDelete={handleDelete}
              isNew={newOrderIds.has(order.id)}
            />
          ))
        )}
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>
          Real-time streaming via SSE · Powered by Supabase &amp; Next.js
        </p>
      </footer>
    </div>
  );
}
