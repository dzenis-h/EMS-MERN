import type { NextFunction, Request, Response } from "express";
import AppError, { type ApplicationError } from "../base/error";
import response from "./response";
import type { ResponsePayload } from "../interfaces/response";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

class ErrorHandler {
  public errorHandling(
    err: ApplicationError,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    let message =
      err instanceof AppError ? err.message : "Internal Server Error";
    let code =
      err instanceof AppError ? (err as ApplicationError).statusCode : 500;

    if (err.message.includes("E11000 duplicate")) {
      console.log(err.message)
      const match = err.message.match(/index: (\w+)_\d+/);
      const fieldName = match ? match[1] : null;
      message = `${fieldName} is already registered.`
      code = 409
    }

    if (err instanceof JsonWebTokenError || err instanceof TokenExpiredError) {
      code = 401;
      message = "missing or invalid token";
    }

    const payload: ResponsePayload = {
      res,
      code,
      message,
    };
    if ((err as ApplicationError).data)
      payload.data = (err as ApplicationError).data;

    if (code === 500) console.log(err)

    response.createResponse(payload);
  }
}

export default new ErrorHandler().errorHandling;
