
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X } from "lucide-react"
import { useIsMobile } from "@/components/ui/use-mobile"

interface MobileNavigationProps {
  children: React.ReactNode
}

export function MobileNavigation({ children }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useIsMobile()

  if (!isMobile) {
    return <>{children}</>
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">القائمة</h2>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
