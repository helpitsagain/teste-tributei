import { Router } from "express";
import * as toDoController from "../controllers/todo.controller";

const router = Router();

router.get("/items", toDoController.getToDos);
router.put("/item/:id", toDoController.updateToDo);
router.put("/bulk", toDoController.bulkUpdateTodos);
router.post("/item/new", toDoController.createToDo);
router.delete("/item/delete/:id", toDoController.deleteToDo);

export default router;
