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
exports.getNotesByTaskId = exports.deleteNote = exports.updateNote = exports.addNote = exports.getNote = exports.getNotes = void 0;
const notes = [];
const getNotes = () => __awaiter(void 0, void 0, void 0, function* () {
    return notes;
});
exports.getNotes = getNotes;
const getNote = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const note = notes.find(note => note.id === id);
    if (!note) {
        throw new Error("Note not found");
    }
    return note;
});
exports.getNote = getNote;
const addNote = (note) => __awaiter(void 0, void 0, void 0, function* () {
    notes.push(note);
    return note;
});
exports.addNote = addNote;
const updateNote = (id, note) => __awaiter(void 0, void 0, void 0, function* () {
    const index = notes.findIndex(note => note.id === id);
    if (index === -1) {
        throw new Error("Note not found");
    }
    notes[index] = note;
    return note;
});
exports.updateNote = updateNote;
const deleteNote = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const index = notes.findIndex(note => note.id === id);
    if (index === -1) {
        throw new Error("Note not found");
    }
    notes.splice(index, 1);
});
exports.deleteNote = deleteNote;
const getNotesByTaskId = (taskId) => __awaiter(void 0, void 0, void 0, function* () {
    return notes.filter(note => note.associatedTaskId === taskId);
});
exports.getNotesByTaskId = getNotesByTaskId;
exports.default = { getNotes: exports.getNotes, getNote: exports.getNote, addNote: exports.addNote, updateNote: exports.updateNote, deleteNote: exports.deleteNote, getNotesByTaskId: exports.getNotesByTaskId };
