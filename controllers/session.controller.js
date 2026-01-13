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
    const { id } = req.params;
    let errors = {};

    if (!id) {
        errors.general = "Session ID required";
    }

    try {
        const session = await Session.findOne({ _id: id });

        if (!session) {
            errors.general = "Session not found";
        } else if (session.status === "active") {
            errors.general = "Session already active";
        }

        if (Object.keys(errors).length > 0) {
            throw new Error(JSON.stringify(errors));
        }

        await Session.findOneAndUpdate({ _id: id }, { $set: { status: 'active' } });

        res.status(200).json({ message: 'Session started', sessionId: id });
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

export const endSession = async (req, res) => {
    const { id } = req.params;
    const { duration } = req.body;
    let errors = {};

    if (!id) {
        errors.general = "Session ID required";
    }

    if (duration === undefined || duration === null) {
        errors.general = "Duration required";
    }

    try {
        const session = await Session.findOne({ _id: id });

        if (!session) {
            errors.general = "Session not found";
        } else if (session.status === "completed") {
            errors.general = "Session already completed";
        }

        if (Object.keys(errors).length > 0) {
            throw new Error(JSON.stringify(errors));
        }

        let remainingDuration = session.duration - duration;

        if (remainingDuration > 0) {
            return res.status(400).json({ errors: { general: "Session incomplete, pause instead" } });
        }

        await Session.findOneAndUpdate({ _id: id }, { $set: { status: 'completed', duration: 0 } });

        res.status(200).json({ message: 'Session ended', sessionId: id });
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

export const pauseSession = async (req, res) => {
    const { id } = req.params;
    const { duration } = req.body;
    let errors = {};

    if (!id) {
        errors.general = "Session ID required";
    }

    if (duration === undefined || duration === null || duration <= 0) {
        errors.duration = "Duration must be positive";
    }

    try {
        const session = await Session.findOne({ _id: id });

        if (!session) {
            errors.general = "Session not found";
        } else if (session.status !== "active") {
            errors.general = "Only active sessions can be paused";
        }

        if (Object.keys(errors).length > 0) {
            throw new Error(JSON.stringify(errors));
        }

        await Session.findOneAndUpdate({ _id: id }, { $set: { status: 'paused', duration: duration } });

        res.status(200).json({ message: 'Session paused', sessionId: id });
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