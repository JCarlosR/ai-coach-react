export interface Message {
  content: string;
  role: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}