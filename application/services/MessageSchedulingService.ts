import {
  IMessageParser,
  IWhatsAppService,
  ISchedulerService,
  WebhookProcessingResponse,
  ScheduleMessageRequest,
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
    const { data } = payload;
    const { key } = data;

    // Only process messages from the user
    if (!key.fromMe) {
      return {
        success: true,
        action: "ignored",
        message: "Message not from user, ignored",
      };
    }

    try {
      // Parse the scheduling message
      const scheduleRequest =
        this.messageParser.parseSchedulingMessage(payload);

      if (!scheduleRequest) {
        await this.addErrorReaction(key.id, key.remoteJid);
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
        scheduleRequest.scheduledAt
      );

      // Schedule the message
      const taskId = await this.schedulerService.scheduleMessage(
        scheduledMessage
      );

      // Add success reaction
      await this.whatsappService.addReaction(key.id, key.remoteJid, "✅");

      return {
        success: true,
        action: "scheduled",
        message: `Message scheduled successfully with task ID: ${taskId}`,
      };
    } catch (error) {
      console.error("Error processing webhook message:", error);

      // Add error reaction
      await this.addErrorReaction(key.id, key.remoteJid);

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
    remoteJid: string
  ): Promise<void> {
    try {
      await this.whatsappService.addReaction(messageId, remoteJid, "❌");
    } catch (error) {
      console.error("Error adding error reaction:", error);
    }
  }
}
