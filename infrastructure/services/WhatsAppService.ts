import axios from "axios";
import {
  AddReactionPayload,
  IWhatsAppService,
  SendMessagePayload,
} from "../../application/interfaces";

const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL!;
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY!;

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
  async addReaction({
    instance,
    messageId,
    remoteJid,
    emoji,
  }: AddReactionPayload): Promise<void> {
    try {
      const response = await axios.post(
        `${EVOLUTION_API_URL}/message/sendReaction/${instance}`,
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
  async sendMessage({
    instance,
    recipient,
    message,
  }: SendMessagePayload): Promise<void> {
    try {
      const response = await axios.post(
        `${EVOLUTION_API_URL}/message/sendText/${instance}`,
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
