"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pool = new pg_1.Pool({
    user: (_a = process.env.POSTGRES_USER) === null || _a === void 0 ? void 0 : _a.toString(),
    host: (_b = process.env.POSTGRES_HOST) === null || _b === void 0 ? void 0 : _b.toString(),
    database: (_c = process.env.POSTGRES_DB) === null || _c === void 0 ? void 0 : _c.toString(),
    password: (_d = process.env.POSTGRES_PASSWORD) === null || _d === void 0 ? void 0 : _d.toString(),
    port: parseInt((_e = process.env.POSTGRES_PORT) === null || _e === void 0 ? void 0 : _e.toString()),
    max: 20,
    idleTimeoutMillis: 30000,
});
exports.default = pool;
