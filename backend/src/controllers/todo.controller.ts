import { Request, Response } from "express";
import * as toDoService from "../services/todo.service";

export const getToDos = (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;

  const result = toDoService.getToDosPaginated(page, limit);

  console.log("get!");

  res.json(result);
};

export const updateToDo = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const updatedToDo = req.body;

  const todo = toDoService.updateToDo(id, updatedToDo);

  if (!todo) {
    console.log("to-do not found");
    return res.status(404).json({ message: "To-do not found" });
  }

  console.log("update!");

  res.json(todo);
};

export const bulkUpdateTodos = (req: Request, res: Response) => {
  const { ids, updates } = req.body;

  if (!Array.isArray(ids) || !updates) {
    return res
      .status(400)
      .json({ message: "ids must be an array and updates must be provided" });
  }

  const updatedTodos = toDoService.bulkUpdateToDos(ids, updates);

  console.log("bulk update!");

  res.json({ updatedTodos });
};
