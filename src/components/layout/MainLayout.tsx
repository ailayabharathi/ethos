"use client";

import React from "react";
import { Header } from "./Header"; // Import the new Header component
import { MadeWithDyad } from "@/components/made-with-dyad";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header /> {/* Render the new Header */}
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
      <MadeWithDyad /> {/* Moved to the bottom of the main content area */}
    </div>
  );
}