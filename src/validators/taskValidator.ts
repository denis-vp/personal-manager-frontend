import { Task } from "../state/taskStore";

export const validateTask = (task: Task) => {
    const errors = [];

    if (task.title === "") {
        errors.push("Title is required");
    }
    if (task.content === "") {
        errors.push("Content is required");
    }
    if (!["low", "medium", "high", ""].includes(task.priority)) {
        errors.push("Priority must be low, medium, or high");
    }

    if (errors.length > 0) {
        throw new Error(errors.join(", "));
    }
};
