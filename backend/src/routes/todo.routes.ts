import { Router } from "express";
import * as toDoController from "../controllers/todo.controller.js";

const router = Router();

router.get("/items", toDoController.getToDos);
router.post("/item/new", toDoController.createToDo);
router.put("/item/:id", toDoController.updateToDo);
router.put("/bulk", toDoController.bulkUpdateTodos);
router.delete("/bulk/delete", toDoController.bulkDeleteTodos);
router.delete("/item/delete/:id", toDoController.deleteToDo);

export default router;
