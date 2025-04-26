import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { CONFIG } from "@/config";

// Create a custom fetch function that wraps the native fetch
export const apiClient = async (url: string, options: RequestInit = {}) => {
  const baseUrl = CONFIG.API_URL;
  const fullUrl = `${baseUrl}${url}`;

  // Add default headers
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers as Record<string, string>,
  };

  // Add auth token if it exists
  const token = localStorage.getItem("token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(fullUrl, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized responses
  if (response.status === 401) {
    // Clear auth state
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Store the message in localStorage
    localStorage.setItem('toastMessage', JSON.stringify({
      type: 'error',
      message: 'Your session has expired. Please login again.',
      duration: 5000,
      position: "top-right",
      richColors: true
    }));

    // Redirect immediately
    window.location.href = "/login";
        
    throw new Error("Your session has expired. Please login again.");
  }

  if (!response.ok) {
    const error = await response.json();
    // toast.error(error.errors?.[0]?.message || "Something went wrong", {
    //   duration: 5000,
    //   position: "top-right",
    //   richColors: true,
    // });
    throw new Error(error.errors?.[0]?.message || "Something went wrong");
  }

  return response.json();
}; 