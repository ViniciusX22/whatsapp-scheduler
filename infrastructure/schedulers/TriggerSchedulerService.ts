import { tasks } from "@trigger.dev/sdk/v3";
import { ISchedulerService } from "../../application/interfaces";
import { ScheduledMessage } from "../../domain/entities";
import type { sendScheduledMessage } from "../../trigger/scheduled-message";

export class TriggerSchedulerService implements ISchedulerService {
  async scheduleMessage(scheduledMessage: ScheduledMessage): Promise<string> {
    try {
      const payload = {
        recipient: scheduledMessage.recipient.toString(),
        message: scheduledMessage.messageText.toString(),
        scheduledAt: scheduledMessage.scheduledAt.toISOString(),
      };

      const taskHandle = await tasks.trigger<typeof sendScheduledMessage>(
        "send-scheduled-message",
        payload
      );

      console.log(`Scheduled message task created with ID: ${taskHandle.id}`);
      return taskHandle.id;
    } catch (error) {
      console.error("Error scheduling message with Trigger.dev:", error);
      throw error;
    }
  }
}
