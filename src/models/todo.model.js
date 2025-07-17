import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: [1, "Content must be at least 1 characters long"],
    maxlength: [500, "Content must be at most 500 characters long"],
  },
  completed: {
    type: Boolean,
    default: false,
  },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true });
const Todo = mongoose.model("Todo", todoSchema);
export default Todo;