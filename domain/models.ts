import { type } from "arktype";

// Domain models using arktype
export const MessageKey = type({
  remoteJid: "string",
  fromMe: "boolean",
  id: "string",
});

export const ContactMessage = type({
  displayName: "string",
  vcard: "string",
});

export const QuotedMessage = type({
  contactMessage: ContactMessage,
});

export const ContextInfo = type({
  stanzaId: "string",
  participant: "string",
  quotedMessage: QuotedMessage,
  "expiration?": "number",
  "ephemeralSettingTimestamp?": "string",
  "entryPointConversionSource?": "string",
  "entryPointConversionApp?": "string",
  "entryPointConversionDelaySeconds?": "number",
  "disappearingMode?": {
    initiator: "string",
    trigger: "string",
    initiatedByMe: "boolean",
  },
});

export const Message = type({
  "conversation?": "string",
  "contactMessage?": ContactMessage,
});

export const MessageData = type({
  key: MessageKey,
  pushName: "string",
  status: "string",
  message: Message,
  "contextInfo?": ContextInfo,
  messageType: "string",
  messageTimestamp: "number",
  instanceId: "string",
  source: "string",
});

export const WhatsAppWebhookPayload = type({
  event: "string",
  instance: "string",
  "data?": MessageData,
  destination: "string",
  date_time: "string",
  sender: "string",
  server_url: "string",
  apikey: "string",
});

// Type inference for TypeScript
export type MessageKeyType = typeof MessageKey.infer;
export type ContactMessageType = typeof ContactMessage.infer;
export type QuotedMessageType = typeof QuotedMessage.infer;
export type ContextInfoType = typeof ContextInfo.infer;
export type MessageType = typeof Message.infer;
export type MessageDataType = typeof MessageData.infer;
export type WhatsAppWebhookPayloadType = typeof WhatsAppWebhookPayload.infer;
