import Todo from "../models/todo.model.js";
import { customError } from "../utils/customError.js";

export const createTodo = async (req, res, next) => {
    try{

        // creating a todo  
        const todo = await Todo.create({
            ...req.body,
            user: req.user._id
        })

        res.status(201).json({
            success:true,
            data: todo,
        })
        
    }catch(err){
        next(err);
    }
}

export const getUserTodo = async (req, res, next) => {

    try {
        if(!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const todos = await Todo.find({ user: req.user._id });
        if(!todos || todos.length === 0) customError("Todos not found. Create one to view", 404);

        res.status(200).json({
            success: true,
            data: todos,
        });
    } catch (err) {
        next(err);
    }
}

export const getTodo = async (req, res, next) => {
    // get a specific todo
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            return res.status(404).json({
                success: false,
                message: "Todo not found",
            });
        }

        if(todo.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        res.status(200).json({
            success: true,
            data: todo,
        });
    } catch (err) {
        next(err);
    }
}

export const updateTodo = async (req, res, next) => {
    
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            return res.status(404).json({
                success: false,
                message: "Todo not found",
            });
        }

        if(todo.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });

        res.status(200).json({
            success: true,
            data: updatedTodo,
        });
    } catch (err) {
        next(err);
    }
}

export const deleteTodo = async (req, res, next) => {
    try {
        
        const deletedTodo = await Todo.findByIdAndDelete(req.params.id)
        if(deletedTodo){
           return res.status(200).json({
                success:true,
                message:"Todo deleted successfully",
                deletedDetails: deleteTodo
                    
            })
        } else{ 
            return res.status(404).json({
                success:false,
                message:'Todo not found'
            })
        }

    } catch (error) {
        next(error);
    }
}