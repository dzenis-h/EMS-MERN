import type { Request, Response, NextFunction } from "express";
import penaltyValidation from "../validations/penalty";
import employeeService from "../services/employee";
import AppError from "../base/error";
import penaltyService from "../services/penalty";
import response from "../middlewares/response";
import helpers from "../helpers";
import type { CreatePenaltyProps } from "../interfaces/penalty";
import { Types } from "mongoose";

export default new (class PenaltyController {
  public async createPenalty(
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
        data: await penaltyService.createPenalty(
          employee._id,
          await penaltyValidation.validateCreatePenalty(req.body)
        ),
      });
    } catch (err) {
      next(err);
    }
  }

  public async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        limit,
        page,
        direction,
        sortBy,
      } = await penaltyValidation.queryValidation(req.query);

      const { total, data } = await penaltyService.getPenaltyList({
        limit,
        page,
        direction,
        sortBy,
      });

      if (!total)
        throw new AppError({
          message: "data not found",
          statusCode: 404,
        });

      response.createResponse(
        { res, code: 200, message: "OK", data },
        {
          totalData: total,
          limit,
          page,
          totalPage: Math.ceil(total / limit),
        }
      );
    } catch (err) {
      next(err);
    }
  }

  public async createBulkPenalty(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { datas } = await penaltyValidation.validateCreateBulkPenalty(
        req.body
      );

      const employees = await employeeService.findMultipleByIds(
        helpers.mapEmployeeId(datas)
      );
      if (!employees.length)
        throw new AppError({
          message: "employees not found",
          statusCode: 404,
        });

      const payload: (CreatePenaltyProps & { employeeId: string })[] = [];
      const failed: (CreatePenaltyProps & {
        employeeId: string;
        reason: string;
      })[] = [];

      for (const data of datas) {
        const emp = employees.find(
          (el) => el._id.toString() === data.employeeId
        );
        if (!emp) {
          failed.push({
            ...data,
            reason: "employee not found",
          });
          continue;
        }
        payload.push(data);
      }
      if (!payload.length)
        return response.createResponse({
          res,
          code: 400,
          message: "there is no processed data",
          data: {
            success: 0,
            failed: failed.length,
            failedData: failed,
            successData: [],
          },
        });

      const penalties = await penaltyService.createBulkPenalty(payload);
      response.createResponse({
        res,
        code: 201,
        message: "OK",
        data: {
          success: penalties.length,
          failed: failed.length,
          failedData: failed,
          successData: penalties,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  public async deletePenalty(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { employeeId, penaltyId } = req.params;

      const penalty = await penaltyService.findEmployeePenalty(
        new Types.ObjectId(penaltyId),
        new Types.ObjectId(employeeId)
      );
      if (!penalty)
        throw new AppError({
          message: "data not found",
          statusCode: 404,
        });

      await penaltyService.deleteById(penalty._id);

      response.createResponse({ res, code: 200, message: "success" });
    } catch (err) {
      next(err);
    }
  }
})();
