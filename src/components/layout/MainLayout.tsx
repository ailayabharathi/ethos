"use client";

import React, { useState } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { SidebarNav } from "./SidebarNav";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      <ResizablePanelGroup direction="horizontal" className="min-h-screen w-full">
        <ResizablePanel
          defaultSize={18}
          collapsedSize={4}
          minSize={15}
          maxSize={25}
          collapsible={true}
          onCollapse={() => setIsSidebarCollapsed(true)}
          onExpand={() => setIsSidebarCollapsed(false)}
          className={cn(
            "transition-all duration-300 ease-in-out",
            isSidebarCollapsed && "min-w-[50px] max-w-[50px]" // Fix width when collapsed
          )}
        >
          <div className="flex h-full flex-col border-r bg-sidebar">
            <div className="p-4 border-b flex items-center justify-between">
              {!isSidebarCollapsed && (
                <h2 className="text-xl font-semibold text-sidebar-primary-foreground whitespace-nowrap overflow-hidden">
                  Productivity App
                </h2>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className={cn(
                  "h-8 w-8",
                  isSidebarCollapsed ? "mx-auto" : "ml-auto"
                )}
              >
                {isSidebarCollapsed ? (
                  <ChevronRight className="h-4 w-4 text-sidebar-foreground" />
                ) : (
                  <ChevronLeft className="h-4 w-4 text-sidebar-foreground" />
                )}
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <SidebarNav isCollapsed={isSidebarCollapsed} />
            </div>
            {!isSidebarCollapsed && <MadeWithDyad />}
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={82}>
          <div className="flex flex-col h-full overflow-y-auto">
            <main className="flex-1 p-6">
              {children}
            </main>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}