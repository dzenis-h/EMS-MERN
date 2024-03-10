import type { Reducer, Action } from "redux";
import type {
  EmployeeLoan,
  GetListEmployeeLoan,
  GetListSummaryEmployeeLoan,
  SummaryLoan,
} from "../interfaces/loan";
import {
  CREATEBULKEMPLOYEELOAN,
  GETALLEMPLOYEELOAN,
  GETEMPLOYEELOANSUMMARY,
  UPDATEAFTERSALARY,
} from "../constant/loan";

export interface LoanState {
  loans: EmployeeLoan[];
  totalData: number;
  totalPage: number;
  summaryLoans: SummaryLoan[];
  summaryLoanTotalData: number;
  summaryLoanTotalPage: number;
}

export type LoanAction<T = any> = Action & {
  payload: T;
};

const initialState: LoanState = {
  loans: [],
  totalData: 0,
  totalPage: 0,
  summaryLoans: [],
  summaryLoanTotalData: 0,
  summaryLoanTotalPage: 0,
};

const reducer: Reducer<LoanState, LoanAction> = (
  state = initialState,
  { type, payload }
) => {
  switch (type) {
    case GETALLEMPLOYEELOAN: {
      const { loans, totalData, totalPage } = payload as GetListEmployeeLoan;
      return {
        ...state,
        loans,
        totalData,
        totalPage,
      };
    }
    case GETEMPLOYEELOANSUMMARY: {
      const {
        totalData,
        totalPage,
        summaries,
      } = payload as GetListSummaryEmployeeLoan;
      return {
        ...state,
        summaryLoans: summaries,
        summaryLoanTotalData: totalData,
        summaryLoanTotalPage: totalPage,
      };
    }
    case CREATEBULKEMPLOYEELOAN: {
      return {
        ...state,
        summaryLoans: [],
        summaryLoanTotalData: 0,
        summaryLoanTotalPage: 0,
        loans: [...(payload as EmployeeLoan[]), ...state.loans],
        totalData: state.totalData + payload.length,
        totalPage: Math.ceil(state.totalData / 20),
      };
    }
    case UPDATEAFTERSALARY: {
      return payload;
    }
    default:
      return state;
  }
};

export default reducer;
