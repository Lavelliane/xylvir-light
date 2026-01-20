import type { Priority } from "@/lib/generated/prisma/client";

export interface Todo {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  priority: Priority;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface CreateTodoInput {
  title: string;
  description?: string;
  priority?: Priority;
  dueDate?: string;
}

export interface UpdateTodoInput {
  title?: string;
  description?: string | null;
  completed?: boolean;
  priority?: Priority;
  dueDate?: string | null;
}

export interface TodoFilters {
  completed?: boolean;
  priority?: Priority;
}

export interface ApiResponse<T> {
  data: T;
}

export interface ApiError {
  error: string;
}
