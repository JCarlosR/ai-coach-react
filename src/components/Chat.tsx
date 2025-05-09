import { useState, useRef, useEffect, Key } from "react"
import { ScrollArea, ScrollAreaViewport, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaCorner } from "@radix-ui/react-scroll-area"
import { ChatMessage } from "./ChatMessage"
import { ChatInput } from "./ChatInput"
import { TypingIndicator } from "./TypingIndicator"
import { Conversation, Message } from "../api/types"

interface ChatProps {
  conversation: Conversation | undefined
  onSendMessage: (content: string) => Promise<void>
}

export function Chat({ conversation, onSendMessage }: ChatProps) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async (content: string) => {
    if (!conversation) return

    setIsLoading(true)
    
    try {
      await onSendMessage(content)
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTo({
        top: viewportRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [conversation?.messages, isLoading])

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex-1 min-h-0 relative">
        <ScrollArea className="h-full">
          <ScrollAreaViewport ref={viewportRef}>
            <div className="p-4 space-y-4 pb-6">
              {conversation?.messages.map((message: Message, index: Key) => (
                <ChatMessage
                  key={index}
                  content={message.content}
                  isUser={message.role === "user"}
                />
              ))}
              {isLoading && (
                <div className="flex justify-center items-center h-12">
                  <TypingIndicator />
                </div>
              )}
            </div>
          </ScrollAreaViewport>
          <ScrollAreaScrollbar orientation="vertical" className="w-2">
            <ScrollAreaThumb className="bg-gray-500" />
          </ScrollAreaScrollbar>
          <ScrollAreaCorner />
        </ScrollArea>
      </div>
      <div className="border-t border-border sticky bottom-0 bg-background">
        <ChatInput onSend={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  )
} 