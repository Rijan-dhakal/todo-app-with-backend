import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import { createTodo, deleteTodo, getUserTodo, updateTodo, getTodo } from "../controllers/todos.controller.js";

const todoRouter = Router()

todoRouter.get("/",authorize, getUserTodo) // render all todos for a specific user

todoRouter.post("/", authorize, createTodo)   // create todo for loggedin user

  
todoRouter.get("/:id", authorize, getTodo)   // render a specific todo

todoRouter.patch("/:id", authorize, updateTodo)   // edit a specific todo



todoRouter.delete("/:id", authorize, deleteTodo)
 
export default todoRouter;

