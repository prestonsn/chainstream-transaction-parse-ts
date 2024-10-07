"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RAYDUIM_PROGRAM_ID = exports.TOKEN_PROGRAM_ID = exports.TOKEN = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const retrieveEnvVariable = (variableName) => {
    const variable = process.env[variableName] || "";
    if (!variable) {
        console.error(`${variableName} is not set`);
        process.exit(1);
    }
    return variable;
};
exports.TOKEN = retrieveEnvVariable("TOKEN");
exports.TOKEN_PROGRAM_ID = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
exports.RAYDUIM_PROGRAM_ID = "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8";
