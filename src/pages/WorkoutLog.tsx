"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkoutTypeSection } from "@/components/workout/WorkoutTypeSection";

const WorkoutLog = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-ramen">Workout Log</h1>
      <p className="text-muted-foreground">Log your exercises and track your fitness progress.</p>

      <Tabs defaultValue="home" className="w-full">
        <TabsList className="grid w-full grid-cols-2"> {/* Changed to grid-cols-2 for two tabs */}
          <TabsTrigger value="home">Home Workouts</TabsTrigger>
          <TabsTrigger value="gym">Gym Workouts</TabsTrigger> {/* Added TabsTrigger for Gym Workouts */}
        </TabsList>
        <TabsContent value="home">
          <WorkoutTypeSection type="home" />
        </TabsContent>
        <TabsContent value="gym"> {/* Added TabsContent for Gym Workouts */}
          <WorkoutTypeSection type="gym" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkoutLog;