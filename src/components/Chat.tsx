import { useState, useRef, useEffect } from "react"
import { ScrollArea, ScrollAreaViewport, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaCorner } from "@radix-ui/react-scroll-area"
import { Sidebar } from "./Sidebar"
import { ChatMessage } from "./ChatMessage"
import { ChatInput } from "./ChatInput"
import { ChatClient, Conversation } from "../api/ChatClient"

const chatClient = new ChatClient()

export function Chat() {
  const viewportRef = useRef<HTMLDivElement>(null)
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "550e8400-e29b-41d4-a716-446655440000",
      title: "New Conversation",
      messages: []
    }
  ])
  const [selectedConversation, setSelectedConversation] = useState<string>("550e8400-e29b-41d4-a716-446655440000")
  const [isLoading, setIsLoading] = useState(false)

  const currentConversation = conversations.find(c => c.id === selectedConversation)

  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedConversation) return
      
      setIsLoading(true)
      try {
        const messages = await chatClient.getMessages(selectedConversation)

        setConversations(conversations.map(conv => {
          if (conv.id === selectedConversation) {
            conv.messages = messages
            return conv
          } else {
            return conv
          }
        }))
      } catch (error) {
        console.error('Failed to load messages:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadMessages()
  }, [selectedConversation])

  const handleSendMessage = async (content: string) => {
    if (!currentConversation) return

    setIsLoading(true)
    try {
      const newMessage = await chatClient.sendMessage(selectedConversation, content)
      setConversations(conversations.map(conv => 
        conv.id === selectedConversation
          ? { ...conv, messages: [...conv.messages, newMessage] }
          : conv
      ))
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
                {isLoading ? (
                  <div className="text-center">Loading...</div>
                ) : (
                  currentConversation?.messages.map((message, index) => (
                    <ChatMessage
                      key={index}
                      content={message.content}
                      isUser={message.role === "user"}
                    />
                  ))
                )}
              </div>
            </ScrollAreaViewport>
            <ScrollAreaScrollbar orientation="vertical" className="w-2">
              <ScrollAreaThumb className="bg-gray-500" />
            </ScrollAreaScrollbar>
            <ScrollAreaCorner />
          </ScrollArea>
        </div>
        <div className="border-t border-border">
          <ChatInput onSend={handleSendMessage} disabled={isLoading} />
        </div>
      </div>
    </div>
  )
} 