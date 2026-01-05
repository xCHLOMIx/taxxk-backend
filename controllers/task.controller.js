import Task from '../models/task.model.js';

export const createTask = async (req, res) => {
    const { title, description } = req.body;
    const user = req.user._id;

    try {
        const task = await Task.createTask(title, description, user);
        
        res.status(201).json({ message: 'Task created', title: task.title });
    } catch (error) {
        let errors = {};
        try {
            errors = JSON.parse(error.message);
        } catch {
            errors.general = error.message;
        }
        res.status(400).json({ errors });
    }
};

export const getTasks = async (req, res) => {};