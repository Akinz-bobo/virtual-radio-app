"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Edit, MoreHorizontal, Play, Trash2, Pause, Radio } from "lucide-react";
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

export default function BroadcastsTable({ broadcasts }) {
  const router = useRouter();
  const { addNotification } = useNotifications();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [broadcastToDelete, setBroadcastToDelete] = useState(null);

  const handleEdit = (id) => {
    router.push(`/admin/broadcasts/${id}/edit`);
  };

  const handleDelete = (broadcast) => {
    setBroadcastToDelete(broadcast);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    // In a real app, this would be an API call
    console.log(`Deleting broadcast: ${broadcastToDelete.id}`);

    // Show notification
    await addNotification({
      title: "Broadcast Deleted",
      message: `"${broadcastToDelete.title}" has been deleted successfully.`,
      type: "info",
    });

    setDeleteDialogOpen(false);
    router.refresh();
  };

  const handleToggleStatus = async (broadcast) => {
    const newStatus = broadcast.status === "live" ? "paused" : "live";

    // In a real app, this would be an API call
    console.log(`Changing broadcast status: ${broadcast.id} to ${newStatus}`);

    // Show notification
    await addNotification({
      title: "Broadcast Status Updated",
      message: `"${broadcast.title}" is now ${newStatus}.`,
      type: "success",
    });

    router.refresh();
  };

  const handleGoToStudio = (id) => {
    router.push(`/admin/broadcasts/${id}/studio`);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "live":
        return <Badge className="bg-green-500">Live</Badge>;
      case "upcoming":
        return <Badge className="bg-blue-500">Upcoming</Badge>;
      case "scheduled":
        return <Badge className="bg-yellow-500">Scheduled</Badge>;
      case "paused":
        return <Badge className="bg-orange-500">Paused</Badge>;
      case "ended":
        return <Badge className="bg-gray-500">Ended</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Host</TableHead>
            <TableHead>Schedule</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
            <TableHead className="w-[150px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {broadcasts.map((broadcast) => (
            <TableRow key={broadcast.id}>
              <TableCell className="font-medium">{broadcast.title}</TableCell>
              <TableCell>{broadcast.host}</TableCell>
              <TableCell>{broadcast.schedule}</TableCell>
              <TableCell>{getStatusBadge(broadcast.status)}</TableCell>
              <TableCell>
                {new Date(broadcast.startTime).toLocaleString()}
              </TableCell>
              <TableCell>
                {new Date(broadcast.endTime).toLocaleString()}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 bg-studio-50 text-studio-700 border-studio-200 hover:bg-studio-100 hover:text-studio-800"
                    onClick={() => handleGoToStudio(broadcast.id)}
                  >
                    <Radio className="h-4 w-4 mr-1" />
                    Studio
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => handleEdit(broadcast.id)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleToggleStatus(broadcast)}
                        disabled={
                          !["live", "paused"].includes(broadcast.status)
                        }
                      >
                        {broadcast.status === "live" ? (
                          <>
                            <Pause className="mr-2 h-4 w-4" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="mr-2 h-4 w-4" />
                            Go Live
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(broadcast)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the broadcast "
              {broadcastToDelete?.title}". This action cannot be undone.
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
