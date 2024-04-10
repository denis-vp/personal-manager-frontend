"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateNote = void 0;
const validateNote = (note) => {
    if (note.title === '' || note.content === '') {
        return false;
    }
    return true;
};
exports.validateNote = validateNote;
