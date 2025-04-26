import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"

interface UserProfileProps {
  username: string
}

export function UserProfile({ username }: UserProfileProps) {
  // This would be fetched from an API in a real application
  const userInfo = {
    displayName: username,
    avatarUrl: "/placeholder.svg?height=100&width=100",
    joinedDate: "April 2025",
  }

  const firstLetter = username.charAt(0).toUpperCase()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-20 w-20 border-4 border-purple-100">
          <AvatarImage src={userInfo.avatarUrl || "/placeholder.svg"} alt={username} />
          <AvatarFallback className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            {firstLetter}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-2xl">@{userInfo.displayName}</CardTitle>
          <CardDescription>
            Joined {userInfo.joinedDate}
          </CardDescription>
          <div className="mt-2">
            <Button variant="outline" size="sm" className="gap-1 cursor-pointer">
              <Share2 className="h-4 w-4" />
              Share Profile
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}
