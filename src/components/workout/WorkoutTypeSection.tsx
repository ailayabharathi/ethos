"use client";

import React, { useState, useEffect } from "react";
import { WorkoutForm, WorkoutItem } from "./WorkoutForm";
import { WorkoutList } from "./WorkoutList";
import { loadState, saveState } from "@/lib/localStorage";

interface WorkoutTypeSectionProps {
  type: "home" | "gym";
}

export function WorkoutTypeSection({ type }: WorkoutTypeSectionProps) {
  const LOCAL_STORAGE_KEY = `workoutLog_${type}Workouts`;
  const [workouts, setWorkouts] = useState<WorkoutItem[]>(() =>
    loadState(LOCAL_STORAGE_KEY, [])
  );

  useEffect(() => {
    saveState(LOCAL_STORAGE_KEY, workouts);
  }, [workouts]);

  const handleAddWorkout = (newWorkout: Omit<WorkoutItem, "id" | "completed">) => {
    const id = crypto.randomUUID();
    setWorkouts((prevWorkouts) => [...prevWorkouts, { id, ...newWorkout, completed: false }]);
  };

  const handleToggleComplete = (id: string) => {
    setWorkouts((prevWorkouts) =>
      prevWorkouts.map((workout) =>
        workout.id === id ? { ...workout, completed: !workout.completed } : workout
      )
    );
  };

  const handleDeleteWorkout = (id: string) => {
    setWorkouts((prevWorkouts) => prevWorkouts.filter((workout) => workout.id !== id));
  };

  const handleEditWorkout = (id: string, updatedWorkout: Partial<WorkoutItem>) => {
    setWorkouts((prevWorkouts) =>
      prevWorkouts.map((workout) =>
        workout.id === id ? { ...workout, ...updatedWorkout } : workout
      )
    );
  };

  return (
    <div className="space-y-6">
      <WorkoutForm onAddWorkout={handleAddWorkout} workoutType={type} />
      <WorkoutList
        workouts={workouts}
        onToggleComplete={handleToggleComplete}
        onDeleteWorkout={handleDeleteWorkout}
        onEditWorkout={handleEditWorkout}
        workoutType={type}
      />
    </div>
  );
}