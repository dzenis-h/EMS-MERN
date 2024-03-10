import {
  legacy_createStore as createStore,
  combineReducers,
  applyMiddleware,
  type Reducer,
} from "redux";
import { thunk } from "redux-thunk";
import employeeReducer, {
  type EmployeeState,
  type EmployeeAction,
} from "../reducer/employee";
import loanReducer, { type LoanAction, type LoanState } from "../reducer/loan";
import penaltyReducer, {
  type PenaltyAction,
  type PenaltyState,
} from "../reducer/penalty";
import type { EmployeeTypes } from "../constant/employee";
import type { LoanTypes } from "../constant/loan";
import type { PenaltyTypes } from "../constant/penalty";

export interface RootReducer {
  employeeReducer: EmployeeState;
  loanReducer: LoanState;
  penaltyReducer: PenaltyState;
}

const reducer: Reducer<
  RootReducer,
  EmployeeAction<EmployeeTypes> & LoanAction<LoanTypes> & PenaltyAction<PenaltyTypes>,
  any
> = combineReducers({ employeeReducer, loanReducer, penaltyReducer });

export default createStore(reducer, applyMiddleware(thunk));
