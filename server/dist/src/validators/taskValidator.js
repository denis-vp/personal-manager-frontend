"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTask = void 0;
const validateTask = (task) => {
    if (task.title === "")
        throw new Error("Invalid task: title is empty");
    if (task.content === "")
        throw new Error("Invalid task: content is empty");
    if (!["low", "medium", "high", ""].includes(task.priority))
        throw new Error("Invalid task: priority is invalid");
};
exports.validateTask = validateTask;
