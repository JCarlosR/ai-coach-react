import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';
import { Conversation } from '../api/types';

interface ConversationsContextType {
  conversations: Conversation[];
  setConversations: Dispatch<SetStateAction<Conversation[]>>;
  selectedConversation: string;
  setSelectedConversation: Dispatch<SetStateAction<string>>;
}

const ConversationsContext = createContext<ConversationsContextType | undefined>(undefined);

export function ConversationsProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string>("");

  return (
    <ConversationsContext.Provider value={{ 
      conversations, 
      setConversations,
      selectedConversation,
      setSelectedConversation
    }}>
      {children}
    </ConversationsContext.Provider>
  );
}

export function useConversations() {
  const context = useContext(ConversationsContext);
  if (context === undefined) {
    throw new Error('useConversations must be used within a ConversationsProvider');
  }
  return context;
} 