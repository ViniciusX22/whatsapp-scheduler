import * as chrono from "chrono-node";
import { IDateParser } from "../../application/interfaces";

export class ChronoDateParser implements IDateParser {
  parse(text: string, timezone: string): Date | null {
    try {
      const parsingReference = {
        instant: new Date(),
        timezone: timezone,
      };

      const parsedDates = chrono.parse(text, parsingReference);

      if (parsedDates.length === 0 || !parsedDates[0].start) {
        return null;
      }

      return parsedDates[0].start.date();
    } catch (error) {
      console.error("Error parsing date:", error);
      return null;
    }
  }
}
