import { Schema } from "mongoose";
import BaseModel from "../base/model";
import type { IAdmin } from "../interfaces/admin";

export default new (class Admin extends BaseModel<IAdmin> {
  //i add a admin account to secure the application
  constructor() {
    super(
      "Admin",
      new Schema({
        name: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          required: true,
          unique: true,
        },
        password: {
          type: String,
          required: true,
        },
      })
    );
  }
})().model;
