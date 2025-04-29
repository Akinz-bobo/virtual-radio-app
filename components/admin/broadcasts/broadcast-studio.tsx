"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Mic,
  MicOff,
  Play,
  Pause,
  Music,
  Volume,
  Volume2,
  VolumeX,
  Users,
  MessageSquare,
  Clock,
  AudioWaveformIcon as Waveform,
  Sliders,
  Save,
  BarChart3,
  Loader2,
  AlertCircle,
  Music2,
  Disc3,
} from "lucide-react";

import { io, Socket } from "socket.io-client";

// Audio effect presets
const AUDIO_EFFECTS = {
  none: {
    name: "None",
    gain: 1.0,
    bass: 0,
    mid: 0,
    treble: 0,
    reverb: 0,
    compression: 0,
  },
  voice: {
    name: "Voice Clarity",
    gain: 1.2,
    bass: 2,
    mid: 3,
    treble: 1,
    reverb: 0.1,
    compression: 0.3,
  },
  warm: {
    name: "Warm & Rich",
    gain: 1.1,
    bass: 4,
    mid: 1,
    treble: -1,
    reverb: 0.2,
    compression: 0.4,
  },
  bright: {
    name: "Bright & Clear",
    gain: 1.0,
    bass: -2,
    mid: 0,
    treble: 4,
    reverb: 0.1,
    compression: 0.2,
  },
  broadcast: {
    name: "Broadcast",
    gain: 1.3,
    bass: 2,
    mid: 2,
    treble: 2,
    reverb: 0,
    compression: 0.5,
  },
  intimate: {
    name: "Intimate",
    gain: 0.9,
    bass: 1,
    mid: 0,
    treble: -1,
    reverb: 0.3,
    compression: 0.2,
  },
};

// Background music tracks
const BACKGROUND_TRACKS = [
  {
    id: "1",
    name: "Smooth Jazz",
    artist: "Studio Session",
    duration: "3:42",
    volume: 0.3,
  },
  {
    id: "2",
    name: "Ambient Flow",
    artist: "Atmosphere",
    duration: "4:15",
    volume: 0.25,
  },
  {
    id: "3",
    name: "Soft Piano",
    artist: "Classical Moods",
    duration: "2:58",
    volume: 0.2,
  },
  {
    id: "4",
    name: "Electronic Beats",
    artist: "Digital Waves",
    duration: "3:30",
    volume: 0.15,
  },
  {
    id: "5",
    name: "Acoustic Guitar",
    artist: "String Sessions",
    duration: "3:05",
    volume: 0.3,
  },
];

// Sound effects
const SOUND_EFFECTS = [
  {
    id: "1",
    name: "Applause",
    icon: "👏",
    color: "bg-green-100 text-green-800",
  },
  {
    id: "2",
    name: "Laughter",
    icon: "😂",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    id: "3",
    name: "Drum Roll",
    icon: "🥁",
    color: "bg-purple-100 text-purple-800",
  },
  { id: "4", name: "Bell", icon: "🔔", color: "bg-blue-100 text-blue-800" },
  { id: "5", name: "Horn", icon: "📯", color: "bg-red-100 text-red-800" },
  {
    id: "6",
    name: "Whoosh",
    icon: "💨",
    color: "bg-indigo-100 text-indigo-800",
  },
];

// Mock listener data
const MOCK_LISTENERS = [
  { id: "1", name: "John Doe", location: "New York, USA", time: "45:12" },
  { id: "2", name: "Jane Smith", location: "London, UK", time: "32:05" },
  { id: "3", name: "Alex Johnson", location: "Toronto, Canada", time: "28:47" },
  { id: "4", name: "Maria Garcia", location: "Madrid, Spain", time: "15:33" },
  { id: "5", name: "Hiroshi Tanaka", location: "Tokyo, Japan", time: "10:21" },
  { id: "6", name: "Sophie Martin", location: "Paris, France", time: "8:15" },
  { id: "7", name: "Mohammed Ali", location: "Dubai, UAE", time: "5:02" },
  { id: "8", name: "Anonymous", location: "Unknown", time: "2:45" },
];

