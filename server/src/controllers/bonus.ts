import type { Request, Response, NextFunction } from "express";
import employeeService from "../services/employee";
import AppError from "../base/error";
import bonusValidation from "../validations/bonus";
import response from "../middlewares/response";
import bonusService from "../services/bonus";
import { Types } from "mongoose";

export default new (class BonusController {
  public async createBonus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { employeeId } = req.params;

      const employee = await employeeService.getByIdentifier(employeeId);
      if (!employee)
        throw new AppError({
          message: "employee not found",
          statusCode: 404,
        });

      response.createResponse({
        res,
        code: 201,
        message: "success",
        data: await bonusService.createOne(
          employee._id,
          await bonusValidation.validateCreateBonus(req.body)
        ),
      });
    } catch (err) {
      next(err);
    }
  }

  public async deleteBonus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { employeeId, bonusId } = req.params;

      const bonus = await bonusService.findEmployeeBonus(
        new Types.ObjectId(bonusId),
        new Types.ObjectId(employeeId)
      );
      if (!bonus)
        throw new AppError({
          message: "data not found",
          statusCode: 404,
        });

      await bonusService.deleteById(bonus._id);

      response.createResponse({ res, code: 200, message: "success" });
    } catch (err) {
      next(err);
    }
  }
})();
