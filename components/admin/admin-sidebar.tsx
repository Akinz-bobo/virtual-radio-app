"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Radio,
  Headphones,
  BookOpen,
  Calendar,
  Tv,
  Users,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AdminSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function AdminSidebar({ open, setOpen }: AdminSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/broadcasts", label: "Broadcasts", icon: Radio },
    { href: "/admin/podcasts", label: "Podcasts", icon: Headphones },
    { href: "/admin/audiobooks", label: "Audiobooks", icon: BookOpen },
    { href: "/admin/events", label: "Events", icon: Calendar },
    { href: "/admin/programs", label: "Programs", icon: Tv },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/notifications", label: "Notifications", icon: Bell },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col bg-studio-50 dark:bg-card border-r border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-300 ease-in-out",
        open ? "w-64" : "w-20"
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 dark:border-slate-700">
        <Link href="/admin" className="flex items-center">
          {open ? (
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-brand-600 flex items-center justify-center">
                <span className="font-serif text-white text-sm font-bold">
                  CB
                </span>
              </div>
              <span className="ml-2 font-semibold text-slate-900 dark:text-white">
                Cinema Book
              </span>
            </div>
          ) : (
            <div className="h-8 w-8 rounded-full bg-brand-600 flex items-center justify-center">
              <span className="font-serif text-white text-sm font-bold">
                CB
              </span>
            </div>
          )}
        </Link>
        <button
          onClick={() => setOpen(!open)}
          className="p-1 rounded-md text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          {open ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-6">
        <div className="px-3 mb-6">
          <h3
            className={cn(
              "text-xs font-medium text-slate-500 dark:text-slate-400 mb-2",
              !open && "sr-only"
            )}
          >
            Main
          </h3>
          <TooltipProvider>
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);

                return (
                  <li key={item.href}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center px-3 py-2 rounded-md transition-colors",
                            isActive
                              ? " text-brand-700 bg-white dark:bg-muted dark:text-white"
                              : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60",
                            !open && "justify-center"
                          )}
                        >
                          <item.icon
                            className={cn("h-5 w-5", open ? "mr-3" : "")}
                          />
                          {open && <span>{item.label}</span>}
                        </Link>
                      </TooltipTrigger>
                      {!open && (
                        <TooltipContent side="right">
                          {item.label}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </li>
                );
              })}
            </ul>
          </TooltipProvider>
        </div>
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/"
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60 transition-colors",
                  !open && "justify-center"
                )}
              >
                <LogOut className={cn("h-5 w-5", open ? "mr-3" : "")} />
                {open && <span>Back to Website</span>}
              </Link>
            </TooltipTrigger>
            {!open && (
              <TooltipContent side="right">Back to Website</TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </motion.div>
  );
}
