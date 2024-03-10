import type { BaseDocument, LoanUnit } from ".";

export interface ILoanPayment extends BaseDocument {
  amount: number;
  date: string;
  description: string;
  employeeId: string;
  loanId: string;
  unit: LoanUnit;
}
