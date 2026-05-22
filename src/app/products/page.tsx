"use client";

import { ConnectionIndicator } from "@/components/OrderComponents";
import { useOrders } from "@/hooks/useOrders";

const MOCK_PRODUCTS = [
  { id: "p1", name: "Classic Espresso", category: "Beverage", price: 4.50, stock: 120, status: "In Stock" },
  { id: "p2", name: "Cappuccino", category: "Beverage", price: 5.00, stock: 85, status: "In Stock" },
  { id: "p3", name: "Cold Brew", category: "Beverage", price: 4.75, stock: 15, status: "Low Stock" },
  { id: "p4", name: "Almond Croissant", category: "Pastry", price: 3.50, stock: 0, status: "Out of Stock" },
  { id: "p5", name: "Blueberry Muffin", category: "Pastry", price: 3.00, stock: 40, status: "In Stock" },
  { id: "p6", name: "Bagel with Cream Cheese", category: "Food", price: 4.25, stock: 25, status: "In Stock" },
];

export default function ProductsPage() {
  const { connected } = useOrders();

  return (
    <div className="page-container">
      <div className="dashboard">
        <header className="dashboard-header">
          <div className="header-left">
            <h1 style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--text-primary)" }}>Products (Mock)</h1>
            <ConnectionIndicator connected={connected} />
          </div>
          <button className="new-order-btn">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Add Product
          </button>
        </header>

        <main className="orders-grid">
          <div className="orders-table-header" style={{ gridTemplateColumns: "100px 2fr 1fr 1fr 140px auto" }}>
            <span>ID</span>
            <span>Name</span>
            <span>Category</span>
            <span>Price</span>
            <span>Stock Status</span>
            <span></span>
          </div>
          {MOCK_PRODUCTS.map((product) => (
            <div key={product.id} className="order-card" style={{ gridTemplateColumns: "100px 2fr 1fr 1fr 140px auto" }}>
              <div className="order-card-id">{product.id}</div>
              <div className="order-card-customer">{product.name}</div>
              <div className="order-card-item">{product.category}</div>
              <div className="order-card-item" style={{ color: "var(--text-primary)" }}>${product.price.toFixed(2)}</div>
              <div>
                <span className={`status-badge ${product.stock === 0 ? "status-cancelled" : product.stock < 20 ? "status-pending" : "status-delivered"}`}>
                  {product.status} ({product.stock})
                </span>
              </div>
              <div className="order-card-actions">
                <button className="btn-cancel" style={{ border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
                  Edit
                </button>
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}
