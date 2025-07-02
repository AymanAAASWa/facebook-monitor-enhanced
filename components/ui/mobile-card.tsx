
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useIsMobile } from "./use-mobile"
import { cn } from "@/lib/utils"

interface MobileCardProps {
  title?: string
  children: React.ReactNode
  className?: string
  compact?: boolean
}

export function MobileCard({ title, children, className, compact = false }: MobileCardProps) {
  const isMobile = useIsMobile()
  
  return (
    <Card className={cn(
      "w-full",
      isMobile && "mx-2 rounded-lg",
      className
    )}>
      {title && (
        <CardHeader className={cn(
          isMobile && compact ? "pb-2" : "pb-4"
        )}>
          <CardTitle className={cn(
            isMobile ? "text-base" : "text-lg"
          )}>
            {title}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={cn(
        isMobile && compact ? "pt-2" : "pt-4"
      )}>
        {children}
      </CardContent>
    </Card>
  )
}
