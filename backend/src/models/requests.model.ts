import { ToDo } from "./todo.model.js";

export interface CreateToDoRequest {
  title: string;
  description: string;
  completed?: boolean;
}

export interface BulkUpdateRequest {
  ids: string[];
  updates: Partial<ToDo>;
}

export interface BulkDeleteRequest {
  ids: string[];
}
