import type { Reducer, Action } from "redux";
import type { GetListPenalty, IPenalty } from "../interfaces/penalty";
import type { Employee } from "../interfaces/employee";
import { GETPENALTYLIST, type PenaltyTypes } from "../constant/penalty";

export interface PenaltyState {
  penalties: (IPenalty & { employee: Employee })[];
  totalData: number;
  totalPage: number;
}

export type PenaltyAction<T = any> = {
  payload: T;
} & Action<PenaltyTypes>;

const initialState: PenaltyState = {
  penalties: [],
  totalData: 0,
  totalPage: 0,
};

const reducer: Reducer<PenaltyState, PenaltyAction> = (
  state = initialState,
  { type, payload }
) => {
  switch (type) {
    case GETPENALTYLIST: {
      const { penalties, totalData, totalPage } = payload as GetListPenalty;
      return {
        ...state,
        penalties,
        totalData,
        totalPage,
      };
    }
    default:
      return state;
  }
};

export default reducer;
