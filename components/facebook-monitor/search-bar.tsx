"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Search, X } from "lucide-react"

interface SearchBarProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  sourceFilter: "all" | "groups" | "pages"
  setSourceFilter: (filter: "all" | "groups" | "pages") => void
  selectedSources: string[]
  setSelectedSources: (sources: string[]) => void
  posts: any[]
  darkMode: boolean
  language: "ar" | "en"
}

export function SearchBar({
  searchQuery,
  setSearchQuery,
  sourceFilter,
  setSourceFilter,
  selectedSources,
  setSelectedSources,
  posts,
  darkMode,
  language,
}: SearchBarProps) {
  const t = {
    ar: {
      searchPlaceholder: "ابحث في المنشورات والتعليقات...",
      filterByType: "فلترة حسب النوع:",
      all: "الكل",
      groups: "الجروبات",
      pages: "الصفحات",
      filterBySource: "فلترة حسب المصدر:",
      clearFilter: "مسح الفلترة",
      noSources: "لا توجد مصادر",
    },
    en: {
      searchPlaceholder: "Search in posts and comments...",
      filterByType: "Filter by type:",
      all: "All",
      groups: "Groups",
      pages: "Pages",
      filterBySource: "Filter by source:",
      clearFilter: "Clear Filter",
      noSources: "No sources",
    },
  }

  const text = t[language]

  // Get unique sources from posts
  const uniqueSources = Array.from(
    new Map(
      posts
        .filter((p) => p.source && p.source_name)
        .map((p) => [p.source, { id: p.source, name: p.source_name, type: p.source_type }]),
    ).values(),
  )

  // Filter sources by type
  const filteredSources = uniqueSources.filter((source) => {
    if (sourceFilter === "all") return true
    if (sourceFilter === "groups") return source.type === "group"
    if (sourceFilter === "pages") return source.type === "page"
    return true
  })

  const toggleSource = (sourceId: string) => {
    setSelectedSources(
      selectedSources.includes(sourceId)
        ? selectedSources.filter((s) => s !== sourceId)
        : [...selectedSources, sourceId],
    )
  }

  return (
    <>
      {/* Search */}
      <Card className={`${darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90"} backdrop-blur-sm`}>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder={text.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/50 backdrop-blur-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Filter Controls */}
      <Card className={`${darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90"} backdrop-blur-sm`}>
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Type Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <Label className="text-sm font-medium">{text.filterByType}</Label>
              <Button
                variant={sourceFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSourceFilter("all")}
              >
                {text.all} ({posts.length})
              </Button>
              <Button
                variant={sourceFilter === "groups" ? "default" : "outline"}
                size="sm"
                onClick={() => setSourceFilter("groups")}
              >
                {text.groups} ({posts.filter((p) => p.source_type === "group").length})
              </Button>
              <Button
                variant={sourceFilter === "pages" ? "default" : "outline"}
                size="sm"
                onClick={() => setSourceFilter("pages")}
              >
                {text.pages} ({posts.filter((p) => p.source_type === "page").length})
              </Button>
            </div>

            {/* Source Filter */}
            {filteredSources.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">{text.filterBySource}</Label>
                  {selectedSources.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedSources([])}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-3 h-3 mr-1" />
                      {text.clearFilter}
                    </Button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {filteredSources.map((source) => {
                    const postsCount = posts.filter((p) => p.source === source.id).length
                    return (
                      <Button
                        key={source.id}
                        variant={selectedSources.includes(source.id) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleSource(source.id)}
                        className="text-xs"
                      >
                        {source.name} ({postsCount})
                      </Button>
                    )
                  })}
                </div>
              </div>
            )}

            {filteredSources.length === 0 && posts.length > 0 && (
              <div className="text-center py-4 text-gray-500">
                <p className="text-sm">{text.noSources}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  )
}
