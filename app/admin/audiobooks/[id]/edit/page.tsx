import AudiobookForm from "@/components/admin/audiobooks/audiobook-form";

export const metadata = {
  title: "Edit Audiobook - WaveStream Admin",
};

export default function EditAudiobookPage({
  params,
}: {
  params: { id: string };
}) {
  // In a real app, we would fetch the audiobook data from the API
  // For now, we'll use mock data
  const mockAudiobooks = [
    {
      id: "1",
      title: "The Silent Echo",
      author: "Elena Rodriguez",
      narrator: "Michael Stevens",
      description: "A thrilling mystery set in a small coastal town",
      imageUrl: "/placeholder.svg?height=400&width=400",
      duration: 28800, // 8 hours in seconds
      category: "Mystery",
      rating: 4.5,
      chapters: [
        { id: "101", title: "Chapter 1", duration: 1800, startPosition: 0 },
        { id: "102", title: "Chapter 2", duration: 2100, startPosition: 1800 },
        { id: "103", title: "Chapter 3", duration: 1950, startPosition: 3900 },
      ],
      createdAt: new Date("2023-02-10").toISOString(),
    },
    {
      id: "2",
      title: "Beyond the Stars",
      author: "Robert Chang",
      narrator: "Samantha Williams",
      description: "An epic science fiction adventure across galaxies",
      imageUrl: "/placeholder.svg?height=400&width=400",
      duration: 36000, // 10 hours in seconds
      category: "Science Fiction",
      rating: 4.8,
      chapters: [
        { id: "201", title: "Prologue", duration: 900, startPosition: 0 },
        { id: "202", title: "Chapter 1", duration: 2400, startPosition: 900 },
        { id: "203", title: "Chapter 2", duration: 2700, startPosition: 3300 },
      ],
      createdAt: new Date("2023-03-15").toISOString(),
    },
    {
      id: "3",
      title: "The Business of Tomorrow",
      author: "Jennifer Lee",
      narrator: "David Johnson",
      description: "Insights into future business trends and strategies",
      imageUrl: "/placeholder.svg?height=400&width=400",
      duration: 21600, // 6 hours in seconds
      category: "Business",
      rating: 4.2,
      chapters: [
        { id: "301", title: "Introduction", duration: 1200, startPosition: 0 },
        { id: "302", title: "Chapter 1", duration: 3600, startPosition: 1200 },
        { id: "303", title: "Chapter 2", duration: 3300, startPosition: 4800 },
      ],
      createdAt: new Date("2023-04-20").toISOString(),
    },
  ];

  const audiobook = mockAudiobooks.find((a) => a.id === params.id);

  return <AudiobookForm audiobook={audiobook} isEdit={true} />;
}
