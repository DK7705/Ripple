"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", href: "/", icon: HomeIcon },
    { name: "Orders", href: "/orders", icon: InboxIcon },
    { name: "Products", href: "/products", icon: ArchiveIcon },
  ];

  return (
    <aside className="app-sidebar">
      <div className="app-sidebar-header">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="5" fill="var(--primary)" />
          <path
            d="M7 12l3 3 7-7"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <h1 className="logo-text" style={{ fontSize: "1.1rem", fontWeight: 650, color: "var(--text-primary)" }}>
          Ripple
        </h1>
      </div>
      <nav className="app-sidebar-nav">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`nav-item ${isActive ? "active" : ""}`}
            >
              <item.icon />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

function HomeIcon() {
  return (
    <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function InboxIcon() {
  return (
    <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  );
}

function ArchiveIcon() {
  return (
    <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="21 8 21 21 3 21 3 8" />
      <rect x="1" y="3" width="22" height="5" />
      <line x1="10" y1="12" x2="14" y2="12" />
    </svg>
  );
}
