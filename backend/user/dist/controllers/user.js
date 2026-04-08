"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = void 0;
const rabbitmq_1 = require("../config/rabbitmq");
const TryCatch_1 = __importDefault(require("../config/TryCatch"));
const index_js_1 = require("../index.js");
exports.loginUser = (0, TryCatch_1.default)(async (req, res) => {
    const { email } = req.body;
    const rateLimitKey = `otp:ratelimit:${email}`;
    const rateLimit = await index_js_1.redisClient.get(rateLimitKey);
    if (rateLimit) {
        return res.status(429).json({ message: "Too many requests. Please try again later." });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpKey = `otp:${email}`;
    await index_js_1.redisClient.set(otpKey, otp, {
        EX: 300
    });
    await index_js_1.redisClient.set(rateLimitKey, "true", {
        EX: 60
    });
    const message = {
        to: email,
        subject: "Your OTP Code",
        body: `Your OTP code is: ${otp}. It will expire in 5 minutes.`
    };
    await (0, rabbitmq_1.publishToQuesue)("send-otp", message);
    res.status(200).json({
        message: "OTP sent to email"
    });
});
