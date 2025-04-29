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
  Calendar,
  Headphones,
  Mic,
  Download,
  Eye,
  Upload,
  Check,
} from "lucide-react";
import {
  getPodcastEpisodes,
  deletePodcastEpisode,
  publishPodcastEpisode,
} from "@/app/actions/podcast-actions";
import { format } from "date-fns";

type PodcastEpisode = {
  id: string;
  title: string;
  audioFile: string;
  duration: number;
  releaseDate: string;
  podcastId: string;
  isDraft: boolean;
  hasTranscript?: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function PodcastEpisodesPage() {
  const params = useParams();
  const router = useRouter();
  const podcastId = params.podcastId as string;

  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [selectedEpisode, setSelectedEpisode] = useState<PodcastEpisode | null>(
    null
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isTranscriptDialogOpen, setIsTranscriptDialogOpen] = useState(false);
  const [transcriptContent, setTranscriptContent] = useState("");
  const [podcastTitle, setPodcastTitle] = useState("Podcast");

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        // This would be implemented in a server action
        const data = await getPodcastEpisodes(podcastId);
        setEpisodes(data.episodes);
        setPodcastTitle(data.podcastTitle);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodes();
  }, [podcastId]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleDeleteEpisode = async () => {
    if (!selectedEpisode) return;

    try {
      await deletePodcastEpisode(selectedEpisode.id);
      setEpisodes(
        episodes.filter((episode) => episode.id !== selectedEpisode.id)
      );
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePublishEpisode = async (episodeId: string) => {
    try {
      await publishPodcastEpisode(episodeId);
      setEpisodes(
        episodes.map((episode) =>
          episode.id === episodeId ? { ...episode, isDraft: false } : episode
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const filteredEpisodes = episodes.filter((episode) => {
    if (filter === "all") return true;
    if (filter === "published") return !episode.isDraft;
    if (filter === "draft") return episode.isDraft;
    return true;
  });

  const viewTranscript = async (episode: PodcastEpisode) => {
    setSelectedEpisode(episode);
    // In a real app, you would fetch the transcript content here
    setTranscriptContent(
      "This is a sample transcript for the podcast episode. In a real application, this would be fetched from the database or API."
    );
    setIsTranscriptDialogOpen(true);
  };

  const downloadTranscript = () => {
    if (!selectedEpisode || !transcriptContent) return;

    const blob = new Blob([transcriptContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedEpisode.title}_transcript.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              {podcastTitle} Episodes
            </h1>
            <p className="text-slate-500 mt-1">
              Manage podcast episodes and transcripts
            </p>
          </div>
          <Button
            onClick={() =>
              router.push(`/admin/podcasts/${podcastId}/episodes/new`)
            }
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Episode
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Headphones className="h-5 w-5" />
                Episodes
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
              {filter === "all" && "All episodes for this podcast"}
              {filter === "published" && "Published episodes for this podcast"}
              {filter === "draft" && "Draft episodes for this podcast"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading episodes...</div>
            ) : filteredEpisodes.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <div className="flex justify-center mb-4">
                  <Mic className="h-12 w-12 text-slate-300" />
                </div>
                <p>No episodes found</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() =>
                    router.push(`/admin/podcasts/${podcastId}/episodes/new`)
                  }
                >
                  Add Your First Episode
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Release Date</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Transcript</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEpisodes.map((episode) => (
                      <TableRow key={episode.id}>
                        <TableCell className="font-medium">
                          {episode.title}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-slate-400" />
                            {format(
                              new Date(episode.releaseDate),
                              "MMM d, yyyy"
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-slate-400" />
                            {formatDuration(episode.duration)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {episode.isDraft ? (
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
                          {episode.hasTranscript ? (
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-700 border-blue-200 cursor-pointer"
                              onClick={() => viewTranscript(episode)}
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
                                  `/admin/podcasts/${podcastId}/episodes/${episode.id}/transcript`
                                )
                              }
                            >
                              <Upload className="h-3 w-3 mr-1" />
                              Add
                            </Badge>
                          )}
                        </TableCell>
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
                                    `/admin/podcasts/${podcastId}/episodes/${episode.id}/edit`
                                  )
                                }
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Episode
                              </DropdownMenuItem>
                              {episode.isDraft && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handlePublishEpisode(episode.id)
                                  }
                                >
                                  <Check className="h-4 w-4 mr-2" />
                                  Publish
                                </DropdownMenuItem>
                              )}
                              {episode.hasTranscript ? (
                                <>
                                  <DropdownMenuItem
                                    onClick={() => viewTranscript(episode)}
                                  >
                                    <FileText className="h-4 w-4 mr-2" />
                                    View Transcript
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      router.push(
                                        `/admin/podcasts/${podcastId}/episodes/${episode.id}/transcript/edit`
                                      )
                                    }
                                  >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Transcript
                                  </DropdownMenuItem>
                                </>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() =>
                                    router.push(
                                      `/admin/podcasts/${podcastId}/episodes/${episode.id}/transcript`
                                    )
                                  }
                                >
                                  <Upload className="h-4 w-4 mr-2" />
                                  Add Transcript
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedEpisode(episode);
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
              This will permanently delete the episode "{selectedEpisode?.title}
              ". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteEpisode}
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
            <DialogTitle>Transcript: {selectedEpisode?.title}</DialogTitle>
            <DialogDescription>
              View and download the transcript for this episode
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
                  `/admin/podcasts/${podcastId}/episodes/${selectedEpisode?.id}/transcript/edit`
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
