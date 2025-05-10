import { Message, User } from './types';
import { AuthService } from './AuthService';

interface TokenResponse {
  access_token: string;
  user: User;
  conversations: string[];
}

export class ChatClient {
  private baseUrl: string;

  constructor(baseUrl: string = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000') {
    this.baseUrl = baseUrl;
  }

  /**
   * Exchange an authorization code for a JWT token and user information
   * 
   * @param code The authorization code to exchange
   * @returns The complete response containing token and user information
   */
  async exchangeCodeForToken(code: string): Promise<TokenResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/token?code=${encodeURIComponent(code)}`, {
        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
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
          'Authorization': `Bearer ${AuthService.getToken()}`
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
          'Authorization': `Bearer ${AuthService.getToken()}`
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
          'Authorization': `Bearer ${AuthService.getToken()}`
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

  /**
   * Get all conversations for the authenticated user.
   * 
   * @returns Array of conversation IDs
   */
  async getConversations(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/conversations`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${AuthService.getToken()}`
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }
  }
} 