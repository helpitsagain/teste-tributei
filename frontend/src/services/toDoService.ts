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
  id: number,
  updatedToDo: Partial<ToDo>,
): Promise<ToDo> => {
  const res = await api.put(`/item/${id}`, updatedToDo);
  return res.data;
};

export const bulkUpdateToDos = async (
  ids: number[],
  updates: Partial<ToDo>,
): Promise<{ updatedToDos: ToDo[] }> => {
  const res = await api.put("/bulk", { ids, updates });
  return res.data;
};
