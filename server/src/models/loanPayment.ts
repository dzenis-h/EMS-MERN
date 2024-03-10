import { Schema } from "mongoose";
import BaseModel from "../base/model";
import type { ILoanPayment } from "../interfaces/loanPayment";

export default new (class LoanPayment extends BaseModel<ILoanPayment> {
  constructor() {
    super(
      "LoanPayment",
      new Schema({
        amount: {
          type: Number,
          required: true,
        },
        date: {
          // i assume we can do early payment
          type: Date,
          required: true,
        },
        description: {
          type: String,
          default: "N/A",
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
        unit: {
          type: String,
          required: true,
          enum: ["BAM", "$"],
          default: "BAM",
        },
      })
    );
  }
})().model;
