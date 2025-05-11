import { useState, useEffect } from "react"
import { Sidebar } from "./Sidebar"
import { Chat } from "./Chat"
import { cn } from "../lib/utils"
import { ChatClient } from "../api/ChatClient"
import { playNotificationSound } from "../lib/sound"
import { Message, Conversation } from "../api/types"
import { useConversations } from "../context/ConversationsContext"
import { TopBar } from "./TopBar"
import { WelcomeMessage } from "./WelcomeMessage"

const chatClient = new ChatClient()

export function ChatPage() {
  const { conversations, setConversations, selectedConversation, setSelectedConversation } = useConversations();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  const currentConversation = conversations.find(c => c.id === selectedConversation);

  // Fetch conversations if the array is empty
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const conversationIds = await chatClient.getConversations();
        const formattedConversations: Conversation[] = conversationIds.map((id, index) => ({
          id,
          title: `Conversation #${index + 1}`,
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
      title: `Conversation #${conversations.length + 1}`,
      messages: []
    }
    setConversations(prev => [...prev, newConversation])
    setSelectedConversation(newConversationId)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {showWelcome && <WelcomeMessage onClose={() => setShowWelcome(false)} />}
      <div className={cn(
        "w-64 h-full border-r border-border bg-background flex flex-col overflow-hidden",
        isSidebarOpen ? "fixed md:relative z-50" : "hidden md:flex"
      )}>
        <Sidebar
          conversations={conversations}
          selectedConversation={selectedConversation}
          onSelectConversation={(id) => {
            setSelectedConversation(id);
            setIsSidebarOpen(false);
          }}
          onNewConversation={handleNewConversation}
        />
      </div>
      <div className={cn(
        "flex-1 flex flex-col overflow-hidden",
        isSidebarOpen ? "hidden md:flex" : "flex"
      )}>
        <TopBar onToggleSidebar={() => setIsSidebarOpen(true)} />
        {currentConversation && (
          <Chat
            conversation={currentConversation}
            onSendMessage={handleSendMessage}
          />
        )}
      </div>
    </div>
  )
} 