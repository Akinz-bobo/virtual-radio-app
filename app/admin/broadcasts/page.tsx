import { Button } from "@/components/ui/button";
import { PlusCircle, Radio } from "lucide-react";
import BroadcastsTable from "@/components/admin/broadcasts/broadcasts-table";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "Manage Broadcasts - WaveStream Admin",
};

export default async function BroadcastsPage() {
  // Fetch broadcasts from the database
  // For now, we'll use mock data since we haven't created the model yet
  const broadcasts = [
    {
      id: "1",
      title: "Morning Show",
      host: "Alex Rivera",
      schedule: "Weekdays, 7AM - 10AM",
      status: "live",
      startTime: "2023-10-16T07:00:00Z",
      endTime: "2023-10-16T10:00:00Z",
    },
    {
      id: "2",
      title: "Afternoon Acoustics",
      host: "Mia Chen",
      schedule: "Weekdays, 2PM - 4PM",
      status: "upcoming",
      startTime: "2023-10-16T14:00:00Z",
      endTime: "2023-10-16T16:00:00Z",
    },
    {
      id: "3",
      title: "Evening Discussions",
      host: "Jordan Taylor",
      schedule: "Mon, Wed, Fri, 7PM - 9PM",
      status: "upcoming",
      startTime: "2023-10-16T19:00:00Z",
      endTime: "2023-10-16T21:00:00Z",
    },
    {
      id: "4",
      title: "Weekend Brunch",
      host: "Chris & Pat",
      schedule: "Weekends, 10AM - 12PM",
      status: "scheduled",
      startTime: "2023-10-21T10:00:00Z",
      endTime: "2023-10-21T12:00:00Z",
    },
  ];

  // Find any currently live broadcast
  const liveBroadcast = broadcasts.find((b) => b.status === "live");

  return (
    <div className="flex flex-col gap-5">
      {liveBroadcast && (
        <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <span className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Live Broadcast in Progress
            </CardTitle>
            <CardDescription>
              "{liveBroadcast.title}" with {liveBroadcast.host} is currently
              live
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="bg-studio-600 hover:bg-studio-700">
              <Link href={`/admin/broadcasts/${liveBroadcast.id}/studio`}>
                <Radio className="h-4 w-4 mr-2" />
                Go to Live Studio
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Broadcasts</h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/admin/broadcasts/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Broadcast
            </Link>
          </Button>
        </div>
      </div>

      <BroadcastsTable broadcasts={broadcasts} />
    </div>
  );
}
