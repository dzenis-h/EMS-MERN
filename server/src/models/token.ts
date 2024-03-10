import { Schema } from "mongoose";
import BaseModel from "../base/model";
import type { IToken } from "../interfaces/token";

export default new (class Token extends BaseModel<IToken> {
  constructor() {
    super(
      "Token",
      new Schema({
        token: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          required: true,
          enum: ["credentials", "google", "microsoft"],
        },
      })
    );
  }
})().model;
