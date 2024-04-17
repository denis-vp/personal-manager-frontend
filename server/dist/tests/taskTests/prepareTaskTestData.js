"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const taskRepository_1 = __importDefault(require("../../src/repository/taskRepository"));
const taskFactory = (id, title, category, content, isFinished, dueDate, priority) => {
    return {
        id: id,
        title: title,
        category: category,
        content: content,
        isFinished: isFinished,
        dueDate: dueDate,
        priority: priority,
    };
};
const prepareTaskTestData = () => {
    taskRepository_1.default.addTask(taskFactory("testTaskId1", "A Task", "todos", "This is a task", false, new Date().toISOString().slice(0, 10), "high"));
    taskRepository_1.default.addTask(taskFactory("testTaskId2", "Another Task", "todos", "This is another task", false, new Date().toISOString().slice(0, 10), "medium"));
    taskRepository_1.default.addTask(taskFactory("testTaskId3", "Yet Another Task", "todos", "This is yet another task", false, new Date().toISOString().slice(0, 10), "low"));
};
exports.default = prepareTaskTestData;
