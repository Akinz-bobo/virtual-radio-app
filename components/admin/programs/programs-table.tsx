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
import { Edit, MoreHorizontal, Trash2, Radio } from "lucide-react";
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

export default function ProgramsTable({ programs }) {
  const router = useRouter();
  const { addNotification } = useNotifications();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [programToDelete, setProgramToDelete] = useState(null);

  const handleEdit = (id) => {
    router.push(`/admin/programs/${id}/edit`);
  };

  const handleDelete = (program) => {
    setProgramToDelete(program);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show notification
      addNotification({
        title: "Program Deleted",
        message: `"${programToDelete.title}" has been deleted successfully.`,
        type: "info",
      });

      setDeleteDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error deleting program:", error);

      // Show error notification
      addNotification({
        title: "Error",
        message: "Failed to delete program. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Host</TableHead>
            <TableHead>Schedule</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {programs.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-8 text-muted-foreground"
              >
                No programs found. Create your first program to get started.
              </TableCell>
            </TableRow>
          ) : (
            programs.map((program) => (
              <TableRow key={program.id}>
                <TableCell>
                  {program.imageUrl ? (
                    <Image
                      src={program.imageUrl || "/placeholder.svg"}
                      alt={program.title}
                      width={50}
                      height={50}
                      className="rounded-md object-cover"
                    />
                  ) : (
                    <div className="w-[50px] h-[50px] bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center text-gray-500">
                      <Radio className="h-5 w-5" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{program.title}</TableCell>
                <TableCell>{program.host}</TableCell>
                <TableCell>{program.schedule}</TableCell>
                <TableCell>
                  {program.category ? (
                    <Badge variant="outline">{program.category}</Badge>
                  ) : (
                    "Uncategorized"
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
                      <DropdownMenuItem onClick={() => handleEdit(program.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(program)}
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
              This will permanently delete the program "{programToDelete?.title}
              ". This action cannot be undone.
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
