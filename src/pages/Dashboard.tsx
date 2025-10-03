"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, DollarSign, Dumbbell, BookOpen } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/components/auth/SessionContextProvider';
import { format } from "date-fns";

const Dashboard = () => {
  const { session } = useSession();
  const userId = session?.user?.id;

  const [userName, setUserName] = useState<string>(""); // New state for user's first name
  const [loadingProfile, setLoadingProfile] = useState(true); // New loading state for profile

  const [completedTasksCount, setCompletedTasksCount] = useState(0);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [todaySpending, setTodaySpending] = useState(0);
  const [loadingSpending, setLoadingSpending] = useState(true);
  const [loggedWorkoutsCount, setLoggedWorkoutsCount] = useState(0);
  const [loadingWorkouts, setLoadingWorkouts] = useState(true);

  // Effect to fetch user's first name
  useEffect(() => {
    const fetchUserName = async () => {
      if (!userId) {
        setUserName("");
        setLoadingProfile(false);
        return;
      }
      setLoadingProfile(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
        console.error("Error fetching user profile:", error.message);
        setUserName("");
      } else if (data) {
        setUserName(data.first_name || "");
      }
      setLoadingProfile(false);
    };

    fetchUserName();
  }, [userId]);

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

  useEffect(() => {
    const fetchTodaySpending = async () => {
      if (!userId) {
        setTodaySpending(0);
        setLoadingSpending(false);
        return;
      }
      setLoadingSpending(true);
      const today = format(new Date(), "yyyy-MM-dd");
      const { data, error } = await supabase
        .from('expenses')
        .select('amount')
        .eq('user_id', userId)
        .eq('date', today);

      if (error) {
        console.error("Error fetching today's spending:", error.message);
        setTodaySpending(0);
      } else {
        const total = data?.reduce((sum, expense) => sum + parseFloat(expense.amount as any), 0) || 0;
        setTodaySpending(total);
      }
      setLoadingSpending(false);
    };

    fetchTodaySpending();
  }, [userId]);

  useEffect(() => {
    const fetchLoggedWorkouts = async () => {
      if (!userId) {
        setLoggedWorkoutsCount(0);
        setLoadingWorkouts(false);
        return;
      }
      setLoadingWorkouts(true);
      const { count, error } = await supabase
        .from('workouts')
        .select('*', { count: 'exact' })
        .eq('user_id', userId);

      if (error) {
        console.error("Error fetching logged workouts:", error.message);
        setLoggedWorkoutsCount(0);
      } else {
        setLoggedWorkoutsCount(count || 0);
      }
      setLoadingWorkouts(false);
    };

    fetchLoggedWorkouts();
  }, [userId]);

  const greeting = userName ? `Welcome, ${userName}!` : "Dashboard";

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{loadingProfile ? "Loading..." : greeting}</h1>
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
            <div className="text-2xl font-bold">
              {loadingSpending ? "..." : `$${todaySpending.toFixed(2)}`}
            </div>
            <p className="text-xs text-muted-foreground">
              {loadingSpending ? "Loading..." : (todaySpending === 0 ? "No spending recorded" : "From your spending tracker")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workout Log</CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loadingWorkouts ? "..." : `${loggedWorkoutsCount} exercises logged`}
            </div>
            <p className="text-xs text-muted-foreground">
              {loadingWorkouts ? "Loading..." : (loggedWorkoutsCount === 0 ? "No exercises logged yet" : "From your workout tracker")}
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