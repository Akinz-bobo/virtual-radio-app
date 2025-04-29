import PodcastForm from "@/components/admin/podcasts/podcast-form";

export const metadata = {
  title: "Edit Podcast - WaveStream Admin",
};

export default function EditPodcastPage({
  params,
}: {
  params: { podcastId: string };
}) {
  // In a real app, we would fetch the podcast data from the API
  // For now, we'll use mock data
  const mockPodcasts = [
    {
      id: "1",
      title: "Tech Talks Weekly",
      author: "Sarah Johnson",
      description:
        "The latest in tech news and interviews with industry leaders",
      imageUrl: "/placeholder.svg?height=400&width=400",
      category: "Technology",
      episodes: [
        { id: "101", title: "The Future of AI", duration: 2460 },
        { id: "102", title: "Web Development Trends 2023", duration: 1980 },
      ],
      createdAt: new Date("2023-01-15").toISOString(),
    },
    {
      id: "2",
      title: "Mindful Moments",
      author: "David Chen",
      description: "Meditation and mindfulness practices for everyday life",
      imageUrl: "/placeholder.svg?height=400&width=400",
      category: "Wellness",
      episodes: [
        { id: "201", title: "Morning Meditation Routine", duration: 1320 },
        { id: "202", title: "Mindfulness at Work", duration: 1560 },
        { id: "203", title: "Sleep Meditation", duration: 1800 },
      ],
      createdAt: new Date("2023-02-20").toISOString(),
    },
    {
      id: "3",
      title: "Business Insights",
      author: "Maya Patel",
      description:
        "Strategies and insights for entrepreneurs and business leaders",
      imageUrl: "/placeholder.svg?height=400&width=400",
      category: "Business",
      episodes: [
        { id: "301", title: "Startup Funding Strategies", duration: 2700 },
        { id: "302", title: "Leadership in Crisis", duration: 2340 },
      ],
      createdAt: new Date("2023-03-10").toISOString(),
    },
    {
      id: "4",
      title: "Creative Corner",
      author: "James Wilson",
      description: "Exploring creativity in various art forms and industries",
      imageUrl: "/placeholder.svg?height=400&width=400",
      category: "Arts",
      episodes: [
        { id: "401", title: "Finding Inspiration", duration: 1920 },
        { id: "402", title: "The Creative Process", duration: 2100 },
        { id: "403", title: "Collaboration in Art", duration: 1860 },
      ],
      createdAt: new Date("2023-04-05").toISOString(),
    },
  ];

  const podcast = mockPodcasts.find((p) => p.id === params.podcastId);

  return <PodcastForm podcast={podcast} isEdit={true} />;
}
