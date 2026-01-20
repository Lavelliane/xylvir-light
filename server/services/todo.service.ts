import type { Priority } from "@/lib/generated/prisma/client";
import prisma from "@/lib/prisma";

export interface CreateTodoInput {
  title: string;
  description?: string;
  priority?: Priority;
  dueDate?: Date;
}

export interface UpdateTodoInput {
  title?: string;
  description?: string | null;
  completed?: boolean;
  priority?: Priority;
  dueDate?: Date | null;
}

export interface TodoFilters {
  completed?: boolean;
  priority?: Priority;
}

export const todoService = {
  async getAll(userId: string, filters?: TodoFilters) {
    return prisma.todo.findMany({
      where: {
        userId,
        ...(filters?.completed !== undefined && { completed: filters.completed }),
        ...(filters?.priority && { priority: filters.priority }),
      },
      orderBy: [{ completed: "asc" }, { createdAt: "desc" }],
    });
  },

  async getById(id: string, userId: string) {
    return prisma.todo.findFirst({
      where: { id, userId },
    });
  },

  async create(userId: string, data: CreateTodoInput) {
    return prisma.todo.create({
      data: {
        ...data,
        userId,
      },
    });
  },

  async update(id: string, userId: string, data: UpdateTodoInput) {
    // Verify ownership first
    const todo = await prisma.todo.findFirst({
      where: { id, userId },
    });

    if (!todo) {
      return null;
    }

    return prisma.todo.update({
      where: { id },
      data,
    });
  },

  async delete(id: string, userId: string) {
    // Verify ownership first
    const todo = await prisma.todo.findFirst({
      where: { id, userId },
    });

    if (!todo) {
      return null;
    }

    return prisma.todo.delete({
      where: { id },
    });
  },

  async toggleComplete(id: string, userId: string) {
    const todo = await prisma.todo.findFirst({
      where: { id, userId },
    });

    if (!todo) {
      return null;
    }

    return prisma.todo.update({
      where: { id },
      data: { completed: !todo.completed },
    });
  },
};
