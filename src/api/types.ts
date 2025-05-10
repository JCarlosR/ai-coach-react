export interface Message {
  content: string;
  role: "user" | "assistant";
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}

export interface User {
  name: string;
  picture: string;
}