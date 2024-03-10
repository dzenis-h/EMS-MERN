import { Schema } from "mongoose";
import BaseModel from "../base/model";
import type { ISalary } from "../interfaces/salary";

export default new (class Salary extends BaseModel<ISalary> {
  constructor() {
    super(
      "Salary",
      new Schema({
        amount: {
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
        employeeId: {
          type: Schema.ObjectId,
          required: true,
          ref: "Employee",
        },
        historyRaises: [
          {
            amount: {
              type: Number,
              required: true,
            },
            description: {
              type: String,
              default: "N/A",
            },
            date: {
              type: Date,
              required: true,
            },
            unit: {
              type: String,
              required: true,
              enum: ["BAM", "$"],
              default: "BAM",
            },
          },
        ],
        paymentHistory: [
          {
            amount: {
              type: Number,
              required: true,
            },
            description: {
              type: String,
              default: "N/A",
            },
            date: {
              type: Date,
              required: true,
            },
            unit: {
              type: String,
              required: true,
              enum: ["BAM", "$"],
              default: "BAM",
            },
          },
        ],
      })
    );
  }
})().model;
