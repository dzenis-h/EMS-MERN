import { Schema } from "mongoose";
import BaseModel from "../base/model";
import type { IBonus } from "../interfaces/bonus";

export default new (class Bonus extends BaseModel<IBonus> {
  constructor() {
    super(
      "Bonus",
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
        isRepeating: {
          type: Boolean,
          default: false,
        },
        employeeId: {
          type: Schema.ObjectId,
          required: true,
          ref: "Employee",
        },
        unit: {
          type: String,
          required: true,
          enum: ["BAM", "$"],
          default: "BAM",
        },
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
          },
        ],
      })
    );
  }
})().model;
