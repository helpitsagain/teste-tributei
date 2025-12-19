import { Request, Response } from "express";
import * as toDoService from "../services/todo.service.js";
import {
  BulkDeleteRequest,
  BulkUpdateRequest,
  CreateToDoRequest,
} from "../models/requests.model.js";

export const getToDos = (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = toDoService.getToDosPaginated(page, limit);

    res.json(result);
  } catch (e) {
    console.log(e);

    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateToDo = (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const updatedToDo = req.body;

    const toDo = toDoService.updateToDo(id, updatedToDo);

    if (!toDo) {
      console.log("to-do not found");
      return res.status(404).json({ message: "To-do not found" });
    }

    console.log("update!");

    res.json(toDo);
  } catch (e) {
    console.log(e);

    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const bulkUpdateToDos = (req: Request, res: Response) => {
  try {
    const { ids, updates }: BulkUpdateRequest = req.body;

    if (!Array.isArray(ids)) {
      return res
        .status(400)
        .json({ message: "ids must be an array and updates must be provided" });
    }

    const updatedTodos = toDoService.bulkUpdateToDos(ids, updates);

    console.log("bulk update!");

    res.json({ updatedTodos });
  } catch (e) {
    console.log(e);

    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const bulkDeleteToDos = (req: Request, res: Response) => {
  try {
    const { ids }: BulkDeleteRequest = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ message: "ids must be an array and must be provided" });
    }

    const updatedTodos = toDoService.bulkDeleteToDos(ids);

    console.log("bulk delete!");

    res.json({ updatedTodos });
  } catch (e) {
    console.log(e);

    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createToDo = (req: Request, res: Response) => {
  try {
    const { title, description }: CreateToDoRequest = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required." });
    }

    const newToDo = toDoService.createToDo(title, description);

    res.json({ newToDo });
  } catch (e) {
    console.log(e);

    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteToDo = (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const toDo = toDoService.deleteToDo(id);

    if (!toDo) {
      console.log("to-do not found");
      return res.status(404).json({ message: "To-do not found." });
    }

    res.json(toDo);
  } catch (e) {
    console.log(e);

    res.status(500).json({ message: "Internal Server Error" });
  }
};
