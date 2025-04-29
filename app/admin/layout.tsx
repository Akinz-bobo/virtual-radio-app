"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { NotificationsProvider } from "@/contexts/notifications-context";
import AdminSidebar from "@/components/admin/admin-sidebar";
import AdminHeader from "@/components/admin/admin-header";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  // Handle sidebar state on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Set initial state
    handleResize();

    // Mark as mounted to avoid hydration issues
    setIsMounted(true);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Extract the current section from the pathname
  const section = pathname.split("/")[2] || "dashboard";

  // Map section to title
  const sectionTitles: Record<string, string> = {
    dashboard: "Dashboard",
    broadcasts: "Broadcast Management",
    podcasts: "Podcast Management",
    audiobooks: "Audiobook Management",
    events: "Event Management",
    programs: "Program Management",
    users: "User Management",
    notifications: "Notifications",
    settings: "Settings",
  };

  const title = sectionTitles[section] || "Admin Dashboard";

  if (!isMounted) {
    return null; // Prevent hydration issues
  }

  return (
    <NotificationsProvider>
      <div className="flex  bg-slate-50 dark:bg-card">
        <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

        <div
          className={cn(
            "flex flex-col flex-1 transition-all duration-300 ease-in-out",
            sidebarOpen ? "md:ml-64" : "md:ml-20"
          )}
        >
          <AdminHeader
            title={title}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />

          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
      <Toaster />
    </NotificationsProvider>
  );
}
