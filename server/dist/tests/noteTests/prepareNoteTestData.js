"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const noteRepository_1 = __importDefault(require("../../src/repository/noteRepository"));
const noteFactory = (id, title, category, content, date, associatedTaskId) => {
    return {
        id: id,
        title: title,
        category: category,
        content: content,
        date: date,
        associatedTaskId: associatedTaskId,
    };
};
const prepareNoteTestData = () => {
    noteRepository_1.default.addNote(noteFactory("testId1", "A Note", "todos", "This is a note", new Date().toISOString().slice(0, 10), "testTaskId1"));
    noteRepository_1.default.addNote(noteFactory("testId2", "Another Note", "todos", "This is another note", new Date().toISOString().slice(0, 10), "testTaskId1"));
    noteRepository_1.default.addNote(noteFactory("testId3", "Yet Another Note", "todos", "This is yet another note", new Date().toISOString().slice(0, 10), "testTaskId2"));
};
exports.default = prepareNoteTestData;
