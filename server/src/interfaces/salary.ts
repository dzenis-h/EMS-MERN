import { Types } from "mongoose";
import type { BaseDocument } from "../base/model";
import type { LoanUnit } from ".";

export interface ISalary extends BaseDocument {
  amount: number;
  date: Date;
  description: string;
  employeeId: Types.ObjectId;
  historyRaises: HistoryRaises[];
  paymentHistory: PaymentHistory[];
}

export interface HistoryRaises {
  amount: number;
  description: string;
  date: Date;
  unit: LoanUnit;
}

export interface PaymentHistory {
  amount: number;
  description: string;
  date: Date;
  unit: LoanUnit;
}

export interface UpdateSalaryProps {
  amount: number;
  description: string;
}

export interface GenerateSalaryProps {
  month: number;
  year: number;
}

export interface SalaryPaymentDetail {
  surname: string;
  penalties: number;
  net: number;
  month: number;
  year: number;
  gross: number;
  tax: number;
  bonuses: number;
  salary: number;
  _id: Types.ObjectId;
}
