import type { Types } from "mongoose";

export interface EmployeeSalaryDetailPerMonth {
  net: number;
  surname: string;
  gross: number;
  tax: number;
  salary: number;
  penalties: number;
  bonuses: number;
  month: number;
  year: number;
}

export type SalaryPerEmployee = EmployeeSalaryDetailPerMonth & {
  _id: Types.ObjectId;
};
