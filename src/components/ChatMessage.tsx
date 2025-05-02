import { cn } from "../lib/utils"

interface ChatMessageProps {
  content: string
  isUser: boolean
}

export function ChatMessage({ content, isUser }: ChatMessageProps) {
  return (
    <div className={cn(
      "flex w-full",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[80%] rounded-lg p-3 my-2",
        isUser ? "bg-primary text-primary-foreground" : "bg-muted"
      )}>
        {content}
      </div>
    </div>
  )
} 