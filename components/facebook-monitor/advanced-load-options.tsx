"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Download,
  Settings,
  Clock,
  ChevronDown,
  ChevronUp,
  Zap,
  Target,
  Users,
  FileText,
  BarChart3,
  Loader2,
} from "lucide-react"

export interface LoadOptions {
  sourceTypes: ("groups" | "pages")[]
  selectedSources: string[]
  timeRange: "all" | "today" | "week" | "month" | "custom"
  customStartDate?: string
  customEndDate?: string
  postsLimit: number
  includeComments: boolean
  sortBy: "newest" | "oldest" | "most_comments"
}

interface AdvancedLoadOptionsProps {
  groupIds: string[]
  pageIds: string[]
  sourceNames: { [key: string]: string }
  loading: boolean
  onLoadPosts: (options: LoadOptions) => void
  darkMode: boolean
  language: "ar" | "en"
}

export function AdvancedLoadOptions({
  groupIds,
  pageIds,
  sourceNames,
  loading,
  onLoadPosts,
  darkMode,
  language,
}: AdvancedLoadOptionsProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [options, setOptions] = useState<LoadOptions>({
    sourceTypes: ["groups", "pages"],
    selectedSources: [],
    timeRange: "all",
    postsLimit: 25,
    includeComments: true,
    sortBy: "newest",
  })

  const t = {
    ar: {
      quickLoad: "تحميل سريع",
      advancedOptions: "خيارات متقدمة",
      loadPosts: "تحميل المنشورات",
      quickLoadDesc: "خيارات سريعة للتحميل",
      fastLoad: "تحميل سريع (25 منشور)",
      normalLoad: "تحميل عادي (50 منشور)",
      intensiveLoad: "تحميل مكثف (100 منشور)",
      customLoad: "تحميل مخصص",
      sourceTypes: "أنواع المصادر",
      groups: "الجروبات",
      pages: "الصفحات",
      specificSources: "مصادر محددة",
      selectSources: "اختر المصادر",
      allSources: "جميع المصادر",
      timeRange: "الفترة الزمنية",
      all: "جميع الأوقات",
      today: "اليوم",
      week: "الأسبوع الماضي",
      month: "الشهر الماضي",
      custom: "فترة مخصصة",
      startDate: "تاريخ البداية",
      endDate: "تاريخ النهاية",
      postsLimit: "عدد المنشورات",
      includeComments: "تضمين التعليقات",
      sortBy: "ترتيب النتائج",
      newest: "الأحدث أولاً",
      oldest: "الأقدم أولاً",
      mostComments: "الأكثر تعليقاً",
      estimatedTime: "الوقت المتوقع",
      sources: "مصدر",
      posts: "منشور",
      loading: "جاري التحميل...",
      selectAtLeastOne: "اختر مصدر واحد على الأقل",
    },
    en: {
      quickLoad: "Quick Load",
      advancedOptions: "Advanced Options",
      loadPosts: "Load Posts",
      quickLoadDesc: "Quick loading options",
      fastLoad: "Fast Load (25 posts)",
      normalLoad: "Normal Load (50 posts)",
      intensiveLoad: "Intensive Load (100 posts)",
      customLoad: "Custom Load",
      sourceTypes: "Source Types",
      groups: "Groups",
      pages: "Pages",
      specificSources: "Specific Sources",
      selectSources: "Select Sources",
      allSources: "All Sources",
      timeRange: "Time Range",
      all: "All Time",
      today: "Today",
      week: "Past Week",
      month: "Past Month",
      custom: "Custom Range",
      startDate: "Start Date",
      endDate: "End Date",
      postsLimit: "Posts Limit",
      includeComments: "Include Comments",
      sortBy: "Sort Results",
      newest: "Newest First",
      oldest: "Oldest First",
      mostComments: "Most Comments",
      estimatedTime: "Estimated Time",
      sources: "source",
      posts: "posts",
      loading: "Loading...",
      selectAtLeastOne: "Select at least one source",
    },
  }

  const text = t[language]

  const allSources = [
    ...groupIds.map((id) => ({ id, type: "group" as const, name: sourceNames[id] || id })),
    ...pageIds.map((id) => ({ id, type: "page" as const, name: sourceNames[id] || id })),
  ]

  const getEstimatedTime = () => {
    const sourcesCount = options.selectedSources.length || allSources.length
    const timePerSource = Math.ceil(options.postsLimit / 25) * 2 // 2 seconds per 25 posts
    return sourcesCount * timePerSource
  }

  const handleQuickLoad = (postsLimit: number) => {
    const quickOptions: LoadOptions = {
      sourceTypes: ["groups", "pages"],
      selectedSources: [],
      timeRange: "all",
      postsLimit,
      includeComments: true,
      sortBy: "newest",
    }
    onLoadPosts(quickOptions)
  }

  const handleAdvancedLoad = () => {
    if (options.sourceTypes.length === 0) {
      alert(text.selectAtLeastOne)
      return
    }
    onLoadPosts(options)
  }

  const updateSourceTypes = (type: "groups" | "pages", checked: boolean) => {
    setOptions((prev) => ({
      ...prev,
      sourceTypes: checked ? [...prev.sourceTypes, type] : prev.sourceTypes.filter((t) => t !== type),
    }))
  }

  const updateSelectedSources = (sourceId: string, checked: boolean) => {
    setOptions((prev) => ({
      ...prev,
      selectedSources: checked
        ? [...prev.selectedSources, sourceId]
        : prev.selectedSources.filter((id) => id !== sourceId),
    }))
  }

  const filteredSources = allSources.filter((source) => options.sourceTypes.includes(source.type))

  return (
    <Card className={`${darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90"} backdrop-blur-sm`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="w-5 h-5 text-blue-500" />
          {text.quickLoad}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Load Options */}
        <div>
          <Label className="text-sm font-medium mb-3 block">{text.quickLoadDesc}</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              onClick={() => handleQuickLoad(25)}
              disabled={loading}
              variant="outline"
              className="flex flex-col items-center gap-2 h-auto p-4"
            >
              <Zap className="w-5 h-5 text-green-500" />
              <span className="text-xs">{text.fastLoad}</span>
            </Button>
            <Button
              onClick={() => handleQuickLoad(50)}
              disabled={loading}
              variant="outline"
              className="flex flex-col items-center gap-2 h-auto p-4"
            >
              <Target className="w-5 h-5 text-blue-500" />
              <span className="text-xs">{text.normalLoad}</span>
            </Button>
            <Button
              onClick={() => handleQuickLoad(100)}
              disabled={loading}
              variant="outline"
              className="flex flex-col items-center gap-2 h-auto p-4"
            >
              <BarChart3 className="w-5 h-5 text-purple-500" />
              <span className="text-xs">{text.intensiveLoad}</span>
            </Button>
            <Button
              onClick={() => setShowAdvanced(!showAdvanced)}
              variant="outline"
              className="flex flex-col items-center gap-2 h-auto p-4"
            >
              <Settings className="w-5 h-5 text-orange-500" />
              <span className="text-xs">{text.customLoad}</span>
            </Button>
          </div>
        </div>

        <Separator />

        {/* Advanced Options */}
        <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between">
              <span className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                {text.advancedOptions}
              </span>
              {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-6 mt-4">
            {/* Source Types */}
            <div>
              <Label className="text-sm font-medium mb-3 block">{text.sourceTypes}</Label>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="groups"
                    checked={options.sourceTypes.includes("groups")}
                    onCheckedChange={(checked) => updateSourceTypes("groups", checked as boolean)}
                  />
                  <Label htmlFor="groups" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {text.groups} ({groupIds.length})
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pages"
                    checked={options.sourceTypes.includes("pages")}
                    onCheckedChange={(checked) => updateSourceTypes("pages", checked as boolean)}
                  />
                  <Label htmlFor="pages" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    {text.pages} ({pageIds.length})
                  </Label>
                </div>
              </div>
            </div>

            {/* Specific Sources */}
            {filteredSources.length > 0 && (
              <div>
                <Label className="text-sm font-medium mb-3 block">{text.specificSources}</Label>
                <div className="max-h-40 overflow-y-auto space-y-2 border rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <Checkbox
                      id="all-sources"
                      checked={options.selectedSources.length === 0}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setOptions((prev) => ({ ...prev, selectedSources: [] }))
                        }
                      }}
                    />
                    <Label htmlFor="all-sources" className="font-medium">
                      {text.allSources}
                    </Label>
                  </div>
                  <Separator />
                  {filteredSources.map((source) => (
                    <div key={source.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={source.id}
                        checked={options.selectedSources.includes(source.id)}
                        onCheckedChange={(checked) => updateSelectedSources(source.id, checked as boolean)}
                      />
                      <Label htmlFor={source.id} className="flex items-center gap-2 text-sm">
                        {source.type === "group" ? <Users className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                        {source.name}
                        <Badge variant="secondary" className="text-xs">
                          {source.type === "group" ? "G" : "P"}
                        </Badge>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Time Range */}
            <div>
              <Label className="text-sm font-medium mb-3 block">{text.timeRange}</Label>
              <Select
                value={options.timeRange}
                onValueChange={(value: any) => setOptions((prev) => ({ ...prev, timeRange: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{text.all}</SelectItem>
                  <SelectItem value="today">{text.today}</SelectItem>
                  <SelectItem value="week">{text.week}</SelectItem>
                  <SelectItem value="month">{text.month}</SelectItem>
                  <SelectItem value="custom">{text.custom}</SelectItem>
                </SelectContent>
              </Select>

              {options.timeRange === "custom" && (
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <Label htmlFor="start-date" className="text-xs">
                      {text.startDate}
                    </Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={options.customStartDate || ""}
                      onChange={(e) => setOptions((prev) => ({ ...prev, customStartDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end-date" className="text-xs">
                      {text.endDate}
                    </Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={options.customEndDate || ""}
                      onChange={(e) => setOptions((prev) => ({ ...prev, customEndDate: e.target.value }))}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Posts Limit */}
            <div>
              <Label htmlFor="posts-limit" className="text-sm font-medium mb-3 block">
                {text.postsLimit}
              </Label>
              <Select
                value={options.postsLimit.toString()}
                onValueChange={(value) => setOptions((prev) => ({ ...prev, postsLimit: Number.parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25">25 {text.posts}</SelectItem>
                  <SelectItem value="50">50 {text.posts}</SelectItem>
                  <SelectItem value="100">100 {text.posts}</SelectItem>
                  <SelectItem value="200">200 {text.posts}</SelectItem>
                  <SelectItem value="500">500 {text.posts}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort By */}
            <div>
              <Label className="text-sm font-medium mb-3 block">{text.sortBy}</Label>
              <Select
                value={options.sortBy}
                onValueChange={(value: any) => setOptions((prev) => ({ ...prev, sortBy: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">{text.newest}</SelectItem>
                  <SelectItem value="oldest">{text.oldest}</SelectItem>
                  <SelectItem value="most_comments">{text.mostComments}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Include Comments */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-comments"
                checked={options.includeComments}
                onCheckedChange={(checked) => setOptions((prev) => ({ ...prev, includeComments: checked as boolean }))}
              />
              <Label htmlFor="include-comments">{text.includeComments}</Label>
            </div>

            {/* Estimated Time */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">{text.estimatedTime}</span>
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                ~{getEstimatedTime()} ثانية ({options.selectedSources.length || allSources.length} {text.sources},{" "}
                {options.postsLimit} {text.posts})
              </p>
            </div>

            {/* Advanced Load Button */}
            <Button
              onClick={handleAdvancedLoad}
              disabled={loading || options.sourceTypes.length === 0}
              className="w-full"
            >
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
              {loading ? text.loading : text.loadPosts}
            </Button>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}
