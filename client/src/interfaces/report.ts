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
  _id: string;
}

export interface EmployeeStatistic {
  genderPrecentage: Statistic<string>[];
  rolePrecentage: Statistic<string>[];
  activeEmployeePrecentage: Statistic<string>[];
  agePrecentage: Statistic<number>[];
  salaryPercentage: Statistic<number>[];
}

export type Statistic<T = any> = {
  total: number;
  _id: T;
};

export interface EmployeeSalaryDetailPerMonth {
  net: number;
  surname: string;
  gross: number;
  tax: number;
  salary: number;
  penalties: number;
  bonuses: number;
  _id: string;
}
