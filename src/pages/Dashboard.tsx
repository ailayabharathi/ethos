"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, DollarSign, Dumbbell, BookOpen } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/components/auth/SessionContextProvider';

const Dashboard = () => {
  const { session } = useSession();
  const userId = session?.user?.id;

  const [completedTasksCount, setCompletedTasksCount] = useState(0);
  const [loadingTasks, setLoadingTasks] = useState(true);

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      if (!userId) {
        setCompletedTasksCount(0);
        setLoadingTasks(false);
        return;
      }
      setLoadingTasks(true);
      const { count, error } = await supabase
        .from('tasks')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .eq('completed', true);

      if (error) {
        console.error("Error fetching completed tasks:", error.message);
        setCompletedTasksCount(0);
      } else {
        setCompletedTasksCount(count || 0);
      }
      setLoadingTasks(false);
    };

    fetchCompletedTasks();
  }, [userId]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">A quick overview of your daily progress.</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Schedule
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loadingTasks ? "..." : `${completedTasksCount} tasks completed`}
            </div>
            <p className="text-xs text-muted-foreground">
              {loadingTasks ? "Loading..." : "From your personal schedule"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Spending Today
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0.00</div>
            <p className="text-xs text-muted-foreground">
              No spending recorded
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workout Log</CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0 workouts logged</div>
            <p className="text-xs text-muted-foreground">
              No exercises completed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Self-Learning</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0 topics completed</div>
            <p className="text-xs text-muted-foreground">
              No topics started
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Completed Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No activities completed yet.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;