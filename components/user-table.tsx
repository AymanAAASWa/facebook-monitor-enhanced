"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Phone } from "lucide-react"

interface ProcessedUser {
  id: string
  name: string
  postCount: number
  commentCount: number
  lastActivity: string
  sources: string[]
}

interface UserTableProps {
  users: ProcessedUser[]
  phoneSearchResults: { [key: string]: string }
  onPhoneSearch: (userId: string, userName: string, source: string) => void
  searchingPhones: Set<string>
  darkMode: boolean
  language: "ar" | "en"
}

export function UserTable({
  users,
  phoneSearchResults,
  onPhoneSearch,
  searchingPhones,
  darkMode,
  language,
}: UserTableProps) {
  const t = {
    ar: {
      users: "المستخدمين",
      name: "الاسم",
      activity: "النشاط",
      phone: "الهاتف",
    },
    en: {
      users: "Users",
      name: "Name",
      activity: "Activity",
      phone: "Phone",
    },
  }

  const text = t[language]

  return (
    <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          {text.users} ({users.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {users.slice(0, 10).map((user) => (
            <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">
                  {user.postCount} posts, {user.commentCount} comments
                </p>
              </div>
              <div className="flex items-center gap-2">
                {phoneSearchResults[user.id] && <Badge variant="secondary">{phoneSearchResults[user.id]}</Badge>}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onPhoneSearch(user.id, user.name, user.sources[0] || "")}
                  disabled={searchingPhones.has(user.id)}
                >
                  <Phone className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}