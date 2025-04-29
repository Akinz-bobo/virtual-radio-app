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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Trash2, Plus, ExternalLink } from "lucide-react";
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

export default function PodcastsTable({ podcasts }) {
  const router = useRouter();
  const { addNotification } = useNotifications();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [podcastToDelete, setPodcastToDelete] = useState(null);

  const handleEdit = (id) => {
    router.push(`/admin/podcasts/${id}/edit`);
  };

  const handleDelete = (podcast) => {
    setPodcastToDelete(podcast);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      // In a real app, this would be an API call
      await fetch(`/api/podcasts/${podcastToDelete.id}`, {
        method: "DELETE",
      });

      // Show notification
      await addNotification({
        title: "Podcast Deleted",
        message: `"${podcastToDelete.title}" has been deleted successfully.`,
        type: "info",
      });

      setDeleteDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error deleting podcast:", error);

      // Show error notification
      await addNotification({
        title: "Error",
        message: "Failed to delete podcast. Please try again.",
        type: "error",
      });
    }
  };

  const handleAddEpisode = (id) => {
    router.push(`/admin/podcasts/${id}/episodes/new`);
  };

  const handleViewEpisodes = (id) => {
    router.push(`/admin/podcasts/${id}/episodes`);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Episodes</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {podcasts.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-8 text-muted-foreground"
              >
                No podcasts found. Create your first podcast to get started.
              </TableCell>
            </TableRow>
          ) : (
            podcasts.map((podcast) => (
              <TableRow key={podcast.id}>
                <TableCell>
                  {podcast.imageUrl ? (
                    <Image
                      src={podcast.imageUrl || "/placeholder.svg"}
                      alt={podcast.title}
                      width={50}
                      height={50}
                      className="rounded-md object-cover"
                    />
                  ) : (
                    <div className="w-[50px] h-[50px] bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center text-gray-500">
                      No img
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{podcast.title}</TableCell>
                <TableCell>{podcast.author}</TableCell>
                <TableCell>{podcast.category || "Uncategorized"}</TableCell>
                <TableCell>{podcast.episodes?.length || 0}</TableCell>
                <TableCell>
                  {new Date(podcast.createdAt).toLocaleDateString()}
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
                      <DropdownMenuItem onClick={() => handleEdit(podcast.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleAddEpisode(podcast.id)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Episode
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleViewEpisodes(podcast.id)}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Episodes
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(podcast)}
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
              This will permanently delete the podcast "{podcastToDelete?.title}
              " and all its episodes. This action cannot be undone.
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
