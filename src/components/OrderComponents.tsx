"use client";

import { useState } from "react";
import type { OrderStatus } from "@/types/order";

interface CreateOrderFormProps {
  onSubmit: (order: {
    customer_name: string;
    item: string;
    quantity: number;
  }) => Promise<void>;
}

export function CreateOrderForm({ onSubmit }: CreateOrderFormProps) {
  const [customerName, setCustomerName] = useState("");
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({ customer_name: customerName, item, quantity });
      setCustomerName("");
      setItem("");
      setQuantity(1);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-order-form">
      <h2 className="form-title">
        <span className="form-title-icon">+</span>
        New Order
      </h2>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="customer-name">Customer</label>
          <input
            id="customer-name"
            type="text"
            placeholder="Customer name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="item-name">Item</label>
          <input
            id="item-name"
            type="text"
            placeholder="Order item"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="quantity">Qty</label>
          <input
            id="quantity"
            type="number"
            min={1}
            max={999}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
            required
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={submitting || !customerName || !item}
        className="submit-btn"
      >
        {submitting ? (
          <span className="spinner" />
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 3v10M3 8h10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Place Order
          </>
        )}
      </button>
    </form>
  );
}

/* ─── Status Badge ─── */

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; className: string; icon: string }
> = {
  pending: { label: "Pending", className: "status-pending", icon: "⏳" },
  confirmed: { label: "Confirmed", className: "status-confirmed", icon: "✓" },
  preparing: { label: "Preparing", className: "status-preparing", icon: "🍳" },
  out_for_delivery: {
    label: "Out for Delivery",
    className: "status-delivery",
    icon: "🚚",
  },
  delivered: { label: "Delivered", className: "status-delivered", icon: "✅" },
  cancelled: { label: "Cancelled", className: "status-cancelled", icon: "✕" },
};

const STATUS_FLOW: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered",
];

export function StatusBadge({ status }: { status: OrderStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <span className={`status-badge ${config.className}`}>
      <span className="status-icon">{config.icon}</span>
      {config.label}
    </span>
  );
}

/* ─── Order Card ─── */

interface OrderCardProps {
  order: {
    id: string;
    customer_name: string;
    item: string;
    quantity: number;
    status: OrderStatus;
    created_at: string;
    updated_at: string;
  };
  onUpdateStatus: (id: string, status: OrderStatus) => void;
  onDelete: (id: string) => void;
  isNew?: boolean;
}

export function OrderCard({
  order,
  onUpdateStatus,
  onDelete,
  isNew,
}: OrderCardProps) {
  const currentIndex = STATUS_FLOW.indexOf(order.status);
  const nextStatus =
    currentIndex >= 0 && currentIndex < STATUS_FLOW.length - 1
      ? STATUS_FLOW[currentIndex + 1]
      : null;

  const timeAgo = getTimeAgo(order.created_at);

  return (
    <div className={`order-card ${isNew ? "order-card-new" : ""}`}>
      <div className="order-card-header">
        <div className="order-card-id">
          #{order.id.slice(0, 8)}
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="order-card-body">
        <div className="order-card-customer">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="order-card-icon">
            <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          {order.customer_name}
        </div>
        <div className="order-card-item">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="order-card-icon">
            <rect x="2" y="3" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M5 7h6M5 10h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          {order.item}
          <span className="order-card-qty">×{order.quantity}</span>
        </div>
        <div className="order-card-time">{timeAgo}</div>
      </div>

      <div className="order-card-actions">
        {nextStatus && order.status !== "cancelled" && (
          <button
            className="btn-advance"
            onClick={() => onUpdateStatus(order.id, nextStatus)}
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {STATUS_CONFIG[nextStatus].label}
          </button>
        )}
        {order.status !== "cancelled" && order.status !== "delivered" && (
          <button
            className="btn-cancel"
            onClick={() => onUpdateStatus(order.id, "cancelled")}
          >
            Cancel
          </button>
        )}
        <button
          className="btn-delete"
          onClick={() => onDelete(order.id)}
          title="Delete order"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path
              d="M4 5h8l-.7 7.3a1 1 0 01-1 .7H5.7a1 1 0 01-1-.7L4 5zM6 5V3.5a.5.5 0 01.5-.5h3a.5.5 0 01.5.5V5M3 5h10"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Progress bar */}
      {order.status !== "cancelled" && (
        <div className="order-progress">
          {STATUS_FLOW.map((s, i) => (
            <div
              key={s}
              className={`progress-step ${
                i <= currentIndex ? "progress-step-active" : ""
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Connection Indicator ─── */

export function ConnectionIndicator({ connected }: { connected: boolean }) {
  return (
    <div className={`connection-indicator ${connected ? "connected" : "disconnected"}`}>
      <span className="connection-dot" />
      <span className="connection-text">
        {connected ? "Live" : "Reconnecting…"}
      </span>
    </div>
  );
}

/* ─── Event Toast ─── */

export function EventToast({ event }: { event: { type: string; record: { customer_name: string; item: string } } | null }) {
  if (!event) return null;

  const messages: Record<string, string> = {
    INSERT: `New order from ${event.record.customer_name}`,
    UPDATE: `${event.record.customer_name}'s order updated`,
    DELETE: `${event.record.customer_name}'s order removed`,
  };

  return (
    <div className="event-toast" key={Date.now()}>
      <div className={`toast-stripe toast-${event.type.toLowerCase()}`} />
      <span className="toast-message">{messages[event.type] || "Order changed"}</span>
    </div>
  );
}

/* ─── Stats Bar ─── */

export function StatsBar({
  orders,
}: {
  orders: { status: OrderStatus }[];
}) {
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    active: orders.filter((o) =>
      ["confirmed", "preparing", "out_for_delivery"].includes(o.status)
    ).length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  return (
    <div className="stats-bar">
      <div className="stat-card">
        <span className="stat-value">{stats.total}</span>
        <span className="stat-label">Total</span>
      </div>
      <div className="stat-card stat-pending">
        <span className="stat-value">{stats.pending}</span>
        <span className="stat-label">Pending</span>
      </div>
      <div className="stat-card stat-active">
        <span className="stat-value">{stats.active}</span>
        <span className="stat-label">Active</span>
      </div>
      <div className="stat-card stat-delivered">
        <span className="stat-value">{stats.delivered}</span>
        <span className="stat-label">Delivered</span>
      </div>
      <div className="stat-card stat-cancelled">
        <span className="stat-value">{stats.cancelled}</span>
        <span className="stat-label">Cancelled</span>
      </div>
    </div>
  );
}

/* ─── Helpers ─── */

function getTimeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / 1000);

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
