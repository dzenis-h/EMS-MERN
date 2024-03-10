import type { Request, Response, NextFunction } from "express";
import employeeValidation from "../validations/employee";
import response from "../middlewares/response";
import { Types } from "mongoose";
import AppError from "../base/error";
import { startSession } from "mongoose";
import type { HistoryRaises, ISalary } from "../interfaces/salary";
import type { NewEmployeeProps } from "../interfaces/employee";
import salaryService from "../services/salary";
import employeeService from "../services/employee";

export default new (class EmployeeController {
  public async registerNewEmployee(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const session = await startSession();
    session.startTransaction();
    try {
      const {
        salaryAmount,
        ...payload
      } = await employeeValidation.validateNewEmployee(req.body);

      const data = await employeeService.createEmployee(payload, { session });
      await salaryService.createSalary(
        {
          date: payload.startdate,
          amount: salaryAmount,
          employeeId: data._id,
        },
        { session }
      );

      await session.commitTransaction();
      response.createResponse({
        res,
        code: 201,
        message: "ok",
        data,
      });
    } catch (err) {
      await session.abortTransaction();
      next(err);
    } finally {
      await session.endSession();
    }
  }

  public async registerBulkNewEmployee(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const session = await startSession();
    session.startTransaction();
    try {
      const { datas } = await employeeValidation.validateBulkNewEmployee(
        req.body
      );

      const unique = datas.filter(
        (val, i, self) => i === self.findIndex((el) => el.JMBG === val.JMBG)
      );

      const employees = await employeeService.findMultipleByJMBG(
        unique.map(({ JMBG }) => JMBG)
      );

      const payload = unique.filter(
        (el) => !employees.some((employee) => employee.JMBG === el.JMBG)
      );
      if (!payload.length)
        throw new AppError({
          message: "there is no processed user,please check your user data",
          statusCode: 400,
        });

      const insertedData = await employeeService.createManyEmployee(payload, {
        session,
      });
      const salaryPayload: ISalary[] = [];
      for (const data of insertedData) {
        const body = unique.find(
          (el) => el.JMBG === data.JMBG
        ) as NewEmployeeProps;

        salaryPayload.push({
          amount: body.salaryAmount,
          date: body.startdate,
          description: "N/A",
          employeeId: data._id,
          historyRaises: [] as HistoryRaises[],
        } as ISalary);
      }
      await salaryService.createManySalary(salaryPayload, { session });

      await session.commitTransaction();
      response.createResponse({
        res,
        code: 201,
        message: "ok",
        data: insertedData,
      });
    } catch (err) {
      await session.abortTransaction();
      next(err);
    } finally {
      await session.endSession();
    }
  }

  public async inActiveAnEmployee(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { employeeId } = req.params;

      const employee = await employeeService.findById(
        new Types.ObjectId(employeeId)
      );
      if (!employee)
        throw new AppError({
          message: "employee not found",
          statusCode: 404,
        });

      if (employee.enddate)
        throw new AppError({
          message: "employee is already resign",
          statusCode: 409,
        });

      await employeeService.inActivatedAnEmployee(employee._id);

      response.createResponse({ res, code: 200, message: "success" });
    } catch (err) {
      next(err);
    }
  }

  public async activatedAnEmployee(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { employeeId } = req.params;

      const employee = await employeeService.findById(
        new Types.ObjectId(employeeId)
      );
      if (!employee)
        throw new AppError({
          message: "employee not found",
          statusCode: 404,
        });

      if (!employee.enddate)
        throw new AppError({
          message: "user still active",
          statusCode: 409,
        });

      await employeeService.activatedAnEmployee(employee._id);

      response.createResponse({ res, code: 200, message: "success" });
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
        page,
        limit,
        sortBy,
        direction,
        search,
      } = await employeeValidation.queryValidation(req.query);

      const { total, data } = await employeeService.findEmployees({
        page,
        limit,
        sortBy,
        direction,
        search,
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

  public async findByIdentifier(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { employeeId } = req.params;

      const data = await employeeService.findEmployeeDetail(
        new Types.ObjectId(employeeId)
      );
      if (!data)
        throw new AppError({
          message: "employee not found",
          statusCode: 404,
        });

      response.createResponse({ res, code: 200, message: "OK", data });
    } catch (err) {
      next(err);
    }
  }

  public async getListName(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { total, data } = await employeeService.getListEmployeeName();
      if (!total)
        throw new AppError({
          message: "data not found",
          statusCode: 404,
        });

      response.createResponse(
        { res, code: 200, message: "OK", data },
        {
          totalData: total,
          limit: Infinity,
          page: 1,
          totalPage: 1,
        }
      );
    } catch (err) {
      next(err);
    }
  }
})();
