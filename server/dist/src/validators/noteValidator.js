"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateNote = void 0;
const validateNote = (note) => {
    if (note.title === "")
        throw new Error("Invalid note: title is empty");
    if (note.content === "")
        throw new Error("Invalid note: content is empty");
};
exports.validateNote = validateNote;
