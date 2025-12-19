import api from "./api";
import { ToDo, ToDosResponse } from "../types/toDo";

export const getToDos = async (
  page: number,
  limit: number = 5,
): Promise<ToDosResponse> => {
  const res = await api.get("items", { params: { page, limit } });
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
  const res = await api.delete(`item/delete/${id}`);
  return res.data;
};

export const bulkDeleteToDos = async (
  ids: string[],
): Promise<{ deletedToDos: ToDo[] }> => {
  const res = await api.delete("/bulk/delete", { data: { ids } });
  return res.data;
};
