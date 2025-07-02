import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, MessageSquare, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, MessageSquare, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, MessageSquare, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, MessageSquare, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, MessageSquare, ExternalLink } from "lucide-react"

<CardContent className="p-4">
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>{text.loading}</span>
          </div>
        ) : comments.length === 0 ? (
          <p className="text-center text-gray-500 py-4">{text.noComments}</p>
        ) : (
          <ScrollArea className="h-64">
            <div className="space-y-4 pr-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3 border-b pb-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={comment.from?.picture?.data?.url} />
                    <AvatarFallback>{comment.from?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="font-medium text-sm">{comment.from?.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatRelative(new Date(comment.created_time), new Date(), {
                          locale: language === "ar" ? ar : undefined,
                        })}
                      </p>
                    </div>
                    <p className="text-sm break-words">{comment.message}</p>
                    {comment.like_count > 0 && (
                      <Badge variant="outline" className="mt-1 text-xs">
                        {comment.like_count} {text.likes}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>