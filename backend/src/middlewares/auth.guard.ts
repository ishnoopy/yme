import { GeneralConfig } from "@/config/general.js";
import { UnauthorizedError } from "@/types/error.js";
import { Context, Next } from "hono";
import jwt from "jsonwebtoken";

export async function authGuard(c: Context, next: Next) {
  try {
    const authHeader = c.req.header("Authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      throw new UnauthorizedError("No security token provided");
    }

    const decoded = jwt.verify(token, GeneralConfig.jwtSecret);

    c.set("user", decoded);

    await next();
    
  } catch (error) {
    throw new UnauthorizedError("Invalid security token");
  }
}