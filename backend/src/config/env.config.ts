import { CLIENT_RENEG_LIMIT } from "node:tls";
import { getEnv } from "../utils/get-env";

export const Env = {
  NODE_ENV: getEnv("NODE_ENV", "development"),
  PORT: getEnv("PORT", "8000"),
  MONGODB_URI: getEnv("MONGODB_URI"),
  JWT_SECRET: getEnv("JWT_SECRET"),
  JWT_EXPIRES_IN: getEnv("JWT_EXPIRES_IN", "7d"),
  FRONTEND_URL: getEnv("FRONTEND_URL", "http://localhost:5173"),
  CLOUDINARY_CLOUD_NAME: getEnv("CLOUDINARY_CLOUD_NAME"),
  CLOUDINARY_API_KEY: getEnv("CLOUDINARY_API_KEY"),
  CLOUDINARY_API_SECRET: getEnv("CLOUDINARY_API_SECRET"),
} as const;
