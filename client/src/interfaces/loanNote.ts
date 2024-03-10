import type { BaseDocument } from ".";

export interface ILoanNote extends BaseDocument {
  description: string;
  employeeId: string;
  loanId: string;
}
