import Session from '../models/session.model.js';

// Create a new session
export const createSession = async (req, res) => {
    const { duration, tasks } = req.body;
    const user = req.user.id;
    console.log(duration)

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