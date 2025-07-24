import {
  IMessageParser,
  IDateParser,
  ScheduleMessageRequest,
} from "../../application/interfaces";
import { WhatsAppWebhookPayloadType } from "../../domain/models";

export class WhatsAppMessageParser implements IMessageParser {
  constructor(
    private readonly dateParser: IDateParser,
    private readonly timezone: string
  ) {}

  parseSchedulingMessage(
    payload: WhatsAppWebhookPayloadType
  ): ScheduleMessageRequest | null {
    const { data } = payload;
    const { messageType, message, contextInfo } = data;

    // Validate message structure
    if (
      messageType !== "conversation" ||
      !message.conversation ||
      !contextInfo?.quotedMessage?.contactMessage
    ) {
      return null;
    }

    // Extract message text (everything except the scheduling line)
    const messageText = message.conversation.replace(/^> .+$/m, "").trim();
    if (!messageText) {
      return null;
    }

    // Extract recipient from vCard
    const recipient =
      contextInfo.quotedMessage.contactMessage.vcard.match(/waid=(\d+)/)?.[1];
    if (!recipient) {
      return null;
    }

    // Extract scheduling time
    const whenText = message.conversation.match(/^> (.+)/m)?.[1];
    if (!whenText) {
      return null;
    }

    // Parse the date
    const scheduledAt = this.dateParser.parse(whenText, this.timezone);
    if (!scheduledAt) {
      return null;
    }

    return {
      messageText,
      recipient,
      scheduledAt,
    };
  }
}
