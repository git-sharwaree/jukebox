"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronUp, ChevronDown, Play, Users, Clock, Share2, Copy, Check } from "lucide-react"

interface QueueItem {
  id: string
  videoId: string
  title: string
  thumbnail: string
  submittedBy: string
  votes: number
  duration: string
}

// Mock initial queue data
const initialQueue: QueueItem[] = [
  {
    id: "1",
    videoId: "dQw4w9WgXcQ",
    title: "Rick Astley - Never Gonna Give You Up",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
    submittedBy: "User123",
    votes: 15,
    duration: "3:33",
  },
  {
    id: "2",
    videoId: "L_jWHffIx5E",
    title: "Smash Mouth - All Star",
    thumbnail: "https://img.youtube.com/vi/L_jWHffIx5E/mqdefault.jpg",
    submittedBy: "MusicFan",
    votes: 12,
    duration: "3:20",
  },
  {
    id: "3",
    videoId: "9bZkp7q19f0",
    title: "PSY - GANGNAM STYLE",
    thumbnail: "https://img.youtube.com/vi/9bZkp7q19f0/mqdefault.jpg",
    submittedBy: "KPopLover",
    votes: 8,
    duration: "4:13",
  },
]

const currentlyPlaying: QueueItem = {
  id: "current",
  videoId: "fJ9rUzIMcZQ",
  title: "Queen - Bohemian Rhapsody",
  thumbnail: "https://img.youtube.com/vi/fJ9rUzIMcZQ/mqdefault.jpg",
  submittedBy: "RockFan",
  votes: 25,
  duration: "5:55",
}

function extractVideoId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
  const match = url.match(regex)
  return match ? match[1] : null
}

export default function SongVotingApp() {
  const [queue, setQueue] = useState<QueueItem[]>(initialQueue)
  const [newVideoUrl, setNewVideoUrl] = useState("")
  const [previewVideo, setPreviewVideo] = useState<{ videoId: string; title: string } | null>(null)
  const [submitterName, setSubmitterName] = useState("")
  const [isSharing, setIsSharing] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  const handleUrlChange = (url: string) => {
    setNewVideoUrl(url)
    const videoId = extractVideoId(url)
    if (videoId) {
      // In a real app, you'd fetch the video title from YouTube API
      setPreviewVideo({
        videoId,
        title: "Loading video title...",
      })
    } else {
      setPreviewVideo(null)
    }
  }

  const handleSubmitVideo = () => {
    if (!previewVideo || !submitterName.trim()) return

    const newItem: QueueItem = {
      id: Date.now().toString(),
      videoId: previewVideo.videoId,
      title: previewVideo.title,
      thumbnail: `https://img.youtube.com/vi/${previewVideo.videoId}/mqdefault.jpg`,
      submittedBy: submitterName,
      votes: 0,
      duration: "0:00",
    }

    setQueue((prev) => [...prev, newItem])
    setNewVideoUrl("")
    setPreviewVideo(null)
    setSubmitterName("")
  }

  const handleVote = (id: string, increment: number) => {
    setQueue((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, votes: Math.max(0, item.votes + increment) } : item))
        .sort((a, b) => b.votes - a.votes),
    )
  }

  const handleShare = async () => {
    setIsSharing(true)
    const shareData = {
      title: "🎵 Stream Song Queue - Vote for the next song!",
      text: "Help choose the next song to be played on the stream! Submit your favorites and vote.",
      url: window.location.href,
    }

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData)
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(window.location.href)
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      }
    } catch (error) {
      // If clipboard fails, try the old method
      try {
        await navigator.clipboard.writeText(window.location.href)
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      } catch (clipboardError) {
        console.error("Failed to share or copy:", clipboardError)
      }
    } finally {
      setIsSharing(false)
    }
  }

  const sortedQueue = [...queue].sort((a, b) => b.votes - a.votes)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8 relative">
          <div className="absolute top-0 right-0">
            <Button
              onClick={handleShare}
              disabled={isSharing}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg"
            >
              {copySuccess ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 mr-2" />
                  {isSharing ? "Sharing..." : "Share"}
                </>
              )}
            </Button>
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            🎵 Stream Song Queue
          </h1>
          <p className="text-gray-300">Vote for the next song to be played on the stream!</p>
          <div className="mt-4 p-4 bg-black/20 rounded-lg backdrop-blur-sm border border-purple-500/30 max-w-2xl mx-auto">
            <p className="text-sm text-gray-300 mb-2">
              <strong className="text-white">Creators:</strong> Share this page with your viewers so they can vote and
              submit songs!
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
              <Copy className="w-3 h-3" />
              <span className="font-mono bg-black/30 px-2 py-1 rounded">
                {typeof window !== "undefined" ? window.location.href : "Loading..."}
              </span>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Current Playing Video */}
          <div className="lg:col-span-2">
            <Card className="bg-black/20 border-purple-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Play className="w-5 h-5 text-green-400" />
                  Now Playing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video rounded-lg overflow-hidden mb-4">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${currentlyPlaying.videoId}?autoplay=1`}
                    title={currentlyPlaying.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-white">{currentlyPlaying.title}</h3>
                    <p className="text-sm text-gray-400">Submitted by {currentlyPlaying.submittedBy}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                      {currentlyPlaying.votes} votes
                    </Badge>
                    <Badge variant="outline" className="border-gray-500 text-gray-300">
                      {currentlyPlaying.duration}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit New Video */}
            <Card className="bg-black/20 border-purple-500/30 backdrop-blur-sm mt-6">
              <CardHeader>
                <CardTitle className="text-white">Submit a Song</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Input
                    placeholder="Enter YouTube video URL..."
                    value={newVideoUrl}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    className="bg-black/30 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <Input
                    placeholder="Your name..."
                    value={submitterName}
                    onChange={(e) => setSubmitterName(e.target.value)}
                    className="bg-black/30 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>

                {previewVideo && (
                  <div className="flex items-center gap-4 p-4 bg-black/30 rounded-lg">
                    <img
                      src={`https://img.youtube.com/vi/${previewVideo.videoId}/mqdefault.jpg`}
                      alt="Video thumbnail"
                      className="w-20 h-15 rounded object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-white">{previewVideo.title}</p>
                      <p className="text-sm text-gray-400">Preview</p>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleSubmitVideo}
                  disabled={!previewVideo || !submitterName.trim()}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                >
                  Add to Queue
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Queue */}
          <div>
            <Card className="bg-black/20 border-purple-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Users className="w-5 h-5 text-blue-400" />
                  Queue ({sortedQueue.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {sortedQueue.map((item, index) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-black/30 rounded-lg">
                      <div className="text-sm font-bold text-gray-400 w-6">#{index + 1}</div>
                      <img
                        src={item.thumbnail || "/placeholder.svg"}
                        alt={item.title}
                        className="w-16 h-12 rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white text-sm line-clamp-2">{item.title}</h4>
                        <p className="text-xs text-gray-400">by {item.submittedBy}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="border-gray-500 text-gray-300 text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {item.duration}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleVote(item.id, 1)}
                          className="h-8 w-8 p-0 hover:bg-green-500/20 text-green-400"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </Button>
                        <span className="text-sm font-bold text-white">{item.votes}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleVote(item.id, -1)}
                          className="h-8 w-8 p-0 hover:bg-red-500/20 text-red-400"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
