"use client";

import { Calendar, Check, Edit2, Trash2, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useDeleteTodo, useToggleTodo, useUpdateTodo } from "../_hooks";
import type { Todo } from "../_types";

interface TodoItemProps {
  todo: Todo;
}

const priorityColors = {
  LOW: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  MEDIUM: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  HIGH: "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400",
};

export function TodoItem({ todo }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const toggleMutation = useToggleTodo();
  const deleteMutation = useDeleteTodo();
  const updateMutation = useUpdateTodo();

  const handleToggle = () => {
    toggleMutation.mutate(todo.id);
  };

  const handleDelete = () => {
    deleteMutation.mutate(todo.id);
  };

  const handleSaveEdit = () => {
    if (editTitle.trim() && editTitle !== todo.title) {
      updateMutation.mutate(
        { id: todo.id, data: { title: editTitle.trim() } },
        { onSuccess: () => setIsEditing(false) },
      );
    } else {
      setIsEditing(false);
      setEditTitle(todo.title);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTitle(todo.title);
  };

  const formattedDate = todo.dueDate
    ? new Date(todo.dueDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : null;

  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed;

  return (
    <Card
      className={cn(
        "group flex items-center gap-3 p-4 transition-all hover:shadow-md",
        todo.completed && "opacity-60",
      )}
    >
      {/* Checkbox */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={toggleMutation.isPending}
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          todo.completed
            ? "border-emerald-500 bg-emerald-500 text-white"
            : "border-slate-300 hover:border-emerald-400 dark:border-slate-600",
        )}
      >
        {todo.completed && <Check className="size-3" />}
      </button>

      {/* Content */}
      <div className="min-w-0 flex-1">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="h-8"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveEdit();
                if (e.key === "Escape") handleCancelEdit();
              }}
            />
            <Button size="sm" variant="ghost" onClick={handleSaveEdit}>
              <Check className="size-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
              <X className="size-4" />
            </Button>
          </div>
        ) : (
          <>
            <p
              className={cn(
                "truncate font-medium",
                todo.completed && "text-slate-500 line-through",
              )}
            >
              {todo.title}
            </p>
            {todo.description && (
              <p className="mt-0.5 truncate text-sm text-slate-500 dark:text-slate-400">
                {todo.description}
              </p>
            )}
          </>
        )}
      </div>

      {/* Metadata */}
      <div className="flex items-center gap-2">
        {formattedDate && (
          <span
            className={cn(
              "flex items-center gap-1 text-xs",
              isOverdue ? "text-rose-500" : "text-slate-500",
            )}
          >
            <Calendar className="size-3" />
            {formattedDate}
          </span>
        )}

        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-xs font-medium",
            priorityColors[todo.priority],
          )}
        >
          {todo.priority}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <Button
          size="icon"
          variant="ghost"
          className="size-8"
          onClick={() => setIsEditing(true)}
          disabled={isEditing}
        >
          <Edit2 className="size-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="size-8 text-rose-500 hover:text-rose-600"
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </Card>
  );
}
