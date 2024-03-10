import type { Request, Response, NextFunction } from "express";
import AppError from "../base/error";
import employeeService from "../services/employee";
import response from "../middlewares/response";
import reportValidation from "../validations/report";
import helpers from "../helpers";
import { Types } from "mongoose";

export default new (class ReportController {
  public async getSummaryData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = await employeeService.getReportSummary();
      if (!data.length)
        throw new AppError({
          message: "data not found",
          statusCode: 404,
        });

      response.createResponse(
        {
          res,
          code: 200,
          message: "OK",
          data,
        },
        {
          page: 1,
          limit: data.length,
          totalData: data.length,
          totalPage: 1,
        }
      );
    } catch (err) {
      next(err);
    }
  }

  public async getSummaryDetail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { month, year } = await reportValidation.validateDate(req.query);
      const [first, last] = helpers.getFirstAndLastDate(month, year);

      const data = await employeeService.getEmployeeSalaryDetailPerMonth(
        first,
        last
      );
      if (!data.length)
        throw new AppError({
          message: "data not found",
          statusCode: 404,
        });

      response.createResponse(
        {
          res,
          code: 200,
          message: "OK",
          data,
        },
        {
          page: 1,
          limit: data.length,
          totalData: data.length,
          totalPage: 1,
        }
      );
    } catch (err) {
      next(err);
    }
  }

  public async getEmployeeStatistic(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { month, year } = await reportValidation.validateDate(req.query);
      const [first, last] = helpers.getFirstAndLastDate(month, year);

      const data = await employeeService.getStatistic(first, last);
      if (!data)
        throw new AppError({
          message: "data not found",
          statusCode: 404,
        });

      response.createResponse({
        res,
        code: 200,
        message: "OK",
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  public async getEmployeeSalary(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { employeeId } = req.params;
      const { month, year } = await reportValidation.validateDate(req.query);
      const [first, last] = helpers.getFirstAndLastDate(month, year);

      const data = await employeeService.getSalaryPaymentPerEmployee(
        new Types.ObjectId(employeeId),
        first,
        last
      );
      if (!data.length)
        throw new AppError({
          message: "data not found",
          statusCode: 404,
        });

      response.createResponse(
        {
          res,
          code: 200,
          message: "OK",
          data,
        },
        {
          page: 1,
          limit: data.length,
          totalData: data.length,
          totalPage: 1,
        }
      );
    } catch (err) {
      next(err);
    }
  }
})();
