import { Types } from "mongoose";
import type { Gender } from ".";
import type { BaseDocument } from "../base/model";
import { IBonus } from "./bonus";
import type { ILoan } from "./loan";
import type { ILoanPayment } from "./loanPayment";
import type { IPenalty } from "./penalty";
import type { ISalary, PaymentHistory } from "./salary";

export type IEmployee = BaseDocument & Employee;

export interface Employee {
  name: string;
  surname: string;
  JMBG: string;
  birthdate: Date;
  gender: Gender;
  position: string;
  isPayoneer: boolean;
  startdate: Date;
  enddate?: Date;
  getByIdentifier: (identifier: string) => Promise<Employee | null>;
}

export interface NewEmployeeProps {
  salaryAmount: number;
  name: string;
  surname: string;
  JMBG: string;
  birthdate: Date;
  gender: Gender;
  position: string;
  isPayoneer: boolean;
  startdate: Date;
}

export type EmployeeDetail = IEmployee & {
  salary: ISalary;
  loans: ILoan[];
  loanPayments: ILoanPayment[];
  bonuses: IBonus[];
  penalties: IPenalty[];
};

export interface EmployeeName {
  _id: Types.ObjectId;
  surname: string;
}

export interface EmployeeSalaryDetail {
  _id: Types.ObjectId;
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

export interface GeneratedSalaryData {
  data: EmployeeSalaryDetail[];
  thisMonthPayment: PaymentHistory[];
}

export interface EmployeeSalaryUnitDetail {
  _id: Types.ObjectId;
  amount: number;
  description: string;
  date: Date;
}

export interface LoanUnitDetail {
  _id: Types.ObjectId;
  installment: number;
  note: string;
  totalLoan: number;
}

export interface SummaryData {
  salary: number;
  employees: number;
  penalties: number;
  net: number;
  month: number;
  year: number;
  gross: number;
  tax: number;
  bonuses: number;
}
