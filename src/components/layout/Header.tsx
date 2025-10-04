"use client";

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Clock, DollarSign, Dumbbell, BookOpen, LayoutDashboard, Settings, Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Time Schedule", href: "/time-schedule", icon: Clock },
  { title: "Spending Tracker", href: "/spending-tracker", icon: DollarSign },
  { title: "Workout Log", href: "/workout-log", icon: Dumbbell },
  { title: "Self-Learning", href: "/self-learning", icon: BookOpen },
  { title: "Settings", href: "/settings", icon: Settings },
];

export function Header() {
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  const handleDarkModeToggle = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  return (
    <header className="fixed bottom-0 z-40 w-full border-t bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-semibold text-indigo-400 whitespace-nowrap">Ethos</span>
        </Link>
        <nav className="flex items-center space-x-4 lg:space-x-6 overflow-x-auto pb-2 sm:pb-0">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center text-sm font-medium transition-colors hover:text-primary",
                location.pathname === item.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className="h-4 w-4 mr-1" />
              <span className="whitespace-nowrap">{item.title}</span>
            </Link>
          ))}
        </nav>
        <div className="flex items-center space-x-2 ml-4">
          {theme === "dark" ? <Moon className="h-4 w-4 text-muted-foreground" /> : <Sun className="h-4 w-4 text-muted-foreground" />}
          <Switch
            id="dark-mode-toggle"
            checked={theme === "dark"}
            onCheckedChange={handleDarkModeToggle}
            aria-label="Toggle dark mode"
          />
        </div>
      </div>
    </header>
  );
}