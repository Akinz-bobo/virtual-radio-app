import { notFound } from "next/navigation";
import BroadcastStudio from "@/components/admin/broadcasts/broadcast-studio";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Broadcast Studio - WaveStream Admin",
};

export default async function BroadcastStudioPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

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
    {
      id: "3",
      title: "Evening Discussions",
      host: "Jordan Taylor",
      description:
        "In-depth conversations about current events and social issues.",
      schedule: "Mon, Wed, Fri, 7PM - 9PM",
      status: "upcoming",
      startTime: "2023-10-16T19:00:00Z",
      endTime: "2023-10-16T21:00:00Z",
    },
    {
      id: "4",
      title: "Weekend Brunch",
      host: "Chris & Pat",
      description:
        "Casual conversations and music to accompany your weekend brunch.",
      schedule: "Weekends, 10AM - 12PM",
      status: "scheduled",
      startTime: "2023-10-21T10:00:00Z",
      endTime: "2023-10-21T12:00:00Z",
    },
  ];

  const broadcast = broadcasts.find((b) => b.id === id);

  if (!broadcast) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/admin/broadcasts">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Broadcasts
          </Link>
        </Button>
      </div>

      <BroadcastStudio broadcastId={id} broadcastData={broadcast} />
    </div>
  );
}
