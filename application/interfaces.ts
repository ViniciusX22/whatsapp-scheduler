import { WhatsAppWebhookPayloadType } from "../domain/models";
import { ScheduledMessage } from "../domain/entities";

// Application DTOs
export interface ScheduleMessageRequest {
  messageText: string;
  recipient: string;
  scheduledAt: Date;
}

export interface ScheduleMessageResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface WebhookProcessingResponse {
  success: boolean;
  action: "scheduled" | "ignored" | "error";
  message: string;
  error?: string;
}

// Message Parser Service Interface
export interface IMessageParser {
  parseSchedulingMessage(
    payload: WhatsAppWebhookPayloadType
  ): ScheduleMessageRequest | null;
}

// WhatsApp Service Interface
export interface IWhatsAppService {
  addReaction(
    messageId: string,
    remoteJid: string,
    emoji: string
  ): Promise<void>;
  sendMessage(recipient: string, message: string): Promise<void>;
}

// Scheduler Service Interface
export interface ISchedulerService {
  scheduleMessage(scheduledMessage: ScheduledMessage): Promise<string>;
}

// Date Parser Interface
export interface IDateParser {
  parse(text: string, timezone: string): Date | null;
}
