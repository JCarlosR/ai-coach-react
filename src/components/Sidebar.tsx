import { ScrollArea } from "@radix-ui/react-scroll-area"
import { cn } from "../lib/utils"
import { ThemeToggle } from "./ThemeToggle"
import { Plus } from "lucide-react"
import { ChatClient } from "../api/ChatClient"

const chatClient = new ChatClient()

interface Conversation {
  id: string
  title: string
}

interface SidebarProps {
  conversations: Conversation[]
  selectedConversation: string | null
  onSelectConversation: (id: string) => void
  onNewConversation: (newConversationId: string) => void
}

export function Sidebar({ conversations, selectedConversation, onSelectConversation, onNewConversation }: SidebarProps) {
  const handleNewConversation = async () => {
    try {
      const newConversationId = await chatClient.addConversation()
      onNewConversation(newConversationId)
    } catch (error) {
      console.error('Failed to create new conversation:', error)
    }
  }

  return (
    <div className="w-64 h-full border-r border-border bg-background flex flex-col">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="text-lg font-semibold">AI Coach</h2>
        <ThemeToggle />
      </div>
      <div className="p-2 border-b border-border">
        <button
          onClick={handleNewConversation}
          className="w-full p-2 flex items-center gap-2 text-left rounded-md hover:bg-accent transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
          New Conversation
        </button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
              className={cn(
                "w-full p-2 text-left rounded-md hover:bg-accent",
                "transition-colors duration-200",
                selectedConversation === conversation.id && "bg-accent"
              )}
            >
              {conversation.title}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
} 