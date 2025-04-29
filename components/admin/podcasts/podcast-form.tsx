"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useNotifications } from "@/contexts/notifications-context";
import { ArrowLeft, Loader2 } from "lucide-react";
import Image from "next/image";

// Define form schema with Zod
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  imageUrl: z.string().optional(),
});

// Define props interface
interface PodcastFormProps {
  podcast?: any; // For editing existing podcast
  isEdit?: boolean;
}

export default function PodcastForm({
  podcast,
  isEdit = false,
}: PodcastFormProps) {
  const router = useRouter();
  const { addNotification } = useNotifications();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    podcast?.imageUrl || null
  );
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Initialize form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: podcast?.title || "",
      author: podcast?.author || "",
      description: podcast?.description || "",
      category: podcast?.category || "",
      imageUrl: podcast?.imageUrl || "",
    },
  });

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    try {
      // Simulate API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app, this would be an API call to upload the image and save the podcast
      console.log("Form values:", values);
      console.log("Image file:", imageFile);

      // Show success notification
      addNotification({
        title: isEdit ? "Podcast Updated" : "Podcast Created",
        message: isEdit
          ? `"${values.title}" has been updated successfully.`
          : `"${values.title}" has been created successfully.`,
        type: "success",
      });

      // Redirect back to podcasts list
      router.push("/admin/podcasts");
    } catch (error) {
      console.error("Error submitting form:", error);

      // Show error notification
      addNotification({
        title: "Error",
        message: isEdit
          ? "Failed to update podcast. Please try again."
          : "Failed to create podcast. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">
          {isEdit ? "Edit Podcast" : "New Podcast"}
        </h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter podcast title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author/Host</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter author or host name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Business">Business</SelectItem>
                        <SelectItem value="Arts">Arts</SelectItem>
                        <SelectItem value="Comedy">Comedy</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Fiction">Fiction</SelectItem>
                        <SelectItem value="Health">Health & Fitness</SelectItem>
                        <SelectItem value="History">History</SelectItem>
                        <SelectItem value="News">News</SelectItem>
                        <SelectItem value="Science">Science</SelectItem>
                        <SelectItem value="Society">
                          Society & Culture
                        </SelectItem>
                        <SelectItem value="Sports">Sports</SelectItem>
                        <SelectItem value="True Crime">True Crime</SelectItem>
                        <SelectItem value="Wellness">Wellness</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter podcast description"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-6">
              <FormItem>
                <FormLabel>Cover Image</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="cursor-pointer"
                  />
                </FormControl>
                <FormDescription>
                  Upload a square image for best results. Recommended size:
                  1400x1400 pixels.
                </FormDescription>
                {imagePreview && (
                  <Card className="mt-2 overflow-hidden">
                    <CardContent className="p-2">
                      <div className="relative aspect-square w-full max-w-[300px] mx-auto">
                        <Image
                          src={imagePreview || "/placeholder.svg"}
                          alt="Cover preview"
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </FormItem>

              {isEdit && podcast?.episodes?.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Episodes</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    This podcast has {podcast.episodes.length} episode(s).
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      router.push(`/admin/podcasts/${podcast.id}/episodes`)
                    }
                  >
                    Manage Episodes
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isEdit ? "Update Podcast" : "Create Podcast"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
