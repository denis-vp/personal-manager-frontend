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
exports.getNotesByTaskId = exports.deleteNote = exports.updateNote = exports.addNote = exports.getNote = exports.getNotes = void 0;
const postgresDatabase_1 = __importDefault(require("../postgresDatabase"));
const getNotes = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield postgresDatabase_1.default.query('SELECT * FROM public."notes"');
    return result.rows;
});
exports.getNotes = getNotes;
const getNote = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield postgresDatabase_1.default.query('SELECT * FROM public."notes" WHERE id = $1', [id]);
    if (result.rowCount === 0) {
        throw new Error("Note not found");
    }
    return result.rows[0];
});
exports.getNote = getNote;
const addNote = (note) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield postgresDatabase_1.default.query('INSERT INTO public."notes" (id, title, category, content, date, associatedTaskId) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [note.id, note.title, note.category, note.content, note.date, note.associatedTaskId]);
    if (result.rowCount === 0) {
        throw new Error("Note not added");
    }
});
exports.addNote = addNote;
const updateNote = (id, note) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield postgresDatabase_1.default.query('UPDATE public."notes" SET title = $2, category = $3, content = $4, date = $5, associatedTaskId = $6 WHERE id = $1 RETURNING *', [id, note.title, note.category, note.content, note.date, note.associatedTaskId]);
    if (result.rowCount === 0) {
        throw new Error("Note not found");
    }
    return result.rows[0];
});
exports.updateNote = updateNote;
const deleteNote = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield postgresDatabase_1.default.query('DELETE FROM public."notes" WHERE id = $1', [id]);
    if (result.rowCount === 0) {
        throw new Error("Note not found");
    }
});
exports.deleteNote = deleteNote;
const getNotesByTaskId = (taskId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield postgresDatabase_1.default.query('SELECT * FROM public."notes" WHERE associatedTaskId = $1', [taskId]);
    return result.rows;
});
exports.getNotesByTaskId = getNotesByTaskId;
exports.default = { getNotes: exports.getNotes, getNote: exports.getNote, addNote: exports.addNote, updateNote: exports.updateNote, deleteNote: exports.deleteNote, getNotesByTaskId: exports.getNotesByTaskId };
