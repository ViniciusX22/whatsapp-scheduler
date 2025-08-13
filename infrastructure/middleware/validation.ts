import { Request, Response, NextFunction } from "express";
import { WhatsAppWebhookPayload } from "../../domain/models";
import { type } from "arktype";

export interface ValidatedRequest<T> extends Request {
  validatedBody: T;
}

export const validateWhatsAppWebhook = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = WhatsAppWebhookPayload(req.body);

    if (validation instanceof type.errors) {
      console.error("Validation errors:", validation.summary);
      res.status(400).json({
        error: "Invalid request body",
        details: validation.summary,
      });
      return;
    }

    // If validation passes, attach the validated data to the request
    req.body = validation;
    next();
  } catch (error) {
    console.error("Validation error:", error);
    res.status(400).json({
      error: "Invalid request body",
      details:
        error instanceof Error ? error.message : "Unknown validation error",
    });
    return;
  }
};
