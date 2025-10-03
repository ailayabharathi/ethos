"use client";

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import Dashboard from "@/pages/Dashboard";
import TimeSchedule from "@/pages/TimeSchedule";
import SpendingTracker from "@/pages/SpendingTracker";
import WorkoutLog from "@/pages/WorkoutLog";
import SelfLearningTopics from "@/pages/SelfLearningTopics";
import SettingsPage from "@/pages/SettingsPage"; // Import the new SettingsPage
import NotFound from "@/pages/NotFound";

const App = () => {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/time-schedule" element={<TimeSchedule />} />
          <Route path="/spending-tracker" element={<SpendingTracker />} />
          <Route path="/workout-log" element={<WorkoutLog />} />
          <Route path="/self-learning" element={<SelfLearningTopics />} />
          <Route path="/settings" element={<SettingsPage />} /> {/* New Settings Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default App;