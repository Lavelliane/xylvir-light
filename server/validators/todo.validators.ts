import { z } from "zod";

/**
 * Custom date string validator
 * Accepts YYYY-MM-DD (from HTML date inputs) or full ISO datetime strings
 * Automatically converts date-only strings to ISO format
 */
export const dateString = z
  .string()
  .refine(
    (val) => {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
      return dateRegex.test(val) || isoRegex.test(val);
    },
    { message: "Invalid date format. Use YYYY-MM-DD" },
  )
  .transform((val) => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
      return `${val}T00:00:00.000Z`;
    }
    return val;
  });

/**
 * Priority enum validator
 */
export const priorityEnum = z.enum(["LOW", "MEDIUM", "HIGH"]);

/**
 * Create Todo validation schema
 */
export const createTodoSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title must be 255 characters or less"),
  description: z.string().max(1000, "Description must be 1000 characters or less").optional(),
  priority: priorityEnum.optional(),
  dueDate: dateString.optional(),
});

/**
 * Update Todo validation schema
 */
export const updateTodoSchema = z.object({
  title: z
    .string()
    .min(1, "Title cannot be empty")
    .max(255, "Title must be 255 characters or less")
    .optional(),
  description: z
    .string()
    .max(1000, "Description must be 1000 characters or less")
    .optional()
    .nullable(),
  completed: z.boolean().optional(),
  priority: priorityEnum.optional(),
  dueDate: dateString.optional().nullable(),
});

/**
 * Todo query/filter validation schema
 */
export const todoQuerySchema = z.object({
  completed: z.enum(["true", "false"]).optional(),
  priority: priorityEnum.optional(),
});

// Type exports for TypeScript inference
export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
export type TodoQueryInput = z.infer<typeof todoQuerySchema>;
