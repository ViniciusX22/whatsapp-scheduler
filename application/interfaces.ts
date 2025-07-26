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

export type AddReactionPayload = {
  instance: string;
  messageId: string;
  remoteJid: string;
  emoji: string;
};

export type SendMessagePayload = {
  instance: string;
  recipient: string;
  message: string;
};

// WhatsApp Service Interface
export interface IWhatsAppService {
  addReaction(payload: AddReactionPayload): Promise<void>;
  sendMessage(payload: SendMessagePayload): Promise<void>;
}

// Scheduler Service Interface
export interface ISchedulerService {
  scheduleMessage(scheduledMessage: ScheduledMessage): Promise<string>;
}

// Date Parser Interface
export interface IDateParser {
  parse(text: string, timezone?: string): Date | null;
}
