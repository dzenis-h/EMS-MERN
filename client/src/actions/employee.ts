import type {
  AddEmployeeState,
  Employee,
  EmployeeDetail,
  EmployeeName,
  GetListEmployee,
} from "../interfaces/employee";
import type {
  DataWithPagination,
  PaginationProps,
} from "../interfaces/request";
import request from "../lib/axios";
import type { ThunkAction } from "redux-thunk";
import type { EmployeeAction } from "../reducer/employee";
import {
  GETEMPLOYEENAME,
  GETLISTEMPLOYEE,
  SETACTIVESTATUS,
  SETINACTIVESTATUS,
} from "../constant/employee";
import type { RootReducer } from "../store";
import { HTTPDELETE, HTTPPATCH, HTTPPOST } from "../constant/request";
import NetworkError from "../base/error";
import type {
  HistoryRaises,
  ISalary,
  PaymentHistory,
} from "../interfaces/salary";

export const getListEmployee =
  ({
    page = 1,
    limit = 20,
    sortBy = "createdAt",
  }: PaginationProps): ThunkAction<
    Promise<DataWithPagination<Employee[]>>,
    RootReducer,
    any,
    EmployeeAction<GetListEmployee>
  > =>
  async (dispatch, getState) =>
    new Promise(async (resolve) => {
      try {
        const {
          status,
          data: { message, data, totalData, totalPage },
        } = await request.Query<EmployeeDetail[]>({
          url: "/employee",
          params: { page, limit, sortBy },
          headers: {
            access_token: localStorage.getItem("access_token"),
          },
        });

        if (status !== 200) throw new NetworkError({ message });
        const { employeeReducer } = getState();

        dispatch<EmployeeAction<GetListEmployee>>({
          type: GETLISTEMPLOYEE,
          payload: {
            employees: [...employeeReducer.employees, ...data],
            totalData,
            totalPage,
          },
        });

        resolve({ data, totalData, totalPage });
      } catch (err) {
        resolve({ data: [], totalData: 0, totalPage: 0 });
      }
    });

export const addEmployee =
  (
    data: AddEmployeeState
  ): ThunkAction<
    Promise<Employee>,
    RootReducer,
    any,
    EmployeeAction<GetListEmployee>
  > =>
  async (dispatch, getState) =>
    new Promise(async (resolve, reject) => {
      try {
        const {
          data: { message, data: result },
          status,
        } = await request.Mutation<Employee>({
          url: "/employee/register",
          data,
          headers: {
            access_token: localStorage.getItem("access_token"),
          },
          method: HTTPPOST,
        });

        if (status !== 201) throw new NetworkError({ message });

        const {
          employeeReducer: { employees, totalData, totalPage },
        } = getState();

        dispatch<EmployeeAction<GetListEmployee>>({
          type: GETLISTEMPLOYEE,
          payload: {
            employees: [
              ...employees,
              {
                ...result,
                salary: {
                  amount: data.salaryAmount,
                  date: new Date().toString(),
                  description: "N/A",
                  employeeId: result._id,
                  paymentHistory: [] as PaymentHistory[],
                  historyRaises: [] as HistoryRaises[],
                } as ISalary,
                loans: [],
                bonuses: [],
                loanPayments: [],
                penalties: [],
              } as EmployeeDetail,
            ],
            totalData: totalData + 1,
            totalPage: totalPage + 1,
          },
        });

        resolve(result);
      } catch (err) {
        reject(err);
      }
    });

export const inactiveEmployee =
  (
    id: string
  ): ThunkAction<Promise<string>, RootReducer, any, EmployeeAction<string>> =>
  (dispatch) =>
    new Promise(async (resolve, reject) => {
      try {
        const {
          data: { message },
          status,
        } = await request.Mutation<null>({
          url: `/employee/${id}`,
          method: HTTPDELETE,
          headers: {
            access_token: localStorage.getItem("access_token"),
          },
        });

        if (status !== 200) throw new NetworkError({ message });

        dispatch<EmployeeAction<string>>({
          type: SETINACTIVESTATUS,
          payload: id,
        });

        resolve(message as string);
      } catch (err) {
        reject(err);
      }
    });

export const activatedAnEmployee =
  (
    id: string
  ): ThunkAction<Promise<string>, RootReducer, any, EmployeeAction<string>> =>
  (dispatch) =>
    new Promise(async (resolve, reject) => {
      try {
        const {
          data: { message },
          status,
        } = await request.Mutation<null>({
          url: `/employee/${id}`,
          method: HTTPPATCH,
          headers: {
            access_token: localStorage.getItem("access_token"),
          },
        });

        if (status !== 200) throw new NetworkError({ message });

        dispatch<EmployeeAction<string>>({
          type: SETACTIVESTATUS,
          payload: id,
        });

        resolve(message as string);
      } catch (err) {
        reject(err);
      }
    });

export const findEmployeeById = (id: string): Promise<EmployeeDetail> =>
  new Promise(async (resolve, reject) => {
    try {
      const {
        data: { data, message },
        status,
      } = await request.Query<EmployeeDetail>({
        url: `/employee/${id}`,
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

export const getEmployeeName =
  (): ThunkAction<
    Promise<EmployeeName[]>,
    RootReducer,
    any,
    EmployeeAction<EmployeeName[]>
  > =>
  async (dispatch) =>
    new Promise(async (resolve) => {
      try {
        const {
          status,
          data: { data, message },
        } = await request.Query<EmployeeName[]>({
          url: "/employee/name",
          headers: {
            access_token: localStorage.getItem("access_token"),
          },
        });

        if (status !== 200) throw new NetworkError({ message });
        dispatch<EmployeeAction<EmployeeName[]>>({
          type: GETEMPLOYEENAME,
          payload: data,
        });

        resolve(data);
      } catch (err) {
        resolve([]);
      }
    });
