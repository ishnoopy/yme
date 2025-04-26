import type { Context } from "hono";
import { ValiError } from "valibot";
import type { BaseError } from "../types/error.js";
import { StatusCodes } from "http-status-codes";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { GeneralConfig } from "@/config/general.js";

interface ErrorResponse {
	success: boolean;
	errors: Array<{
		code: number;
		message: string;
		stack?: string;
	}>;
	errorCode?: ContentfulStatusCode
}

export async function errorHandler(err: Error | BaseError, c: Context) {
	const environment = GeneralConfig.environment;

	if (err instanceof ValiError) {
		const errors = err.issues.map((issue) => ({
			code: StatusCodes.BAD_REQUEST,
			message: issue.message,
		}));

		return c.json<ErrorResponse>(
			{
				success: false,
				errors,
			},
			StatusCodes.BAD_REQUEST,
		);

  }

  // Check if it's a BaseError (has code property)
	const errorCode = 'code' in err ? err.code : StatusCodes.INTERNAL_SERVER_ERROR;

	return c.json<ErrorResponse>(
		{
			success: false,
			errors: [
				{
					code: errorCode,
					message: err.message || "An unexpected error occurred",
					...(environment === "development" && { stack: err.stack })
				},
			]
		},
		errorCode as ContentfulStatusCode
	);
}
