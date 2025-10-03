"use client";

import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Clock, DollarSign, Dumbbell, BookOpen, LayoutDashboard, Settings } from "lucide-react"; // Import Settings icon

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Time Schedule",
    href: "/time-schedule",
    icon: Clock,
  },
  {
    title: "Spending Tracker",
    href: "/spending-tracker",
    icon: DollarSign,
  },
  {
    title: "Workout Log",
    href: "/workout-log",
    icon: Dumbbell,
  },
  {
    title: "Self-Learning",
    href: "/self-learning",
    icon: BookOpen,
  },
  {
    title: "Settings", // New Settings item
    href: "/settings",
    icon: Settings, // Use the Settings icon
  },
];

interface SidebarNavProps {
  isCollapsed: boolean;
}

export function SidebarNav({ isCollapsed }: SidebarNavProps) {
  const location = useLocation();

  return (
    <nav className="flex flex-col space-y-1 p-4">
      {navItems.map((item) => (
        <Button
          key={item.href}
          asChild
          variant={location.pathname === item.href ? "secondary" : "ghost"}
          className={cn(
            "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            location.pathname === item.href && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 hover:text-sidebar-primary-foreground",
            isCollapsed ? "justify-center" : "justify-start"
          )}
        >
          <Link to={item.href} className="flex items-center">
            <item.icon className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
            {!isCollapsed && <span className="whitespace-nowrap">{item.title}</span>}
          </Link>
        </Button>
      ))}
    </nav>
  );
}