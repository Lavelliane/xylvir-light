import { env } from "@/env/client";
import type { ApiResponse, CreateTodoInput, Todo, TodoFilters, UpdateTodoInput } from "../_types";

const BASE_URL = `${env.NEXT_PUBLIC_BASE_URL}/api/todos`;

interface ApiErrorResponse {
  error: string;
  details?: string[];
  status?: number;
}

class ApiError extends Error {
  status: number;
  details?: string[];

  constructor(message: string, status: number, details?: string[]) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    let errorData: ApiErrorResponse;
    try {
      errorData = await response.json();
    } catch {
      throw new ApiError("An unexpected error occurred", response.status);
    }

    const message = errorData.details?.join(", ") || errorData.error || "An error occurred";
    throw new ApiError(message, response.status, errorData.details);
  }

  return response.json();
}

// Query functions
export const todoApi = {
  getAll: async (filters?: TodoFilters): Promise<Todo[]> => {
    const params = new URLSearchParams();
    if (filters?.completed !== undefined) {
      params.set("completed", String(filters.completed));
    }
    if (filters?.priority) {
      params.set("priority", filters.priority);
    }

    const url = params.toString() ? `${BASE_URL}?${params}` : BASE_URL;
    const response = await fetcher<ApiResponse<Todo[]>>(url);
    return response.data;
  },

  getById: async (id: string): Promise<Todo> => {
    const response = await fetcher<ApiResponse<Todo>>(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Mutation functions
  create: async (data: CreateTodoInput): Promise<Todo> => {
    const response = await fetcher<ApiResponse<Todo>>(BASE_URL, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.data;
  },

  update: async (id: string, data: UpdateTodoInput): Promise<Todo> => {
    const response = await fetcher<ApiResponse<Todo>>(`${BASE_URL}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    return response.data;
  },

  toggle: async (id: string): Promise<Todo> => {
    const response = await fetcher<ApiResponse<Todo>>(`${BASE_URL}/${id}/toggle`, {
      method: "PATCH",
    });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await fetcher(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
  },
};

export { ApiError };
