"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notes = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const uuid_1 = require("uuid");
const lorem_ipsum_1 = require("lorem-ipsum");
const cors_1 = __importDefault(require("cors"));
const cronjob_1 = require("./cronjob");
require("./socket");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
const port = process.env.NODE_ENV === "test" ? 0 : process.env.PORT;
const placeholderNotes = Array.from({ length: 20 }, (_, i) => ({
    id: (0, uuid_1.v4)(),
    title: `Note ${i + 1}`,
    category: "todos",
    content: (0, lorem_ipsum_1.loremIpsum)({
        count: Math.floor(Math.random() * 10) + 1,
        units: "sentences",
    }),
    date: new Date().toISOString().slice(0, 10),
}));
exports.notes = placeholderNotes;
(0, cronjob_1.noteGenerator)();
app.get("/notes", (req, res) => {
    res.status(200);
    res.json(exports.notes);
});
app.get("/notes/:id", (req, res) => {
    const note = exports.notes.find((n) => n.id === req.params.id);
    if (note) {
        res.status(200);
        res.json(note);
    }
    else {
        res.status(404).json({ message: "Note not found" });
    }
});
app.post("/notes/create", (req, res) => {
    const note = req.body;
    note.id = (0, uuid_1.v4)();
    exports.notes.push(note);
    res.status(201);
    res.json(note);
});
app.patch("/notes/:id", (req, res) => {
    const noteIndex = exports.notes.findIndex((n) => n.id === req.params.id);
    if (noteIndex !== -1) {
        exports.notes[noteIndex] = req.body;
        res.status(200);
        res.json(exports.notes[noteIndex]);
    }
    else {
        res.status(404).json({ message: "Note not found" });
    }
});
app.delete("/notes/:id", (req, res) => {
    const noteIndex = exports.notes.findIndex((n) => n.id === req.params.id);
    if (noteIndex !== -1) {
        exports.notes.splice(noteIndex, 1);
        res.status(204);
    }
    else {
        res.status(404).json({ message: "Note not found" });
    }
    res.send();
});
const server = app.listen(port, () => {
    console.group();
    console.log(`Server started at port ${port}`);
    console.groupEnd();
});
exports.default = server;
