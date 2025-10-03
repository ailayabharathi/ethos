"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkoutTypeSection } from "@/components/workout/WorkoutTypeSection";

const WorkoutLog = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Workout Log</h1>
      <p className="text-muted-foreground">Log your exercises and track your fitness progress.</p>

      <Tabs defaultValue="home" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="home">Home Workouts</TabsTrigger>
          <TabsTrigger value="gym">Gym Workouts</TabsTrigger>
        </TabsList>
        <TabsContent value="home">
          <WorkoutTypeSection type="home" />
        </TabsContent>
        <TabsContent value="gym">
          <WorkoutTypeSection type="gym" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkoutLog;