import { publishToQuesue } from "../config/rabbitmq";
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
  
  const otpKey = `otp:${email}`;
  await redisClient.set(otpKey, otp,{
    EX: 300
  });

  await redisClient.set(rateLimitKey,"true",{
    EX: 60
  });

  const message ={
    to: email,
    subject: "Your OTP Code",
    body: `Your OTP code is: ${otp}. It will expire in 5 minutes.`
  };

  await publishToQuesue("send-otp", message);
  res.status(200).json({ 
    message: "OTP sent to email" 
  });


})

