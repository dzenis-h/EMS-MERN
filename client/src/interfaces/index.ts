import type { TabName } from "./context";

export type Gender = "M" | "F";

export type LoanUnit = "BAM" | "$";

export type LoanStatus = "Process" | "Finish" | "NPL";

export interface BaseDocument {
  createdAt: string;
  updatedAt: string;
  _id: string;
}

export interface ProfileTabItem {
  id: number;
  name: TabName;
  active: boolean;
  confirmed: boolean;
}

export interface DisplayContent {
  amount: number;
  date: string;
  description: string;
  unit: LoanUnit;
  _id: string;
}

export type CreateBulkResp<T = any, F = any> = {
  success: number;
  failed: number;
  failedData: F[];
  successData: T[];
};

export interface DisplaySalaryTab {
  amount: number;
  date: string;
  description: string;
  surname: string;
}

export interface BaseDataEntry {
  title?: string | number;
  color: string;
  value: number;
  key?: string | number;
}

export type DeleteItemFunc<T = any> = (
  employeeId: string,
  id: string
) => Promise<T>;
