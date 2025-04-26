import { prisma } from "@/db/client.js";
import { CreateAnswerRepositoryDto } from "@/types/dto/answer/index.js";
import { NotFoundError } from "@/types/error.js";

export async function fetchAnswerById(id: string) {
  const answer = await prisma.answer.findUnique({
    where: { id },
  });

  if (!answer) {
    throw new NotFoundError("Answer not found");
  }

  return answer;
}

export async function fetchAnswerByMessageId(message_id: string) {
  const answer = await prisma.answer.findUnique({
    where: { message_id },
  });

  return answer;
}

export async function insertAnswer(answer: CreateAnswerRepositoryDto) {
  const newAnswer = await prisma.answer.create({
    data: answer,
  });

  return newAnswer;
}
