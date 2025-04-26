import { prisma } from "@/db/client.js";
import { CreateMessageRepositoryDto, UpdateMessageRepositoryDto } from "@/types/dto/message/index.js";
import { NotFoundError } from "@/types/error.js";

export async function findMessageById(id: string) {
  const message = await prisma.message.findUnique({
    where: { id },
  });

  if (!message) {
    throw new NotFoundError("Message not found");
  }

  return message;
}

export async function findMessagesByReceiverId(receiver_id: string) {
  const messages = await prisma.message.findMany({
    where: { receiver_id },
    include: {
      answer: true,
    }
  });

  return messages;
}

export async function insertMessage(props: CreateMessageRepositoryDto) {
  const message = await prisma.message.create({
    data: props,
  });

  return message;
}

export async function updateMessageById(props: UpdateMessageRepositoryDto) {
  const message = await prisma.message.update({
    where: { id: props.id },
    data: props,
  });

  return message;
}