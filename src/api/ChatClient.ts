export interface Message {
  content: string;
  role: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}

export class ChatClient {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:8000') {
    this.baseUrl = baseUrl;
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/${conversationId}`, {
        method: "GET",
        credentials: "include"
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }

  async sendMessage(conversationId: string, content: string): Promise<Message> {
    try {
      const response = await fetch(`${this.baseUrl}/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
} 