import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import type { AuthType } from "@/lib/auth";
import { authMiddleware } from "@/server/middleware/auth.middleware";
import { todoService } from "@/server/services/todo.service";
import {
  createTodoSchema,
  todoQuerySchema,
  updateTodoSchema,
} from "@/server/validators/todo.validators";

const router = new Hono<{ Variables: AuthType }>();

// Apply auth middleware to all routes
router.use("/*", authMiddleware);

// Helper to get user ID (safe after auth middleware)
function getUserId(c: { get: (key: "user") => AuthType["user"] }): string {
  const user = c.get("user");
  return user?.id ?? "";
}

// GET /api/todos - Get all todos for user
router.get("/", zValidator("query", todoQuerySchema), async (c) => {
  const userId = getUserId(c);
  const query = c.req.valid("query");

  const filters = {
    completed: query.completed ? query.completed === "true" : undefined,
    priority: query.priority,
  };

  const todos = await todoService.getAll(userId, filters);
  return c.json({ data: todos });
});

// GET /api/todos/:id - Get single todo
router.get("/:id", async (c) => {
  const userId = getUserId(c);
  const id = c.req.param("id");

  const todo = await todoService.getById(id, userId);

  if (!todo) {
    throw new HTTPException(404, { message: "Todo not found" });
  }

  return c.json({ data: todo });
});

// POST /api/todos - Create new todo
router.post("/", zValidator("json", createTodoSchema), async (c) => {
  const userId = getUserId(c);
  const body = c.req.valid("json");

  const todo = await todoService.create(userId, {
    ...body,
    dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
  });

  return c.json({ data: todo }, 201);
});

// PATCH /api/todos/:id - Update todo
router.patch("/:id", zValidator("json", updateTodoSchema), async (c) => {
  const userId = getUserId(c);
  const id = c.req.param("id");
  const body = c.req.valid("json");

  const todo = await todoService.update(id, userId, {
    ...body,
    dueDate: body.dueDate === null ? null : body.dueDate ? new Date(body.dueDate) : undefined,
  });

  if (!todo) {
    throw new HTTPException(404, { message: "Todo not found" });
  }

  return c.json({ data: todo });
});

// PATCH /api/todos/:id/toggle - Toggle todo completion
router.patch("/:id/toggle", async (c) => {
  const userId = getUserId(c);
  const id = c.req.param("id");

  const todo = await todoService.toggleComplete(id, userId);

  if (!todo) {
    throw new HTTPException(404, { message: "Todo not found" });
  }

  return c.json({ data: todo });
});

// DELETE /api/todos/:id - Delete todo
router.delete("/:id", async (c) => {
  const userId = getUserId(c);
  const id = c.req.param("id");

  const todo = await todoService.delete(id, userId);

  if (!todo) {
    throw new HTTPException(404, { message: "Todo not found" });
  }

  return c.json({ data: { success: true } });
});

export default router;
