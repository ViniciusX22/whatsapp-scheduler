import express from 'express';
import dotenv from 'dotenv';
import { validateWhatsAppWebhook } from './infrastructure/middleware/validation';
import { WhatsAppService } from './infrastructure/services/WhatsAppService';
import { ChronoDateParser } from './infrastructure/parsers/ChronoDateParser';
import { WhatsAppMessageParser } from './infrastructure/parsers/WhatsAppMessageParser';
import { TriggerSchedulerService } from './infrastructure/schedulers/TriggerSchedulerService';
import { MessageSchedulingService } from './application/services/MessageSchedulingService';
import { WhatsAppWebhookPayloadType } from './domain/models';

dotenv.config();

const app = express();
app.use(express.json());

// Setup timezone
const TIMEZONE = process.env.TIMEZONE || 'America/Sao_Paulo';

// Initialize services with dependency injection
const whatsAppService = new WhatsAppService();
const dateParser = new ChronoDateParser();
const messageParser = new WhatsAppMessageParser(dateParser, TIMEZONE);
const schedulerService = new TriggerSchedulerService();

// Initialize application service
const messageSchedulingService = new MessageSchedulingService(
  messageParser,
  whatsAppService,
  schedulerService
);

app.post('/schedule', validateWhatsAppWebhook, async (req, res) => {
  try {
    const payload: WhatsAppWebhookPayloadType = req.body;
    
    // Process the webhook message
    await messageSchedulingService.processWebhookMessage(payload);
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
