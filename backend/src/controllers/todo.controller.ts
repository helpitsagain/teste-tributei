import { Request, Response } from "express";
import * as toDoService from "../services/todo.service.js";
import {
  BulkDeleteRequest,
  BulkUpdateRequest,
  CreateToDoRequest,
} from "../models/requests.model.js";

const parseBoolean = (value?: string): boolean | undefined => {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
};

export const getToDos = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const completed = parseBoolean(req.query.completed as string);

    const result = await toDoService.getToDosPaginated(page, limit, completed);

    res.json(result);
  } catch (e) {
    console.error(e);

    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getToDosFiltered = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const completed = parseBoolean(req.query.completed as string);

    const filters: Partial<CreateToDoRequest & { completed?: boolean } & Record<string, any>> = {};

    if (typeof completed !== "undefined") filters.completed = completed;
    if (req.query.title) filters.title = String(req.query.title);
    if (req.query.description) filters.description = String(req.query.description);

    const result = await toDoService.getToDosFiltered(page, limit, filters as any);

    res.json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateToDo = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const updatedToDo = req.body;

    const toDo = await toDoService.updateToDo(id, updatedToDo);

    if (!toDo) {
      const message = `ID '${id}' not found.`;
      console.error(message);
      return res.status(404).json({ message });
    }

    console.info(`Updated to-do '${id}'`);

    res.json(toDo);
  } catch (e) {
    console.error(e);

    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const bulkUpdateToDos = async (req: Request, res: Response) => {
  try {
    const { ids, updates }: BulkUpdateRequest = req.body;

    if (!Array.isArray(ids)) {
      return res
        .status(400)
        .json({ message: "ids must be an array and updates must be provided" });
    }

    const updatedToDos = await toDoService.bulkUpdateToDos(ids, updates);

    console.info(`Updated ${updatedToDos.length} to-dos.`);

    res.json({ updatedTodos: updatedToDos });
  } catch (e) {
    console.error(e);

    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const bulkDeleteToDos = async (req: Request, res: Response) => {
  try {
    const { ids }: BulkDeleteRequest = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ message: "ids must be an array and must be provided" });
    }

    const updatedTodos = await toDoService.bulkDeleteToDos(ids);

    console.log("bulk delete!");

    res.json({ updatedTodos });
  } catch (e) {
    console.error(e);

    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createToDo = async (req: Request, res: Response) => {
  try {
    const { title, description }: CreateToDoRequest = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required." });
    }

    const newToDo = await toDoService.createToDo(title, description);

    res.json({ newToDo });
  } catch (e) {
    console.error(e);

    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteToDo = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const toDo = await toDoService.deleteToDo(id);

    if (!toDo) {
      console.error("to-do not found");
      return res.status(404).json({ message: "To-do not found." });
    }

    res.json(toDo);
  } catch (e) {
    console.error(e);

    res.status(500).json({ message: "Internal Server Error" });
  }
};
