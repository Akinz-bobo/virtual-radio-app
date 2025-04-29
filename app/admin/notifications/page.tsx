import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import NotificationsTable from "@/components/admin/notifications/notifications-table";

export const metadata = {
  title: "Notifications - WaveStream Admin",
};

export default function NotificationsPage() {
  // Mock notifications data
  const notifications = [
    {
      id: "1",
      title: "New Podcast Episode",
      message: "A new episode of 'Tech Talks Weekly' has been published.",
      type: "info",
      read: true,
      user: null, // Sent to all users
      creator: {
        name: "Admin",
        email: "admin@example.com",
      },
      createdAt: new Date("2023-09-25T10:30:00").toISOString(),
    },
    {
      id: "2",
      title: "Account Update Required",
      message: "Please update your profile information.",
      type: "warning",
      read: false,
      user: {
        name: "Jane Smith",
        email: "jane.smith@example.com",
      },
      creator: {
        name: "System",
        email: "system@example.com",
      },
      createdAt: new Date("2023-09-26T14:15:00").toISOString(),
    },
    {
      id: "3",
      title: "Upcoming Event",
      message: "Don't forget about the live podcast recording this weekend!",
      type: "info",
      read: false,
      user: null, // Sent to all users
      creator: {
        name: "Admin",
        email: "admin@example.com",
      },
      createdAt: new Date("2023-09-27T09:45:00").toISOString(),
    },
    {
      id: "4",
      title: "Payment Failed",
      message:
        "Your subscription payment has failed. Please update your payment method.",
      type: "error",
      read: true,
      user: {
        name: "Robert Johnson",
        email: "robert.johnson@example.com",
      },
      creator: {
        name: "System",
        email: "system@example.com",
      },
      createdAt: new Date("2023-09-28T16:20:00").toISOString(),
    },
    {
      id: "5",
      title: "Subscription Renewed",
      message: "Your premium subscription has been successfully renewed.",
      type: "success",
      read: false,
      user: {
        name: "Emily Davis",
        email: "emily.davis@example.com",
      },
      creator: {
        name: "System",
        email: "system@example.com",
      },
      createdAt: new Date("2023-09-29T11:10:00").toISOString(),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <Button asChild>
          <a href="/admin/notifications/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Notification
          </a>
        </Button>
      </div>

      <NotificationsTable notifications={notifications} />
    </div>
  );
}
