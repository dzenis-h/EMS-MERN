import type { BaseDocument, Gender, LoanUnit } from ".";
import type { IBonus } from "./bonus";
import type { ILoan } from "./loan";
import type { ILoanPayment } from "./loanPayment";
import type { IPenalty } from "./penalty";
import type { ISalary } from "./salary";

export interface Employee extends BaseDocument {
  _id: string;
  name: string;
  surname: string;
  JMBG: string;
  birthdate: string;
  gender: Gender;
  position: string;
  isPayoneer: boolean;
  startdate: string;
  enddate?: string;
}

export type EmployeeDetail = Employee & {
  salary: ISalary;
  loans: ILoan[];
  loanPayments: ILoanPayment[];
  bonuses: IBonus[];
  penalties: IPenalty[];
};

export interface GetListEmployee {
  employees: EmployeeDetail[];
  totalData: number;
  totalPage: number;
}

export interface AddEmployeeState {
  name: string;
  surname: string;
  JMBG: string;
  birthdate: string;
  gender: string;
  position: string;
  startdate: string;
  isPayoneer: boolean;
  salaryAmount: number;
}

export interface EmployeeName {
  _id: string;
  surname: string;
}

export interface EmployeeSalaryDetail {
  _id: string;
  takeHomePay: number;
  totalInstallment: number;
  totalBonus: number;
  totalPenalties: number;
  surname: string;
  salary: number;
  tax: number;
  penalties: EmployeeSalaryUnitDetail[];
  bonuses: EmployeeSalaryUnitDetail[];
  isLastInstallment: boolean;
  loanDetail: LoanUnitDetail | null;
}

export interface EmployeeSalaryUnitDetail {
  _id: string;
  amount: number;
  description: string;
  date: string;
}

export interface LoanUnitDetail {
  _id: string;
  note: string;
  installment: number;
  totalLoan: number;
}

export interface GenerateSalaryResp {
  data: EmployeeSalaryDetail[];
  unit: LoanUnit;
  isRepeated: boolean;
}
