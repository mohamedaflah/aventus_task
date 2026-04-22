import { NextFunction, type Request, Response } from "express";
import redisClient from "../cache/redis.config";
const WINDOW_SIZE = 60;
const MAX_REQUEST = 10;

export const rateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ip =
      req.ip ||
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      "unknown";
    const key = `rate:${ip}`;

    const requests = await redisClient.incr(key);

    if (requests === 1) {
      await redisClient.expire(key, WINDOW_SIZE);
    }

    if (requests > MAX_REQUEST) {
      return res.status(429).json({
        message: "Too many requests, please try again later",
      });
    }
    next();
  } catch (err) {
    console.error("Rate limiter error:", err);
    next(); // don't block request if Redis fails
  }
};
