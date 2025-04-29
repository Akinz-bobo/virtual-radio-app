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
import { MoreHorizontal, Trash2, CheckCircle } from "lucide-react";
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

export default function NotificationsTable({ notifications }) {
  const router = useRouter();
  const { addNotification } = useNotifications();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState(null);

  const handleDelete = (notification) => {
    setNotificationToDelete(notification);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      // In a real app, this would be an API call
      await fetch(`/api/notifications/${notificationToDelete.id}`, {
        method: "DELETE",
      });

      // Show notification
      await addNotification({
        title: "Notification Deleted",
        message: `Notification "${notificationToDelete.title}" has been deleted successfully.`,
        type: "info",
      });

      setDeleteDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error deleting notification:", error);

      // Show error notification
      await addNotification({
        title: "Error",
        message: "Failed to delete notification. Please try again.",
        type: "error",
      });
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      // In a real app, this would be an API call
      await fetch(`/api/notifications/${id}/read`, {
        method: "PUT",
      });

      router.refresh();
    } catch (error) {
      console.error("Error marking notification as read:", error);

      // Show error notification
      await addNotification({
        title: "Error",
        message: "Failed to mark notification as read. Please try again.",
        type: "error",
      });
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case "info":
        return <Badge className="bg-blue-500">Info</Badge>;
      case "success":
        return <Badge className="bg-green-500">Success</Badge>;
      case "warning":
        return <Badge className="bg-yellow-500">Warning</Badge>;
      case "error":
        return <Badge className="bg-red-500">Error</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Recipient</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notifications.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center py-8 text-muted-foreground"
              >
                No notifications found.
              </TableCell>
            </TableRow>
          ) : (
            notifications.map((notification) => (
              <TableRow
                key={notification.id}
                className={notification.read ? "" : "bg-muted/20"}
              >
                <TableCell className="font-medium">
                  {notification.title}
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {notification.message}
                </TableCell>
                <TableCell>{getTypeBadge(notification.type)}</TableCell>
                <TableCell>
                  {notification.user
                    ? notification.user.name || notification.user.email
                    : "All Users"}
                </TableCell>
                <TableCell>
                  {notification.creator
                    ? notification.creator.name || notification.creator.email
                    : "System"}
                </TableCell>
                <TableCell>
                  {new Date(notification.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  {notification.read ? (
                    <Badge
                      variant="outline"
                      className="border-green-500 text-green-500"
                    >
                      Read
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="border-blue-500 text-blue-500"
                    >
                      Unread
                    </Badge>
                  )}
                </TableCell>
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
                      {!notification.read && (
                        <DropdownMenuItem
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Mark as Read
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(notification)}
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
              This will permanently delete the notification "
              {notificationToDelete?.title}". This action cannot be undone.
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
