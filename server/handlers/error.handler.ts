import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { ZodError } from "zod";
import { logger } from "@/server/services/logger.service";

/**
 * Global error handler for Hono app
 * Handles HTTPException, Zod validation errors, and generic errors
 */
export function errorHandler(err: Error, c: Context) {
  const method = c.req.method;
  const path = c.req.path;

  // Handle HTTPException (our custom errors)
  if (err instanceof HTTPException) {
    logger.apiError(method, path, err.status, err.message);
    return c.json(
      {
        error: err.message,
        status: err.status,
      },
      err.status,
    );
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const messages = err.issues.map((issue) => {
      const issuePath = issue.path.length > 0 ? issue.path.join(".") : "root";
      return `${issuePath}: ${issue.message}`;
    });
    logger.apiError(method, path, 400, `Validation failed: ${messages.join(", ")}`);
    return c.json(
      {
        error: "Validation failed",
        details: messages,
        status: 400,
      },
      400,
    );
  }

  // Handle generic errors
  logger.apiError(method, path, 500, err);
  return c.json(
    {
      error: err.message || "Internal server error",
      status: 500,
    },
    500,
  );
}
