import express, { Request, Response } from "express";
import dotenv from "dotenv";
import * as chrono from "chrono-node";
import { MessageRequestBody, MessageResponseBody } from "./types";
import { whatsappService } from "./services/whatsapp";
import type {
  sendScheduledMessage,
  ScheduledMessagePayload,
} from "./trigger/scheduled-message";
import { tasks } from "@trigger.dev/sdk/v3";

dotenv.config();

const app = express();
const port = process.env.PORT ?? 3000;
const timezone = process.env.TIMEZONE ?? "UTC";

app.use(express.json());

app.post(
  "/schedule",
  async (
    req: Request<{}, {}, MessageRequestBody, {}>,
    res: Response<MessageResponseBody>
  ) => {
    const { data } = req.body;
    const { messageType, message, contextInfo, key } = data;

    // Extract message ID and sender for reactions
    const messageId = key.id;
    const remoteJid = key.remoteJid;

    try {
      // 1. ensures that the message was sent by the user itself
      // 3. ensures a quoted message of type contectMessage is present
      // 2. ensures that the message type is "conversation"
      // 4. sets "message" constant as the message text
      // 6. sets "when" constant as the text from the line that starts with "> "
      // 5. sets "recipient" constant as the first number in the contact vCard
      if (
        messageType !== "conversation" ||
        !message.conversation ||
        !contextInfo?.quotedMessage?.contactMessage
      ) {
        console.error(
          "Invalid message format",
          JSON.stringify(req.body, null, 2)
        );

        // Add X reaction for error
        await whatsappService.addReaction(messageId, remoteJid, "❌");

        res.status(400).json({ error: "Invalid message format" });
        return;
      }

      const messageText = message.conversation.replace(/^> .+$/m, "").trim();
      const recipient =
        contextInfo.quotedMessage.contactMessage.vcard.match(/waid=(\d+)/)?.[1];
      const when = message.conversation.match(/^> (.+)/m)?.[1];

      if (!recipient || !when) {
        console.error("Missing recipient or time", {
          recipient,
          when,
        });

        // Add X reaction for error
        await whatsappService.addReaction(messageId, remoteJid, "❌");

        res.status(400).json({ error: "Missing recipient or time" });
        return;
      }

      // Parse the "when" text into a Date object using English locale
      const parsingReference = {
        instant: new Date(),
        timezone: timezone,
      };

      const parsedDates = chrono.parse(when, parsingReference);

      if (parsedDates.length === 0 || !parsedDates[0].start) {
        console.error("Could not parse date from:", when);

        // Add X reaction for error
        await whatsappService.addReaction(messageId, remoteJid, "❌");

        res.status(400).json({
          error:
            "Invalid date format. Try using formats like 'tomorrow at 10am', 'monday at 2pm', or 'in 2 hours'",
        });
        return;
      }

      const scheduledDate = parsedDates[0].start.date();

      console.log(`Message: ${messageText}`);
      console.log(`Recipient: ${recipient}`);
      console.log(`When: ${when}`);
      console.log(`Scheduled Date (UTC): ${scheduledDate.toISOString()}`);
      console.log(
        `Scheduled Date (Local): ${scheduledDate.toLocaleString("pt-BR", {
          timeZone: timezone,
        })}`
      );
      console.log(`Timezone: ${timezone}`);

      // Schedule the message using Trigger.dev
      const payload: ScheduledMessagePayload = {
        recipient,
        message: messageText,
        scheduledAt: scheduledDate.toISOString(),
      };

      // Trigger the scheduled message task
      const taskHandle = await tasks.trigger<typeof sendScheduledMessage>(
        "send-scheduled-message",
        payload
      );

      console.log(`Scheduled message task created with ID: ${taskHandle.id}`);

      // Add checkmark reaction for success
      await whatsappService.addReaction(messageId, remoteJid, "✅");

      res.status(201).json({ message: "Message scheduled successfully" });
    } catch (error) {
      console.error("Error scheduling message:", error);

      // Add X reaction for error
      try {
        await whatsappService.addReaction(messageId, remoteJid, "❌");
      } catch (reactionError) {
        console.error("Error adding error reaction:", reactionError);
      }

      res.status(500).json({ error: "Internal server error" });
    }
  }
);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

export default app;
