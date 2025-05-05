import { Message } from './types';

export class ChatClient {
  private baseUrl: string;

  constructor(baseUrl: string = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000') {
    this.baseUrl = baseUrl;
  }

  /**
   * Get the conversation messages.
   * 
   * @param conversationId The id of the conversation
   * @returns The conversation history
   */
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

  /**
   * Send a message to the chatbot.
   * 
   * @param conversationId The id of the conversation
   * @param content The content of the user's message
   * @returns The response from the chatbot
   */
  async sendMessage(conversationId: string, content: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          conversation_id: conversationId,
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
} 