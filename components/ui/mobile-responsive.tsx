
"use client"

import { useIsMobile } from "./use-mobile"
import { cn } from "@/lib/utils"

interface MobileResponsiveProps {
  children: React.ReactNode
  className?: string
  mobileClassName?: string
  desktopClassName?: string
}

export function MobileResponsive({ 
  children, 
  className, 
  mobileClassName, 
  desktopClassName 
}: MobileResponsiveProps) {
  const isMobile = useIsMobile()
  
  return (
    <div className={cn(
      className,
      isMobile ? mobileClassName : desktopClassName
    )}>
      {children}
    </div>
  )
}

export function MobileOnly({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile()
  return isMobile ? <>{children}</> : null
}

export function DesktopOnly({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile()
  return !isMobile ? <>{children}</> : null
}
