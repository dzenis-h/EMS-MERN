import { Schema } from "mongoose";
import BaseModel from "../base/model";
import type { ILoan } from "../interfaces/loan";

export default new (class Loan extends BaseModel<ILoan> {
  constructor() {
    super(
      "Loan",
      new Schema({
        amount: {
          type: Number,
          required: true,
        },
        installment: {
          type: Number,
          required: true,
        },
        date: {
          type: Date,
          required: true,
        },
        description: {
          type: String,
          default: "N/A",
        },
        unit: {
          type: String,
          required: true,
          enum: ["BAM", "$"],
          default: "BAM",
        },
        employeeId: {
          type: Schema.ObjectId,
          required: true,
          ref: "Employee",
        },
        status: {
          type: String,
          enum: ["Process", "Finish", "NPL"],
          default: "Process",
        },
        period: {
          type: Number,
          required: true,
          min: [1, "Minimum period is 1"],
          max: [12, "Maximum period is 12"],
        },
        paymentHistory: [
          {
            unit: {
              type: String,
              required: true,
              enum: ["BAM", "$"],
              default: "BAM",
            },
            date: {
              type: Date,
              required: true,
            },
            description: {
              type: String,
              default: "N/A",
            },
            amount: {
              type: Number,
              required: true,
            },
          },
        ],
      })
    );
  }
})().model;
