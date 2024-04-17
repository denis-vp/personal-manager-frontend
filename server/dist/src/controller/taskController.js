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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.getTask = exports.getTasks = void 0;
const taskRepository_1 = __importDefault(require("../repository/taskRepository"));
const taskValidator_1 = require("../validators/taskValidator");
const uuid_1 = require("uuid");
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield taskRepository_1.default.getTasks();
        res.status(200).json(tasks);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.getTasks = getTasks;
const getTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const task = yield taskRepository_1.default.getTask(id);
        res.status(200).json(task);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
});
exports.getTask = getTask;
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const task = req.body;
    try {
        (0, taskValidator_1.validateTask)(task);
        task.id = (0, uuid_1.v4)();
        yield taskRepository_1.default.addTask(task);
        res.status(201).json(task);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.createTask = createTask;
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const task = req.body;
    const id = req.params.id;
    try {
        (0, taskValidator_1.validateTask)(task);
        yield taskRepository_1.default.updateTask(id, task);
        res.status(200).json(task);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
});
exports.updateTask = updateTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        yield taskRepository_1.default.deleteTask(id);
        res.status(204).send();
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
});
exports.deleteTask = deleteTask;
exports.default = { getTasks: exports.getTasks, getTask: exports.getTask, createTask: exports.createTask, updateTask: exports.updateTask, deleteTask: exports.deleteTask };
