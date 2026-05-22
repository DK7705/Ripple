"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";

// Mock Data
const ordersOverTime = [
  { date: "Mon", orders: 12 },
  { date: "Tue", orders: 18 },
  { date: "Wed", orders: 14 },
  { date: "Thu", orders: 22 },
  { date: "Fri", orders: 30 },
  { date: "Sat", orders: 35 },
  { date: "Sun", orders: 28 },
];

const statusBreakdown = [
  { name: "Delivered", value: 45, color: "var(--success)" },
  { name: "Active", value: 30, color: "var(--info)" },
  { name: "Pending", value: 15, color: "var(--warning)" },
  { name: "Cancelled", value: 10, color: "var(--danger)" },
];

const fulfillmentProgress = [
  { name: "Fulfillment", fulfilled: 75, unfulfilled: 25 },
];

const aovTrend = [
  { date: "Mon", aov: 42 },
  { date: "Tue", aov: 45 },
  { date: "Wed", aov: 41 },
  { date: "Thu", aov: 48 },
  { date: "Fri", aov: 52 },
  { date: "Sat", aov: 50 },
  { date: "Sun", aov: 55 },
];

// Custom Tooltip for dark mode
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-sm)",
          padding: "8px 12px",
          boxShadow: "var(--shadow-md)",
          fontSize: "0.8rem",
        }}
      >
        <p style={{ color: "var(--text-primary)", fontWeight: 600, marginBottom: "4px" }}>
          {label}
        </p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color || "var(--text-secondary)" }}>
            {entry.name}: <span style={{ fontWeight: 600 }}>{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Chart Container Component
function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <h3
        style={{
          fontSize: "0.95rem",
          fontWeight: 600,
          color: "var(--text-primary)",
          marginBottom: "16px",
        }}
      >
        {title}
      </h3>
      <div style={{ height: 260, width: "100%", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export function DashboardCharts() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "24px",
      }}
    >
      {/* 1. Orders Over Time */}
      <ChartCard title="Orders Over Time">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={ordersOverTime} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="var(--text-muted)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="var(--text-muted)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="orders"
              name="Orders"
              stroke="var(--primary)"
              strokeWidth={2}
              dot={{ r: 4, fill: "var(--surface)", stroke: "var(--primary)", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: "var(--primary)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* 2. Order Status Breakdown */}
      <ChartCard title="Status Breakdown">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={statusBreakdown}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {statusBreakdown.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* 3. Average Order Value Trend */}
      <ChartCard title="Average Order Value ($)">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={aovTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="var(--text-muted)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="var(--text-muted)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="aov"
              name="AOV"
              stroke="var(--info)"
              strokeWidth={2}
              dot={{ r: 4, fill: "var(--surface)", stroke: "var(--info)", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: "var(--info)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* 4. Fulfillment Progress */}
      <ChartCard title="Fulfillment Progress">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={fulfillmentProgress}
            margin={{ top: 60, right: 10, left: -10, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" hide />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}
            />
            <Bar dataKey="fulfilled" name="Fulfilled" stackId="a" fill="var(--success)" radius={[4, 0, 0, 4]} barSize={40} />
            <Bar dataKey="unfulfilled" name="Unfulfilled" stackId="a" fill="#71717a" radius={[0, 4, 4, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
