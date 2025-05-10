import { Message } from './types';

export class ChatClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000') {
    this.baseUrl = baseUrl;
  }

  /**
   * Exchange an authorization code for a JWT token
   * 
   * @param code The authorization code to exchange
   * @returns The JWT token
   */
  async exchangeCodeForToken(code: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/token?code=${encodeURIComponent(code)}`, {
        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      this.token = result.token;
      return result.token;
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      throw error;
    }
  }

  /**
   * Get the conversation messages.
   * 
   * @param conversationId The id of the conversation
   * @returns The conversation history
   */
  async getMessages(conversationId: string): Promise<Message[]> {
    try {
      const response = await fetch(`${this.baseUrl}/conversations/${conversationId}/messages`, {
        method: "GET",
        credentials: "include",
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
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

  /**
   * Send a message to the chatbot.
   * 
   * @param conversationId The id of the conversation
   * @param content The content of the user's message
   * @returns The response from the chatbot
   */
  async sendMessage(conversationId: string, content: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify({ 
          user_input: content
         }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const chatbotResponse = await response.json();
      return chatbotResponse.reply;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  /**
   * Create a new conversation.
   * 
   * @returns The ID of the newly created conversation
   */
  async addConversation(): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.conversation_id;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }
} 