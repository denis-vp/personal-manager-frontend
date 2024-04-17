"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const taskPostgresRepo_1 = __importDefault(require("./taskPostgresRepo"));
const taskInMemoryRepo_1 = __importDefault(require("./taskInMemoryRepo"));
exports.default = process.env.NODE_ENV === "test" ? taskInMemoryRepo_1.default : taskPostgresRepo_1.default;
