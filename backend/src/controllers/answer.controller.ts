import { fetchAnswerById, fetchAnswerByMessageId } from "@/repository/answer.repository.js";
import { answerMessage } from "@/services/answer.service.js";
import { Context } from "hono";
import { StatusCodes } from "http-status-codes";
import * as v from "valibot"
import { NotFoundError } from "@/types/error.js";

export async function getAnswerById(c: Context) {
  const params = c.req.param();
  const { id } = v.parse(v.object({ id: v.string() }), params);

  const answer = await fetchAnswerById(id);

  return c.json(answer);
}

export async function getAnswerByMessageId(c: Context) {
  const params = c.req.param();
  const { id } = v.parse(v.object({ id: v.string() }), params);

  const answer = await fetchAnswerByMessageId(id);
  if (!answer) {
    throw new NotFoundError("Answer not found");
  }
  return c.json(answer);
}

export async function createAnswer(c: Context) {
  const body = await c.req.json();
  const Schema = v.object({
    message_id: v.string(),
    user_id: v.string(),
    content: v.string(),
  });

  const validatedBody = v.parse(Schema, body);

  const answer = await answerMessage(validatedBody);
  return c.json(answer, StatusCodes.CREATED);
}

