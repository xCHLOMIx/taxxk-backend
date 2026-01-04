import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    passcode: {
        type: String,
        required: true
    }
}, { timestamps: true });

userSchema.statics.signUp = async function (username, email, passcode) {
    let errors = {};

    if (!username) {
        errors.username = "Username is required";
    }

    if (!email) {
        errors.email = "Email is required";
    } else if (!validator.isEmail(email)) {
        errors.email = "Email must include '@' and a domain";
    }

    if (!passcode || passcode.trim() === '') {
        errors.passcode = 'Passcode is required';
    } else if (passcode.length !== 4) {
        errors.passcode = 'Passcode must be 4 characters long';
    }

    const existingUser = await this.findOne({ username });
    if (existingUser) {
        throw { username: "Username is already in use" };
    }

    if (Object.keys(errors).length > 0) {
        throw new Error(JSON.stringify(errors));
    } else {
        const hashedPasscode = await bcrypt.hash(passcode, 10);
        const user = await this.create({ username, passcode: hashedPasscode });

        return user;
    }
};

userSchema.statics.signin = async function (username, passcode) {
    let errors = {};

    if (!username || username.trim() === '') {
        errors.username = 'Username is required';
    }

    if (!passcode || passcode.trim() === '') {
        errors.passcode = 'Passcode is required';
    } else if (passcode.length !== 4) {
        errors.passcode = 'Passcode must be 4 characters long';
    }

    if (Object.keys(errors).length > 0) throw new Error(JSON.stringify(errors));

    const user = await this.findOne({ username });

    if (!user) {
        errors.username = 'No user with this username';
        throw new Error(JSON.stringify(errors));
    }

    const passcodeMatch = await bcrypt.compare(passcode, user.passcode);

    if (!passcodeMatch) {
        errors.passcode = 'Incorrect passcode';
        throw new Error(JSON.stringify(errors));
    }

    return user;
};

const User = mongoose.model('User', userSchema);

export default User;