import dotenv from "dotenv";

dotenv.config();

export const GeneralConfig = {
  environment: process.env.NODE_ENV || "development",
  serviceName: process.env.SERVICE_NAME || "split-bill-api",
  port: process.env.PORT || 3001,
  logLevel: process.env.LOG_LEVEL || "info",
  jwtSecret: process.env.JWT_SECRET || "secret",
  redisPort: process.env.REDIS_PORT || 6379,
  enableLogs: process.env.ENABLE_LOGS === "true",
};
