"use client";

import React, { useState, useEffect } from "react";
import { loadState, saveState } from "@/lib/localStorage";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExpenseForm } from "@/components/spending/ExpenseForm";
import { ExpenseList } from "@/components/spending/ExpenseList";
import { SpendingChart } from "@/components/spending/SpendingChart";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { DownloadSpendingPDF } from "@/components/spending/DownloadSpendingPDF"; // Import the new component

export interface ExpenseItem {
  id: string;
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD format
}

const LOCAL_STORAGE_KEY = "spendingTrackerExpenses";

const SpendingTracker = () => {
  const [expenses, setExpenses] = useState<ExpenseItem[]>(() =>
    loadState(LOCAL_STORAGE_KEY, [])
  );
  const [viewMode, setViewMode] = useState<"daily" | "monthly">("daily");

  useEffect(() => {
    saveState(LOCAL_STORAGE_KEY, expenses);
  }, [expenses]);

  const handleAddExpense = (newExpense: Omit<ExpenseItem, "id">) => {
    const id = crypto.randomUUID();
    setExpenses((prevExpenses) => [...prevExpenses, { id, ...newExpense }]);
    toast.success("Expense added successfully!");
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense.id !== id));
    toast.success("Expense deleted.");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Spending Tracker</h1>
      <p className="text-muted-foreground">Keep track of your daily expenses and visualize your spending habits.</p>

      <ExpenseForm onAddExpense={handleAddExpense} />

      <Card>
        <CardHeader>
          <CardTitle>Spending Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center mb-4">
            <ToggleGroup type="single" value={viewMode} onValueChange={(value: "daily" | "monthly") => value && setViewMode(value)}>
              <ToggleGroupItem value="daily" aria-label="Toggle daily view">
                Daily
              </ToggleGroupItem>
              <ToggleGroupItem value="monthly" aria-label="Toggle monthly view">
                Monthly
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <SpendingChart expenses={expenses} viewMode={viewMode} />
        </CardContent>
      </Card>

      <DownloadSpendingPDF expenses={expenses} /> {/* New PDF download component */}

      <ExpenseList expenses={expenses} onDeleteExpense={handleDeleteExpense} />
    </div>
  );
};

export default SpendingTracker;