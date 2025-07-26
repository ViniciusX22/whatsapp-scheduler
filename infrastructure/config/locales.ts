/**
 * Locale configuration for Chrono date parser
 */

export interface LocaleConfig {
  code: string;
  name: string;
  chrono: any; // chrono-node locale
  timezone: string;
}

// Import all available locales from chrono-node
import {
  en as chronoEn,
  pt as chronoPt,
  de as chronoDe,
  fr as chronoFr,
  es as chronoEs,
  ja as chronoJa,
  zh as chronoZh,
  ru as chronoRu,
  nl as chronoNl,
} from "chrono-node";

export const SUPPORTED_LOCALES: Record<string, LocaleConfig> = {
  en: {
    code: "en",
    name: "English",
    chrono: chronoEn,
    timezone: "UTC",
  },
  pt: {
    code: "pt",
    name: "Portuguese",
    chrono: chronoPt,
    timezone: "BRT",
  },
  es: {
    code: "es",
    name: "Spanish",
    chrono: chronoEs,
    timezone: "CET",
  },
  fr: {
    code: "fr",
    name: "French",
    chrono: chronoFr,
    timezone: "CET",
  },
  de: {
    code: "de",
    name: "German",
    chrono: chronoDe,
    timezone: "CET",
  },
  ja: {
    code: "ja",
    name: "Japanese",
    chrono: chronoJa,
    timezone: "JST",
  },
  zh: {
    code: "zh",
    name: "Chinese",
    chrono: chronoZh,
    timezone: "CST",
  },
  ru: {
    code: "ru",
    name: "Russian",
    chrono: chronoRu,
    timezone: "MSK",
  },
  nl: {
    code: "nl",
    name: "Dutch",
    chrono: chronoNl,
    timezone: "CET",
  },
};

export const DEFAULT_LOCALE = "en";

/**
 * Get locale configuration by code
 */
export function getLocaleConfig(localeCode: string): LocaleConfig {
  const locale = SUPPORTED_LOCALES[localeCode.toLowerCase()];
  if (!locale) {
    console.warn(
      `Locale '${localeCode}' not supported, falling back to '${DEFAULT_LOCALE}'`
    );
    return SUPPORTED_LOCALES[DEFAULT_LOCALE];
  }
  return locale;
}

/**
 * Get available locale codes
 */
export function getAvailableLocales(): string[] {
  return Object.keys(SUPPORTED_LOCALES);
}

/**
 * Get locale from environment variable with fallback
 */
export function getLocaleFromEnv(): string {
  const envLocale =
    process.env.CHRONO_LOCALE || process.env.LOCALE || DEFAULT_LOCALE;
  return envLocale.toLowerCase();
}
