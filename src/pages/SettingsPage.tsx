"use client";

import React, { useState, useEffect, useCallback } from "react";
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
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/components/auth/SessionContextProvider';
import { dataURLtoFile } from '@/lib/imageUtils'; // Import the new utility

interface UserAccountSettings {
  first_name: string; // Changed to match Supabase column
  last_name: string;  // Changed to match Supabase column
  age: number | '';
  height: number | ''; // Assuming cm
  weight: number | ''; // Assuming kg
  birthDate: string | undefined; // Stored as YYYY-MM-DD string
  avatar_url: string | undefined; // Changed to match Supabase column, stored as Supabase Storage URL
}

// Keep local storage for non-Supabase managed settings like age, height, weight, birthDate
const LOCAL_STORAGE_ACCOUNT_SETTINGS_KEY = "userAccountSettingsLocal";

const SettingsPage = () => {
  const { theme, setTheme } = useTheme(); // Keep useTheme for potential future theme-related settings or context
  const navigate = useNavigate();
  const { session } = useSession();
  const userId = session?.user?.id;

  const [accountSettings, setAccountSettings] = useState<UserAccountSettings>(() =>
    loadState(LOCAL_STORAGE_ACCOUNT_SETTINGS_KEY, {
      first_name: "",
      last_name: "",
      age: "",
      height: "",
      weight: "",
      birthDate: undefined,
      avatar_url: undefined,
    })
  );
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Effect for local storage (for non-Supabase fields)
  useEffect(() => {
    saveState(LOCAL_STORAGE_ACCOUNT_SETTINGS_KEY, {
      age: accountSettings.age,
      height: accountSettings.height,
      weight: accountSettings.weight,
      birthDate: accountSettings.birthDate,
    });
  }, [accountSettings.age, accountSettings.height, accountSettings.weight, accountSettings.birthDate]);

  // Effect to load profile from Supabase
  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        setLoadingProfile(false);
        return;
      }
      setLoadingProfile(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar_url')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
        toast.error("Failed to load profile: " + error.message);
      } else if (data) {
        setAccountSettings((prev) => ({
          ...prev,
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          avatar_url: data.avatar_url || undefined,
        }));
      }
      setLoadingProfile(false);
    };

    fetchProfile();
  }, [userId]);

  // Removed handleDarkModeToggle as it's now in Header

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setAccountSettings((prevSettings) => ({
      ...prevSettings,
      [id]: id === "age" || id === "height" || id === "weight" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const handleSupabaseInputChange = (id: 'first_name' | 'last_name', value: string) => {
    setAccountSettings((prevSettings) => ({
      ...prevSettings,
      [id]: value,
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

  const handleCropComplete = useCallback(async (croppedImage: string) => {
    if (!userId) {
      toast.error("User not authenticated.");
      return;
    }

    try {
      const file = dataURLtoFile(croppedImage, `avatar_${userId}.jpeg`);
      const filePath = `${userId}/avatar.jpeg`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true, // Overwrite existing avatar
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      if (!publicUrlData?.publicUrl) {
        throw new Error("Failed to get public URL for avatar.");
      }

      const { error: updateProfileError } = await supabase
        .from('profiles')
        .upsert({ id: userId, avatar_url: publicUrlData.publicUrl });

      if (updateProfileError) {
        throw updateProfileError;
      }

      setAccountSettings((prevSettings) => ({
        ...prevSettings,
        avatar_url: publicUrlData.publicUrl,
      }));
      toast.success("Profile picture updated!");
    } catch (e: any) {
      toast.error("Failed to update profile picture: " + e.message);
      console.error("Avatar upload/update error:", e);
    } finally {
      setIsCropperOpen(false);
      setImageToCrop(null);
    }
  }, [userId]);

  const handleSaveAccountSettings = async () => {
    if (!userId) {
      toast.error("User not authenticated.");
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          first_name: accountSettings.first_name,
          last_name: accountSettings.last_name,
        });

      if (error) {
        throw error;
      }
      toast.success("Account settings saved successfully!");
    } catch (e: any) {
      toast.error("Failed to save account settings: " + e.message);
      console.error("Save account settings error:", e);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to log out: " + error.message);
    } else {
      toast.success("Logged out successfully!");
      navigate('/login');
    }
  };

  if (loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading profile settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-quantum">Settings</h1> {/* Applied font-quantum */}
      <p className="text-muted-foreground">Manage your application preferences.</p>

      <Card>
        <CardHeader>
          <CardTitle className="font-naruto">General Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Removed dark mode toggle from here */}
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
          <CardTitle className="font-naruto">Account Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center space-y-4 mb-6">
            <Label htmlFor="profile-picture" className="text-lg font-medium">Profile Picture</Label>
            <Avatar className="h-24 w-24">
              <AvatarImage src={accountSettings.avatar_url} alt="Profile Picture" />
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
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                value={accountSettings.first_name}
                onChange={(e) => handleSupabaseInputChange('first_name', e.target.value)}
                placeholder="John"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                value={accountSettings.last_name}
                onChange={(e) => handleSupabaseInputChange('last_name', e.target.value)}
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