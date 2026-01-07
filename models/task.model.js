import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        enum: ["pending", "in-progress", "completed"],
        default: "pending",
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
}, { timestamps: true });

taskSchema.statics.createTask = async function(title, description="", user) {
    let errors = {};

    if (!title) {
        errors.title = "Title is required.";
    }
    
    const existingTask = await this.findOne({ title });
    
    if (existingTask) {
        errors.title = "Task with this title already exists.";
    }

    if (Object.keys(errors).length > 0) {
        throw new Error(JSON.stringify(errors));
    } else {   
        const task = await this.create({ title, description, user });
        
        return task;
    }
};

const Task = mongoose.model("Task", taskSchema);

export default Task;