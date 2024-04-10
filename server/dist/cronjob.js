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
exports.noteGenerator = void 0;
const index_1 = require("./index");
const uuid_1 = require("uuid");
const lorem_ipsum_1 = require("lorem-ipsum");
const socket_1 = __importDefault(require("./socket"));
const noteGenerator = () => __awaiter(void 0, void 0, void 0, function* () {
    while (true) {
        console.log("Generating a new note...");
        const note = {
            id: (0, uuid_1.v4)(),
            title: `Random Note`,
            category: "random",
            content: (0, lorem_ipsum_1.loremIpsum)({
                count: Math.floor(Math.random() * 10) + 1,
                units: "sentences",
            }),
            date: new Date().toISOString().slice(0, 10),
        };
        index_1.notes.push(note);
        console.log("Note generated:", note);
        socket_1.default.clients.forEach((client) => {
            client.send(JSON.stringify(note));
        });
        // Generate a new note every 5-15 seconds
        const timeOutDuration = Math.floor(Math.random() * 5000) + 10000;
        yield new Promise(resolve => setTimeout(resolve, 5000));
    }
});
exports.noteGenerator = noteGenerator;
