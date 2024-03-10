import type { BaseDocument, CreateBulkResp, LoanUnit } from ".";
import type { Employee } from "./employee";

export interface IPenalty extends BaseDocument {
  amount: number;
  date: string;
  unit: LoanUnit;
  description: string;
  employeeId: string;
  isPayed: boolean;
}

export interface CreatePenaltyProps {
  amount: number;
  unit: LoanUnit;
  description: string;
  // date: string;
}

export interface GetListPenalty {
  penalties: (IPenalty & { employee: Employee })[];
  totalData: number;
  totalPage: number;
}

export type CreateBulkPenaltyResp = CreateBulkResp<
  IPenalty,
  CreatePenaltyProps & { employeeId: string; reason: string }
>;
