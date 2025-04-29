import NotificationForm from "@/components/admin/notifications/notification-form";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Send Notification - WaveStream Admin",
};

export default async function NewNotificationPage() {
  // Fetch users for the recipient dropdown
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-3xl font-bold">Send Notification</h1>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <NotificationForm users={users} />
      </div>
    </div>
  );
}
