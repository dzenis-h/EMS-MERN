import type { Document, Types, Model, ClientSession } from "mongoose";
import type { BaseDocument } from "../base/model";

export type Gender = "M" | "F";

export type LoanUnit = "BAM" | "$";

export type LoanStatus = "Process" | "Finish" | "NPL";

export type ApplicationModel<T extends BaseDocument> = Model<
  T,
  {},
  any,
  {},
  Document<unknown, {}, T> & T & { _id: Types.ObjectId },
  any
>;

export interface DbOpts {
  session?: ClientSession;
}

export interface PaginationProps {
  page: number;
  limit: number;
  sortBy: string;
  direction: string;
}

export type SearchQuery = PaginationProps & {
  search?: string;
};

export interface PaginationOptionalProps {
  page?: number;
  limit?: number;
  sortBy?: string;
  direction?: string;
  search?: string;
}

export type DataWithTotal<T = any> = {
  data: T;
  total: number;
};

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
