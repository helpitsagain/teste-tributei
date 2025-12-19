import { Router } from "express";
import {
  bulkDeleteToDos,
  bulkUpdateToDos,
  // getTodoById,
  createToDo,
  deleteToDo,
  getToDos,
  updateToDo,
} from "../controllers/todo.controller.js";

const router = Router();

router.post("/item/new", createToDo);
router.get("/items", getToDos);
router.put("/bulk", bulkUpdateToDos);
router.delete("/bulk/delete", bulkDeleteToDos);
router.put("/item/:id", updateToDo);
router.delete("/item/:id", deleteToDo);

export default router;
