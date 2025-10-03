"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ExpenseItem } from "@/pages/SpendingTracker";
import { format } from "date-fns";

interface ExpenseListProps {
  expenses: ExpenseItem[];
  onDeleteExpense: (id: string) => void;
}

export function ExpenseList({ expenses, onDeleteExpense }: ExpenseListProps) {
  // Sort expenses by date in descending order
  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        {sortedExpenses.length === 0 ? (
          <p className="text-muted-foreground">No expenses recorded yet. Add a new expense above!</p>
        ) : (
          <ul className="space-y-3">
            {sortedExpenses.map((expense) => (
              <li
                key={expense.id}
                className="flex items-center justify-between p-3 border rounded-md bg-background"
              >
                <div className="flex flex-col sm:flex-row sm:items-center flex-1">
                  <span className="font-medium mr-2">${expense.amount.toFixed(2)}</span>
                  <span className="text-muted-foreground mr-2">({expense.category})</span>
                  <span className="text-sm text-muted-foreground">{format(new Date(expense.date), "PPP")}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteExpense(expense.id)}
                  aria-label="Delete expense"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}