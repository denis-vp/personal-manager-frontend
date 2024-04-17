"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.addTask = exports.getTask = exports.getTasks = void 0;
const tasks = [];
const getTasks = () => __awaiter(void 0, void 0, void 0, function* () {
    return tasks;
});
exports.getTasks = getTasks;
const getTask = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const task = tasks.find(task => task.id === id);
    if (!task) {
        throw new Error("Task not found");
    }
    return task;
});
exports.getTask = getTask;
const addTask = (task) => __awaiter(void 0, void 0, void 0, function* () {
    tasks.push(task);
});
exports.addTask = addTask;
const updateTask = (id, task) => __awaiter(void 0, void 0, void 0, function* () {
    const index = tasks.findIndex(task => task.id === id);
    if (index === -1) {
        throw new Error("Task not found");
    }
    tasks[index] = task;
    return task;
});
exports.updateTask = updateTask;
const deleteTask = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const index = tasks.findIndex(task => task.id === id);
    if (index === -1) {
        throw new Error("Task not found");
    }
    tasks.splice(index, 1);
});
exports.deleteTask = deleteTask;
exports.default = { getTasks: exports.getTasks, getTask: exports.getTask, addTask: exports.addTask, updateTask: exports.updateTask, deleteTask: exports.deleteTask };
