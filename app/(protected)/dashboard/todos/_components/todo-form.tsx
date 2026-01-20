"use client";

import { AlertCircle, Calendar, Flag, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Priority } from "@/lib/generated/prisma/client";
import { cn } from "@/lib/utils";
import { useCreateTodo } from "../_hooks";

const priorities: { value: Priority; label: string; color: string }[] = [
  { value: "LOW", label: "Low", color: "text-slate-500" },
  { value: "MEDIUM", label: "Medium", color: "text-amber-500" },
  { value: "HIGH", label: "High", color: "text-rose-500" },
];

export function TodoForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const createMutation = useCreateTodo();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    createMutation.mutate(
      {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        dueDate: dueDate || undefined,
      },
      {
        onSuccess: () => {
          setTitle("");
          setDescription("");
          setPriority("MEDIUM");
          setDueDate("");
          setIsExpanded(false);
        },
      },
    );
  };

  const resetForm = () => {
    setIsExpanded(false);
    setTitle("");
    setDescription("");
    setPriority("MEDIUM");
    setDueDate("");
    createMutation.reset();
  };

  return (
    <Card className="overflow-hidden">
      <form onSubmit={handleSubmit}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-slate-300 dark:border-slate-600">
              <Plus className="size-3 text-slate-400" />
            </div>
            <Input
              placeholder="Add a new task..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              className="border-0 bg-transparent p-0 text-base shadow-none focus-visible:ring-0"
            />
          </div>

          {isExpanded && (
            <div className="mt-4 space-y-4 border-t pt-4 dark:border-slate-800">
              {/* Error message */}
              {createMutation.isError && (
                <div className="flex items-center gap-2 rounded-lg bg-rose-50 p-3 text-sm text-rose-600 dark:bg-rose-900/20 dark:text-rose-400">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{createMutation.error.message}</span>
                </div>
              )}

              <Input
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <div className="flex flex-wrap items-center gap-4">
                {/* Priority */}
                <div className="flex items-center gap-2">
                  <Flag className="size-4 text-slate-400" />
                  <div className="flex gap-1">
                    {priorities.map((p) => (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => setPriority(p.value)}
                        className={cn(
                          "rounded-md px-2 py-1 text-xs font-medium transition-colors",
                          priority === p.value
                            ? "bg-slate-100 dark:bg-slate-800"
                            : "hover:bg-slate-50 dark:hover:bg-slate-800/50",
                          p.color,
                        )}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Due date */}
                <div className="flex items-center gap-2">
                  <Calendar className="size-4 text-slate-400" />
                  <Input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="h-8 w-auto"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!title.trim() || createMutation.isPending}>
                  {createMutation.isPending ? "Adding..." : "Add Task"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </form>
    </Card>
  );
}
