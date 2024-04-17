"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notePostgresRepo_1 = __importDefault(require("./notePostgresRepo"));
const noteInMemoryRepo_1 = __importDefault(require("./noteInMemoryRepo"));
exports.default = process.env.NODE_ENV === "test" ? noteInMemoryRepo_1.default : notePostgresRepo_1.default;
