"use client";

import React from "react";
import { Header } from "./Header";
import { MadeWithDyad } from "@/components/made-with-dyad";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-1 p-6 overflow-y-auto pb-16">
        {children}
        <MadeWithDyad />
      </main>
      <Header />
    </div>
  );
}