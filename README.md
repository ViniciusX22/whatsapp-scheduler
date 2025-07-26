# WhatsApp Scheduler

A WhatsApp message scheduler deployed on Vercel that uses Evolution API and Trigger.dev for scheduling messages.

## Setup

### 1. Environment Variables
Update your `.env` file with the following variables:

```env
TIMEZONE=UTC # Timezone name or minute-offset (e.g. "BRT" or "-180")
EVOLUTION_API_URL=api-base-url
EVOLUTION_API_KEY=your-evolution-api-key-here
TRIGGER_SECRET_KEY=your-trigger-secret-key-here

# Locale Configuration (Optional)
CHRONO_LOCALE=en # Language for date parsing (see supported locales below)
```

#### Supported Locales
The app supports multiple languages for date parsing:

| Code | Language | Default Timezone | Examples |
|------|----------|------------------|----------|
| `en` | English | UTC | "tomorrow at 3pm", "next monday 9am" |
| `pt` | Portuguese | BRT | "amanhã às 15h", "segunda que vem às 9h" |
| `es` | Spanish | CET | "mañana a las 3pm", "el lunes a las 9" |
| `fr` | French | CET | "demain à 15h", "lundi prochain à 9h" |
| `de` | German | CET | "morgen um 15 Uhr", "nächsten Montag um 9" |
| `ja` | Japanese | JST | "明日の午後3時", "来週の月曜日午前9時" |
| `zh` | Chinese | CST | "明天下午3点", "下周一上午9点" |
| `ru` | Russian | MSK | "завтра в 15:00", "в понедельник в 9 утра" |
| `nl` | Dutch | CET | "morgen om 15:00", "maandag om 9 uur" |

**Default:** English (`en`) if not specified.

### 2. Evolution API Setup
- Make sure your Evolution API instance is running and accessible. You can clone the [oficial repository](https://github.com/EvolutionAPI/evolution-api) or use this [fork](https://github.com/ViniciusX22/evolution-api) which has already been tested for this purpose.
- Get your API key from the Evolution API dashboard
- Update the `EVOLUTION_API_KEY` in your `.env` file

### 3. Trigger.dev Setup
- Sign up at [trigger.dev](https://trigger.dev)
- Create a new project
- Get your secret key and update `TRIGGER_SECRET_KEY` in your `.env` file
- Deploy your triggers using: `npx trigger.dev deploy`

## How it works

### 1. Send a WhatsApp Message
Send a message in WhatsApp to your own number (you can use the URL shorcut `https://wa.me/<your_phone_number_here>`) with the following format:
```
Your message here
> tomorrow at 10am
```

The message should:
- Quote a contact message (the person you want to send the message to)
- Have the message text
- Have a line starting with `> ` followed by the time specification

### 2. Message Processing
The app will:
- Extract the recipient from the quoted contact's vCard
- Parse the message text (everything except the `> ` line)
- Parse the scheduling time using chrono-node
- Schedule the message using Trigger.dev

### 3. Feedback Reactions
- ✅ Checkmark emoji: Message scheduled successfully
- ❌ X emoji: Error occurred (invalid format, parsing error, etc.)

### 4. Message Delivery
Trigger.dev will:
- Wait until the scheduled time
- Send the message via Evolution API
- Log the delivery status

## Supported Time Formats

The app supports English time expressions like:
- `tomorrow at 10am`
- `monday at 2pm`
- `in 2 hours`
- `next friday at 3pm`
- `in 30 minutes`
- `december 25th at noon`

## API Endpoints

### POST /schedule
Processes incoming WhatsApp messages and schedules them.

**Request Body**: `MessageRequestBody` (WhatsApp webhook payload)

**Responses**:
- `200`: Message processed successfully
- `400`: Invalid message format or parsing error
- `500`: Internal server error

### GET /
Health check endpoint

**Response**: `{ "status": "ok" }`

## Development

```bash
# Install dependencies
npm install

# Start Vercel's development server
npm start

# Deploy Trigger.dev tasks
npm run deploy:trigger

# Deploy Vercel function
npm run deploy:vercel

# Deploys both Vercel function and Trigger.dev tasks
npm run deploy
```
