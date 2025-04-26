import { apiClient } from "@/lib/api-client";

const answerMessage = async (messageId: string, userId: string, content: string) => {
  const response = await apiClient(`/answers`, {
    method: "POST",
    body: JSON.stringify({
      message_id: messageId,
      user_id: userId,
      content: content,
    }),
  });
  return response.data;
};

export default answerMessage;