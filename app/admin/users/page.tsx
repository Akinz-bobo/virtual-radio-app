import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import UsersTable from "@/components/admin/users/users-table";

export const metadata = {
  title: "Manage Users - WaveStream Admin",
};

export default function UsersPage() {
  // Mock users data
  const users = [
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      role: "admin",
      profilePicture: "/placeholder.svg?height=100&width=100&text=JD",
      createdAt: new Date("2023-01-05").toISOString(),
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "user",
      profilePicture: "/placeholder.svg?height=100&width=100&text=JS",
      createdAt: new Date("2023-02-10").toISOString(),
    },
    {
      id: "3",
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
      role: "user",
      profilePicture: null,
      createdAt: new Date("2023-03-15").toISOString(),
    },
    {
      id: "4",
      name: "Emily Davis",
      email: "emily.davis@example.com",
      role: "admin",
      profilePicture: "/placeholder.svg?height=100&width=100&text=ED",
      createdAt: new Date("2023-04-20").toISOString(),
    },
    {
      id: "5",
      name: null,
      email: "anonymous@example.com",
      role: "user",
      profilePicture: null,
      createdAt: new Date("2023-05-25").toISOString(),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Users</h1>
        <Button asChild>
          <a href="/admin/users/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New User
          </a>
        </Button>
      </div>

      <UsersTable users={users} />
    </div>
  );
}
