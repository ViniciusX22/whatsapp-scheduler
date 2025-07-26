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

    // Only process messages where the sender and recipient are the same
    if (!data?.key || sender !== data?.key?.remoteJid) {
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
