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
exports.deleteTask = exports.updateTask = exports.addTask = exports.getTask = exports.getTasks = void 0;
const postgresDatabase_1 = __importDefault(require("../postgresDatabase"));
const getTasks = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield postgresDatabase_1.default.query('SELECT * FROM public."tasks"');
    return result.rows;
});
exports.getTasks = getTasks;
const getTask = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield postgresDatabase_1.default.query('SELECT * FROM public."tasks" WHERE id = $1', [id]);
    if (result.rowCount === 0) {
        throw new Error("Task not found");
    }
    return result.rows[0];
});
exports.getTask = getTask;
const addTask = (task) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield postgresDatabase_1.default.query('INSERT INTO public."tasks" (id, title, category, content, isFinished, dueDate, priority) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [task.id, task.title, task.category, task.content, task.isFinished, task.dueDate, task.priority]);
    if (result.rowCount === 0) {
        throw new Error("Task not added");
    }
});
exports.addTask = addTask;
const updateTask = (id, task) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield postgresDatabase_1.default.query('UPDATE public."tasks" SET title = $2, category = $3, content = $4, isFinished = $5, dueDate = $6, priority = $7 WHERE id = $1 RETURNING *', [id, task.title, task.category, task.content, task.isFinished, task.dueDate, task.priority]);
    if (result.rowCount === 0) {
        throw new Error("Task not found");
    }
    return result.rows[0];
});
exports.updateTask = updateTask;
const deleteTask = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield postgresDatabase_1.default.query('DELETE FROM public."tasks" WHERE id = $1', [id]);
    if (result.rowCount === 0) {
        throw new Error("Task not found");
    }
});
exports.deleteTask = deleteTask;
exports.default = { getTasks: exports.getTasks, getTask: exports.getTask, addTask: exports.addTask, updateTask: exports.updateTask, deleteTask: exports.deleteTask };
