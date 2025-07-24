import axios from "axios";
import { IWhatsAppService } from "../../application/interfaces";

const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL!;
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY!;
const EVOLUTION_INSTANCE = process.env.EVOLUTION_INSTANCE!;

export class WhatsAppService implements IWhatsAppService {
  private getHeaders() {
    return {
      "Content-Type": "application/json",
      apikey: EVOLUTION_API_KEY,
    };
  }

  /**
   * Add a reaction emoji to a message
   */
  async addReaction(
    messageId: string,
    remoteJid: string,
    emoji: string
  ): Promise<void> {
    try {
      const response = await axios.post(
        `${EVOLUTION_API_URL}/message/sendReaction/${EVOLUTION_INSTANCE}`,
        {
          key: {
            id: messageId,
            fromMe: true,
            remoteJid: remoteJid,
          },
          reaction: emoji,
        },
        { headers: this.getHeaders() }
      );

      console.log("Reaction added successfully:", response.data);
    } catch (error) {
      console.error("Error adding reaction:", error);

      if (error instanceof Error) {
        console.error("Reaction error details:", error.message);
      }
    }
  }

  /**
   * Send a WhatsApp message
   */
  async sendMessage(recipient: string, message: string): Promise<void> {
    try {
      const response = await axios.post(
        `${EVOLUTION_API_URL}/message/sendText/${EVOLUTION_INSTANCE}`,
        {
          number: recipient,
          text: message,
        },
        { headers: this.getHeaders() }
      );

      console.log("Message sent successfully:", response.data);
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }
}
