import BroadcastForm from "@/components/admin/broadcasts/broadcast-form";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Edit Broadcast - WaveStream Admin",
};

export default async function EditBroadcastPage({ params }) {
  const { id } = params;

  // In a real app, fetch the broadcast from the database
  // For now, we'll use mock data
  const broadcasts = [
    {
      id: "1",
      title: "Morning Show",
      host: "Alex Rivera",
      description:
        "Start your day with the latest news, music, and engaging conversations.",
      schedule: "Weekdays, 7AM - 10AM",
      status: "live",
      startTime: "2023-10-16T07:00:00Z",
      endTime: "2023-10-16T10:00:00Z",
    },
    {
      id: "2",
      title: "Afternoon Acoustics",
      host: "Mia Chen",
      description: "Relaxing acoustic music to get you through the afternoon.",
      schedule: "Weekdays, 2PM - 4PM",
      status: "upcoming",
      startTime: "2023-10-16T14:00:00Z",
      endTime: "2023-10-16T16:00:00Z",
    },
  ];

  const broadcast = broadcasts.find((b) => b.id === id);

  if (!broadcast) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-3xl font-bold">Edit Broadcast</h1>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <BroadcastForm broadcast={broadcast} />
      </div>
    </div>
  );
}
