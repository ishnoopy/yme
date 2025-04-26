import { fetchAnswerByMessageId, insertAnswer } from "@/repository/answer.repository.js";
import { findMessageById, updateMessageById } from "@/repository/message.repository.js";
import { findUserById } from "@/repository/user.repository.js";
import { CreateAnswerServiceDto } from "@/types/dto/answer/index.js";
import { BadRequestError } from "@/types/error.js";

export async function answerMessage(answer: CreateAnswerServiceDto) {

  const isMessageExists = await findMessageById(answer.message_id);
  if (!isMessageExists) {
    throw new BadRequestError("Message not found");
  }

  const isUserExists = await findUserById(answer.user_id);
  if (!isUserExists) {
    throw new BadRequestError("User not found");
  }

  const isMessageAnswered = await fetchAnswerByMessageId(answer.message_id);
  if (isMessageAnswered) {
    throw new BadRequestError("Message already answered");
  }

  const newAnswer = await insertAnswer(answer);

  await updateMessageById({ id: answer.message_id, is_answered: true });

  return newAnswer;
}
