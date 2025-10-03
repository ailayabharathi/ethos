"use client";

import React, { useState, useEffect } from "react";
import { WorkoutForm, WorkoutItem } from "./WorkoutForm";
import { WorkoutList } from "./WorkoutList";
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/components/auth/SessionContextProvider';
import { toast } from "sonner";

interface WorkoutTypeSectionProps {
  type: "home" | "gym";
}

export function WorkoutTypeSection({ type }: WorkoutTypeSectionProps) {
  const { session } = useSession();
  const userId = session?.user?.id;

  const [workouts, setWorkouts] = useState<WorkoutItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkouts = async () => {
      if (!userId) {
        setWorkouts([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      const { data, error } = await supabase
        .from('workouts')
        .select('id, name, sets, reps, weight, date, completed')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) {
        toast.error("Failed to load workouts: " + error.message);
        setWorkouts([]);
      } else {
        setWorkouts(data || []);
      }
      setLoading(false);
    };

    fetchWorkouts();
  }, [userId]);

  const handleAddWorkout = async (newWorkout: Omit<WorkoutItem, "id" | "completed">) => {
    if (!userId) {
      toast.error("You must be logged in to add workouts.");
      return;
    }

    const { data, error } = await supabase
      .from('workouts')
      .insert({ user_id: userId, ...newWorkout, completed: false })
      .select('id, name, sets, reps, weight, date, completed')
      .single();

    if (error) {
      toast.error("Failed to add workout: " + error.message);
    } else if (data) {
      setWorkouts((prevWorkouts) => [...prevWorkouts, data]);
      toast.success("Workout exercise added!");
    }
  };

  const handleToggleComplete = async (id: string, currentCompleted: boolean) => {
    if (!userId) {
      toast.error("You must be logged in to update workouts.");
      return;
    }

    const { error } = await supabase
      .from('workouts')
      .update({ completed: !currentCompleted })
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      toast.error("Failed to update workout status: " + error.message);
    } else {
      setWorkouts((prevWorkouts) =>
        prevWorkouts.map((workout) =>
          workout.id === id ? { ...workout, completed: !workout.completed } : workout
        )
      );
      toast.info("Workout status updated.");
    }
  };

  const handleDeleteWorkout = async (id: string) => {
    if (!userId) {
      toast.error("You must be logged in to delete workouts.");
      return;
    }

    const { error } = await supabase
      .from('workouts')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      toast.error("Failed to delete workout: " + error.message);
    } else {
      setWorkouts((prevWorkouts) => prevWorkouts.filter((workout) => workout.id !== id));
      toast.success("Workout deleted.");
    }
  };

  const handleEditWorkout = async (id: string, updatedWorkout: Partial<WorkoutItem>) => {
    if (!userId) {
      toast.error("You must be logged in to edit workouts.");
      return;
    }

    const { error } = await supabase
      .from('workouts')
      .update(updatedWorkout)
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      toast.error("Failed to update workout: " + error.message);
    } else {
      setWorkouts((prevWorkouts) =>
        prevWorkouts.map((workout) =>
          workout.id === id ? { ...workout, ...updatedWorkout } : workout
        )
      );
      toast.success("Workout updated successfully!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading workouts...</p>
      </div>
    );
  }

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