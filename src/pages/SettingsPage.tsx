"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input"; // Import Input
import { Button } from "@/components/ui/button"; // Import Button
import { useTheme } from "next-themes";
import { loadState, saveState } from "@/lib/localStorage"; // Import loadState and saveState
import { toast } from "sonner"; // Import toast

interface UserAccountSettings {
  firstName: string;
  lastName: string;
  age: number | '';
  height: number | ''; // Assuming cm
  weight: number | ''; // Assuming kg
}

const LOCAL_STORAGE_ACCOUNT_SETTINGS_KEY = "userAccountSettings";

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const [accountSettings, setAccountSettings] = useState<UserAccountSettings>(() =>
    loadState(LOCAL_STORAGE_ACCOUNT_SETTINGS_KEY, {
      firstName: "",
      lastName: "",
      age: "",
      height: "",
      weight: "",
    })
  );

  useEffect(() => {
    saveState(LOCAL_STORAGE_ACCOUNT_SETTINGS_KEY, accountSettings);
  }, [accountSettings]);

  const handleDarkModeToggle = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setAccountSettings((prevSettings) => ({
      ...prevSettings,
      [id]: id === "age" || id === "height" || id === "weight" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const handleSaveAccountSettings = () => {
    saveState(LOCAL_STORAGE_ACCOUNT_SETTINGS_KEY, accountSettings);
    toast.success("Account settings saved successfully!");
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
              checked={theme === "dark"}
              onCheckedChange={handleDarkModeToggle}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications">Enable Notifications</Label>
            <Switch id="notifications" disabled />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={accountSettings.firstName}
                onChange={handleInputChange}
                placeholder="John"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={accountSettings.lastName}
                onChange={handleInputChange}
                placeholder="Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={accountSettings.age}
                onChange={handleInputChange}
                placeholder="30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                value={accountSettings.height}
                onChange={handleInputChange}
                placeholder="175"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={accountSettings.weight}
                onChange={handleInputChange}
                placeholder="70"
              />
            </div>
          </div>
          <Button onClick={handleSaveAccountSettings} className="w-full md:w-auto mt-4">
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;