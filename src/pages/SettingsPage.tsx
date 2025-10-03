"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes"; // Import useTheme

const SettingsPage = () => {
  const { theme, setTheme } = useTheme(); // Use the useTheme hook

  const handleDarkModeToggle = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      <p className="text-muted-foreground">Manage your application preferences.</p>

      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="dark-mode">Enable Dark Mode</Label>
            <Switch
              id="dark-mode"
              checked={theme === "dark"} // Set checked based on current theme
              onCheckedChange={handleDarkModeToggle} // Handle theme change
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications">Enable Notifications</Label>
            <Switch id="notifications" disabled /> {/* Placeholder for future functionality */}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Account management features will go here.</p>
          {/* Placeholder for future account settings */}
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;