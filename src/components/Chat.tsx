import { useState, useRef, useEffect } from "react"
import { ScrollArea, ScrollAreaViewport, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaCorner } from "@radix-ui/react-scroll-area"
import { Sidebar } from "./Sidebar"
import { ChatMessage } from "./ChatMessage"
import { ChatInput } from "./ChatInput"

interface Message {
  id: string
  content: string
  isUser: boolean
}

interface Conversation {
  id: string
  title: string
  messages: Message[]
}

export function Chat() {
  const viewportRef = useRef<HTMLDivElement>(null)
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      title: "New Conversation",
      messages: []
    }
  ])
  const [selectedConversation, setSelectedConversation] = useState<string>("1")

  const currentConversation = conversations.find(c => c.id === selectedConversation)

  const handleSendMessage = (content: string) => {
    if (!currentConversation) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true
    }

    setConversations(conversations.map(conv => 
      conv.id === selectedConversation
        ? { ...conv, messages: [...conv.messages, newMessage] }
        : conv
    ))
  }

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTo({
        top: viewportRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [currentConversation?.messages])

  return (
    <div className="flex h-full">
      <Sidebar
        conversations={conversations}
        selectedConversation={selectedConversation}
        onSelectConversation={setSelectedConversation}
      />
      <div className="flex-1 flex flex-col h-full">
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full overflow-y-auto">
            <ScrollAreaViewport ref={viewportRef}>
              <div className="p-4 space-y-4">
                {currentConversation?.messages.map(message => (
                  <ChatMessage
                    key={message.id}
                    content={message.content}
                    isUser={message.isUser}
                  />
                ))}
              </div>
            </ScrollAreaViewport>
            <ScrollAreaScrollbar orientation="vertical" className="w-2">
              <ScrollAreaThumb className="bg-gray-500" />
            </ScrollAreaScrollbar>
            <ScrollAreaCorner />
          </ScrollArea>
        </div>
        <div className="border-t border-border">
          <ChatInput onSend={handleSendMessage} />
        </div>
      </div>
    </div>
  )
} 