import { cn } from "../lib/utils"
import { useEffect, useState } from "react"
import { AuthService } from "../api/AuthService"

interface ChatMessageProps {
  content: string
  isUser: boolean
}

export function ChatMessage({ content, isUser }: ChatMessageProps) {
  const [userImage, setUserImage] = useState<string>("")
  const messages = content.split('\n').filter(line => line.trim() !== '')

  useEffect(() => {
    const user = AuthService.getUser()
    if (user?.picture) {
      setUserImage(user.picture)
    }
  }, [])

  return (
    <div className={cn(
      "flex w-full flex-col",
      isUser ? "items-end" : "items-start"
    )}>
      {messages.map((message, index) => (
        <div 
          key={index}
          className={cn(
            "flex items-center gap-2",
            isUser ? "flex-row-reverse" : "flex-row"
          )}
        >
          <img
            src={isUser ? userImage : "/coach.jpeg"}
            alt={isUser ? "User" : "Coach"}
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
          />
          <div 
            className={cn(
              "max-w-[80%] rounded-lg p-3 my-1",
              isUser ? "bg-primary text-primary-foreground" : "bg-muted"
            )}
          >
            {message}
          </div>
        </div>
      ))}
    </div>
  )
}