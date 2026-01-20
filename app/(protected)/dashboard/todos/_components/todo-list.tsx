"use client";

import { ListChecks, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTodos } from "../_hooks";
import { TodoForm } from "./todo-form";
import { TodoItem } from "./todo-item";

export function TodoList() {
  const { data: todos, isLoading, error } = useTodos();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-rose-200 bg-rose-50 dark:border-rose-800 dark:bg-rose-900/20">
        <CardContent className="py-6 text-center text-rose-600 dark:text-rose-400">
          Failed to load todos. Please try again.
        </CardContent>
      </Card>
    );
  }

  const completedTodos = todos?.filter((t) => t.completed) ?? [];
  const incompleteTodos = todos?.filter((t) => !t.completed) ?? [];

  return (
    <div className="space-y-6">
      {/* Add todo form */}
      <TodoForm />

      {/* Todo list */}
      {todos && todos.length > 0 ? (
        <div className="space-y-6">
          {/* Incomplete todos */}
          {incompleteTodos.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Tasks ({incompleteTodos.length})
              </h3>
              <div className="space-y-2">
                {incompleteTodos.map((todo) => (
                  <TodoItem key={todo.id} todo={todo} />
                ))}
              </div>
            </div>
          )}

          {/* Completed todos */}
          {completedTodos.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Completed ({completedTodos.length})
              </h3>
              <div className="space-y-2">
                {completedTodos.map((todo) => (
                  <TodoItem key={todo.id} todo={todo} />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <ListChecks className="mb-4 size-12 text-slate-300 dark:text-slate-600" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">No tasks yet</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Add your first task above to get started
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
