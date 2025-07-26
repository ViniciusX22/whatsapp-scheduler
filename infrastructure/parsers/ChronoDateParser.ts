import { pt as chrono } from "chrono-node";
import { IDateParser } from "../../application/interfaces";

export class ChronoDateParser implements IDateParser {
  parse(text: string, timezone: string): Date | null {
    try {
      const parsingReference: chrono.ParsingReference = {
        instant: new Date(),
        timezone: timezone,
      };
      const parsingOptions: chrono.ParsingOption = {
        forwardDate: true,
      };

      const parsedDate = chrono.parseDate(
        text,
        parsingReference,
        parsingOptions
      );

      return parsedDate;
    } catch (error) {
      console.error("Error parsing date:", error);
      return null;
    }
  }
}
