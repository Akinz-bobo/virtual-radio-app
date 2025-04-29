import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import ProgramsTable from "@/components/admin/programs/programs-table";

export const metadata = {
  title: "Manage Programs - WaveStream Admin",
};

export default function ProgramsPage() {
  // Mock programs data
  const programs = [
    {
      id: "1",
      title: "Morning Vibes",
      host: "Alex Rivera",
      description:
        "Start your day with upbeat music and positive conversations",
      schedule: "Weekdays, 7AM - 10AM",
      imageUrl: "/placeholder.svg?height=200&width=400",
      category: "Talk Show",
      createdAt: new Date("2023-01-10").toISOString(),
    },
    {
      id: "2",
      title: "Afternoon Acoustics",
      host: "Mia Chen",
      description: "Relaxing acoustic music and artist interviews",
      schedule: "Weekdays, 2PM - 4PM",
      imageUrl: "/placeholder.svg?height=200&width=400",
      category: "Music",
      createdAt: new Date("2023-02-15").toISOString(),
    },
    {
      id: "3",
      title: "Evening Discussions",
      host: "Jordan Taylor",
      description:
        "In-depth conversations about current events and social issues",
      schedule: "Mon, Wed, Fri, 7PM - 9PM",
      imageUrl: "/placeholder.svg?height=200&width=400",
      category: "Interview",
      createdAt: new Date("2023-03-20").toISOString(),
    },
    {
      id: "4",
      title: "Weekend Brunch",
      host: "Chris & Pat",
      description:
        "Casual conversations and music to accompany your weekend brunch",
      schedule: "Weekends, 10AM - 12PM",
      imageUrl: "/placeholder.svg?height=200&width=400",
      category: "Lifestyle",
      createdAt: new Date("2023-04-05").toISOString(),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Programs</h1>
        <Button asChild>
          <a href="/admin/programs/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Program
          </a>
        </Button>
      </div>

      <ProgramsTable programs={programs} />
    </div>
  );
}
