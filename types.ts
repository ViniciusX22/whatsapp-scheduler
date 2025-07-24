export type MessageRequestBody = {
  event: string;
  instance: string;
  data: {
    key: {
      remoteJid: string;
      fromMe: boolean;
      id: string;
    };
    pushName: string;
    status: string;
    message: {
      conversation?: string;
      contactMessage?: {
        displayName: string;
        vcard: string;
      };
    };
    contextInfo?: {
      stanzaId: string;
      participant: string;
      quotedMessage?: {
        contactMessage?: {
          displayName: string;
          vcard: string;
        };
      };
      expiration?: number;
      ephemeralSettingTimestamp?: string;
      entryPointConversionSource?: string;
      entryPointConversionApp?: string;
      entryPointConversionDelaySeconds?: number;
      disappearingMode?: {
        initiator: string;
        trigger: string;
        initiatedByMe: boolean;
      };
    };
    messageType: string;
    messageTimestamp: number;
    instanceId: string;
    source: string;
  };
  destination: string;
  date_time: string;
  sender: string;
  server_url: string;
  apikey: string;
};

export type MessageResponseBody =
  | {
      message: string;
    }
  | {
      error: string;
    };
