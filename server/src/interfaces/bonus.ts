import { Types } from "mongoose";
import type { BaseDocument } from "../base/model";
import type { LoanUnit } from ".";

export interface IBonus extends BaseDocument {
  amount: number;
  date: Date;
  description: string;
  isRepeating: boolean;
  employeeId: Types.ObjectId;
  unit: LoanUnit;
  paymentHistory: PaymentHistory[];
}

export interface BonusFormProps {
  date: string;
  amount: number;
  description: string;
  isRepeating: boolean;
  unit: LoanUnit;
}

export interface PaymentHistory {
  date: Date;
  amount: number;
  description: string;
}
