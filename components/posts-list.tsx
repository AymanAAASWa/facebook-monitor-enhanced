
"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PostCard } from "@/components/post-card"
import { useAppContext } from "@/lib/app-context"
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Calendar,
  TrendingUp,
  MessageSquare,
  Heart,
  Share2
} from "lucide-react"

interface Post {
  id: string
  message?: string
  created_time: string
  likes?: { data: any[] }
  comments?: { data: any[] }
  shares?: { count: number }
  from?: { name: string; id: string }
  source?: string
}

interface PostsListProps {
  posts: Post[]
  compact?: boolean
}

export function PostsList({ posts, compact = false }: PostsListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("recent")
  const [filterBy, setFilterBy] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const { darkMode } = useAppContext()

  const filteredAndSortedPosts = useMemo(() => {
    let filtered = posts.filter(post => {
      const matchesSearch = !searchTerm || 
        post.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.from?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesFilter = filterBy === "all" || 
        (filterBy === "high-engagement" && (post.likes?.data?.length || 0) > 10) ||
        (filterBy === "recent" && new Date(post.created_time) > new Date(Date.now() - 24 * 60 * 60 * 1000))
      
      return matchesSearch && matchesFilter
    })

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.created_time).getTime() - new Date(a.created_time).getTime()
        case "likes":
          return (b.likes?.data?.length || 0) - (a.likes?.data?.length || 0)
        case "comments":
          return (b.comments?.data?.length || 0) - (a.comments?.data?.length || 0)
        default:
          return 0
      }
    })

    return filtered
  }, [posts, searchTerm, sortBy, filterBy])

  const stats = useMemo(() => ({
    total: posts.length,
    filtered: filteredAndSortedPosts.length,
    totalLikes: posts.reduce((acc, post) => acc + (post.likes?.data?.length || 0), 0),
    totalComments: posts.reduce((acc, post) => acc + (post.comments?.data?.length || 0), 0),
    totalShares: posts.reduce((acc, post) => acc + (post.shares?.count || 0), 0)
  }), [posts, filteredAndSortedPosts])

  if (compact) {
    return (
      <div className="space-y-3">
        {filteredAndSortedPosts.slice(0, 5).map((post) => (
          <div key={post.id} className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-sm">{post.from?.name}</span>
                  <Badge variant="outline" className="text-xs">{post.source}</Badge>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                  {post.message || "منشور بدون نص"}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    {post.likes?.data?.length || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    {post.comments?.data?.length || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <Share2 className="w-3 h-3" />
                    {post.shares?.count || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold">المنشورات</h2>
            <p className="text-gray-600">إدارة ومراجعة جميع المنشورات</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">إجمالي المنشورات</div>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.filtered}</div>
            <div className="text-sm text-gray-600">المنشورات المعروضة</div>
          </div>
          <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{stats.totalLikes}</div>
            <div className="text-sm text-gray-600">إجمالي الإعجابات</div>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{stats.totalComments}</div>
            <div className="text-sm text-gray-600">إجمالي التعليقات</div>
          </div>
          <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{stats.totalShares}</div>
            <div className="text-sm text-gray-600">إجمالي المشاركات</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="البحث في المنشورات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="ترتيب حسب" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">الأحدث</SelectItem>
              <SelectItem value="likes">الأكثر إعجاباً</SelectItem>
              <SelectItem value="comments">الأكثر تعليقاً</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="فلترة حسب" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع المنشورات</SelectItem>
              <SelectItem value="high-engagement">عالية التفاعل</SelectItem>
              <SelectItem value="recent">الحديثة</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Posts Grid/List */}
      <div className={viewMode === "grid" ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
        {filteredAndSortedPosts.map((post) => (
          <PostCard key={post.id} post={post} viewMode={viewMode} />
        ))}
      </div>

      {filteredAndSortedPosts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            لا توجد منشورات
          </h3>
          <p className="text-gray-500">
            {searchTerm ? "لم يتم العثور على منشورات تطابق البحث" : "لا توجد منشورات للعرض"}
          </p>
        </div>
      )}
    </div>
  )
}
