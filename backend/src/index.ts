import { serve } from "@hono/node-server";
import { Scalar } from "@scalar/hono-api-reference";
import { swaggerUI } from "@hono/swagger-ui";
import { Hono } from "hono";
import { openAPISpecs } from "hono-openapi";
import { errorHandler } from "./middlewares/error-handler.js";
import { requestLogger } from "./middlewares/request-logger.js";
import { GeneralConfig } from "./config/general.js";
import { responseFormatter } from "./middlewares/response-formatter.js";
import { loadRoutes } from "./utils/load-routes.js";
import { cors } from "hono/cors";
import { handleWebSocketConnection } from "./websockets/connection.js";

const app = new Hono();

//DOCU: Open WebSocket connection for realtime notifications
const injectWebSocket = handleWebSocketConnection(app)

//DOCU: CORS middleware
app.use('/api/*', cors({
	origin: '*', // Allow all origins
	allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // Allow all HTTP methods
	allowHeaders: ["Origin", "Content-Type", "Authorization", "Accept", "X-Requested-With"],
	exposeHeaders: ["Content-Length", "Content-Type"],
	maxAge: 86400, // Cache preflight request results for 24 hours
}))

//DOCU: Middleware to log requests and responses
if (GeneralConfig.enableLogs) {
	app.use("*", requestLogger);
}

app.use("*", responseFormatter);

//DOCU: Used util function to load routes dynamically
await loadRoutes(app);

//DOCU: Middleware to handle errors
app.onError(errorHandler);

//DOCU: Use OpenAPI documentation
app.get(
	"/api/openapi",
	openAPISpecs(app, {
		documentation: {
			info: {
				title: "Hono API",
				version: "1.0.0",
				description: "API documentation for split bill",
			},
			servers: [
				{
					url: "http://localhost:3001/",
					description: "Local server",
				},
			],
		},
	})
);

//DOCU: Use Scalar API reference
app.get(
	"/api/scalar",
	Scalar({
		theme: "saturn",
		url: "/api/openapi",
	})
);

//DOCU: Use Swagger UI
app.get(
	"/api/swagger",
	swaggerUI({
		url: "/api/openapi",
	})
);

const PORT = GeneralConfig.port;

const server = serve(
	{
		fetch: app.fetch,
		port: parseInt(PORT as string),
	},
	(info) => {
		console.log(`Server is running on port:${info.port}`);
	}
);

(await injectWebSocket)(server);

