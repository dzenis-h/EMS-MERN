import NetworkError from "../base/error";
import type {
  EmployeeSalaryDetailPerMonth,
  EmployeeStatistic,
  SummaryData,
} from "../interfaces/report";
import request from "../lib/axios";

export const getSummaryData = (): Promise<SummaryData[]> =>
  new Promise(async (resolve) => {
    try {
      const {
        status,
        data: { data, message },
      } = await request.Query<SummaryData[]>({
        url: "/report/summary",
        headers: {
          access_token: localStorage.getItem("access_token"),
        },
      });

      if (status !== 200) throw new NetworkError({ message });

      resolve(data);
    } catch (err) {
      resolve([]);
    }
  });

export const getSummaryDetail = (
  month: number,
  year: number
): Promise<EmployeeSalaryDetailPerMonth[]> =>
  new Promise(async (resolve) => {
    try {
      const {
        status,
        data: { data, message },
      } = await request.Query<EmployeeSalaryDetailPerMonth[]>({
        url: "/report/summary/detail",
        headers: {
          access_token: localStorage.getItem("access_token"),
        },
        params: { year, month },
      });

      if (status !== 200) throw new NetworkError({ message });

      resolve(data);
    } catch (err) {
      resolve([]);
    }
  });

export const getStatistic = (
  month: number,
  year: number
): Promise<EmployeeStatistic | null> =>
  new Promise(async (resolve) => {
    try {
      const {
        status,
        data: { data, message },
      } = await request.Query<EmployeeStatistic>({
        url: "/report/statistic",
        headers: {
          access_token: localStorage.getItem("access_token"),
        },
        params: { month, year },
      });

      if (status !== 200) throw new NetworkError({ message });

      resolve(data);
    } catch (err) {
      resolve(null);
    }
  });

export const getSummaryDetailPerEmployee = (
  id: string,
  month: number,
  year: number
): Promise<EmployeeSalaryDetailPerMonth[]> =>
  new Promise(async (resolve, reject) => {
    try {
      const {
        status,
        data: { data, message },
      } = await request.Query<EmployeeSalaryDetailPerMonth[]>({
        url: `/report/summary/detail/${id}`,
        headers: {
          access_token: localStorage.getItem("access_token"),
        },
        params: { year, month },
      });

      if (status !== 200) throw new NetworkError({ message });

      resolve(data);
    } catch (err) {
      reject(err);
    }
  });
