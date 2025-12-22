import api from "./api";
import { ToDo, ToDosResponse, SortOption } from "../types/toDo";

export const getToDos = async (
  page: number,
  limit: number = 5,
  filters?: {
    title?: string;
    description?: string;
    completed?: boolean | null;
  },
  sort?: SortOption,
): Promise<ToDosResponse> => {
  const params: any = { page, limit };

  if (filters) {
    if (filters.title) params.title = filters.title;
    if (filters.description) params.description = filters.description;
    if (typeof filters.completed === "boolean")
      params.completed = filters.completed;
  }

  if (sort) {
    params.sortBy = sort.sortBy;
    params.sortOrder = sort.sortOrder;
  }

  // use the filter endpoint when any filter is provided
  if (
    filters &&
    (filters.title ||
      filters.description ||
      typeof filters.completed === "boolean")
  ) {
    const res = await api.get("items/filter", { params });
    return res.data;
  }

  const res = await api.get("items", { params });
  return res.data;
};

export const updateToDo = async (
  id: string,
  updatedToDo: Partial<ToDo>,
): Promise<ToDo> => {
  const res = await api.put(`/item/${id}`, updatedToDo);
  return res.data;
};

export const bulkUpdateToDos = async (
  ids: string[],
  updates: Partial<ToDo>,
): Promise<{ updatedToDos: ToDo[] }> => {
  const res = await api.put("/bulk", { ids, updates });
  return res.data;
};

export const createToDo = async (newToDo: Partial<ToDo>): Promise<ToDo> => {
  const res = await api.post("/item/new", newToDo);
  return res.data;
};

export const deleteToDo = async (id: string): Promise<ToDo> => {
  const res = await api.delete(`item/${id}`);
  return res.data;
};

export const bulkDeleteToDos = async (
  ids: string[],
): Promise<{ deletedToDos: ToDo[] }> => {
  const res = await api.delete("/bulk/delete", { data: { ids } });
  return res.data;
};
