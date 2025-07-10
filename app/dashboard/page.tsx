"use client";

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ThumbsUp, ThumbsDown, Play, Share2 } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import axios from "axios";
import { Appbar } from "../components/Appbar"

interface Video {
  id: string
  type: string
  url: string
  extractedId: string
  title: string
  smallImg: string
  bigImg: string
  active: boolean
  userId: string
  upvotes: number
  haveUpvoted: boolean
}

const REFRESH_INTERVAL_MS = 10 * 1000

export default function Dashboard() {
  const [inputLink, setInputLink] = useState("")
  const [queue, setQueue] = useState<Video[]>([])
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(false)

  async function refreshStreams() {
    const res = await fetch("/api/streams/my", {
      credentials: "include",
    })
    console.log(res)
  }

  useEffect(() => {
    refreshStreams()
    const interval = setInterval(() => {
      refreshStreams()
    }, REFRESH_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [])

  /* // Mock data for demonstration (remove this when you have real API)
    const mockQueue: Video[] = [
      {
        id: "1",
        type: "youtube",
        url: "https://www.youtube.com/watch?v=fJ9rUzIMcZQ",
        extractedId: "fJ9rUzIMcZQ",
        title: "Bohemian Rhapsody - Queen",
        smallImg: "https://img.youtube.com/vi/fJ9rUzIMcZQ/default.jpg",
        bigImg: "https://img.youtube.com/vi/fJ9rUzIMcZQ/maxresdefault.jpg",
        active: false,
        userId: "user1",
        upvotes: 42,
        haveUpvoted: false
      },
      {
        id: "2",
        type: "youtube",
        url: "https://www.youtube.com/watch?v=BciS5krYL80",
        extractedId: "BciS5krYL80",
        title: "Hotel California - Eagles",
        smallImg: "https://img.youtube.com/vi/BciS5krYL80/default.jpg",
        bigImg: "https://img.youtube.com/vi/BciS5krYL80/maxresdefault.jpg",
        active: false,
        userId: "user2",
        upvotes: 38,
        haveUpvoted: true
      },
      {
        id: "3",
        type: "youtube",
        url: "https://www.youtube.com/watch?v=QkF3oxziUI4",
        extractedId: "QkF3oxziUI4",
        title: "Stairway to Heaven - Led Zeppelin",
        smallImg: "https://img.youtube.com/vi/QkF3oxziUI4/default.jpg",
        bigImg: "https://img.youtube.com/vi/QkF3oxziUI4/maxresdefault.jpg",
        active: false,
        userId: "user3",
        upvotes: 35,
        haveUpvoted: false
      },
    ]

    const mockCurrentVideo: Video = {
      id: "current",
      type: "youtube",
      url: "https://www.youtube.com/watch?v=1w7OgIMMRc4",
      extractedId: "1w7OgIMMRc4",
      title: "Sweet Child O Mine - Guns N Roses",
      smallImg: "https://img.youtube.com/vi/1w7OgIMMRc4/default.jpg",
      bigImg: "https://img.youtube.com/vi/1w7OgIMMRc4/maxresdefault.jpg",
      active: true,
      userId: "user4",
      upvotes: 55,
    }

    setQueue(mockQueue.sort((a, b) => b.upvotes - a.upvotes))
    setCurrentVideo(mockCurrentVideo)

    // Cleanup interval on component unmount
    return () => clearInterval(interval)
  }, []) */

  const extractYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  const handleSubmit = async () => {
    if (!inputLink.trim()) {
      toast.error("Please enter a YouTube URL")
      return
    }

    const extractedId = extractYouTubeId(inputLink)
    if (!extractedId) {
      toast.error("Please enter a valid YouTube URL")
      return
    }

    setLoading(true)
    try {
      // In a real app, you would make an API call here
      // const response = await axios.post('/api/streams', { url: inputLink })

      // Mock API response
      const newVideo: Video = {
        id: Date.now().toString(),
        type: "youtube",
        url: inputLink,
        extractedId: extractedId,
        title: "New Song", // Would come from YouTube API
        smallImg: `https://img.youtube.com/vi/${extractedId}/default.jpg`,
        bigImg: `https://img.youtube.com/vi/${extractedId}/maxresdefault.jpg`,
        active: false,
        userId: "currentUser",
        upvotes: 0,
        haveUpvoted: false,
      }

      setQueue((prev) => [...prev, newVideo].sort((a, b) => b.upvotes - a.upvotes))
      setInputLink("")
      toast.success("Song added to queue!")
    } catch (error) {
      toast.error("Failed to add song to queue")
    } finally {
      setLoading(false)
    }
  }

  const handleVote = (id: string, isUpvote: boolean) => {
  setQueue(queue.map(video =>
    video.id === id
      ? {
          ...video,
          upvotes: isUpvote ? video.upvotes + 1 : video.upvotes - 1,
          haveUpvoted: !video.haveUpvoted
        }
      : video
  ).sort((a, b) => b.upvotes - a.upvotes));

  fetch(`/api/stream/${isUpvote ? "upvote" : "downvote"}`, {
    method: "POST",
    body: JSON.stringify({ streamId: id }),
  });

  if (currentVideo?.id === id) {
    setCurrentVideo(prev =>
      prev ? {
        ...prev,
        upvotes: prev.haveUpvoted ? prev.upvotes - 1 : prev.upvotes + 1,
        haveUpvoted: !prev.haveUpvoted
      } : prev
    );
  }

  toast.success("Vote updated!");
}

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success("Room link copied to clipboard!")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Appbar />

      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Music Room</h1>
            <p className="text-gray-400">Let your audience choose the music</p>
          </div>
          <Button onClick={handleShare} className="bg-purple-600 hover:bg-purple-700 text-white">
            <Share2 className="w-4 h-4 mr-2" />
            Share Room
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Add Song & Queue */}
          <div className="space-y-6">
            {/* Add Song */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Add a Song</h2>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Paste YouTube URL here..."
                    value={inputLink}
                    onChange={(e) => setInputLink(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                    onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
                  />
                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {loading ? "Adding..." : "Add"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Queue */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Up Next ({queue.length} songs)</h2>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {queue.map((video, index) => (
                    <div key={video.id} className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                      <div className="text-gray-400 font-mono text-sm w-6">#{index + 1}</div>

                      <img
                        src={video.smallImg || "/placeholder.svg"}
                        alt={video.title}
                        className="w-16 h-12 object-cover rounded"
                      />

                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{video.title}</p>
                        <p className="text-gray-400 text-sm">Added by User</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleVote(video.id, video.haveUpvoted ? false : true)}
                          className={video.haveUpvoted ? "text-gray-400" : "text-gray-400 hover:text-green-400 "}
                        >
                          {video.haveUpvoted?<ThumbsDown className="h-4 w-4"/>:<ThumbsUp className="w-4 h-4" />}
                        </Button>
                        <span className="text-white font-medium min-w-[2rem] text-center">{video.upvotes}</span>
                      </div>
                    </div>
                  ))}

                  {queue.length === 0 && (
                    <div className="text-center py-8 text-gray-400">No songs in queue. Add one above!</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Now Playing */}
          <div>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Play className="w-5 h-5 text-green-400" />
                  <h2 className="text-xl font-semibold text-white">Now Playing</h2>
                </div>

                {currentVideo ? (
                  <div className="space-y-4">
                    {/* YouTube Player */}
                    <div className="aspect-video">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${currentVideo.extractedId}?autoplay=1`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="rounded-lg"
                      />
                    </div>

                    {/* Video Info */}
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold text-lg truncate">{currentVideo.title}</h3>
                        <p className="text-gray-400">Added by User</p>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleVote(currentVideo.id, !currentVideo.haveUpvoted)}
                          className={currentVideo.haveUpvoted? "text-gray-400 hover:text-green-400" : "text-gray-400 hover:text-green-400"}
                          
                        >
                          {currentVideo.haveUpvoted
                            ? <ThumbsDown className="h-4 w-4" />
                            : <ThumbsUp className="w-4 h-4" />
                          }
                          
                        </Button>
                        <span className="text-white font-medium">{currentVideo.upvotes}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-700 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <Play className="w-12 h-12 mx-auto mb-2" />
                      <p>No song currently playing</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  )
}

