"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  MoreVertical,
  Edit,
  Trash,
  FileText,
  Clock,
  Music,
  BookOpen,
  Download,
  Eye,
  Upload,
  Check,
} from "lucide-react";
import { getChapters, deleteChapter, publishChapter } from "@/app/actions";

type Chapter = {
  id: string;
  title: string;
  audioFile: string;
  duration: number;
  trackNumber: number;
  isDraft: boolean;
  playCount: number;
  audiobookId: string;
  createdAt: string;
  updatedAt: string;
  hasTranscript?: boolean;
};

export default function ChaptersPage() {
  const params = useParams();
  const router = useRouter();
  const audiobookId = params.audiobookId as string;

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isTranscriptDialogOpen, setIsTranscriptDialogOpen] = useState(false);
  const [transcriptContent, setTranscriptContent] = useState("");

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        // This would be implemented in a server action
        const data = await getChapters(audiobookId);
        setChapters(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [audiobookId]);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleDeleteChapter = async () => {
    if (!selectedChapter) return;

    try {
      await deleteChapter(selectedChapter.id);
      setChapters(
        chapters.filter((chapter) => chapter.id !== selectedChapter.id)
      );
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePublishChapter = async (chapterId: string) => {
    try {
      await publishChapter(chapterId);
      setChapters(
        chapters.map((chapter) =>
          chapter.id === chapterId ? { ...chapter, isDraft: false } : chapter
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const filteredChapters = chapters.filter((chapter) => {
    if (filter === "all") return true;
    if (filter === "published") return !chapter.isDraft;
    if (filter === "draft") return chapter.isDraft;
    return true;
  });

  const viewTranscript = async (chapter: Chapter) => {
    setSelectedChapter(chapter);
    // In a real app, you would fetch the transcript content here
    setTranscriptContent(
      "This is a sample transcript for the chapter. In a real application, this would be fetched from the database or API."
    );
    setIsTranscriptDialogOpen(true);
  };

  const downloadTranscript = () => {
    if (!selectedChapter || !transcriptContent) return;

    const blob = new Blob([transcriptContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedChapter.title}_transcript.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-4">
            <Button
              variant="outline"
              onClick={() => router.push(`/admin/audiobooks`)}
            >
              Back to Audiobooks
            </Button>
            <h1 className="text-3xl font-bold text-slate-800">
              Audiobook Chapters
            </h1>
            <p className="text-slate-500 mt-1">
              Manage chapters and transcripts
            </p>
          </div>
          <Button
            onClick={() =>
              router.push(`/admin/audiobooks/${audiobookId}/chapters/new`)
            }
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Chapter
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Chapters
              </CardTitle>
              <Tabs
                defaultValue="all"
                value={filter}
                onValueChange={(value) => setFilter(value as any)}
              >
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="published">Published</TabsTrigger>
                  <TabsTrigger value="draft">Drafts</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <CardDescription>
              {filter === "all" && "All chapters for this audiobook"}
              {filter === "published" &&
                "Published chapters for this audiobook"}
              {filter === "draft" && "Draft chapters for this audiobook"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading chapters...</div>
            ) : filteredChapters.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <div className="flex justify-center mb-4">
                  <Music className="h-12 w-12 text-slate-300" />
                </div>
                <p>No chapters found</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() =>
                    router.push(`/admin/audiobooks/${audiobookId}/chapters/new`)
                  }
                >
                  Add Your First Chapter
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Transcript</TableHead>
                      <TableHead>Plays</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredChapters.map((chapter) => (
                      <TableRow key={chapter.id}>
                        <TableCell className="font-medium">
                          {chapter.trackNumber}
                        </TableCell>
                        <TableCell className="font-medium">
                          {chapter.title}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-slate-400" />
                            {formatDuration(chapter.duration)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {chapter.isDraft ? (
                            <Badge
                              variant="outline"
                              className="bg-amber-50 text-amber-700 border-amber-200"
                            >
                              Draft
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 border-green-200"
                            >
                              Published
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {chapter.hasTranscript ? (
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-700 border-blue-200 cursor-pointer"
                              onClick={() => viewTranscript(chapter)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-slate-50 text-slate-500 border-slate-200 cursor-pointer"
                              onClick={() =>
                                router.push(
                                  `/admin/audiobooks/${audiobookId}/chapters/${chapter.id}/transcript`
                                )
                              }
                            >
                              <Upload className="h-3 w-3 mr-1" />
                              Add
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{chapter.playCount}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  router.push(
                                    `/admin/audiobooks/${audiobookId}/chapters/${chapter.id}/edit`
                                  )
                                }
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              {chapter.isDraft && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handlePublishChapter(chapter.id)
                                  }
                                >
                                  <Check className="h-4 w-4 mr-2" />
                                  Publish
                                </DropdownMenuItem>
                              )}
                              {chapter.hasTranscript && (
                                <DropdownMenuItem
                                  onClick={() => viewTranscript(chapter)}
                                >
                                  <FileText className="h-4 w-4 mr-2" />
                                  View Transcript
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedChapter(chapter);
                                  setIsDeleteDialogOpen(true);
                                }}
                                className="text-red-600"
                              >
                                <Trash className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the chapter "{selectedChapter?.title}
              ". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteChapter}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Transcript View Dialog */}
      <Dialog
        open={isTranscriptDialogOpen}
        onOpenChange={setIsTranscriptDialogOpen}
      >
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Transcript: {selectedChapter?.title}</DialogTitle>
            <DialogDescription>
              View and download the transcript for this chapter
            </DialogDescription>
          </DialogHeader>
          <div className="bg-slate-50 p-4 rounded-md border border-slate-200 max-h-[50vh] overflow-y-auto my-4">
            <pre className="text-sm whitespace-pre-wrap">
              {transcriptContent}
            </pre>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={downloadTranscript}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Transcript
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                router.push(
                  `/admin/audiobooks/${audiobookId}/chapters/${selectedChapter?.id}/transcript/edit`
                )
              }
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Transcript
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
