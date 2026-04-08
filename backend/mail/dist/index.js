"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const consumer_1 = require("./consumer");
dotenv_1.default.config();
(0, consumer_1.startSendOtpConsumer)();
const app = (0, express_1.default)();
app.listen(process.env.PORT, () => {
    console.log(`sever is running on port ${process.env.PORT}`);
});
