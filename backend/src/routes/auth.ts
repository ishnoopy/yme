import { loginUser } from "@/controllers/auth.controller.js";
import { Hono } from "hono";

const AuthRoutes = new Hono().basePath("/auth");

AuthRoutes.post("/login", loginUser);

export default AuthRoutes;
