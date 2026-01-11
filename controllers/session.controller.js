import Session from '../models/session.model.js';
import Task from '../models/task.model.js';

export const createSession = async (req, res) => {
    const { duration, tasks } = req.body;
    const user = req.user.id;

    try {
        const session = await Session.createSession(user, duration, tasks);

        res.status(201).json({ message: 'Session created', sessionId: session._id });
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

export const startSession = async (req, res) => {
    const { sessionId } = req.params;
    let errors = {};

    if (!sessionId) {
        errors.general = "Session ID is required to start a session.";
    }

    try {
        const session = await Session.updateOne({_id: sessionId}, { $set: { status: 'active' } });

        if (!session) {
            errors.general = "Session not found.";
        } else if (session.status === "active") {
            errors.general = "Session is already active.";
        }

        if (Object.keys(errors).length > 0) {
            throw new Error(JSON.stringify(errors));
        }

        res.status(200).json({ message: 'Session started', sessionId: sessionId });
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