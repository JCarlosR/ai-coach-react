import { useState, useEffect } from "react"
import { Sidebar } from "./Sidebar"
import { Chat } from "./Chat"
import { Menu } from "lucide-react"
import { cn } from "../lib/utils"
import { ChatClient } from "../api/ChatClient"
import { playNotificationSound } from "../lib/sound"
import { Message, Conversation } from "../api/types"
import { useConversations } from "../context/ConversationsContext"

const chatClient = new ChatClient()

export function ChatPage() {
  const { conversations, setConversations, selectedConversation, setSelectedConversation } = useConversations();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const currentConversation = conversations.find(c => c.id === selectedConversation);

  // Fetch conversations if the array is empty
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const conversationIds = await chatClient.getConversations();
        const formattedConversations: Conversation[] = conversationIds.map(id => ({
          id,
          title: "New Conversation",
          messages: []
        }));
        setConversations(formattedConversations);
        
        // Set the first conversation as selected if available
        if (formattedConversations.length > 0) {
          setSelectedConversation(formattedConversations[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
      }
    };

    if (conversations.length === 0) {
      fetchConversations();
    }
  }, [conversations.length]);

  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedConversation) return;
      
      try {
        const messages = await chatClient.getMessages(selectedConversation);
        setConversations((prevConversations: Conversation[]) => 
          prevConversations.map((conv: Conversation) => {
            if (conv.id === selectedConversation) {
              return { ...conv, messages };
            }
            return conv;
          })
        );
      } catch (error) {
        console.error('Failed to load messages:', error);
      }
    };

    loadMessages();
  }, [selectedConversation]);

  const addMessageToConversation = (message: Message) => {
    setConversations((prevConversations: Conversation[]) => 
      prevConversations.map((conv: Conversation) => 
        conv.id === selectedConversation
          ? { ...conv, messages: [...conv.messages, message] }
          : conv
      )
    );
  };

  const handleSendMessage = async (content: string) => {
    if (!currentConversation) return

    // Add user message immediately
    addMessageToConversation({ content, role: "user" })

    try {
      const coachResponse = await chatClient.sendMessage(selectedConversation, content)
      
      // Add coach message after receiving response
      addMessageToConversation({ content: coachResponse, role: "assistant" })
      
      playNotificationSound()
    } catch (error) {
      console.error('Failed to send message:', error)
      throw error
    }
  }

  const handleNewConversation = async (newConversationId: string) => {
    const newConversation = {
      id: newConversationId,
      title: "New Conversation",
      messages: []
    }
    setConversations(prev => [...prev, newConversation])
    setSelectedConversation(newConversationId)
  }

  return (
    <div className="h-screen w-screen overflow-hidden">
      <div className="flex h-full">
        <div className={cn(
          "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm",
          "md:hidden",
          isSidebarOpen ? "block" : "hidden"
        )} onClick={() => setIsSidebarOpen(false)} />
        <div className={cn(
          "fixed md:relative z-50 h-full transition-transform duration-300 ease-in-out",
          "md:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <Sidebar
            conversations={conversations}
            selectedConversation={selectedConversation}
            onSelectConversation={(id) => {
              setSelectedConversation(id)
              setIsSidebarOpen(false)
            }}
            onNewConversation={handleNewConversation}
          />
        </div>
        <div className="flex-1 flex flex-col h-full">
          <div className="flex items-center p-4 md:hidden">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-md hover:bg-accent"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
          <Chat
            conversation={currentConversation}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>
    </div>
  )
} 