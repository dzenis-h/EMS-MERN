import NetworkError from "../base/error";
import { HTTPDELETE, HTTPPOST } from "../constant/request";
import type { DeleteItemFunc } from "../interfaces";
import type { BonusFormProps, IBonus } from "../interfaces/bonus";
import request from "../lib/axios";

export const CreateBonus = (
  id: string,
  payload: BonusFormProps
): Promise<IBonus> =>
  new Promise(async (resolve, reject) => {
    try {
      const {
        status,
        data: { data, message },
      } = await request.Mutation<IBonus>({
        url: `/bonus/${id}`,
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

export const deleteBonus: DeleteItemFunc = (employeeId, bonusId) =>
  new Promise(async (resolve, reject) => {
    try {
      const {
        status,
        data: { message },
      } = await request.Mutation({
        url: `/bonus/${employeeId}/${bonusId}`,
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
