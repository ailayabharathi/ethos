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
import { toast } from "sonner";

export interface WorkoutItem {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number; // Optional for home workouts
  date: string; // YYYY-MM-DD
  completed: boolean;
}

interface WorkoutFormProps {
  onAddWorkout: (workout: Omit<WorkoutItem, "id" | "completed">) => void;
  workoutType: "home" | "gym";
}

export function WorkoutForm({ onAddWorkout, workoutType }: WorkoutFormProps) {
  const [name, setName] = useState<string>("");
  const [sets, setSets] = useState<string>("");
  const [reps, setReps] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedSets = parseInt(sets);
    const parsedReps = parseInt(reps);
    const parsedWeight = parseFloat(weight);

    if (name.trim() === "") {
      toast.error("Exercise name cannot be empty.");
      return;
    }
    if (isNaN(parsedSets) || parsedSets <= 0) {
      toast.error("Please enter a valid number of sets.");
      return;
    }
    if (isNaN(parsedReps) || parsedReps <= 0) {
      toast.error("Please enter a valid number of reps.");
      return;
    }
    if (workoutType === "gym" && (isNaN(parsedWeight) || parsedWeight <= 0)) {
      toast.error("Please enter a valid positive weight for gym workouts.");
      return;
    }
    if (!date) {
      toast.error("Please select a date.");
      return;
    }

    onAddWorkout({
      name,
      sets: parsedSets,
      reps: parsedReps,
      weight: workoutType === "gym" ? parsedWeight : undefined,
      date: format(date, "yyyy-MM-dd"),
    });

    setName("");
    setSets("");
    setReps("");
    setWeight("");
    setDate(new Date());
    toast.success("Workout exercise added!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-naruto">Add New Exercise</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div className="space-y-2 col-span-full lg:col-span-1">
            <Label htmlFor="exercise-name">Exercise Name</Label>
            <Input
              id="exercise-name"
              placeholder="e.g., Push-ups"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sets">Sets</Label>
            <Input
              id="sets"
              type="number"
              placeholder="3"
              value={sets}
              onChange={(e) => setSets(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reps">Reps</Label>
            <Input
              id="reps"
              type="number"
              placeholder="10"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              required
            />
          </div>
          {workoutType === "gym" && (
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg/lbs)</Label>
              <Input
                id="weight"
                type="number"
                step="0.5"
                placeholder="50"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
              />
            </div>
          )}
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
          <Button type="submit" className="w-full md:w-auto col-span-full lg:col-span-1">
            <Plus className="h-4 w-4 mr-2" /> Add Exercise
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}