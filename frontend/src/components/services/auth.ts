import { apiClient } from "@/lib/api-client";

export const login = async (email: string, password: string) => {
  const response = await apiClient("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });

  return response;
}

export const register = async (email: string, password: string, firstName: string, lastName: string, username: string) => {
  const response = await apiClient("/users", {
    method: "POST",
    body: JSON.stringify({
      email: email,
      password: password,
      first_name: firstName,
      last_name: lastName,
      username: username,
    }),
  });

  return response;
}