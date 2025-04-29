"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { useNotifications } from "@/contexts/notifications-context";
import { Menu, Bell, Search, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface AdminHeaderProps {
  title: string;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function AdminHeader({
  title,
  sidebarOpen,
  setSidebarOpen,
}: AdminHeaderProps) {
  const { user, logout } = useAuth();
  const { notifications, markAsRead } = useNotifications();
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll position for header styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Mock user data if not available
  const mockUser = {
    name: "Admin User",
    email: "admin@example.com",
    profilePicture: null,
  };

  const activeUser = user || mockUser;

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-16 items-center bg-studio-50 dark:bg-card border-b border-slate-200 dark:border-muted px-4 md:px-6 transition-all duration-200",
        scrolled && "shadow-sm"
      )}
    >
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-semibold text-slate-900 dark:text-white"
        >
          {title}
        </motion.h1>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <AnimatePresence>
          {searchOpen ? (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "100%" }}
              exit={{ opacity: 0, width: 0 }}
              className="relative w-full max-w-sm"
            >
              <Input
                type="search"
                placeholder="Search..."
                className="pr-8 border-slate-300 dark:border-slate-600 focus:border-purple-500 focus:ring-purple-500"
                autoFocus
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0"
                onClick={() => setSearchOpen(false)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close search</span>
              </Button>
            </motion.div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          )}
        </AnimatePresence>

        <ThemeToggle />

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {unreadCount}
                </Badge>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle className="text-xl font-semibold">
                Notifications
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-4">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Bell className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
                  <p className="text-slate-500 dark:text-slate-400">
                    No notifications yet
                  </p>
                  <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                    When you receive notifications, they'll appear here
                  </p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "flex items-start gap-4 rounded-lg border p-4 transition-colors",
                      notification.read
                        ? "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                        : "border-purple-200 dark:border-purple-900/50 bg-purple-50 dark:bg-purple-900/20"
                    )}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div
                      className={cn(
                        "h-2 w-2 mt-2 rounded-full flex-shrink-0",
                        notification.read
                          ? "bg-slate-300 dark:bg-slate-600"
                          : "bg-purple-500"
                      )}
                    />
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {notification.title}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
              {notifications.length > 0 && (
                <div className="flex justify-center pt-4">
                  <Link href="/admin/notifications">
                    <Button variant="outline" size="sm">
                      View All Notifications
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 rounded-full"
            >
              <Avatar className="h-8 w-8">
                {activeUser?.profilePicture ? (
                  <AvatarImage
                    src={activeUser.profilePicture || "/placeholder.svg"}
                    alt={activeUser.name || "User"}
                  />
                ) : (
                  <AvatarFallback className="bg-purple-100 text-brand-700 dark:bg-brand-600 dark:text-purple-200">
                    {activeUser?.name?.[0] || "A"}
                  </AvatarFallback>
                )}
              </Avatar>
              <span className="hidden md:inline-block text-sm font-medium text-slate-700 dark:text-slate-200">
                {activeUser?.name}
              </span>
              <ChevronDown className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{activeUser?.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {activeUser?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin/settings" className="cursor-pointer">
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/profile" className="cursor-pointer">
                My Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => logout()}
              className="text-red-600 dark:text-red-400 cursor-pointer"
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
