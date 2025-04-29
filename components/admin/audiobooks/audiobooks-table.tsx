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
import { formatDuration } from "@/lib/audiobook-api";

export default function AudiobooksTable({ audiobooks }) {
  const router = useRouter();
  const { addNotification } = useNotifications();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [audiobookToDelete, setAudiobookToDelete] = useState(null);

  const handleEdit = (id) => {
    router.push(`/admin/audiobooks/${id}/edit`);
  };

  const handleDelete = (audiobook) => {
    setAudiobookToDelete(audiobook);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      // In a real app, this would be an API call
      await fetch(`/api/audiobooks/${audiobookToDelete.id}`, {
        method: "DELETE",
      });

      // Show notification
      await addNotification({
        title: "Audiobook Deleted",
        message: `"${audiobookToDelete.title}" has been deleted successfully.`,
        type: "info",
      });

      setDeleteDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error deleting audiobook:", error);

      // Show error notification
      await addNotification({
        title: "Error",
        message: "Failed to delete audiobook. Please try again.",
        type: "error",
      });
    }
  };

  const handleAddChapter = (id) => {
    router.push(`/admin/audiobooks/${id}/chapters/new`);
  };

  const handleViewChapters = (id) => {
    router.push(`/admin/audiobooks/${id}/chapters`);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Cover</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Narrator</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Chapters</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {audiobooks.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center py-8 text-muted-foreground"
              >
                No audiobooks found. Create your first audiobook to get started.
              </TableCell>
            </TableRow>
          ) : (
            audiobooks.map((audiobook) => (
              <TableRow key={audiobook.id}>
                <TableCell>
                  {audiobook.imageUrl ? (
                    <Image
                      src={audiobook.imageUrl || "/placeholder.svg"}
                      alt={audiobook.title}
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
                <TableCell className="font-medium">{audiobook.title}</TableCell>
                <TableCell>{audiobook.author}</TableCell>
                <TableCell>{audiobook.narrator || "—"}</TableCell>
                <TableCell>{audiobook.category || "Uncategorized"}</TableCell>
                <TableCell>{formatDuration(audiobook.duration)}</TableCell>
                <TableCell>{audiobook.chapters?.length || 0}</TableCell>
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
                      <DropdownMenuItem
                        onClick={() => handleEdit(audiobook.id)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleAddChapter(audiobook.id)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Chapter
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleViewChapters(audiobook.id)}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Chapters
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(audiobook)}
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
              This will permanently delete the audiobook "
              {audiobookToDelete?.title}" and all its chapters. This action
              cannot be undone.
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
