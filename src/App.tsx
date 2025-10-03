"use client";

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import Dashboard from "@/pages/Dashboard";
import TimeSchedule from "@/pages/TimeSchedule";
import SpendingTracker from "@/pages/SpendingTracker";
import WorkoutLog from "@/pages/WorkoutLog";
import SelfLearningTopics from "@/pages/SelfLearningTopics";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login"; // Import the new Login page
import { useSession } from "@/components/auth/SessionContextProvider"; // Import useSession

// ProtectedRoute component to guard routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session } = useSession();
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/time-schedule" element={<TimeSchedule />} />
                  <Route path="/spending-tracker" element={<SpendingTracker />} />
                  <Route path="/workout-log" element={<WorkoutLog />} />
                  <Route path="/self-learning" element={<SelfLearningTopics />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;