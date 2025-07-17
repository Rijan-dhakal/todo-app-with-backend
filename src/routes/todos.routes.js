import { Router } from "express";
import { createTodo, deleteTodo, getUserTodo, updateTodo, getTodo } from "../controllers/todos.controller.js";

const todoRouter = Router()

todoRouter.get("/", getUserTodo)

todoRouter.post("/", createTodo)

todoRouter.get("/:id", getTodo)

todoRouter.patch("/:id", updateTodo)

todoRouter.delete("/:id", deleteTodo)
 
export default todoRouter;

