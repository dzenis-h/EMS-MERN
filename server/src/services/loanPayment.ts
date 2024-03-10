import { Types } from "mongoose";
import BaseService from "../base/services";
import type { ILoanPayment } from "../interfaces/loanPayment";
import loanPayment from "../models/loanPayment";
import type { CreateLoanPaymentProps } from "../interfaces/loan";
import type { DbOpts } from "../interfaces";

export default new (class LoanPaymentService extends BaseService<ILoanPayment> {
  constructor() {
    super(loanPayment);
  }

  public async createData(
    employeeId: Types.ObjectId,
    loanId: Types.ObjectId,
    data: CreateLoanPaymentProps,
    dbOpts?: DbOpts
  ) {
    return await this.createOneData(
      { employeeId, loanId, ...data },
      { ...dbOpts }
    );
  }

  public async createManyData(
    datas: (CreateLoanPaymentProps & {
      loanId: Types.ObjectId;
      employeeId: Types.ObjectId;
    })[],
    dbOpts?: DbOpts
  ) {
    return await this.createMany(datas, { ...dbOpts });
  }
})();
