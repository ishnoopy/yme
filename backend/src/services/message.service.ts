import { insertMessage } from "@/repository/message.repository.js";
import { findUserById } from "@/repository/user.repository.js";
import { CreateMessageServiceDto } from "@/types/dto/message/index.js";
import { NotFoundError } from "@/types/error.js";

export async function sendAnonymousMessage(props: CreateMessageServiceDto) {

  const isReceiverExists = await findUserById(props.receiver_id);

  if (!isReceiverExists) {
    throw new NotFoundError("Receiver not found");
  }

  if (props.sender_id) {
    const isSenderExists = await findUserById(props.sender_id);
    if (!isSenderExists) {
      throw new NotFoundError("Sender not found");
    }
  }

  const message = await insertMessage(props);
  return message;
}