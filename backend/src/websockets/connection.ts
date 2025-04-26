import RedisClient from "@/db/redis.js";
import { createNodeWebSocket } from "@hono/node-ws";
import { Context, Hono } from "hono";
import { WSContext } from "hono/ws";

const redisClient = RedisClient.getInstance();

const activeConnections = new Map<string, WSContext>();

export async function handleWebSocketConnection(app: Hono) {
	//DOCU: Open websocket connection for realtime notifications
	const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app });

	app.get(
		"/ws",
		upgradeWebSocket(async (c: Context) => {
			const data = c.req.query();

			return {
        onOpen: async (event, ws) => {
          const userId = data?.userId;
        
          if (!userId || userId.trim() === "" || userId === "undefined") {
            console.log("Socket: User ID not provided or invalid");
            return;
          }
        
          if (activeConnections.has(userId)) {
            console.log("Socket: User already connected:", userId);
          } else {
            activeConnections.set(userId, ws);
        
            const loggedInUsers = await redisClient.get("loggedInUsers");
            const parsedLoggedInUsers = loggedInUsers ? JSON.parse(loggedInUsers) : [];
        
            if (!parsedLoggedInUsers.includes(userId)) {
              const updatedLoggedInUsers = [...parsedLoggedInUsers, userId];
              await redisClient.set("loggedInUsers", JSON.stringify(updatedLoggedInUsers));
              console.log("User logged in:", userId);
              console.log("Logged in users:", updatedLoggedInUsers);
            } else {
              console.log("User already logged in:", userId);
            }
          }
        },
				onMessage(event, ws) {
					try {
						const message = JSON.parse(event.data as string);

						console.log("WebSocket: Message received:", message);
						console.log("WebSocket: Message type:", message.type);

						switch (message.type) {
							case "notification":
								const notification = message;
								const userId = message.userId;
								const connection = activeConnections.get(userId);

								if (connection) {
									connection.send(
										JSON.stringify({
											type: "notification",
											message: "Notification received",
										})
									);
								} else {
									console.log("Socket: No active connection for user:", userId);
								}

								console.log("Socket: Notification received:", notification);
								break;

							case "ping":
								ws.send(JSON.stringify({ type: "pong" }));
								break;

							default:
								console.log("Socket: Unknown message type:", message.type);
								break;
						}
					} catch {
						console.error("Socket: Error parsing message:", event.data);
					}
				},
        onClose: async () => {
          const userId = data?.userId;
        
          if (!userId || userId.trim() === "" || userId === "undefined") {
            console.log("Socket: User ID not provided on close");
            return;
          }
        
          activeConnections.delete(userId);
        
          const loggedInUsers = await redisClient.get("loggedInUsers");
          if (loggedInUsers) {
            const parsedLoggedInUsers = JSON.parse(loggedInUsers);
            if (parsedLoggedInUsers.includes(userId)) {
              const updatedLoggedInUsers = parsedLoggedInUsers.filter(
                (id: string) => id !== userId
              );
              await redisClient.set("loggedInUsers", JSON.stringify(updatedLoggedInUsers));
              console.log("User logged out:", userId);
              console.log("Logged in users:", updatedLoggedInUsers);
            }
          }
        },
			};
		})
	);

	return injectWebSocket;
}
