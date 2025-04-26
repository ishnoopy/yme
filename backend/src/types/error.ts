import { StatusCodes } from "http-status-codes";

export class BaseError extends Error {
  code: StatusCodes;

  constructor(message: string, code: StatusCodes = StatusCodes.INTERNAL_SERVER_ERROR) {
    super(message);
    this.name = "BaseError";
    this.message = message;
    this.code = code
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends BaseError {
  constructor(message: string) {
    super(message, StatusCodes.NOT_FOUND);
    this.name = "NotFoundError";
  }
}

export class BadRequestError extends BaseError {
  constructor(message: string) {
    super(message, StatusCodes.BAD_REQUEST);
    this.name = "BadRequestError";
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message: string) {
    super(message, StatusCodes.UNAUTHORIZED);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends BaseError {
  constructor(message: string) {
    super(message, StatusCodes.FORBIDDEN);
    this.name = "ForbiddenError";
  }
}

export class ConflictError extends BaseError {
  constructor(message: string) {
    super(message, StatusCodes.CONFLICT);
    this.name = "ConflictError";
  }
}

export class ValidationError extends BaseError {
  constructor(message: string) {
    super(message, StatusCodes.UNPROCESSABLE_ENTITY);
    this.name = "ValidationError";
  }
}

export class TooManyRequestsError extends BaseError {
  constructor(message: string) {
    super(message, StatusCodes.TOO_MANY_REQUESTS);
    this.name = "TooManyRequestsError";
  }
}