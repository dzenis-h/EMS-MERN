import { HTTPPOST } from "../constant/request";
import type {
  CreateBulkLoanResp,
  CreateLoanPaymentProps,
  CreateLoanProps,
  EmployeeLoan,
  GetListEmployeeLoan,
  GetListSummaryEmployeeLoan,
  ILoan,
  SummaryLoan,
} from "../interfaces/loan";
import type { ILoanPayment } from "../interfaces/loanPayment";
import request from "../lib/axios";
import type {
  DataWithPagination,
  PaginationProps,
} from "../interfaces/request";
import type { ThunkAction } from "redux-thunk";
import type { RootReducer } from "../store";
import type { LoanAction } from "../reducer/loan";
import {
  CREATEBULKEMPLOYEELOAN,
  GETALLEMPLOYEELOAN,
  GETEMPLOYEELOANSUMMARY,
} from "../constant/loan";
import NetworkError from "../base/error";

export const createLoan = (
  id: string,
  payload: CreateLoanProps
): Promise<ILoan> =>
  new Promise(async (resolve, reject) => {
    try {
      const {
        status,
        data: { data, message },
      } = await request.Mutation<ILoan>({
        data: payload,
        url: `/loan/${id}`,
        method: HTTPPOST,
        headers: {
          access_token: localStorage.getItem("access_token"),
        },
      });

      if (status !== 201) throw new NetworkError({ message });

      resolve(data);
    } catch (err) {
      reject(err);
    }
  });

export const createLoanExtraPayment = (
  id: string,
  payload: CreateLoanPaymentProps
): Promise<ILoanPayment> =>
  new Promise(async (resolve, reject) => {
    try {
      const {
        status,
        data: { data, message },
      } = await request.Mutation<ILoanPayment>({
        url: `/loan/payment/${id}`,
        method: HTTPPOST,
        data: payload,
        headers: {
          access_token: localStorage.getItem("access_token"),
        },
      });

      if (status !== 201) throw new NetworkError({ message });

      resolve(data);
    } catch (err) {
      reject(err);
    }
  });

export const getEmployeeLoan = ({
  page = 1,
  limit = 20,
  sortBy = "createdAt",
}: PaginationProps): ThunkAction<
  Promise<DataWithPagination<EmployeeLoan[]>>,
  RootReducer,
  any,
  LoanAction<GetListEmployeeLoan>
> => async (dispatch, getState) =>
  new Promise(async (resolve) => {
    try {
      const {
        data: { data, message, totalData, totalPage },
        status,
      } = await request.Query<EmployeeLoan[]>({
        url: "/loan",
        params: { page, limit, sortBy },
        headers: {
          access_token: localStorage.getItem("access_token"),
        },
      });

      if (status !== 200) throw new NetworkError({ message });
      const { loanReducer } = getState();

      dispatch<LoanAction<GetListEmployeeLoan>>({
        type: GETALLEMPLOYEELOAN,
        payload: {
          loans: [...loanReducer.loans, ...data],
          totalData,
          totalPage,
        },
      });

      resolve({ data, totalData, totalPage });
    } catch (err) {
      resolve({ data: [], totalData: 0, totalPage: 0 });
    }
  });

export const getEmployeeLoanSummary = ({
  page = 1,
  limit = 20,
  sortBy = "createdAt",
}: PaginationProps): ThunkAction<
  Promise<DataWithPagination<SummaryLoan[]>>,
  RootReducer,
  any,
  LoanAction<GetListSummaryEmployeeLoan>
> => async (dispatch, getState) =>
  new Promise(async (resolve) => {
    try {
      const {
        data: { data, message, totalData, totalPage },
        status,
      } = await request.Query<SummaryLoan[]>({
        url: "/loan/summary",
        params: { page, limit, sortBy },
        headers: {
          access_token: localStorage.getItem("access_token"),
        },
      });

      if (status !== 200) throw new NetworkError({ message });
      const { loanReducer } = getState();

      dispatch<LoanAction<GetListSummaryEmployeeLoan>>({
        type: GETEMPLOYEELOANSUMMARY,
        payload: {
          summaries: [...loanReducer.summaryLoans, ...data],
          totalData,
          totalPage,
        },
      });

      resolve({ data, totalData, totalPage });
    } catch (err) {
      resolve({ data: [], totalData: 0, totalPage: 0 });
    }
  });

export const bulkCreateEmployeeLoan = (
  datas: (CreateLoanProps & { employeeId: string })[]
): ThunkAction<
  Promise<CreateBulkLoanResp>,
  RootReducer,
  any,
  LoanAction<EmployeeLoan[]>
> => async (dispatch) =>
  new Promise(async (resolve, reject) => {
    try {
      const {
        status,
        data: { data, message },
      } = await request.Mutation<CreateBulkLoanResp>({
        url: "/loan/bulk",
        method: HTTPPOST,
        headers: {
          access_token: localStorage.getItem("access_token"),
        },
        data: { datas },
      });

      if (status !== 201 || data.success < 1)
        throw new NetworkError({ message });

      dispatch<LoanAction<EmployeeLoan[]>>({
        type: CREATEBULKEMPLOYEELOAN,
        payload: data.successData,
      });

      resolve(data);
    } catch (err) {
      reject(err);
    }
  });
