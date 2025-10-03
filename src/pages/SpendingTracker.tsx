"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExpenseForm } from "@/components/spending/ExpenseForm";
import { ExpenseList } from "@/components/spending/ExpenseList";
import { SpendingChart } from "@/components/spending/SpendingChart";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { DownloadSpendingPDF } from "@/components/spending/DownloadSpendingPDF";
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/components/auth/SessionContextProvider';
import { format } from "date-fns";

export interface ExpenseItem {
  id: string;
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD format
}

const SpendingTracker = () => {
  const { session } = useSession();
  const userId = session?.user?.id;

  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [viewMode, setViewMode] = useState<"daily" | "monthly">("daily");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      if (!userId) {
        setExpenses([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      const { data, error } = await supabase
        .from('expenses')
        .select('id, amount, category, date')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) {
        toast.error("Failed to load expenses: " + error.message);
        setExpenses([]);
      } else {
        setExpenses(data || []);
      }
      setLoading(false);
    };

    fetchExpenses();
  }, [userId]);

  const handleAddExpense = async (newExpense: Omit<ExpenseItem, "id">) => {
    if (!userId) {
      toast.error("You must be logged in to add expenses.");
      return;
    }

    const { data, error } = await supabase
      .from('expenses')
      .insert({ user_id: userId, ...newExpense })
      .select('id, amount, category, date')
      .single();

    if (error) {
      toast.error("Failed to add expense: " + error.message);
    } else if (data) {
      setExpenses((prevExpenses) => [...prevExpenses, data]);
      toast.success("Expense added successfully!");
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!userId) {
      toast.error("You must be logged in to delete expenses.");
      return;
    }

    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      toast.error("Failed to delete expense: " + error.message);
    } else {
      setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense.id !== id));
      toast.success("Expense deleted.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading expenses...</p>
      </div>
    );
  }

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

      <DownloadSpendingPDF expenses={expenses} />

      <ExpenseList expenses={expenses} onDeleteExpense={handleDeleteExpense} />
    </div>
  );
};

export default SpendingTracker;