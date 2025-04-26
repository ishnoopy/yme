import { findMessageById, findMessagesByReceiverId, updateMessageById } from "@/repository/message.repository.js";
import { sendAnonymousMessage } from "@/services/message.service.js";
import { Context } from "hono";
import { StatusCodes } from "http-status-codes";
import * as v from "valibot";

export async function getMessageById(C: Context) {
  const params = C.req.param();
  const { id } = v.parse(v.object({ id: v.string() }), params);
  const message = await findMessageById(id);

  return C.json(message);
}

export async function getMessagesByReceiverId(C: Context) {
  const params = C.req.param();
  const { id } = v.parse(v.object({ id: v.string() }), params);
  const messages = await findMessagesByReceiverId(id);

  return C.json(messages);
}

export async function createMessage(C: Context) {
  const body = await C.req.json();
  const Schema = v.object({
    sender_id: v.optional(v.string()),
    receiver_id: v.string(),
    content: v.string()
  })

  const validatedBody = v.parse(Schema, body);

  const message = await sendAnonymousMessage(validatedBody);
  return C.json(message, StatusCodes.CREATED);
}

export async function updateMessage(C: Context) {
  const body = await C.req.json();
  const params = C.req.param();
  const { id } = v.parse(v.object({ id: v.string() }), params);
  
  const Schema = v.object({
    content: v.optional(v.string()),
    is_viewed: v.optional(v.boolean()),
    is_answered: v.optional(v.boolean())
  })

  const validatedBody = v.parse(Schema, body);
  const message = await updateMessageById({ id, ...validatedBody });
  return C.json(message, StatusCodes.OK);
}
