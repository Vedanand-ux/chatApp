"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = void 0;
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
    await index_js_1.redisClient.setEx(`otp:${email}`, 300, otp);
    await index_js_1.redisClient.setEx(rateLimitKey, 60, "1");
});
//# sourceMappingURL=user.js.map