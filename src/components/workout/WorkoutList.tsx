"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Trash2 } from "lucide-react";
import { WorkoutItem } from "./WorkoutForm";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils"; // Added import for cn

interface WorkoutListProps {
  workouts: WorkoutItem[];
  onToggleComplete: (id: string) => void;
  onDeleteWorkout: (id: string) => void;
  onEditWorkout: (id: string, updatedWorkout: Partial<WorkoutItem>) => void;
  workoutType: "home" | "gym";
}

export function WorkoutList({
  workouts,
  onToggleComplete,
  onDeleteWorkout,
  onEditWorkout,
  workoutType,
}: WorkoutListProps) {
  const [editingWorkoutId, setEditingWorkoutId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState<string>("");
  const [editedSets, setEditedSets] = useState<string>("");
  const [editedReps, setEditedReps] = useState<string>("");
  const [editedWeight, setEditedWeight] = useState<string>("");

  const sortedWorkouts = [...workouts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleEditClick = (workout: WorkoutItem) => {
    setEditingWorkoutId(workout.id);
    setEditedName(workout.name);
    setEditedSets(workout.sets.toString());
    setEditedReps(workout.reps.toString());
    setEditedWeight(workout.weight?.toString() || "");
  };

  const handleSaveEdit = (id: string) => {
    const parsedSets = parseInt(editedSets);
    const parsedReps = parseInt(editedReps);
    const parsedWeight = parseFloat(editedWeight);

    if (editedName.trim() === "") {
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

    onEditWorkout(id, {
      name: editedName,
      sets: parsedSets,
      reps: parsedReps,
      weight: workoutType === "gym" ? parsedWeight : undefined,
    });
    setEditingWorkoutId(null);
    toast.success("Workout updated successfully!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>All {workoutType === "home" ? "Home" : "Gym"} Exercises</CardTitle>
      </CardHeader>
      <CardContent>
        {sortedWorkouts.length === 0 ? (
          <p className="text-muted-foreground">No {workoutType} exercises logged yet. Add a new exercise above!</p>
        ) : (
          <ul className="space-y-3">
            {sortedWorkouts.map((workout) => (
              <li
                key={workout.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border rounded-md bg-background"
              >
                <div className="flex items-center flex-1 w-full sm:w-auto mb-2 sm:mb-0">
                  <Checkbox
                    id={`workout-${workout.id}`}
                    checked={workout.completed}
                    onCheckedChange={() => onToggleComplete(workout.id, workout.completed)}
                    className="mr-3"
                  />
                  {editingWorkoutId === workout.id ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 flex-1">
                      <Input
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        onBlur={() => handleSaveEdit(workout.id)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") handleSaveEdit(workout.id);
                        }}
                        className="col-span-full sm:col-span-1"
                      />
                      <Input
                        type="number"
                        value={editedSets}
                        onChange={(e) => setEditedSets(e.target.value)}
                        onBlur={() => handleSaveEdit(workout.id)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") handleSaveEdit(workout.id);
                        }}
                        className="w-full"
                      />
                      <Input
                        type="number"
                        value={editedReps}
                        onChange={(e) => setEditedReps(e.target.value)}
                        onBlur={() => handleSaveEdit(workout.id)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") handleSaveEdit(workout.id);
                        }}
                        className="w-full"
                      />
                      {workoutType === "gym" && (
                        <Input
                          type="number"
                          step="0.5"
                          value={editedWeight}
                          onChange={(e) => setEditedWeight(e.target.value)}
                          onBlur={() => handleSaveEdit(workout.id)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") handleSaveEdit(workout.id);
                          }}
                          className="w-full"
                        />
                      )}
                    </div>
                  ) : (
                    <Label
                      htmlFor={`workout-${workout.id}`}
                      className={cn(
                        "flex-1 text-base",
                        workout.completed ? "line-through text-muted-foreground" : ""
                      )}
                    >
                      {workout.name} - {workout.sets} sets of {workout.reps} reps
                      {workoutType === "gym" && typeof workout.weight === 'number' && workout.weight > 0 && ` at ${workout.weight}kg`}
                      <span className="text-sm text-muted-foreground ml-2">({format(new Date(workout.date), "PPP")})</span>
                    </Label>
                  )}
                </div>
                <div className="flex space-x-2 ml-auto sm:ml-0">
                  {editingWorkoutId !== workout.id && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditClick(workout)}
                      aria-label="Edit workout"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteWorkout(workout.id)}
                    aria-label="Delete workout"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}