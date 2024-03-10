import { Types } from "mongoose";
import { BaseDocument } from "../base/model";

export interface ILoanNote extends BaseDocument {
  description: string;
  employeeId: Types.ObjectId;
  loanId: Types.ObjectId;
}
