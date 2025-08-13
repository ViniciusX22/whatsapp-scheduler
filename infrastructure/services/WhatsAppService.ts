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
      console.log(
        `🔧 Adding reaction ${emoji} to message ${messageId} in instance ${instance}`
      );
      console.log(
        `📡 Evolution API URL: ${EVOLUTION_API_URL}/message/sendReaction/${instance}`
      );

      const payload = {
        key: {
          id: messageId,
          fromMe: true,
          remoteJid: remoteJid,
        },
        reaction: emoji,
      };

      console.log(`📦 Reaction payload:`, JSON.stringify(payload, null, 2));

      const response = await axios.post(
        `${EVOLUTION_API_URL}/message/sendReaction/${instance}`,
        payload,
        { headers: this.getHeaders() }
      );

      console.log("✅ Reaction added successfully:", response.data);
    } catch (error) {
      console.error("❌ Error adding reaction:", error);

      if (axios.isAxiosError(error)) {
        console.error("🚨 Evolution API error details:");
        console.error("Status:", error.response?.status);
        console.error("Status Text:", error.response?.statusText);
        console.error("Response data:", error.response?.data);
        console.error("Request URL:", error.config?.url);
      } else if (error instanceof Error) {
        console.error("Error message:", error.message);
      }

      // Re-throw the error so the caller can handle it
      throw error;
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
