import { Router } from "express";
import * as controller from "../controllers/todo.controller.js";

const router = Router();

router.post("/item/new", controller.createToDo);
router.get("/items", controller.getToDos);
router.get("/items/filter", controller.getToDosFiltered);
router.put("/bulk", controller.bulkUpdateToDos);
router.delete("/bulk/delete", controller.bulkDeleteToDos);
router.put("/item/:id", controller.updateToDo);
router.delete("/item/:id", controller.deleteToDo);

export default router;
