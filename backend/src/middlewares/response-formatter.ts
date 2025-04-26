// src/middlewares/response-formatter.ts
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library.js";
import { Context, Next } from "hono";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { StatusCodes } from "http-status-codes";

export async function responseFormatter(c: Context, next: Next) {
	// Skip formatting for Swagger and API docs routes
	if (
		c.req.path.startsWith("/api/swagger") ||
		c.req.path.startsWith("/api/scalar") ||
		c.req.path.startsWith("/api/openapi")
	) {
		return next();
	}

	await next();

	const response = c.res;

	let responseBody;

	if (response && response.body) {
		const clonedResponse = response.clone();
		try {
			responseBody = await clonedResponse.json();
		} catch {
			responseBody = undefined;
		}
	}

	console.log("C.ERROR", c.error);

	// DOCU: Handle Prisma client errors
	if (c?.error && 'code' in c.error && typeof c.error.code === 'string' && c.error.code[0] === 'P') {
    // This is a Prisma error
    c.res = c.json(
        {
            success: false,
            errors: {
                code: c.error.code,
                message: c.error.message,
                meta: (c.error as PrismaClientKnownRequestError).meta
            }
        },
        StatusCodes.BAD_REQUEST
    );

    return;
}

	const ERROR_CODE_START = 400;

	if (response?.status < ERROR_CODE_START) {


		// Handle single object responses
		if (responseBody && typeof responseBody === "object") {
			const isListResponse = c.req.query("isList");

			if (isListResponse) {
				c.res = c.json(
					{
						success: true,
						data: {
							items: [responseBody],
							count: 1,
							page: 1,
							limit: 1,
						},
					},
					response.status as ContentfulStatusCode
				);
			} else {
				c.res = c.json(
					{
						success: true,
						data: responseBody,
					},
					response.status as ContentfulStatusCode
				);
			}

			return;
		}

		// Handle other types (string, number, etc.)
		c.res = c.json(
			{
				success: true,
				data: responseBody,
			},
			response.status as ContentfulStatusCode
		);

		return;
	}
}
