"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Order, OrderEvent } from "@/types/order";

/**
 * Custom hook that manages the order list state and SSE connection.
 * - Fetches initial orders from REST API
 * - Subscribes to SSE stream for real-time updates
 * - Automatically reconnects on disconnection
 */
export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastEvent, setLastEvent] = useState<OrderEvent | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Fetch initial orders
  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch");
    } finally {
      setLoading(false);
    }
  }, []);

  // Connect to SSE stream
  useEffect(() => {
    fetchOrders();

    const connectSSE = () => {
      const es = new EventSource("/api/orders/stream");
      eventSourceRef.current = es;

      es.onopen = () => {
        setConnected(true);
        setError(null);
      };

      es.onerror = () => {
        setConnected(false);
        es.close();
        // Reconnect after 3 seconds
        setTimeout(connectSSE, 3000);
      };

      // Listen for INSERT events
      es.addEventListener("INSERT", (e) => {
        const event: OrderEvent = JSON.parse(e.data);
        setLastEvent(event);
        setOrders((prev) => [event.record, ...prev]);
      });

      // Listen for UPDATE events
      es.addEventListener("UPDATE", (e) => {
        const event: OrderEvent = JSON.parse(e.data);
        setLastEvent(event);
        setOrders((prev) =>
          prev.map((order) =>
            order.id === event.record.id ? event.record : order
          )
        );
      });

      // Listen for DELETE events
      es.addEventListener("DELETE", (e) => {
        const event: OrderEvent = JSON.parse(e.data);
        setLastEvent(event);
        setOrders((prev) =>
          prev.filter((order) => order.id !== event.record.id)
        );
      });
    };

    connectSSE();

    return () => {
      eventSourceRef.current?.close();
    };
  }, [fetchOrders]);

  // CRUD operations
  const createOrder = useCallback(
    async (order: {
      customer_name: string;
      item: string;
      quantity: number;
    }) => {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }
      return res.json();
    },
    []
  );

  const updateOrder = useCallback(
    async (id: string, updates: Partial<Order>) => {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }
      return res.json();
    },
    []
  );

  const deleteOrder = useCallback(async (id: string) => {
    const res = await fetch("/api/orders", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error);
    }
    return res.json();
  }, []);

  return {
    orders,
    loading,
    connected,
    error,
    lastEvent,
    createOrder,
    updateOrder,
    deleteOrder,
    refetch: fetchOrders,
  };
}
