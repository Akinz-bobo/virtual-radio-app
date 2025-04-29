"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type Activity = {
  id: string;
  user: {
    name: string;
    image?: string;
  };
  action: string;
  target: string;
  timestamp: string;
};

// Mock data for recent activities
const mockActivities: Activity[] = [
  {
    id: "1",
    user: { name: "John Doe", image: "/placeholder.svg?height=32&width=32" },
    action: "uploaded",
    target: "Tech Talk Episode 45",
    timestamp: "2023-04-23T10:23:42Z",
  },
  {
    id: "2",
    user: {
      name: "Sarah Johnson",
      image: "/placeholder.svg?height=32&width=32",
    },
    action: "published",
    target: "Morning Vibes Show",
    timestamp: "2023-04-23T09:15:22Z",
  },
  {
    id: "3",
    user: { name: "Mike Wilson", image: "/placeholder.svg?height=32&width=32" },
    action: "edited",
    target: "Science Fiction Audiobook",
    timestamp: "2023-04-23T08:47:11Z",
  },
  {
    id: "4",
    user: { name: "Emily Chen", image: "/placeholder.svg?height=32&width=32" },
    action: "created",
    target: "New Event: Summer Music Festival",
    timestamp: "2023-04-22T16:32:08Z",
  },
  {
    id: "5",
    user: { name: "Admin", image: "/placeholder.svg?height=32&width=32" },
    action: "updated",
    target: "system settings",
    timestamp: "2023-04-22T14:05:32Z",
  },
];

export default function RecentActivityList() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    // In a real app, fetch from API
    // For now, use mock data
    setActivities(mockActivities);
  }, []);

  // Format timestamp to relative time (e.g., "2 hours ago")
  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
    }
    if (diffHours > 0) {
      return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
    }
    if (diffMins > 0) {
      return diffMins === 1 ? "1 minute ago" : `${diffMins} minutes ago`;
    }
    return "just now";
  };

  // Get action color based on action type
  const getActionColor = (action: string) => {
    switch (action) {
      case "created":
        return "text-green-600 dark:text-green-400";
      case "uploaded":
        return "text-studio-600 dark:text-studio-400";
      case "published":
        return "text-blue-600 dark:text-blue-400";
      case "edited":
        return "text-amber-600 dark:text-amber-400";
      case "updated":
        return "text-purple-600 dark:text-purple-400";
      case "deleted":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-slate-600 dark:text-slate-400";
    }
  };

  return (
    <div className="space-y-6">
      {activities.length === 0 ? (
        <div className="text-center py-8 text-studio-500 dark:text-studio-400">
          No recent activity
        </div>
      ) : (
        <ul className="space-y-4">
          {activities.map((activity) => (
            <li
              key={activity.id}
              className="flex items-start gap-4 p-4 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700"
            >
              <Avatar className="h-10 w-10 border border-studio-100 dark:border-studio-800">
                <AvatarImage
                  src={activity.user.image || "/placeholder.svg"}
                  alt={activity.user.name}
                />
                <AvatarFallback className="bg-studio-100 text-studio-700 dark:bg-studio-900 dark:text-studio-300">
                  {activity.user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-studio-800 dark:text-studio-200">
                  <span className="font-medium">{activity.user.name}</span>{" "}
                  <span
                    className={cn(
                      "font-medium",
                      getActionColor(activity.action)
                    )}
                  >
                    {activity.action}
                  </span>{" "}
                  <span className="font-medium">{activity.target}</span>
                </p>
                <p className="text-xs text-studio-500 dark:text-studio-400 mt-1">
                  {formatRelativeTime(activity.timestamp)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
