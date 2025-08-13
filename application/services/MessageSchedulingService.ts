import {
  IMessageParser,
  IWhatsAppService,
  ISchedulerService,
  WebhookProcessingResponse,
} from "../interfaces";
import { WhatsAppWebhookPayloadType } from "../../domain/models";
import { ScheduledMessage } from "../../domain/entities";

export class MessageSchedulingService {
  constructor(
    private readonly messageParser: IMessageParser,
    private readonly whatsappService: IWhatsAppService,
    private readonly schedulerService: ISchedulerService
  ) {}

  async processWebhookMessage(
    payload: WhatsAppWebhookPayloadType
  ): Promise<WebhookProcessingResponse> {
    const { data, sender, instance } = payload;

    // Debug logging
    console.log(
      "🔍 Debug - Payload received:",
      JSON.stringify(payload, null, 2)
    );
    console.log("  sender:", sender);
    console.log("  data.key.remoteJid:", data?.key?.remoteJid);
    console.log("  match:", sender === data?.key?.remoteJid);
    console.log("  message text:", data?.message?.conversation);

    // Temporarily allow ping messages to bypass the self-message check for testing
    const messageText = data?.message?.conversation?.trim();
    if (messageText === "/ping") {
      console.log(
        "🏓 Ping message detected - bypassing self-message check for testing"
      );

      if (!data?.key) {
        return {
          success: false,
          action: "ping_failed",
          message: "Invalid message key",
          error: "Missing message key",
        };
      }

      const { id: messageId, remoteJid } = data.key;

      try {
        await this.whatsappService.addReaction({
          instance,
          messageId,
          remoteJid,
          emoji: "🏓", // Ping pong emoji
        });

        console.log(`Ping test successful for message ${messageId}`);
        return {
          success: true,
          action: "ping",
          message: "Ping test successful - all services are working correctly",
        };
      } catch (error) {
        console.error("Ping test failed:", error);
        return {
          success: false,
          action: "ping_failed",
          message: "Ping test failed - service may be warming up",
          error: error instanceof Error ? error.message : String(error),
        };
      }
    }

    // Only process messages where the sender and recipient are the same
    if (!data?.key || sender !== data?.key?.remoteJid) {
      console.log("❌ Message ignored - not from user to themselves");
      return {
        success: true,
        action: "ignored",
        message: "Message not from user to themselves, ignored",
      };
    }

    const { id: messageId, remoteJid } = data.key;

    try {
      // Parse the scheduling message
      const scheduleRequest =
        this.messageParser.parseSchedulingMessage(payload);

      if (!scheduleRequest) {
        await this.addErrorReaction(messageId, remoteJid, instance);
        return {
          success: false,
          action: "error",
          message: "Invalid message format or missing required information",
          error: "Message parsing failed",
        };
      }

      // Create domain entity
      const scheduledMessage = ScheduledMessage.create(
        scheduleRequest.recipient,
        scheduleRequest.messageText,
        scheduleRequest.scheduledAt,
        instance
      );

      // Schedule the message
      const taskId = await this.schedulerService.scheduleMessage(
        scheduledMessage
      );

      // Add success reaction
      await this.whatsappService.addReaction({
        instance,
        messageId,
        remoteJid,
        emoji: "✅",
      });

      return {
        success: true,
        action: "scheduled",
        message: `Message scheduled successfully with task ID: ${taskId}`,
      };
    } catch (error) {
      console.error("Error processing webhook message:", error);

      // Add error reaction
      await this.addErrorReaction(messageId, remoteJid, instance);

      return {
        success: false,
        action: "error",
        message: "Internal error processing message",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  private async addErrorReaction(
    messageId: string,
    remoteJid: string,
    instance: string
  ): Promise<void> {
    try {
      await this.whatsappService.addReaction({
        messageId,
        remoteJid,
        instance,
        emoji: "❌",
      });
    } catch (error) {
      console.error("Error adding error reaction:", error);
    }
  }
}
