import type { NextFunction, Request, Response } from "express";
import AppError from "../base/error";
import { isValidObjectId } from "mongoose";

export default new (class ValidObjectId {
  public checkValidParamObjectId = (field: string) => (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const param = req.params[field];
    if (!param)
      throw new AppError({
        message: "Internal Server Error",
        statusCode: 500,
      });

    if (!isValidObjectId(param))
      throw new AppError({ message: "Invalid ObjectId", statusCode: 400 });

    next();
  };
})().checkValidParamObjectId;
