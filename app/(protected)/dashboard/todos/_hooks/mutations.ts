"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateTodoInput, Todo, UpdateTodoInput } from "../_types";
import { todoApi } from "./api";
import { todoKeys } from "./queries";

export function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTodoInput) => todoApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
    },
  });
}

export function useUpdateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTodoInput }) => todoApi.update(id, data),
    onSuccess: (updatedTodo) => {
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
      queryClient.setQueryData(todoKeys.detail(updatedTodo.id), updatedTodo);
    },
  });
}

export function useToggleTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => todoApi.toggle(id),
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: todoKeys.lists() });

      // Snapshot previous value
      const previousTodos = queryClient.getQueryData<Todo[]>(todoKeys.list());

      // Optimistically update
      if (previousTodos) {
        queryClient.setQueryData<Todo[]>(
          todoKeys.list(),
          previousTodos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo,
          ),
        );
      }

      return { previousTodos };
    },
    onError: (_err, _id, context) => {
      // Rollback on error
      if (context?.previousTodos) {
        queryClient.setQueryData(todoKeys.list(), context.previousTodos);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
    },
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => todoApi.delete(id),
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: todoKeys.lists() });

      // Snapshot previous value
      const previousTodos = queryClient.getQueryData<Todo[]>(todoKeys.list());

      // Optimistically remove
      if (previousTodos) {
        queryClient.setQueryData<Todo[]>(
          todoKeys.list(),
          previousTodos.filter((todo) => todo.id !== id),
        );
      }

      return { previousTodos };
    },
    onError: (_err, _id, context) => {
      // Rollback on error
      if (context?.previousTodos) {
        queryClient.setQueryData(todoKeys.list(), context.previousTodos);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
    },
  });
}