// Mock chat messages
const MOCK_CHAT = [
  {
    id: "1",
    name: "John Doe",
    message: "Great show today!",
    time: "2 min ago",
  },
  {
    id: "2",
    name: "Jane Smith",
    message: "Can you play some jazz next?",
    time: "5 min ago",
  },
  {
    id: "3",
    name: "Alex Johnson",
    message: "Loving the interview!",
    time: "8 min ago",
  },
  {
    id: "4",
    name: "Maria Garcia",
    message: "Hello from Spain!",
    time: "12 min ago",
  },
  {
    id: "5",
    name: "System",
    message: "Broadcast started",
    time: "15 min ago",
    isSystem: true,
  },
];

interface BroadcastStudioProps {
  broadcastId: string;
  broadcastData: {
    id: string;
    title: string;
    host: string;
    description?: string;
    schedule: string;
    status: string;
    startTime: string;
    endTime: string;
  };
  onStatusChange?: (status: string) => void;
}

export default function BroadcastStudio({
  broadcastId,
  broadcastData,
  onStatusChange,
}: BroadcastStudioProps) {
  const { addNotification } = useNotifications();
  const [isLive, setIsLive] = useState(broadcastData.status === "live");
  const [isMicActive, setIsMicActive] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [micVolume, setMicVolume] = useState(80);
  const [masterVolume, setMasterVolume] = useState(100);
  const [musicVolume, setMusicVolume] = useState(30);
  const [selectedEffect, setSelectedEffect] = useState("broadcast");
  const [selectedMusic, setSelectedMusic] = useState<string | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [listenerCount, setListenerCount] = useState(8);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [notes, setNotes] = useState("");
  const [equalizerValues, setEqualizerValues] = useState({
    bass: AUDIO_EFFECTS[selectedEffect].bass,
    mid: AUDIO_EFFECTS[selectedEffect].mid,
    treble: AUDIO_EFFECTS[selectedEffect].treble,
    reverb: AUDIO_EFFECTS[selectedEffect].reverb,
    compression: AUDIO_EFFECTS[selectedEffect].compression,
  });

  // Audio context and nodes
  const audioContextRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const micSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize audio context and setup visualizer
  // useEffect(() => {
  //   if (isLive) {
  //     // Create audio context
  //     audioContextRef.current = new AudioContext();

  //     // Create analyzer for visualizations
  //     const analyser = audioContextRef.current.createAnalyser();
  //     analyser.fftSize = 256;
  //     analyserRef.current = analyser;

  //     // Create gain node for volume control
  //     const gainNode = audioContextRef.current.createGain();
  //     gainNode.gain.value = masterVolume / 100;
  //     gainNodeRef.current = gainNode;

  //     // Connect nodes
  //     gainNode.connect(analyser);
  //     analyser.connect(audioContextRef.current.destination);

  //     // Setup visualizer
  //     setupVisualizer();

  //     return () => {
  //       if (animationFrameRef.current) {
  //         cancelAnimationFrame(animationFrameRef.current);
  //       }
  //       if (audioContextRef.current?.state !== "closed") {
  //         audioContextRef.current?.close();
  //       }
  //     };
  //   }
  // }, [isLive]);

  useEffect(() => {
    const socketInstance = io("/api/socket", {
      path: "/api/socket",
      transports: ["websocket"],
    });

    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("🔌 Connected to WebSocket server:", socketInstance.id);
      socketInstance.emit("admin:join-broadcast", { broadcastId });
    });

    socketInstance.on("listener:count", (count: number) => {
      setListenerCount(count);
    });

    socketInstance.on("broadcast:status", (status: string) => {
      setIsLive(status === "live");
      addNotification({
        title: `Broadcast ${status === "live" ? "Started" : "Paused"}`,
        message: `The broadcast is now ${status}.`,
        type: status === "live" ? "success" : "info",
      });
    });

    socketInstance.on("disconnect", () => {
      console.log("❌ Disconnected from WebSocket server");
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [broadcastId, addNotification]);
  // Cleanup audio context on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current?.state !== "closed") {
        audioContextRef.current?.close();
      }
    };
  }, []);

  // Update gain node when master volume changes
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = masterVolume / 100;
    }
  }, [masterVolume]);

  // Update equalizer when effect changes
  useEffect(() => {
    const effect = AUDIO_EFFECTS[selectedEffect];
    setEqualizerValues({
      bass: effect.bass,
      mid: effect.mid,
      treble: effect.treble,
      reverb: effect.reverb,
      compression: effect.compression,
    });
  }, [selectedEffect]);

  // Setup audio visualizer
  const setupVisualizer = () => {
    if (!canvasRef.current || !analyserRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const width = canvas.width;
    const height = canvas.height;

    const renderFrame = () => {
      animationFrameRef.current = requestAnimationFrame(renderFrame);

      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = "rgb(20, 20, 30)";
      ctx.fillRect(0, 0, width, height);

      const barWidth = (width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * height;

        // Use studio color gradient
        const r = 0;
        const g = 105 + dataArray[i] / 2;
        const b = 105 + dataArray[i] / 2;

        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fillRect(x, height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    };

    renderFrame();
  };

  // Toggle microphone
  // const toggleMicrophone = async () => {
  //   if (!audioContextRef.current) return;

  //   if (!isMicActive) {
  //     try {
  //       // Request microphone access
  //       const stream = await navigator.mediaDevices.getUserMedia({
  //         audio: true,
  //       });
  //       micStreamRef.current = stream;

  //       // Create source from microphone
  //       const micSource =
  //         audioContextRef.current.createMediaStreamSource(stream);
  //       micSourceRef.current = micSource;

  //       // Connect to gain node
  //       micSource.connect(gainNodeRef.current!);

  //       setIsMicActive(true);
  //       addNotification({
  //         title: "Microphone Active",
  //         message: "Your voice is now being broadcast to listeners.",
  //         type: "success",
  //       });
  //     } catch (error) {
  //       console.error("Error accessing microphone:", error);
  //       addNotification({
  //         title: "Microphone Error",
  //         message:
  //           "Could not access your microphone. Please check permissions.",
  //         type: "error",
  //       });
  //     }
  //   } else {
  //     // Stop microphone
  //     if (micStreamRef.current) {
  //       micStreamRef.current.getTracks().forEach((track) => track.stop());
  //       micStreamRef.current = null;
  //     }

  //     if (micSourceRef.current) {
  //       micSourceRef.current.disconnect();
  //       micSourceRef.current = null;
  //     }

  //     setIsMicActive(false);
  //     addNotification({
  //       title: "Microphone Disabled",
  //       message: "Your microphone has been turned off.",
  //       type: "info",
  //     });
  //   }
  // };

  const toggleMicrophone = async () => {
    if (!audioContextRef.current || !socket) return;

    if (!isMicActive) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        micStreamRef.current = stream;

        const micSource =
          audioContextRef.current.createMediaStreamSource(stream);
        micSourceRef.current = micSource;

        micSource.connect(gainNodeRef.current!);

        setIsMicActive(true);
        addNotification({
          title: "Microphone Active",
          message: "Your voice is now being broadcast to listeners.",
          type: "success",
        });

        socket.emit("admin:mic-active", { broadcastId });
      } catch (error) {
        console.error("Error accessing microphone:", error);
        console.error("Error accessing microphone:", error);
        addNotification({
          title: "Microphone Error",
          message:
            "Could not access your microphone. Please check permissions.",
          type: "error",
        });
      }
    } else {
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((track) => track.stop());
        micStreamRef.current = null;
      }

      if (micSourceRef.current) {
        micSourceRef.current.disconnect();
        micSourceRef.current = null;
      }

      setIsMicActive(false);
      addNotification({
        title: "Microphone Disabled",
        message: "Your microphone has been turned off.",
        type: "info",
      });

      socket.emit("admin:mic-inactive", { broadcastId });
    }
  };

  // Toggle broadcast status
  // const toggleBroadcastStatus = async () => {
  //   setIsLoading(true);

  //   try {
  //     // Simulate API call
  //     await new Promise((resolve) => setTimeout(resolve, 1500));

  //     const newStatus = isLive ? "paused" : "live";
  //     setIsLive(!isLive);

  //     if (onStatusChange) {
  //       onStatusChange(newStatus);
  //     }

  //     addNotification({
  //       title: isLive ? "Broadcast Paused" : "Broadcast Live",
  //       message: isLive
  //         ? `"${broadcastData.title}" has been paused.`
  //         : `"${broadcastData.title}" is now live and streaming!`,
  //       type: "success",
  //     });

  //     // If going live, start listener counter simulation
  //     if (!isLive) {
  //       simulateListeners();
  //     }
  //   } catch (error) {
  //     console.error("Error toggling broadcast status:", error);
  //     addNotification({
  //       title: "Error",
  //       message: "Failed to change broadcast status. Please try again.",
  //       type: "error",
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const toggleBroadcastStatus = async () => {
    if (!socket) return;

    try {
      addNotification({
        title: isLive ? "Broadcast Paused" : "Broadcast Live",
        message: isLive
          ? `"${broadcastData.title}" has been paused.`
          : `"${broadcastData.title}" is now live and streaming!`,
        type: "success",
      });
      if (isLive) {
        socket.emit("admin:pause-broadcast", { broadcastId });
      } else {
        socket.emit("admin:start-broadcast", { broadcastId });
      }
    } catch (error) {
      console.error("Error toggling broadcast status:", error);
      addNotification({
        title: "Error",
        message: "Failed to change broadcast status. Please try again.",
        type: "error",
      });
    }
  };

  // End broadcast
  // const endBroadcast = async () => {
  //   setIsLoading(true);

  //   try {
  //     // Simulate API call
  //     await new Promise((resolve) => setTimeout(resolve, 1500));

  //     // Stop microphone if active
  //     if (isMicActive) {
  //       if (micStreamRef.current) {
  //         micStreamRef.current.getTracks().forEach((track) => track.stop());
  //       }
  //       setIsMicActive(false);
  //     }

  //     // Update status
  //     if (onStatusChange) {
  //       onStatusChange("ended");
  //     }

  //     addNotification({
  //       title: "Broadcast Ended",
  //       message: `"${broadcastData.title}" has been ended successfully.`,
  //       type: "info",
  //     });

  //     // Redirect to broadcasts list
  //     window.location.href = "/admin/broadcasts";
  //   } catch (error) {
  //     console.error("Error ending broadcast:", error);
  //     addNotification({
  //       title: "Error",
  //       message: "Failed to end broadcast. Please try again.",
  //       type: "error",
  //     });
  //     setIsLoading(false);
  //   }
  // };

  const endBroadcast = async () => {
    if (!socket) return;

    setIsLoading(true);

    try {
      socket.emit("admin:end-broadcast", { broadcastId });

      // Stop microphone if active
      if (isMicActive) {
        if (micStreamRef.current) {
          micStreamRef.current.getTracks().forEach((track) => track.stop());
        }
        setIsMicActive(false);
      }

      // Update status
      setIsLive(false);
      if (onStatusChange) {
        onStatusChange("ended");
      }

      addNotification({
        title: "Broadcast Ended",
        message: `"${broadcastData.title}" has been ended successfully.`,
        type: "info",
      });

      // Redirect to broadcasts list
      window.location.href = "/admin/broadcasts";
    } catch (error) {
      console.error("Error ending broadcast:", error);
      addNotification({
        title: "Error",
        message: "Failed to end broadcast. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle background music
  const toggleBackgroundMusic = (trackId: string) => {
    if (selectedMusic === trackId && isMusicPlaying) {
      setIsMusicPlaying(false);
      addNotification({
        title: "Music Paused",
        message: `Background music has been paused.`,
        type: "info",
      });
    } else {
      setSelectedMusic(trackId);
      setIsMusicPlaying(true);
      const track = BACKGROUND_TRACKS.find((t) => t.id === trackId);
      addNotification({
        title: "Music Playing",
        message: `Now playing: ${track?.name} by ${track?.artist}`,
        type: "success",
      });
    }
  };

  // Play sound effect
  const playEffect = (effectId: string) => {
    const effect = SOUND_EFFECTS.find((e) => e.id === effectId);
    addNotification({
      title: "Sound Effect",
      message: `Played "${effect?.name}" sound effect`,
      type: "info",
    });
  };

  // Simulate increasing listener count
  const simulateListeners = () => {
    const interval = setInterval(() => {
      setListenerCount((prev) => {
        const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        return Math.max(8, prev + change);
      });
    }, 5000);

    return () => clearInterval(interval);
  };

  // Format time as HH:MM:SS
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Calculate broadcast duration
  const calculateDuration = () => {
    const start = new Date(broadcastData.startTime);
    const now = new Date();
    const diffMs = now.getTime() - start.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const diffSecs = Math.floor((diffMs % (1000 * 60)) / 1000);

    return `${diffHrs.toString().padStart(2, "0")}:${diffMins.toString().padStart(2, "0")}:${diffSecs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Broadcast header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-studio-50 dark:bg-studio-900/20 p-4 rounded-lg border border-studio-200 dark:border-studio-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{broadcastData.title}</h1>
            <Badge className={isLive ? "bg-green-500" : "bg-orange-500"}>
              {isLive ? "LIVE" : "PAUSED"}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Hosted by {broadcastData.host} • {broadcastData.schedule}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <div className="text-sm text-muted-foreground">
              Started at {formatTime(broadcastData.startTime)}
            </div>
            <div className="text-sm font-medium">{calculateDuration()}</div>
          </div>

          <AlertDialog open={showEndConfirm} onOpenChange={setShowEndConfirm}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">End Broadcast</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>End this broadcast?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will end the current broadcast and disconnect all
                  listeners. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={endBroadcast} disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  End Broadcast
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main broadcast controls */}
        <div className="lg:col-span-2 space-y-6">
          {/* Audio visualizer and main controls */}
          <Card className="border-studio-200 dark:border-studio-800">
            <CardHeader className="pb-2">
              <CardTitle>Broadcast Studio</CardTitle>
              <CardDescription>
                Control your live broadcast and audio settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Audio visualizer */}
              <div className="relative h-40 bg-studio-900/90 rounded-md overflow-hidden">
                <canvas
                  ref={canvasRef}
                  className="w-full h-full"
                  width={800}
                  height={160}
                ></canvas>

                {!isLive && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="text-center">
                      <AlertCircle className="h-10 w-10 text-studio-300 mx-auto mb-2" />
                      <p className="text-white font-medium">
                        Broadcast is paused
                      </p>
                      <p className="text-studio-300 text-sm">
                        Click "Go Live" to start broadcasting
                      </p>
                    </div>
                  </div>
                )}

                {/* Listener count */}
                <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center">
                  <Users className="h-3 w-3 mr-1" />
                  {listenerCount} listeners
                </div>
              </div>

              {/* Main controls */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Go Live button */}
                <div className="flex flex-col items-center justify-center">
                  <Button
                    className={`w-full h-16 text-lg font-medium ${
                      isLive
                        ? "bg-orange-500 hover:bg-orange-600"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                    onClick={toggleBroadcastStatus}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    ) : isLive ? (
                      <Pause className="h-5 w-5 mr-2" />
                    ) : (
                      <Play className="h-5 w-5 mr-2" />
                    )}
                    {isLive ? "Pause Broadcast" : "Go Live"}
                  </Button>
                </div>

                {/* Microphone control */}
                <div className="flex flex-col items-center justify-center">
                  <Button
                    className={`w-full h-16 text-lg font-medium ${
                      isMicActive
                        ? "bg-studio-600 hover:bg-studio-700"
                        : "bg-studio-500 hover:bg-studio-600"
                    }`}
                    onClick={toggleMicrophone}
                    disabled={!isLive}
                  >
                    {isMicActive ? (
                      <MicOff className="h-5 w-5 mr-2" />
                    ) : (
                      <Mic className="h-5 w-5 mr-2" />
                    )}
                    {isMicActive ? "Mute Mic" : "Activate Mic"}
                  </Button>
                </div>

                {/* Master volume */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Master Volume</Label>
                    <span className="text-xs text-muted-foreground">
                      {masterVolume}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setMasterVolume(0)}
                    >
                      <VolumeX className="h-4 w-4" />
                    </Button>
                    <Slider
                      value={[masterVolume]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(value) => setMasterVolume(value[0])}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setMasterVolume(100)}
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Audio settings tabs */}
          <Tabs defaultValue="effects" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="effects" className="flex items-center gap-1">
                <Sliders className="h-4 w-4" />
                <span>Audio Effects</span>
              </TabsTrigger>
              <TabsTrigger value="music" className="flex items-center gap-1">
                <Music className="h-4 w-4" />
                <span>Background Music</span>
              </TabsTrigger>
              <TabsTrigger
                value="soundboard"
                className="flex items-center gap-1"
              >
                <Waveform className="h-4 w-4" />
                <span>Sound Effects</span>
              </TabsTrigger>
            </TabsList>

            {/* Audio effects tab */}
            <TabsContent value="effects">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    Voice Effects & Equalizer
                  </CardTitle>
                  <CardDescription>
                    Enhance your voice with professional audio effects
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Effect presets */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {Object.entries(AUDIO_EFFECTS).map(([key, effect]) => (
                      <Button
                        key={key}
                        variant={selectedEffect === key ? "default" : "outline"}
                        className={
                          selectedEffect === key
                            ? "bg-studio-600 hover:bg-studio-700"
                            : ""
                        }
                        onClick={() => setSelectedEffect(key)}
                      >
                        {effect.name}
                      </Button>
                    ))}
                  </div>

                  {/* Equalizer sliders */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Bass</Label>
                        <span className="text-xs text-muted-foreground">
                          {equalizerValues.bass > 0 ? "+" : ""}
                          {equalizerValues.bass}
                        </span>
                      </div>
                      <Slider
                        value={[equalizerValues.bass]}
                        min={-10}
                        max={10}
                        step={1}
                        onValueChange={(value) =>
                          setEqualizerValues({
                            ...equalizerValues,
                            bass: value[0],
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Mid</Label>
                        <span className="text-xs text-muted-foreground">
                          {equalizerValues.mid > 0 ? "+" : ""}
                          {equalizerValues.mid}
                        </span>
                      </div>
                      <Slider
                        value={[equalizerValues.mid]}
                        min={-10}
                        max={10}
                        step={1}
                        onValueChange={(value) =>
                          setEqualizerValues({
                            ...equalizerValues,
                            mid: value[0],
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Treble</Label>
                        <span className="text-xs text-muted-foreground">
                          {equalizerValues.treble > 0 ? "+" : ""}
                          {equalizerValues.treble}
                        </span>
                      </div>
                      <Slider
                        value={[equalizerValues.treble]}
                        min={-10}
                        max={10}
                        step={1}
                        onValueChange={(value) =>
                          setEqualizerValues({
                            ...equalizerValues,
                            treble: value[0],
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* Advanced effects */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Reverb</Label>
                        <span className="text-xs text-muted-foreground">
                          {(equalizerValues.reverb * 100).toFixed(0)}%
                        </span>
                      </div>
                      <Slider
                        value={[equalizerValues.reverb]}
                        min={0}
                        max={1}
                        step={0.01}
                        onValueChange={(value) =>
                          setEqualizerValues({
                            ...equalizerValues,
                            reverb: value[0],
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Compression</Label>
                        <span className="text-xs text-muted-foreground">
                          {(equalizerValues.compression * 100).toFixed(0)}%
                        </span>
                      </div>
                      <Slider
                        value={[equalizerValues.compression]}
                        min={0}
                        max={1}
                        step={0.01}
                        onValueChange={(value) =>
                          setEqualizerValues({
                            ...equalizerValues,
                            compression: value[0],
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* Microphone settings */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">
                        Microphone Volume
                      </Label>
                      <span className="text-xs text-muted-foreground">
                        {micVolume}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setMicVolume(0)}
                      >
                        <VolumeX className="h-4 w-4" />
                      </Button>
                      <Slider
                        value={[micVolume]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={(value) => setMicVolume(value[0])}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setMicVolume(100)}
                      >
                        <Mic className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedEffect("none")}
                  >
                    Reset to Default
                  </Button>
                  <Button className="bg-studio-600 hover:bg-studio-700">
                    <Save className="h-4 w-4 mr-2" />
                    Save Preset
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Background music tab */}
            <TabsContent value="music">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Background Music</CardTitle>
                  <CardDescription>
                    Add background music to your broadcast
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Music volume */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">
                        Music Volume
                      </Label>
                      <span className="text-xs text-muted-foreground">
                        {musicVolume}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setMusicVolume(0)}
                      >
                        <VolumeX className="h-4 w-4" />
                      </Button>
                      <Slider
                        value={[musicVolume]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={(value) => setMusicVolume(value[0])}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setMusicVolume(50)}
                      >
                        <Volume className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Music tracks */}
                  <div className="space-y-2">
                    <Label>Available Tracks</Label>
                    <div className="space-y-2">
                      {BACKGROUND_TRACKS.map((track) => (
                        <div
                          key={track.id}
                          className={`flex items-center justify-between p-3 rounded-md ${
                            selectedMusic === track.id && isMusicPlaying
                              ? "bg-studio-100 dark:bg-studio-900/40 border border-studio-300 dark:border-studio-700"
                              : "bg-muted"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Button
                              variant="ghost"
                              size="icon"
                              className={`h-8 w-8 rounded-full ${
                                selectedMusic === track.id && isMusicPlaying
                                  ? "bg-studio-500 text-white hover:bg-studio-600"
                                  : ""
                              }`}
                              onClick={() => toggleBackgroundMusic(track.id)}
                            >
                              {selectedMusic === track.id && isMusicPlaying ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </Button>
                            <div>
                              <p className="font-medium">{track.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {track.artist}
                              </p>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {track.duration}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Upload custom track */}
                  <div className="pt-2">
                    <Label>Upload Custom Track</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <Input type="file" accept="audio/*" />
                      <Button className="whitespace-nowrap">
                        <Music2 className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex items-center gap-2 w-full">
                    <Switch id="auto-fade" />
                    <Label htmlFor="auto-fade">
                      Auto-fade music when speaking
                    </Label>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Sound effects tab */}
            <TabsContent value="soundboard">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Sound Effects</CardTitle>
                  <CardDescription>
                    Add sound effects to your broadcast
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {SOUND_EFFECTS.map((effect) => (
                      <Button
                        key={effect.id}
                        variant="outline"
                        className={`h-16 ${effect.color}`}
                        onClick={() => playEffect(effect.id)}
                      >
                        <span className="text-xl mr-2">{effect.icon}</span>
                        {effect.name}
                      </Button>
                    ))}

                    {/* Add custom effect button */}
                    <Button variant="outline" className="h-16 border-dashed">
                      <Disc3 className="h-4 w-4 mr-2" />
                      Add Custom Effect
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar with listeners, chat, and notes */}
        <div className="space-y-6">
          {/* Listeners */}
          <Card className="border-studio-200 dark:border-studio-800">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Live Listeners</CardTitle>
                <Badge variant="outline" className="font-normal">
                  <Users className="h-3 w-3 mr-1" />
                  {listenerCount}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[180px]">
                <div className="space-y-2">
                  {MOCK_LISTENERS.map((listener) => (
                    <div
                      key={listener.id}
                      className="flex items-center justify-between p-2 rounded-md bg-muted"
                    >
                      <div>
                        <p className="font-medium">{listener.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {listener.location}
                        </p>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {listener.time}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Live chat */}
          <Card className="border-studio-200 dark:border-studio-800">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Live Chat</CardTitle>
                <Badge variant="outline" className="font-normal">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  {MOCK_CHAT.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                <div className="space-y-3">
                  {MOCK_CHAT.map((message) => (
                    <div
                      key={message.id}
                      className={`p-2 rounded-md ${message.isSystem ? "bg-muted text-center" : "bg-muted"}`}
                    >
                      {!message.isSystem && (
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium">{message.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {message.time}
                          </p>
                        </div>
                      )}
                      <p
                        className={
                          message.isSystem
                            ? "text-xs text-muted-foreground"
                            : "text-sm"
                        }
                      >
                        {message.message}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="flex items-center gap-2 mt-3">
                <Input placeholder="Send a message..." />
                <Button>Send</Button>
              </div>
            </CardContent>
          </Card>

          {/* Broadcast notes */}
          <Card className="border-studio-200 dark:border-studio-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Broadcast Notes</CardTitle>
              <CardDescription>
                Keep track of important points and reminders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Type your notes here..."
                className="min-h-[120px]"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Clear</Button>
              <Button className="bg-studio-600 hover:bg-studio-700">
                <Save className="h-4 w-4 mr-2" />
                Save Notes
              </Button>
            </CardFooter>
          </Card>

          {/* Broadcast stats */}
          <Card className="border-studio-200 dark:border-studio-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Broadcast Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Peak Listeners:</span>
                  <span className="font-medium">{listenerCount + 3}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Average Listening Time:
                  </span>
                  <span className="font-medium">18:24</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Chat Messages:</span>
                  <span className="font-medium">{MOCK_CHAT.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Broadcast Quality:
                  </span>
                  <span className="font-medium text-green-600">Excellent</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Detailed Analytics
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
