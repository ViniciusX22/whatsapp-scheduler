#!/usr/bin/env node

/**
 * Utility script to test date parsing with different locales
 * Usage: npx tsx test-locales.ts
 */

import { ChronoDateParser } from "../infrastructure/parsers/ChronoDateParser";
import {
  SUPPORTED_LOCALES,
  getAvailableLocales,
} from "../infrastructure/config/locales";

const testPhrases = [
  "tomorrow at 3pm",
  "next monday 9am",
  "in 2 hours",
  "december 25th 2024",
  "next week",
  "hoje às 15h", // Portuguese
  "mañana a las 3pm", // Spanish
  "demain à 15h", // French
  "morgen um 15 Uhr", // German
];

async function testLocales() {
  console.log("🌍 Testing Date Parsing with Different Locales\n");

  const availableLocales = getAvailableLocales();

  for (const localeCode of availableLocales) {
    const locale = SUPPORTED_LOCALES[localeCode];
    console.log(
      `\n📍 Testing ${locale.name} (${locale.code}) - ${locale.timezone}`
    );
    console.log("=" + "=".repeat(50));

    const parser = new ChronoDateParser(localeCode);

    for (const phrase of testPhrases) {
      const result = parser.parse(phrase);
      const status = result ? "✅" : "❌";
      const dateStr = result ? result.toLocaleString() : "Failed to parse";
      console.log(`${status} "${phrase}" → ${dateStr}`);
    }
  }

  console.log("\n🎯 Environment Configuration:");
  console.log("Add to your .env file:");
  console.log("CHRONO_LOCALE=pt  # for Portuguese");
  console.log("CHRONO_LOCALE=en  # for English");
  console.log("CHRONO_LOCALE=es  # for Spanish");
  console.log("# etc...");
}

// Run the test if called directly
if (require.main === module) {
  testLocales().catch(console.error);
}

export { testLocales };
