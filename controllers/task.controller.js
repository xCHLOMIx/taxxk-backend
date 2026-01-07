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

export const deleteTask = async (req, res) => {
    const taskId = req.params.id;
    const user = req.user.id;

    try {
        const task = await Task.findOneAndDelete({ _id: taskId, user: user });
        console.log(task)
        if (!task) {
            return res.status(404).json({ errors: { general: 'Task not found' } });
        }
        res.status(200).json({ message: 'Task successfully deleted' });
    } catch (error) {
        res.status(500).json({ errors: { general: error.message } });
    }
};