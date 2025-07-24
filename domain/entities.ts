// Domain Value Objects
export class WhatsAppId {
  constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error("WhatsApp ID cannot be empty");
    }
    if (!value.match(/^\d+$/)) {
      throw new Error("WhatsApp ID must contain only digits");
    }
  }

  toString(): string {
    return this.value;
  }
}

export class MessageText {
  constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error("Message text cannot be empty");
    }
    if (value.length > 4096) {
      throw new Error("Message text too long");
    }
  }

  toString(): string {
    return this.value;
  }
}

export class ScheduleTime {
  constructor(private readonly value: Date) {
    if (value < new Date()) {
      throw new Error("Schedule time cannot be in the past");
    }
  }

  toDate(): Date {
    return new Date(this.value);
  }

  toISOString(): string {
    return this.value.toISOString();
  }
}

// Domain Entity
export class ScheduledMessage {
  constructor(
    public readonly id: string,
    public readonly recipient: WhatsAppId,
    public readonly messageText: MessageText,
    public readonly scheduledAt: ScheduleTime,
    public readonly status: "pending" | "sent" | "failed" = "pending"
  ) {}

  static create(
    recipient: string,
    messageText: string,
    scheduledAt: Date
  ): ScheduledMessage {
    return new ScheduledMessage(
      crypto.randomUUID(),
      new WhatsAppId(recipient),
      new MessageText(messageText),
      new ScheduleTime(scheduledAt)
    );
  }
}
