import { ThunkAction } from "redux-thunk";
import NetworkError from "../base/error";
import { HTTPPATCH, HTTPPOST } from "../constant/request";
import type {
  EmployeeSalaryDetail,
  GenerateSalaryResp,
} from "../interfaces/employee";
import type { ISalary, UpdateSalaryProps } from "../interfaces/salary";
import request from "../lib/axios";
import type { RootReducer } from "../store";
import type { LoanAction, LoanState } from "../reducer/loan";
import { UPDATEAFTERSALARY } from "../constant/loan";

export const raiseSalary = (
  id: string,
  payload: UpdateSalaryProps
): Promise<ISalary> =>
  new Promise(async (resolve, reject) => {
    try {
      const {
        status,
        data: { data, message },
      } = await request.Mutation<ISalary>({
        url: `/salary/${id}`,
        method: HTTPPATCH,
        data: payload,
        headers: {
          access_token: localStorage.getItem("access_token"),
        },
      });

      if (status !== 200) throw new NetworkError({ message });

      resolve(data);
    } catch (err) {
      reject(err);
    }
  });

export const generateSalary = (date: Date): Promise<GenerateSalaryResp> =>
  new Promise(async (resolve, reject) => {
    try {
      const {
        status,
        data: { data, message },
      } = await request.Query<GenerateSalaryResp>({
        url: "/salary",
        headers: {
          access_token: localStorage.getItem("access_token"),
        },
        params: { date },
      });

      if (status !== 200) throw new NetworkError({ message });

      resolve(data);
    } catch (err) {
      reject(err);
    }
  });

export const releaseSalary = (
  datas: EmployeeSalaryDetail[],
  date: Date
): ThunkAction<
  Promise<string>,
  RootReducer,
  any,
  LoanAction<LoanState>
> => async (dispatch) =>
  new Promise(async (resolve, reject) => {
    try {
      const {
        status,
        data: { message },
      } = await request.Mutation({
        url: "/salary",
        method: HTTPPOST,
        headers: {
          access_token: localStorage.getItem("access_token"),
        },
        data: { datas, date },
      });

      if (status !== 200) throw new NetworkError({ message });

      dispatch<LoanAction>({
        type: UPDATEAFTERSALARY,
        payload: {
          loans: [],
          totalData: 0,
          totalPage: 0,
          summaryLoans: [],
          summaryLoanTotalData: 0,
          summaryLoanTotalPage: 0,
        },
      });

      resolve(message ?? "success");
    } catch (err) {
      reject(err);
    }
  });
