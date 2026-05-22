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

export default function OrdersPage() {
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
    <div className="page-container">
      <div className="dashboard">
        <header className="dashboard-header">
          <div className="header-left">
            <h1 style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--text-primary)" }}>Orders</h1>
            <ConnectionIndicator connected={connected} />
          </div>
          <button
            className="new-order-btn"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? (
              <>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                  <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Close
              </>
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                  <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                New Order
              </>
            )}
          </button>
        </header>

        <EventToast event={toastEvent} />

        <StatsBar orders={orders} />

        {showForm && (
          <div className="form-container">
            <CreateOrderForm onSubmit={handleCreate} />
          </div>
        )}

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

        <main className="orders-grid">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner" />
              <p>Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="empty-state">
              <p>No orders {filter !== "all" ? `with status "${filter}"` : "yet"}</p>
              <button className="empty-cta" onClick={() => setShowForm(true)}>
                Create an order
              </button>
            </div>
          ) : (
            <>
              <div className="orders-table-header">
                <span>Order</span>
                <span>Customer</span>
                <span>Item</span>
                <span>Status</span>
                <span></span>
              </div>
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onUpdateStatus={handleUpdateStatus}
                  onDelete={handleDelete}
                  isNew={newOrderIds.has(order.id)}
                />
              ))}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
