"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Heart, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { toggleFavoriteAudiobook } from "@/app/audiobooks/actions"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface AudiobookCardProps {
  id: string
  title: string
  author: string
  image: string
  category?: string
  rating?: number
  isFavorite?: boolean
  onPlay?: () => void
  className?: string
}

export function AudiobookCard({
  id,
  title,
  author,
  image,
  category,
  rating,
  isFavorite: initialIsFavorite = false,
  onPlay,
  className,
}: AudiobookCardProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsLoading(true)
    try {
      const result = await toggleFavoriteAudiobook({
        id,
        title,
        image,
        author,
      })

      if (result.success) {
        setIsFavorite(result.isFavorite)
        toast({
          title: result.isFavorite ? "Added to favorites" : "Removed from favorites",
          description: result.isFavorite
            ? `${title} has been added to your favorites`
            : `${title} has been removed from your favorites`,
          duration: 3000,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onPlay) onPlay()
  }

  // Generate stars for rating
  const renderRating = () => {
    if (!rating) return null

    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-3 w-3 fill-yellow-400 text-yellow-400" />)
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-3 w-3 text-yellow-400" />)
    }

    const emptyStars = 5 - stars.length
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-3 w-3 text-gray-300" />)
    }

    return (
      <div className="flex items-center gap-0.5">
        {stars}
        <span className="ml-1 text-xs text-muted-foreground">{rating.toFixed(1)}</span>
      </div>
    )
  }

  return (
    <Link href={`/audiobooks/${id}`}>
      <Card className={cn("overflow-hidden transition-all hover:shadow-md h-full", className)}>
        <div className="relative aspect-[2/3]">
          <Image src={image || "/placeholder.svg?height=600&width=400"} alt={title} fill className="object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full bg-white hover:bg-white/90 h-12 w-12"
              onClick={handlePlayClick}
            >
              <Play className="h-5 w-5 text-purple-700 fill-current" />
              <span className="sr-only">Play {title}</span>
            </Button>
          </div>

          {category && (
            <div className="absolute top-3 left-3 bg-purple-600 text-white text-xs font-medium px-2 py-1 rounded-full">
              {category}
            </div>
          )}

          <Button
            size="icon"
            variant="ghost"
            className={cn(
              "absolute bottom-3 right-3 rounded-full bg-white/80 hover:bg-white",
              isFavorite && "text-red-500 hover:text-red-600",
            )}
            disabled={isLoading}
            onClick={handleFavoriteClick}
          >
            <Heart className={cn("h-5 w-5", isFavorite && "fill-current")} />
            <span className="sr-only">{isFavorite ? "Remove from favorites" : "Add to favorites"}</span>
          </Button>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-1 line-clamp-1">{title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-1 mb-2">by {author}</p>
          {renderRating()}
        </CardContent>
      </Card>
    </Link>
  )
}
