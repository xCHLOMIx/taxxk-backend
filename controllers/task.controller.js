import Task from '../models/task.model.js';

export const createTask = async (req, res) => {
    const { title, description } = req.body;
    const user = req.user.id;
    console.log('Creating task for user:', req.user.id);

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

export const getTasks = async (req, res) => {
    const user = req.user.id;

    try {
        const tasks = await Task.find({ user: user });
        res.status(200).json({ tasks });
    } catch (error) {
        res.status(500).json({ errors: { general: 'Failed to retrieve tasks' } });
    }
};