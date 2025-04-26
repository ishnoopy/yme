import { CONFIG } from "@/config";
import { createContext, useRef, useEffect, useContext } from "react";
import { useAuth } from "./AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type WebSocketContextType = {
  sendMessage: (message: any) => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const socketRef = useRef<WebSocket | null>(null);
  const handlersRef = useRef<Map<string, (data: any) => void>>(new Map());
  const { user, isLoggedIn } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = new WebSocket(`${CONFIG.SOCKET_URL}?userId=${user?.id}`);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("Client: WebSocket connection opened ✅");
    }

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event?.data);
        // const handler = handlersRef.current.get(data?.type);

        // if (handler) {
        //   handler(data);
        //   console.log("Client: WebSocket message received 💬:", data);
        // } else {
        //   console.warn("Client: No handler found for message type:", data?.type);
        // }

        if (data?.type === "notification") {
          queryClient.invalidateQueries({
            queryKey: ["messages"],
          })
          toast.success("New message received!", {
            description: "You have a new message.",
            duration: 5000,
            position: "top-right",
            richColors: true,
          });

          console.log("Client: WebSocket message received 💬:", data);
          return;
        }

        console.warn("Client: WebSocket message received but no handler found:", data);

      } catch (error) {
        console.error("Client: Error handling message", error);
      }
    }

    socket.onclose = () => {
      console.log(`Client: WebSocket connection closed for ${user?.id} 🚫`);
    }
    socket.onerror = (error) => {
      console.error("Client: WebSocket error:", error);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      console.log("Client: WebSocket connection closed in cleanup 🧹");
    }

  }, [isLoggedIn])

  const sendMessage = (message: any) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
      console.log("Client: WebSocket message sent:", message);
    } else {
      console.error("Client: WebSocket is not open. Cannot send message.");
    }
  }

  

  return (
    <WebSocketContext.Provider value={{ sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  )
}

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }

  return context;
}