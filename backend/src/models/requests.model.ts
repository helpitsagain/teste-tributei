import { ToDo } from "./todo.model";

export interface CreateToDoRequest {
  title: string;
  description: string;
}

export interface BulkUpdateRequest {
  ids: string[];
  updates: Partial<ToDo>;
}

export interface BulkDeleteRequest {
  ids: string[];
}
