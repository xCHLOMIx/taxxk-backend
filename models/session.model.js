import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    tasks: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Task",
        required: true
    }
}, { timestamps: true });

sessionSchema.statics.startSession = async function (user, duration, tasks) {
    let errors = {};

    if (!tasks || tasks.length === 0) {
        errors.tasks = "At least one task must be provided to start a session.";
    }

    if (!duration || duration <= 0) {
        errors.duration = "Duration must be a positive number.";
    }

    if (Object.keys(errors).length > 0) {
        throw errors;
    }

    const session = await this.create({ user, duration, tasks });
    
    return session;
};

export const Session = mongoose.model("Session", sessionSchema);