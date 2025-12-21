import { neon } from "@neondatabase/serverless";
import "dotenv/config";
import { v4 as uuidv4 } from "uuid";
import { ToDo } from "../models/todo.model.js";

const sql = neon(process.env.DATABASE_URL!);

export const getToDos = async () => {
  try {
    const results =
      await sql`SELECT id, title, description, completed, created_date, updated_date FROM todos;`;
    return results;
  } catch (e) {
    console.error("DB error (getToDos):", e);
    return [];
  }
};

export const getToDosPaginated = async (
  page: number,
  limit: number,
  completed?: boolean,
) => {
  try {
    const offset = (page - 1) * limit;
    const hasFilter = typeof completed === "boolean";

    const toDos = hasFilter
      ? await sql`SELECT id, title, description, completed, created_date, updated_date FROM todos WHERE completed = ${completed} ORDER BY title LIMIT ${limit} OFFSET ${offset};`
      : await sql`SELECT id, title, description, completed, created_date, updated_date FROM todos ORDER BY title LIMIT ${limit} OFFSET ${offset};`;

    const countResult = hasFilter
      ? await sql`SELECT COUNT(*)::text AS count FROM todos WHERE completed = ${completed};`
      : await sql`SELECT COUNT(*)::text AS count FROM todos;`;

    const total = countResult?.[0] ? parseInt(countResult[0].count, 10) : 0;

    return {
      toDos,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (e) {
    console.error("DB error (getToDosPaginated):", e);
    return { toDos: [], total: 0, page, totalPages: 0 };
  }
};

export const getToDosFiltered = async (
  page: number,
  limit: number,
  filters?: Partial<ToDo>,
) => {
  try {
    const offset = (page - 1) * limit;

    const escape = (s: string) => s.replace(/'/g, "''");

    const conditions: string[] = [];
    if (filters) {
      if (typeof filters.completed === "boolean") {
        conditions.push(`completed = ${filters.completed}`);
      }
      if (filters.title) {
        conditions.push(`title ILIKE '%${escape(filters.title)}%'`);
      }
      if (filters.description) {
        conditions.push(`description ILIKE '%${escape(filters.description)}%'`);
      }
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const query = `SELECT id, title, description, completed, created_date, updated_date FROM todos ${where} ORDER BY title LIMIT ${limit} OFFSET ${offset};`;

    const countQuery = `SELECT COUNT(*)::text AS count FROM todos ${where};`;

    const toDos = await sql.query(query);
    const countResult = await sql.query(countQuery);

    const total = countResult?.[0] ? parseInt(countResult[0].count, 10) : 0;

    return {
      toDos,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (e) {
    console.error("DB error (getToDosFiltered):", e);
    return { toDos: [], total: 0, page, totalPages: 0 };
  }
};

export const createToDo = async (title: string, description: string) => {
  try {
    const newId = uuidv4();
    const createdDate = new Date().toISOString();

    const [result] =
      await sql`INSERT INTO todos (id, title, description, completed, created_date, updated_date) VALUES (
      ${newId}, ${title}, ${description}, false, ${createdDate}, ${createdDate}
    ) RETURNING id, title, description, completed;`;

    return result;
  } catch (e) {
    console.error("DB error (createToDo):", e);
    return null;
  }
};

export const updateToDo = async (
  id: string,
  updates: { title?: string; description?: string; completed?: boolean },
) => {
  try {
    const [existing] =
      await sql`SELECT id, title, description, completed FROM todos WHERE id = ${id} LIMIT 1;`;
    if (!existing) return null;

    const newTitle = updates.title ?? existing.title;
    const newDescription = updates.description ?? existing.description;
    const newCompleted =
      typeof updates.completed === "boolean"
        ? updates.completed
        : existing.completed;
    const newUpdatedDate = new Date().toISOString();

    const [updated] =
      await sql`UPDATE todos SET title = ${newTitle}, description = ${newDescription}, completed = ${newCompleted}, updated_date = ${newUpdatedDate} WHERE id = ${id} RETURNING id, title, description, completed;`;
    return updated;
  } catch (e) {
    console.error("DB error (updateToDo):", e);
    return null;
  }
};

export const bulkUpdateToDos = async (
  ids: string[],
  updates: { title?: string; description?: string; completed?: boolean },
) => {
  try {
    const updatedToDos = [];
    for (const id of ids) {
      const updated = await updateToDo(id, updates);
      if (updated) updatedToDos.push(updated);
    }
    return updatedToDos;
  } catch (e) {
    console.error("DB error (bulkUpdateToDos):", e);
    return [];
  }
};

export const bulkDeleteToDos = async (ids: string[]) => {
  try {
    const deleted =
      await sql`DELETE FROM todos WHERE id = ANY(${ids}) RETURNING id, title, description, completed;`;
    return deleted;
  } catch (e) {
    console.error("DB error (bulkDeleteToDos):", e);
    return [];
  }
};

export const deleteToDo = async (id: string) => {
  try {
    const [deleted] =
      await sql`DELETE FROM todos WHERE id = ${id} RETURNING id, title, description, completed;`;
    return deleted ?? null;
  } catch (e) {
    console.error("DB error (deleteToDo):", e);
    return null;
  }
};
