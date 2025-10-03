"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ExpenseItem } from "@/pages/SpendingTracker";
import { format, parseISO } from "date-fns";

interface SpendingChartProps {
  expenses: ExpenseItem[];
  viewMode: "daily" | "monthly";
}

export function SpendingChart({ expenses, viewMode }: SpendingChartProps) {
  const aggregateData = (data: ExpenseItem[], mode: "daily" | "monthly") => {
    const aggregated: { [key: string]: number } = {};

    data.forEach((expense) => {
      const date = parseISO(expense.date);
      let key: string;
      if (mode === "daily") {
        key = format(date, "MMM dd"); // e.g., "Jan 01"
      } else {
        key = format(date, "MMM yyyy"); // e.g., "Jan 2023"
      }
      aggregated[key] = (aggregated[key] || 0) + expense.amount;
    });

    // Convert to array of objects for Recharts
    const chartData = Object.keys(aggregated)
      .map((key) => ({
        name: key,
        total: aggregated[key],
      }))
      .sort((a, b) => {
        // Sort by date for proper chronological order
        const dateA = parseISO(a.name.includes(" ") ? format(new Date(a.name + (mode === "daily" ? "" : " 01")), "yyyy-MM-dd") : a.name);
        const dateB = parseISO(b.name.includes(" ") ? format(new Date(b.name + (mode === "daily" ? "" : " 01")), "yyyy-MM-dd") : b.name);
        return dateA.getTime() - dateB.getTime();
      });

    return chartData;
  };

  const chartData = aggregateData(expenses, viewMode);

  if (chartData.length === 0) {
    return (
      <div className="text-center text-muted-foreground p-4">
        No spending data available for the chart. Add some expenses!
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
        <YAxis stroke="hsl(var(--foreground))" />
        <Tooltip
          formatter={(value: number) => `$${value.toFixed(2)}`}
          labelFormatter={(label: string) => `${viewMode === "daily" ? "Date" : "Month"}: ${label}`}
          contentStyle={{
            backgroundColor: "hsl(var(--popover))",
            borderColor: "hsl(var(--border))",
            borderRadius: "var(--radius)",
          }}
          itemStyle={{ color: "hsl(var(--foreground))" }}
        />
        <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}