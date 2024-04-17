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
exports.deleteNote = exports.updateNote = exports.createNote = exports.getNote = exports.getNotesByTaskId = exports.getNotes = void 0;
const noteRepository_1 = __importDefault(require("../repository/noteRepository"));
const noteValidator_1 = require("../validators/noteValidator");
const uuid_1 = require("uuid");
const getNotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { titleSortOrder } = req.query;
    try {
        const notes = yield noteRepository_1.default.getNotes();
        if (titleSortOrder === "ASC") {
            notes.sort((a, b) => a.title.localeCompare(b.title));
        }
        else if (titleSortOrder === "DESC") {
            notes.sort((a, b) => b.title.localeCompare(a.title));
        }
        res.status(200).json(notes);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.getNotes = getNotes;
const getNotesByTaskId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const taskId = req.params.taskId;
    try {
        const notes = yield noteRepository_1.default.getNotesByTaskId(taskId);
        res.status(200).json(notes);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.getNotesByTaskId = getNotesByTaskId;
const getNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const note = yield noteRepository_1.default.getNote(id);
        res.status(200).json(note);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
});
exports.getNote = getNote;
const createNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const note = req.body;
    try {
        (0, noteValidator_1.validateNote)(note);
        note.id = (0, uuid_1.v4)();
        yield noteRepository_1.default.addNote(note);
        res.status(201).json(note);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.createNote = createNote;
const updateNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const note = req.body;
    const id = req.params.id;
    try {
        (0, noteValidator_1.validateNote)(note);
        yield noteRepository_1.default.updateNote(id, note);
        res.status(200).json(note);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
});
exports.updateNote = updateNote;
const deleteNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        yield noteRepository_1.default.deleteNote(id);
        res.status(204).send();
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
});
exports.deleteNote = deleteNote;
exports.default = { getNotes: exports.getNotes, getNotesByTaskId: exports.getNotesByTaskId, getNote: exports.getNote, createNote: exports.createNote, updateNote: exports.updateNote, deleteNote: exports.deleteNote };
