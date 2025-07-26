import { IDateParser } from "../../application/interfaces";
import {
  getLocaleConfig,
  getLocaleFromEnv,
  LocaleConfig,
} from "../config/locales";

export class ChronoDateParser implements IDateParser {
  private locale: LocaleConfig;

  constructor(localeCode?: string) {
    const selectedLocale = localeCode || getLocaleFromEnv();
    this.locale = getLocaleConfig(selectedLocale);
    console.log(
      `ChronoDateParser initialized with locale: ${this.locale.name} (${this.locale.code})`
    );
  }

  parse(text: string, timezone?: string): Date | null {
    try {
      // Use the locale-specific timezone as default, but allow override
      const selectedTimezone = timezone || this.locale.timezone;

      const parsingReference = {
        instant: new Date(),
        timezone: selectedTimezone,
      };

      const parsingOptions = {
        forwardDate: true,
      };

      // Use the locale-specific chrono parser
      const parsedDate = this.locale.chrono.parseDate(
        text,
        parsingReference,
        parsingOptions
      );

      if (parsedDate) {
        console.log(
          `Parsed "${text}" to ${parsedDate.toISOString()} using locale ${
            this.locale.code
          }`
        );
      }

      return parsedDate;
    } catch (error) {
      console.error("Error parsing date:", error);
      return null;
    }
  }

  /**
   * Get current locale information
   */
  getLocaleInfo(): LocaleConfig {
    return this.locale;
  }

  /**
   * Change locale at runtime
   */
  setLocale(localeCode: string): void {
    this.locale = getLocaleConfig(localeCode);
    console.log(`Locale changed to: ${this.locale.name} (${this.locale.code})`);
  }
}
