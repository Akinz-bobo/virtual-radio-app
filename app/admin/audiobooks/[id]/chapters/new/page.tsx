"use client";

import type React from "react";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  FileText,
  Save,
  BookOpen,
  Clock,
  Music,
  Download,
} from "lucide-react";
import { createChapter, saveTranscript } from "@/app/actions";

export default function NewChapterPage() {
  const params = useParams();
  const router = useRouter();
  const audiobookId = params.audiobookId as string;
  const audioRef = useRef<HTMLAudioElement>(null);

  const [title, setTitle] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [trackNumber, setTrackNumber] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraft, setIsDraft] = useState(true);

  // Transcript states
  const [transcriptTab, setTranscriptTab] = useState("write");
  const [transcriptText, setTranscriptText] = useState("");
  const [transcriptFile, setTranscriptFile] = useState<File | null>(null);
  const [isTranscriptSaving, setIsTranscriptSaving] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      const audioUrl = URL.createObjectURL(file);
      setAudioPreview(audioUrl);

      // Create audio element to get duration
      const audio = new Audio(audioUrl);
      audio.onloadedmetadata = () => {
        setDuration(Math.floor(audio.duration));
      };
    }
  };

  const handleTranscriptFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setTranscriptFile(file);

      // Read the file content
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setTranscriptText(event.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !audioFile || !duration) {
      return;
    }

    setIsSubmitting(true);

    try {
      // This would be implemented in a server action
      await createChapter({
        title,
        audioFile,
        duration,
        trackNumber,
        audiobookId,
        isDraft,
        transcript: transcriptText,
      });

      router.push(`/admin/audiobooks/${audiobookId}/chapters`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveTranscript = async (asDraft = true) => {
    setIsTranscriptSaving(true);
    try {
      await saveTranscript({
        content: transcriptText,
        audiobookId,
        isDraft: asDraft,
      });

      // Show success message or notification
    } catch (error) {
      console.error(error);
    } finally {
      setIsTranscriptSaving(false);
    }
  };

  const downloadTranscript = () => {
    if (!transcriptText) return;

    const blob = new Blob([transcriptText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title || "chapter"}_transcript.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Add New Chapter
            </h1>
            <p className="text-slate-500 mt-1">
              Create a new chapter for your audiobook with transcript
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() =>
              router.push(`/admin/audiobooks/${audiobookId}/chapters`)
            }
          >
            Back to Chapters
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chapter Details Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Chapter Details
              </CardTitle>
              <CardDescription>
                Basic information about the chapter
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Chapter Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter chapter title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="trackNumber">Track Number</Label>
                <Input
                  id="trackNumber"
                  type="number"
                  value={trackNumber}
                  onChange={(e) => setTrackNumber(Number(e.target.value))}
                  min={1}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="isDraft">Save as Draft</Label>
                  <Switch
                    id="isDraft"
                    checked={isDraft}
                    onCheckedChange={setIsDraft}
                  />
                </div>
                <p className="text-sm text-slate-500">
                  {isDraft
                    ? "Chapter will be saved as a draft"
                    : "Chapter will be published immediately"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Audio Upload Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5" />
                Audio File
              </CardTitle>
              <CardDescription>
                Upload the audio file for this chapter
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="audioFile"
                  accept="audio/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {!audioPreview ? (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <Upload className="h-10 w-10 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-2">
                        Drag and drop your audio file here, or click to browse
                      </p>
                      <Button
                        variant="outline"
                        onClick={() =>
                          document.getElementById("audioFile")?.click()
                        }
                      >
                        Select Audio File
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <audio
                        ref={audioRef}
                        controls
                        src={audioPreview}
                        className="w-full max-w-md"
                      />
                    </div>

                    <div className="flex items-center justify-center gap-4">
                      {duration && (
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          <Clock className="h-3 w-3" />
                          {formatDuration(duration)}
                        </Badge>
                      )}

                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <FileText className="h-3 w-3" />
                        {audioFile?.name}
                      </Badge>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setAudioFile(null);
                        setAudioPreview(null);
                        setDuration(null);
                      }}
                    >
                      Change File
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Transcript Card */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Chapter Transcript
              </CardTitle>
              <CardDescription>
                Add a transcript for this chapter
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={transcriptTab}
                onValueChange={setTranscriptTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="write">Write Transcript</TabsTrigger>
                  <TabsTrigger value="upload">Upload Transcript</TabsTrigger>
                </TabsList>

                <TabsContent value="write" className="space-y-4">
                  <Textarea
                    placeholder="Type or paste your transcript here..."
                    className="min-h-[300px] font-mono text-sm"
                    value={transcriptText}
                    onChange={(e) => setTranscriptText(e.target.value)}
                  />
                </TabsContent>

                <TabsContent value="upload" className="space-y-4">
                  <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      id="transcriptFile"
                      accept=".txt,.srt,.vtt"
                      onChange={handleTranscriptFileChange}
                      className="hidden"
                    />

                    {!transcriptFile ? (
                      <div className="space-y-4">
                        <div className="flex justify-center">
                          <Upload className="h-10 w-10 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 mb-2">
                            Upload a transcript file (.txt, .srt, .vtt)
                          </p>
                          <Button
                            variant="outline"
                            onClick={() =>
                              document.getElementById("transcriptFile")?.click()
                            }
                          >
                            Select Transcript File
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          <FileText className="h-3 w-3" />
                          {transcriptFile.name}
                        </Badge>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setTranscriptFile(null);
                          }}
                        >
                          Change File
                        </Button>
                      </div>
                    )}
                  </div>

                  {transcriptFile && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium mb-2">Preview:</h3>
                      <div className="bg-slate-50 p-4 rounded-md border border-slate-200 max-h-[300px] overflow-y-auto">
                        <pre className="text-sm whitespace-pre-wrap">
                          {transcriptText}
                        </pre>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              {transcriptText && (
                <div className="mt-4 flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadTranscript}
                    className="flex items-center gap-1"
                  >
                    <Download className="h-4 w-4" />
                    Download Transcript
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSaveTranscript(true)}
                    disabled={isTranscriptSaving}
                    className="flex items-center gap-1"
                  >
                    <Save className="h-4 w-4" />
                    Save Draft
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSaveTranscript(false)}
                    disabled={isTranscriptSaving}
                    className="flex items-center gap-1"
                  >
                    <BookOpen className="h-4 w-4" />
                    Save & Publish
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() =>
              router.push(`/admin/audiobooks/${audiobookId}/chapters`)
            }
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !title || !audioFile}
            className="flex items-center gap-2"
          >
            {isSubmitting
              ? "Saving..."
              : isDraft
                ? "Save as Draft"
                : "Publish Chapter"}
          </Button>
        </div>
      </div>
    </div>
  );
}
