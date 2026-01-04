import User from '../models/user.model.js';
import { createToken } from '../utils/token.js';
import { setAuthCookie } from '../utils/cookie.js';

export const signUp = async (req, res) => {
    const { username, email, passcode } = req.body;

    try {
        const user = await User.signUp(username, email, passcode);

        res.status(201).json({ message: 'User created', user });
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

export const signIn = async (req, res) => {
    const { username, passcode } = req.body;

    try {
        const user = await User.signin(username, passcode);

        const token = createToken(user._id);
        setAuthCookie(res, token);

        res.status(200).json({ message: 'User signed in', username: user.username });
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