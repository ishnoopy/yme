import { apiClient } from "@/lib/api-client"

export const getMessages = async (userId: string) => {

  const response = apiClient(`/messages/receiver/${userId}`)
  return response
}

export const sendMessage = async (receiver_id: string, content: string) => {
  const response = apiClient(`/messages`, {
    method: "POST",
    body: JSON.stringify({ receiver_id, content }),
  })

  return response
}

export const updateMessage = async (messageId: string, content?: string, is_viewed?: boolean, is_answered?: boolean) => {
  const response = apiClient(`/messages/${messageId}`, {
    method: "PUT",
    body: JSON.stringify({ content, is_viewed, is_answered }),
  })
  return response
}