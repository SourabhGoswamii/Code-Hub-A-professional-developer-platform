"use client";

import DashboardSidebar from "./DashboardSidebar";
import { RiSearchLine, RiBellLine, RiMenuLine } from "react-icons/ri";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      
      {/* Main Content */}
      <div className={`${sidebarOpen ? 'ml-64' : 'ml-0'} transition-all duration-300`}>
        {/* Top Navigation */}
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
          <div className="flex h-16 items-center gap-4 px-6">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <RiMenuLine className="h-5 w-5" />
            </Button>
            
            <div className="flex-1 md:flex-none">
              <form className="relative">
                <RiSearchLine className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full md:w-[300px] pl-9 bg-secondary"
                />
              </form>
            </div>
            
            <div className="ml-auto flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
              >
                <RiBellLine className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
              >
                <img
                  src="https://github.com/shadcn.png"
                  alt="Avatar"
                  className="rounded-full"
                  width={32}
                  height={32}
                />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}