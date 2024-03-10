import { Types } from "mongoose";
import type { BaseDocument } from "../base/model";
import type { LoanUnit } from ".";

export interface ILoanPayment extends BaseDocument {
  amount: number;
  date: Date;
  description: string;
  employeeId: Types.ObjectId;
  loanId: Types.ObjectId;
  unit: LoanUnit;
}
