"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Trash2, Calendar } from "lucide-react";
import { useNotifications } from "@/contexts/notifications-context";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function EventsTable({ events }) {
  const router = useRouter();
  const { addNotification } = useNotifications();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  const handleEdit = (id) => {
    router.push(`/admin/events/${id}/edit`);
  };

  const handleDelete = (event) => {
    setEventToDelete(event);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      // In a real app, this would be an API call
      await fetch(`/api/events/${eventToDelete.id}`, {
        method: "DELETE",
      });

      // Show notification
      await addNotification({
        title: "Event Deleted",
        message: `"${eventToDelete.title}" has been deleted successfully.`,
        type: "info",
      });

      setDeleteDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error deleting event:", error);

      // Show error notification
      await addNotification({
        title: "Error",
        message: "Failed to delete event. Please try again.",
        type: "error",
      });
    }
  };

  const getEventStatus = (date) => {
    const eventDate = new Date(date);
    const now = new Date();

    if (eventDate < now) {
      return <Badge className="bg-gray-500">Past</Badge>;
    } else if (eventDate.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000) {
      return <Badge className="bg-green-500">Upcoming</Badge>;
    } else {
      return <Badge className="bg-blue-500">Scheduled</Badge>;
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center py-8 text-muted-foreground"
              >
                No events found. Create your first event to get started.
              </TableCell>
            </TableRow>
          ) : (
            events.map((event) => (
              <TableRow key={event.id}>
                <TableCell>
                  {event.imageUrl ? (
                    <Image
                      src={event.imageUrl || "/placeholder.svg"}
                      alt={event.title}
                      width={50}
                      height={50}
                      className="rounded-md object-cover"
                    />
                  ) : (
                    <div className="w-[50px] h-[50px] bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center text-gray-500">
                      <Calendar className="h-5 w-5" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{event.title}</TableCell>
                <TableCell>
                  {new Date(event.date).toLocaleDateString()}
                </TableCell>
                <TableCell>{event.time || "—"}</TableCell>
                <TableCell>{event.location || "—"}</TableCell>
                <TableCell>{event.category || "Uncategorized"}</TableCell>
                <TableCell>{getEventStatus(event.date)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleEdit(event.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(event)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the event "{eventToDelete?.title}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
