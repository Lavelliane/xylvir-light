import { Hono } from "hono";
import { handle } from "hono/vercel";
import type { AuthType } from "@/lib/auth";
import { errorHandler } from "@/server/handlers/error.handler";
import { loggerMiddleware } from "@/server/middleware/logger.middleware";
import auth from "@/server/routes/auth/auth.route";
import todos from "@/server/routes/todo/todo.route";

const app = new Hono<{ Variables: AuthType }>({ strict: false }).basePath("/api");

// Request logging middleware
app.use("*", loggerMiddleware);

// Global error handler
app.onError(errorHandler);

// Route registration
app.route("/auth", auth);
app.route("/todos", todos);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
