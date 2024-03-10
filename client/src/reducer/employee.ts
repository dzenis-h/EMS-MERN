import type { Reducer, Action } from "redux";
import type {
  EmployeeDetail,
  EmployeeName,
  GetListEmployee,
} from "../interfaces/employee";
import {
  type EmployeeTypes,
  GETLISTEMPLOYEE,
  SETACTIVESTATUS,
  SETINACTIVESTATUS,
  GETEMPLOYEENAME,
} from "../constant/employee";

export interface EmployeeState {
  employees: EmployeeDetail[];
  totalData: number;
  totalPage: number;
  employeeNames: EmployeeName[];
}

export type EmployeeAction<T = any> = {
  payload: T;
} & Action<EmployeeTypes>;

const initialState: EmployeeState = {
  employees: [],
  totalData: 0,
  totalPage: 0,
  employeeNames: [],
};

const reducer: Reducer<EmployeeState, EmployeeAction> = (
  state = initialState,
  { type, payload }
) => {
  switch (type) {
    case GETLISTEMPLOYEE: {
      const { employees, totalData, totalPage } = payload as GetListEmployee;
      return {
        ...state,
        employees,
        totalData,
        totalPage,
      };
    }
    case SETACTIVESTATUS: {
      return {
        ...state,
        employees: state.employees.map((el) =>
          el._id === payload ? { ...el, enddate: undefined } : el
        ),
      };
    }
    case SETINACTIVESTATUS: {
      return {
        ...state,
        employees: state.employees.map((el) =>
          el._id === payload
            ? { ...el, enddate: new Date().toDateString() }
            : el
        ),
      };
    }
    case GETEMPLOYEENAME: {
      return {
        ...state,
        employeeNames: payload,
      };
    }
    default:
      return state;
  }
};

export default reducer;
