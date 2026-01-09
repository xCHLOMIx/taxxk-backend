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
    status: {
        type: String,
        enum: ["active", "completed", "paused", "inactive"],
        default: "inactive"
    },
    tasks: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Task",
        required: true
    }
}, { timestamps: true });

sessionSchema.statics.createSession = async function (user, duration, tasks) {
    let errors = {};

    if (!tasks || tasks.length === 0) {
        errors.tasks = "At least one task must be provided to start a session.";
    }
    if (!duration) {
        errors.duration = "Duration is required.";
    } else if (duration <= 0) {
        errors.duration = "Duration must be a positive number.";
    }

    if (Object.keys(errors).length > 0) {
        throw new Error(JSON.stringify(errors));
    }

    const session = await this.create({ user, duration, tasks });

    return session;
};

sessionSchema.statics.startSession = async function (sessionId) {
    let errors = {};

    if (!sessionId) {
        errors.sessionId = "Session ID is required to start a session.";
    }

    const session = await this.findById(sessionId);

    if (!session) {
        errors.session = "Session not found.";
    } else if (session.status === "active") {
        errors.status = "Session is already active.";
    }

    if (Object.keys(errors).length > 0) {
        throw new Error(JSON.stringify(errors));
    }

    session.status = "active";
    await session.save();

    return session;
};

const Session = mongoose.model("Session", sessionSchema);

export default Session;