import TryCatch from "../config/TryCatch";
import {redisClient} from "../index.js";

export const loginUser = TryCatch(async(req,res)=>{
  const {email} = req.body;
  const rateLimitKey = `otp:ratelimit:${email}`;

  const rateLimit = await redisClient.get(rateLimitKey);
  if (rateLimit) {
    return res.status(429).json({ message: "Too many requests. Please try again later." });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await redisClient.setEx(`otp:${email}`, 300, otp);
  await redisClient.setEx(rateLimitKey, 60, "1");

})

