import { Schema } from "mongoose";
import BaseModel from "../base/model";
import type { ILoanNote } from "../interfaces/loanNote";

export default new (class LoanNote extends BaseModel<ILoanNote> {
  constructor() {
    super(
      "LoanNote",
      new Schema({
        description: {
          type: String,
          required: true,
        },
        employeeId: {
          type: Schema.ObjectId,
          required: true,
          ref: "Employee",
        },
        loanId: {
          type: Schema.ObjectId,
          required: true,
          ref: "Loan",
        },
      })
    );
  }
})().model;
