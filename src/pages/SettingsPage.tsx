"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { loadState, saveState } from "@/lib/localStorage";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProfilePictureCropper } from "@/components/settings/ProfilePictureCropper";
import { supabase } from '@/integrations/supabase/client'; // Import supabase client
import { useNavigate } from 'react-router-dom'; // Import useNavigate

interface UserAccountSettings {
  firstName: string;
  lastName: string;
  age: number | '';
  height: number | ''; // Assuming cm
  weight: number | ''; // Assuming kg
  birthDate: string | undefined; // Stored as YYYY-MM-DD string
  avatarUrl: string | undefined; // Stored as data URL string
}

const LOCAL_STORAGE_ACCOUNT_SETTINGS_KEY = "userAccountSettings";

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate(); // Initialize useNavigate
  const [accountSettings, setAccountSettings] = useState<UserAccountSettings>(() =>
    loadState(LOCAL_STORAGE_ACCOUNT_SETTINGS_KEY, {
      firstName: "",
      lastName: "",
      age: "",
      height: "",
      weight: "",
      birthDate: undefined,
      avatarUrl: undefined,
    })
  );
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);

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

  const handleBirthDateSelect = (date: Date | undefined) => {
    setAccountSettings((prevSettings) => ({
      ...prevSettings,
      birthDate: date ? format(date, "yyyy-MM-dd") : undefined,
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageToCrop(reader.result as string);
        setIsCropperOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImage: string) => {
    setAccountSettings((prevSettings) => ({
      ...prevSettings,
      avatarUrl: croppedImage,
    }));
    toast.success("Profile picture updated!");
    setIsCropperOpen(false);
    setImageToCrop(null);
  };

  const handleSaveAccountSettings = () => {
    saveState(LOCAL_STORAGE_ACCOUNT_SETTINGS_KEY, accountSettings);
    toast.success("Account settings saved successfully!");
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to log out: " + error.message);
    } else {
      toast.success("Logged out successfully!");
      navigate('/login'); // Redirect to login page
    }
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
          <Button onClick={handleLogout} variant="destructive" className="w-full">
            Log Out
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center space-y-4 mb-6">
            <Label htmlFor="profile-picture" className="text-lg font-medium">Profile Picture</Label>
            <Avatar className="h-24 w-24">
              <AvatarImage src={accountSettings.avatarUrl} alt="Profile Picture" />
              <AvatarFallback>
                <User className="h-12 w-12 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <Input
              id="profile-picture"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="w-full max-w-xs"
            />
          </div>

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
            <div className="space-y-2">
              <Label htmlFor="birthDate">Birth Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="birthDate"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !accountSettings.birthDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {accountSettings.birthDate ? format(new Date(accountSettings.birthDate), "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={accountSettings.birthDate ? new Date(accountSettings.birthDate) : undefined}
                    onSelect={handleBirthDateSelect}
                    initialFocus
                    captionLayout="dropdown"
                    fromYear={1900}
                    toYear={new Date().getFullYear()}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <Button onClick={handleSaveAccountSettings} className="w-full md:w-auto mt-4">
            Save Changes
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isCropperOpen} onOpenChange={setIsCropperOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Crop Profile Picture</DialogTitle>
          </DialogHeader>
          {imageToCrop && (
            <ProfilePictureCropper
              imageSrc={imageToCrop}
              onCropComplete={handleCropComplete}
              onClose={() => setIsCropperOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsPage;