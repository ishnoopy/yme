import { Context, Next } from "hono";
import { logger } from "@/utils/logger.js";

/*
  * Middleware to log requests and responses
  * @param {Context} c - Hono context
  * @param {Next} next - Next middleware function
*/


export async function requestLogger(c: Context, next: Next) {
  const requestStart = performance.now();
  const requestId = crypto.randomUUID();
  const method = c.req.method;

  const body = await c.req.json().catch(() => undefined);

  //DOCU: Request log
  logger.info(`Request: ${method} ${c.req.path}`, {
    requestId,
    method: method,
    path: c.req.path,
    query: c.req.query(),
    body: body,
    headers: {
      'user-agent': c.req.header('user-agent'),
      'content-type': c.req.header('content-type'),
    }
  })

  //DOCU: Response log
  await next();

  const response = c.res
  let responseBody;

  if (response && response.body) {
    //DOCU: Clone the response to read its body as reading the body once will consume the body stream
    const clonedResponse = response.clone();

    try {
      responseBody = await clonedResponse.json();
    } catch {
      responseBody = undefined
    }
  }

  const duration = Math.round(performance.now() - requestStart);
  const status = c.res.status;

  const ERROR_CODE_START = 400;
  if (status >= ERROR_CODE_START) {

    logger.error(`Request Failed (${status})`, {
      requestId: requestId,
      method: c.req.method,
      path: c.req.path,
      status: status,
      error: responseBody?.errors || responseBody,
      duration: `${duration}ms`,
    });

  } else {

    logger.info(`Response: ${method}|${status} ${c.req.path}`, {
      requestId,
      method: c.req.method,
      path: c.req.path,
      status,
      response: responseBody,
      duration: `${duration}ms`,
    });
  }

}