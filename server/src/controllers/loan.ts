import type { Request, Response, NextFunction } from "express";
import loanValidation from "../validations/loan";
import response from "../middlewares/response";
import AppError from "../base/error";
import { Types, startSession } from "mongoose";
import employeeService from "../services/employee";
import salaryService from "../services/salary";
import loanService from "../services/loan";
import loanNoteService from "../services/loanNote";
import loanPaymentService from "../services/loanPayment";
import type { CreateLoanProps } from "../interfaces/loan";
import helpers from "../helpers";

export default new (class LoanController {
  public async createLoan(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const session = await startSession();
    session.startTransaction();
    try {
      const {
        amount,
        unit,
        date,
        description,
        period,
        note,
      } = await loanValidation.validateCreateLoan(req.body);
      const { employeeId } = req.params;

      const employee = await employeeService.getByIdentifier(employeeId);
      if (!employee)
        throw new AppError({
          message: "employee not found",
          statusCode: 404,
        });

      const now = new Date();
      if (employee.enddate && employee.enddate < now)
        throw new AppError({
          message: "employee is already resign",
          statusCode: 400,
        });

      const startWork = employee.startdate;
      startWork.setDate(startWork.getMonth() + 2 + (startWork.getDate() + 28));
      if (startWork < now)
        throw new AppError({
          message:
            "employee hasnt start working or employee hasnt been working for at least one month",
          statusCode: 400,
        });

      if (await loanService.findEmployeeProcessedLoan(employee._id))
        throw new AppError({
          message: "employee has an active loan",
          statusCode: 409,
        });

      const salary = await salaryService.findEmployeeSalary(employee._id);
      if (!salary)
        throw new AppError({
          message: "salary not found",
          statusCode: 404,
        });

      //you can change the schema implementation
      if (salary.amount < helpers.countInstallment(amount, period))
        throw new AppError({
          message: "loan amount cannot greater than salary amount",
          statusCode: 400,
        });

      const data = await loanService.createLoan(
        employee._id,
        {
          amount,
          unit,
          date,
          description,
          period,
        },
        { session }
      );

      if (note)
        await loanNoteService.createNote(
          {
            description: note,
            employeeId: employee._id,
            loanId: data._id,
          },
          { session }
        );

      await session.commitTransaction();
      response.createResponse({
        res,
        code: 201,
        message: "success",
        data,
      });
    } catch (err) {
      await session.abortTransaction();
      next(err);
    } finally {
      await session.endSession();
    }
  }

  public async createBulkLoan(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const session = await startSession();
    session.startTransaction();
    try {
      const { datas } = await loanValidation.validateBulkCreateLoan(req.body);

      const employees = await employeeService.findMultipleByIdsAndPopulate(
        helpers.mapEmployeeId(datas)
      );
      if (!employees.length)
        throw new AppError({
          message: "employees not found",
          statusCode: 404,
        });

      const payload: (CreateLoanProps & { employeeId: Types.ObjectId })[] = [];
      const failed: (CreateLoanProps & {
        employeeId: string;
        reason: string;
      })[] = [];
      const now = new Date();
      for (const employee of employees) {
        const data = datas.find(
          (el) => el.employeeId === employee._id.toString()
        ) as CreateLoanProps & { employeeId: string };

        if (employee.loans.find((el) => el.status === "Process")) {
          failed.push({ ...data, reason: "employee has an active loan" });
          continue;
        }

        if (employee.enddate && employee.enddate < now) {
          failed.push({
            ...data,
            reason: "employee is already resign",
          });
          continue;
        }

        if (employee.startdate > now) {
          failed.push({
            ...data,
            reason: "employee hasnt start working",
          });
          continue;
        }

        if (
          employee.salary.amount <
          helpers.countInstallment(data.amount, data.period)
        ) {
          failed.push({
            ...data,
            reason: "loan installment cannot greater than salary amount",
          });
          continue;
        }

        payload.push({
          ...data,
          employeeId: new Types.ObjectId(data.employeeId),
          note: undefined,
        });
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

      const result = await loanService.createManyLoans(payload, { session });
      const notes = await loanNoteService.createManyNotes(
        result
          .map((el) => {
            const data = datas.find(
              (data) => data.employeeId === el.employeeId.toString()
            ) as CreateLoanProps & { employeeId: string };

            return data?.note
              ? {
                  employeeId: el.employeeId,
                  loanId: el._id,
                  description: data.note,
                }
              : null;
          })
          .filter((el) => el !== null) as any,
        { session }
      );

      await session.commitTransaction();
      response.createResponse({
        res,
        code: 201,
        message: "success",
        data: {
          success: result.length,
          failed: failed.length,
          failedData: failed,
          successData: result.map((el) => ({
            amount: el.amount,
            installment: el.installment,
            date: el.date,
            description: el.description,
            unit: el.unit,
            employeeId: el.employeeId,
            status: el.status,
            period: el.period,
            paymentHistory: el.paymentHistory,
            note:
              notes.find(
                (note) =>
                  note.loanId.toString() === el._id.toString() &&
                  note.employeeId.toString() === el.employeeId.toString()
              ) || null,
            employee: employees.find(
              (employee) => employee._id.toString() === el.employeeId.toString()
            ),
          })),
        },
      });
    } catch (err) {
      await session.abortTransaction();
      next(err);
    } finally {
      await session.endSession();
    }
  }

  public async createLoanExtraPayment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { employeeId } = req.params;
      const employeeObjectId = new Types.ObjectId(employeeId);

      const payload = await loanValidation.validateCreateLoanPayment(req.body);

      const employee = await employeeService.findById(employeeObjectId);
      if (!employee)
        throw new AppError({
          message: "employee not found",
          statusCode: 404,
        });

      const loan = await loanService.findEmployeeProcessedLoan(
        employeeObjectId
      );
      if (!loan)
        throw new AppError({
          message: "employee has no on going loan",
          statusCode: 404,
        });

      if (loan.installment < payload.amount)
        throw new AppError({
          message: "amount cannot greater than loan installment",
          statusCode: 404,
        });

      response.createResponse({
        res,
        code: 201,
        message: "success",
        data: await loanPaymentService.createData(
          employeeObjectId,
          loan._id,
          payload
        ),
      });
    } catch (err) {
      next(err);
    }
  }

  public async getAllProcessLoan(
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
      } = await loanValidation.queryValidation(req.query);

      const { total, data } = await loanService.getProcessLoan({
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

  public async getSummaryLoan(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { total, data } = await loanService.getSummaryLoan();
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
