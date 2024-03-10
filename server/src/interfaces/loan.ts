import { Types } from "mongoose";
import type { LoanStatus, LoanUnit } from ".";
import type { BaseDocument } from "../base/model";
import type { ILoanNote } from "./loanNote";

export interface ILoan extends BaseDocument {
  amount: number;
  installment: number;
  date: Date;
  description: string;
  unit: LoanUnit;
  employeeId: Types.ObjectId;
  status: LoanStatus;
  period: number;
  paymentHistory: PaymentHistory[];
  note?: ILoanNote;
}

export interface CreateLoanProps {
  amount: number;
  date: Date;
  description: string;
  unit: LoanUnit;
  period: number;
  note?: string;
}

export interface CreateLoanPaymentProps {
  amount: number;
  date: Date;
  description: string;
  unit: LoanUnit;
}

export interface PaymentHistory {
  amount: number;
  date: Date;
  description: string;
  unit: LoanUnit;
}

export interface SummaryLoan {
  _id: Types.ObjectId;
  surname: string;
  totalAmount: number;
  totalLoan: number;
  remainingDebt: number;
  remainingInstallment: number;
}
