import { ToDo } from "../models/todo.model.js";
import * as sql from "../repositories/sql.js";

export const getToDosPaginated = async (page: number, limit: number) => {
  try {
    const result = await sql.getToDosPaginated(page, limit);
    return result;
  } catch (e) {
    console.error("Service error (getToDosPaginated):", e);
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

export const createToDo = async (title: string, description: string) => {
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

// Popula a base de dados se não tiver itens o suficiente.
// WARN: Deletar antes de subir para produção.
export const populateDatabase = async () => {
  const toDos = await sql.getToDos();

  if (toDos.length < 250) {
    for (let i = 1; i <= 500; i++) {
      const number = String(i).padStart(3, "0");
      console.log(`Creating to-do ${number}`);
      await createToDo(`To-do ${number}`, `Description ${number}`);
    }
  }
};
