import { Task } from "../state/taskStore";

export const validateTask = (task: Task) => {
    if (task.title === "" || task.content === "") {
        return false;
    } else if (!["low", "medium", "high", ""].includes(task.priority)) {
        return false;
    }
    return true;
}