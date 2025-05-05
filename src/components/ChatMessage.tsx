import { cn } from "../lib/utils"

interface ChatMessageProps {
  content: string
  isUser: boolean
}

export function ChatMessage({ content, isUser }: ChatMessageProps) {
  const messages = content.split('\n').filter(line => line.trim() !== '')

  return (
    <div className={cn(
      "flex w-full flex-col",
      isUser ? "items-end" : "items-start"
    )}>
      {messages.map((message, index) => (
        <div 
          key={index}
          className={cn(
            "max-w-[80%] rounded-lg p-3 my-1",
            isUser ? "bg-primary text-primary-foreground" : "bg-muted"
          )}
        >
          {message}
        </div>
      ))}
    </div>
  )
}