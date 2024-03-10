import { HTTPDELETE, HTTPPOST } from "../constant/request";
import { Employee } from "../interfaces/employee";
import type {
  CreateBulkPenaltyResp,
  CreatePenaltyProps,
  GetListPenalty,
  IPenalty,
} from "../interfaces/penalty";
import type {
  DataWithPagination,
  PaginationProps,
} from "../interfaces/request";
import request from "../lib/axios";
import type { ThunkAction } from "redux-thunk";
import type { RootReducer } from "../store";
import type { PenaltyAction } from "../reducer/penalty";
import { GETPENALTYLIST } from "../constant/penalty";
import NetworkError from "../base/error";
import type { DeleteItemFunc } from "../interfaces";

export const createPenalty = (
  id: string,
  payload: CreatePenaltyProps
): Promise<IPenalty> =>
  new Promise(async (resolve, reject) => {
    try {
      const {
        data: { data, message },
        status,
      } = await request.Mutation<IPenalty>({
        url: `/penalty/${id}`,
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

export const getAllPenalty = ({
  page = 1,
  limit = 20,
  sortBy = "createdAt",
}: PaginationProps): ThunkAction<
  Promise<DataWithPagination<(IPenalty & { employee: Employee })[]>>,
  RootReducer,
  any,
  PenaltyAction<GetListPenalty>
> => async (dispatch, getState) =>
  new Promise(async (resolve) => {
    try {
      const {
        status,
        data: { message, data, totalData, totalPage },
      } = await request.Query<(IPenalty & { employee: Employee })[]>({
        url: "/penalty",
        params: { page, limit, sortBy },
        headers: {
          access_token: localStorage.getItem("access_token"),
        },
      });

      if (status !== 200) throw new NetworkError({ message });
      const { penaltyReducer } = getState();

      dispatch<PenaltyAction<GetListPenalty>>({
        type: GETPENALTYLIST,
        payload: {
          totalData,
          totalPage,
          penalties: [...data, ...penaltyReducer.penalties],
        },
      });
    } catch (err) {
      resolve({ data: [], totalData: 0, totalPage: 0 });
    }
  });

export const createBulkPenalty = (
  datas: (CreatePenaltyProps & { employeeId: string })[]
) =>
  new Promise(async (resolve, reject) => {
    try {
      const {
        data: { data, message },
        status,
      } = await request.Mutation<CreateBulkPenaltyResp>({
        url: "/penalty/bulk",
        headers: {
          access_token: localStorage.getItem("access_token"),
        },
        method: HTTPPOST,
        data: { datas },
      });

      if (status !== 201) throw new NetworkError({ message });

      resolve(data);
    } catch (err) {
      reject(err);
    }
  });

export const deletePenalty: DeleteItemFunc = (employeeId, penaltyId) =>
  new Promise(async (resolve, reject) => {
    try {
      const {
        status,
        data: { message },
      } = await request.Mutation({
        url: `/penalty/${employeeId}/${penaltyId}`,
        headers: {
          access_token: localStorage.getItem("access_token"),
        },
        method: HTTPDELETE,
      });

      if (status !== 200) throw new NetworkError({ message });

      resolve(message);
    } catch (err) {
      reject(err);
    }
  });
