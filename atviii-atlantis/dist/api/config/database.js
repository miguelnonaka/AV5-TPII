"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const promise_1 = __importDefault(require("mysql2/promise"));
dotenv_1.default.config();
exports.pool = promise_1.default.createPool({
    host: (_a = process.env.DB_HOST) !== null && _a !== void 0 ? _a : "localhost",
    port: Number((_b = process.env.DB_PORT) !== null && _b !== void 0 ? _b : 3306),
    user: (_c = process.env.DB_USER) !== null && _c !== void 0 ? _c : "root",
    password: (_d = process.env.DB_PASSWORD) !== null && _d !== void 0 ? _d : "",
    database: (_e = process.env.DB_NAME) !== null && _e !== void 0 ? _e : "atlantis",
    waitForConnections: true,
    connectionLimit: 10,
    namedPlaceholders: true
});
