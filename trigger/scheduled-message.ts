import { task, wait } from "@trigger.dev/sdk/v3";
import { WhatsAppService } from "../infrastructure/services/WhatsAppService";

// Initialize WhatsApp service
const whatsappService = new WhatsAppService();

// Define the payload type for the scheduled message task
export type ScheduledMessagePayload = {
  recipient: string;
  message: string;
  scheduledAt: string; // ISO date string
};

// Create a task that will send the scheduled message
export const sendScheduledMessage = task({
  id: "send-scheduled-message",
  run: async (payload: ScheduledMessagePayload) => {
    try {
      // Calculate delay until the scheduled time
      const scheduledTime = new Date(payload.scheduledAt);
      const now = new Date();
      const delay = scheduledTime.getTime() - now.getTime();

      console.log(`Message scheduled for: ${scheduledTime.toISOString()}`);
      console.log(`Current time: ${now.toISOString()}`);
      console.log(`Delay: ${delay}ms`);

      if (delay > 0) {
        // Wait until the scheduled time using Trigger.dev's wait function
        console.log(`Waiting ${delay}ms until scheduled time...`);
        await wait.for({ seconds: Math.ceil(delay / 1000) });
      }

      // Send the message
      console.log(
        `Sending message to ${payload.recipient}: ${payload.message}`
      );
      await whatsappService.sendMessage(payload.recipient, payload.message);

      return {
        success: true,
        message: "Scheduled message sent successfully",
        sentAt: new Date().toISOString(),
        recipient: payload.recipient,
      };
    } catch (error) {
      console.error("Error sending scheduled message:", error);
      throw error;
    }
  },
});
