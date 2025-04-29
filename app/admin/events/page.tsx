import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import EventsTable from "@/components/admin/events/events-table";

export const metadata = {
  title: "Manage Events - WaveStream Admin",
};

export default function EventsPage() {
  // Mock events data
  const events = [
    {
      id: "1",
      title: "Live Podcast Recording: Tech Trends 2023",
      description:
        "Join us for a live recording of our popular Tech Talks Weekly podcast",
      date: new Date("2023-10-15").toISOString(),
      time: "6:00 PM - 8:00 PM",
      location: "Studio One, Downtown",
      category: "Live Recording",
      imageUrl: "/placeholder.svg?height=400&width=400",
      createdAt: new Date("2023-09-01").toISOString(),
    },
    {
      id: "2",
      title: "Meet & Greet with Podcast Hosts",
      description:
        "Meet your favorite podcast hosts and get exclusive merchandise",
      date: new Date("2023-10-22").toISOString(),
      time: "3:00 PM - 5:00 PM",
      location: "Central Park Pavilion",
      category: "Community",
      imageUrl: "/placeholder.svg?height=400&width=400",
      createdAt: new Date("2023-09-05").toISOString(),
    },
    {
      id: "3",
      title: "Audiobook Launch: 'The Silent Echo'",
      description: "Book signing and Q&A with author Elena Rodriguez",
      date: new Date("2023-11-05").toISOString(),
      time: "7:00 PM - 9:00 PM",
      location: "City Library Auditorium",
      category: "Book Launch",
      imageUrl: "/placeholder.svg?height=400&width=400",
      createdAt: new Date("2023-09-10").toISOString(),
    },
    {
      id: "4",
      title: "Wellness Workshop with David Chen",
      description:
        "Learn meditation techniques from the host of Mindful Moments",
      date: new Date("2023-11-12").toISOString(),
      time: "10:00 AM - 12:00 PM",
      location: "Wellness Center",
      category: "Workshop",
      imageUrl: "/placeholder.svg?height=400&width=400",
      createdAt: new Date("2023-09-15").toISOString(),
    },
    {
      id: "5",
      title: "Business Networking Event",
      description: "Network with business leaders and entrepreneurs",
      date: new Date("2023-09-01").toISOString(), // Past event
      time: "6:00 PM - 9:00 PM",
      location: "Grand Hotel Conference Room",
      category: "Networking",
      imageUrl: "/placeholder.svg?height=400&width=400",
      createdAt: new Date("2023-08-01").toISOString(),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Events</h1>
        <Button asChild>
          <a href="/admin/events/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Event
          </a>
        </Button>
      </div>

      <EventsTable events={events} />
    </div>
  );
}
