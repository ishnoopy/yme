import { Hono } from "hono";
import { createAnswer, getAnswerById, getAnswerByMessageId } from "@/controllers/answer.controller.js";
import { authGuard } from "@/middlewares/auth.guard.js";

const AnswerRoutes = new Hono().basePath("/answers");

AnswerRoutes.get("/:id", authGuard, getAnswerById);
AnswerRoutes.get("/message/:id", authGuard, getAnswerByMessageId);
AnswerRoutes.post("/", authGuard, createAnswer);

export default AnswerRoutes;