import {
	createMessage,
	getMessageById,
	getMessagesByReceiverId,
	updateMessage,
} from "@/controllers/message.controller.js";
import { authGuard } from "@/middlewares/auth.guard.js";
import { Hono } from "hono";

const MessageRoutes = new Hono().basePath("/messages");

MessageRoutes.get("/:id", authGuard, getMessageById);

MessageRoutes.post("/", createMessage);

MessageRoutes.get("/receiver/:id", authGuard, getMessagesByReceiverId);

MessageRoutes.put("/:id", authGuard, updateMessage);

export default MessageRoutes;
