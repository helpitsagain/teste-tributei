import { ToDo } from "../models/todo.model.js";
import * as sql from "../repositories/sql.js";

export const getToDosPaginated = async (
  page: number,
  limit: number,
  completed?: boolean,
  sortBy: string = 'updated_date',
  sortOrder: string = 'desc',
) => {
  try {
    const result = await sql.getToDosPaginated(page, limit, completed, sortBy, sortOrder);
    return result;
  } catch (e) {
    console.error("Service error (getToDosPaginated):", e);
    return { toDos: [], total: 0, page, totalPages: 0 };
  }
};

export const getToDosFiltered = async (
  page: number,
  limit: number,
  filters?: Partial<ToDo>,
  sortBy: string = 'updated_date',
  sortOrder: string = 'desc',
) => {
  try {
    const result = await sql.getToDosFiltered(page, limit, filters as any, sortBy, sortOrder);
    return result;
  } catch (e) {
    console.error("Service error (getToDosFiltered):", e);
    return { toDos: [], total: 0, page, totalPages: 0 };
  }
};

export const updateToDo = async (id: string, updatedToDo: Partial<ToDo>) => {
  try {
    const updated = await sql.updateToDo(id, updatedToDo as any);
    return updated;
  } catch (e) {
    console.error("Service error (updateToDo):", e);
    return null;
  }
};

export const bulkUpdateToDos = async (
  ids: string[],
  updates: Partial<ToDo>,
) => {
  try {
    const updated = await sql.bulkUpdateToDos(ids, updates as any);
    return updated;
  } catch (e) {
    console.error("Service error (bulkUpdateToDos):", e);
    return [];
  }
};

export const bulkDeleteToDos = async (ids: string[]) => {
  try {
    const deleted = await sql.bulkDeleteToDos(ids);
    return deleted;
  } catch (e) {
    console.error("Service error (bulkDeleteToDos):", e);
    return [];
  }
};

export const createToDo = async (
  title: string,
  description: string,
): Promise<any> => {
  try {
    const created = await sql.createToDo(title, description);
    return created;
  } catch (e) {
    console.error("Service error (createToDo):", e);
    return null;
  }
};

export const deleteToDo = async (id: string) => {
  try {
    const deleted = await sql.deleteToDo(id);
    return deleted;
  } catch (e) {
    console.error("Service error (deleteToDo):", e);
    return null;
  }
};
