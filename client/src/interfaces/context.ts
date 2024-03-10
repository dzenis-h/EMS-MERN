import type { ProfileTabItem } from ".";
import type { IBonus } from "./bonus";
import type { EmployeeSalaryDetail } from "./employee";
import type { ILoan } from "./loan";
import type { ILoanPayment } from "./loanPayment";
import type { IPenalty } from "./penalty";
import type { ISalary } from "./salary";

export interface TabEmployeeContext {
  bonuses: IBonus[];
  loans: ILoan[];
  loanPayments: ILoanPayment[];
  salary: ISalary;
  penalties: IPenalty[];
  activeTab: ProfileTabItem;
}

export type TabName =
  | "Salary Raises"
  | "Bonuses"
  | "Penalties"
  | "Loans"
  | "Loan Extra Payments";

export interface TabSalaryContext {
  activeTab: ProfileTabItem;
  datas: EmployeeSalaryDetail[];
  step: SalaryStep;
  generatedDate: Date;
  isRepeated: boolean;
}

export type SalaryStep = "Generate" | "Preview" | "Release";
