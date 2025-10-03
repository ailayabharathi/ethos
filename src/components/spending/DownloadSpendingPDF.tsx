"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format, isBefore, isAfter, parseISO } from "date-fns";
import { CalendarIcon, Download } from "lucide-react";
import { ExpenseItem } from "@/pages/SpendingTracker";
import { toast } from "sonner";
import jsPDF from "jspdf";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Added missing import
import { Label } from "@/components/ui/label"; // Added missing import

interface DownloadSpendingPDFProps {
  expenses: ExpenseItem[];
}

export function DownloadSpendingPDF({ expenses }: DownloadSpendingPDFProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const handleDownloadPDF = () => {
    if (!startDate || !endDate) {
      toast.error("Please select both a start and an end date.");
      return;
    }
    if (isBefore(endDate, startDate)) {
      toast.error("End date cannot be before start date.");
      return;
    }

    const filteredExpenses = expenses.filter((expense) => {
      const expenseDate = parseISO(expense.date);
      return (
        (isAfter(expenseDate, startDate) || format(expenseDate, "yyyy-MM-dd") === format(startDate, "yyyy-MM-dd")) &&
        (isBefore(expenseDate, endDate) || format(expenseDate, "yyyy-MM-dd") === format(endDate, "yyyy-MM-dd"))
      );
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Sort chronologically

    if (filteredExpenses.length === 0) {
      toast.info("No expenses found for the selected date range.");
      return;
    }

    const doc = new jsPDF();
    let yPos = 20;
    const margin = 10;
    const lineHeight = 7;
    const pageHeight = doc.internal.pageSize.height;

    doc.setFontSize(18);
    doc.text("Spending Report", margin, yPos);
    yPos += lineHeight * 2;

    doc.setFontSize(12);
    doc.text(`Date Range: ${format(startDate, "PPP")} - ${format(endDate, "PPP")}`, margin, yPos);
    yPos += lineHeight * 2;

    let totalSpending = 0;

    filteredExpenses.forEach((expense) => {
      if (yPos + lineHeight * 2 > pageHeight - margin) {
        doc.addPage();
        yPos = margin;
        doc.setFontSize(12);
        doc.text("Spending Report (continued)", margin, yPos);
        yPos += lineHeight * 2;
      }

      doc.text(
        `${format(parseISO(expense.date), "PPP")} - ${expense.category}: $${expense.amount.toFixed(2)}`,
        margin,
        yPos
      );
      totalSpending += expense.amount;
      yPos += lineHeight;
    });

    yPos += lineHeight; // Add some space before total
    doc.setFontSize(14);
    doc.text(`Total Spending: $${totalSpending.toFixed(2)}`, margin, yPos);

    doc.save(`Spending_Report_${format(startDate, "yyyy-MM-dd")}_to_${format(endDate, "yyyy-MM-dd")}.pdf`);
    toast.success("Spending report downloaded successfully!");
  };

  return (
    <Card className="p-4">
      <CardHeader className="p-0 pb-4">
        <CardTitle className="text-lg">Download Report</CardTitle>
      </CardHeader>
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="grid gap-2 w-full md:w-auto">
          <Label htmlFor="start-date">Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="start-date"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : <span>Pick start date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="grid gap-2 w-full md:w-auto">
          <Label htmlFor="end-date">End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="end-date"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : <span>Pick end date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <Button onClick={handleDownloadPDF} className="w-full md:w-auto">
          <Download className="h-4 w-4 mr-2" /> Download PDF
        </Button>
      </div>
    </Card>
  );
}