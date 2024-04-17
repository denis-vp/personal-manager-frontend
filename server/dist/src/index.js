"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const noteController_1 = __importDefault(require("./controller/noteController"));
const taskController_1 = __importDefault(require("./controller/taskController"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.NODE_ENV === "test" ? 0 : process.env.PORT;
app.use((0, cors_1.default)());
const jsonParser = body_parser_1.default.json();
// ----------------------------------- Ping Route -----------------------------------
app.get("/", (req, res) => {
    res.send("Server working!").status(200);
});
// ------------------------------------ Notes ---------------------------------------
app.get("/notes", noteController_1.default.getNotes);
app.get("/notes/:id", noteController_1.default.getNote);
app.get("/notes/task/:taskId", noteController_1.default.getNotesByTaskId);
app.post("/notes/create", jsonParser, noteController_1.default.createNote);
app.patch("/notes/:id", jsonParser, noteController_1.default.updateNote);
app.delete("/notes/:id", noteController_1.default.deleteNote);
// ------------------------------------ Tasks ---------------------------------------
app.get("/tasks", taskController_1.default.getTasks);
app.get("/tasks/:id", taskController_1.default.getTask);
app.post("/tasks/create", jsonParser, taskController_1.default.createTask);
app.patch("/tasks/:id", jsonParser, taskController_1.default.updateTask);
app.delete("/tasks/:id", taskController_1.default.deleteTask);
const server = app.listen(port, () => {
    console.group();
    console.log(`Server started at port ${port}`);
    console.groupEnd();
});
exports.default = server;
