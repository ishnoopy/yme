import { apiClient } from "@/lib/api-client"

export const getUserById = async (userId: string) => {
  const response = apiClient(`/users/${userId}`)
  return response
} 