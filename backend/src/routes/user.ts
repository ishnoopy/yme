import { Hono } from "hono";
import { getUserById, getUsers, createUser } from "@/controllers/user.controller.js";
import { authGuard } from "@/middlewares/auth.guard.js";

const UserRoutes = new Hono().basePath("/users");

UserRoutes.get("/", authGuard, getUsers);
UserRoutes.get("/:id", getUserById);
UserRoutes.post("/", createUser);

export default UserRoutes;
