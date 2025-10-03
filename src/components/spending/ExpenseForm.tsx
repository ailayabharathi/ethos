"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Plus } from "lucide-react";
import { ExpenseItem } from "@/pages/SpendingTracker";
import { toast } from "sonner";

interface ExpenseFormProps {
  onAddExpense: (expense: Omit<ExpenseItem, "id">) => void;
}

const categories = [
  "Food",
  "Transport",
  "Entertainment",
  "Utilities",
  "Shopping",
  "Health",
  "Education",
  "Rent",
  "Other",
];

export function ExpenseForm({ onAddExpense }: ExpenseFormProps) {
  const [amount, setAmount] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Please enter a valid positive amount.");
      return;
    }
    if (!category) {
      toast.error("Please select a category.");
      return;
    }
    if (!date) {
      toast.error("Please select a date.");
      return;
    }

    onAddExpense({
      amount: parsedAmount,
      category,
      date: format(date, "yyyy-MM-dd"),
    });

    setAmount("");
    setCategory("");
    setDate(new Date()); // Reset to current date
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Expense</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="e.g., 25.50"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <Button type="submit" className="w-full md:w-auto">
            <Plus className="h-4 w-4 mr-2" /> Add Expense
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}