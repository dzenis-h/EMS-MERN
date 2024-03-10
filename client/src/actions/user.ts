import NetworkError from "../base/error";
import { HTTPDELETE, HTTPPOST } from "../constant/request";
import type { LoginPayload } from "../interfaces/request";
import request from "../lib/axios";

export const loginHandler = ({
  email,
  password,
}: LoginPayload): Promise<string> =>
  new Promise(async (resolve, reject) => {
    try {
      const {
        data: { message, data },
        status,
      } = await request.Mutation<string>({
        url: "/admin/login",
        method: HTTPPOST,
        data: {
          email,
          password,
        },
      });

      if (status !== 200) throw new NetworkError({ message });

      resolve(data);
    } catch (err) {
      reject(err);
    }
  });

export const googleLogin = (googleToken: string): Promise<string> =>
  new Promise(async (resolve, reject) => {
    try {
      const {
        data: { message, data },
        status,
      } = await request.Mutation<string>({
        url: "/admin/google-login",
        method: HTTPPOST,
        data: {
          googleToken,
        },
      });

      if (status !== 200) throw new NetworkError({ message });

      resolve(data);
    } catch (err) {
      reject(err);
    }
  });

export const microsoftLogin = (microsoftToken: string): Promise<string> =>
  new Promise(async (resolve, reject) => {
    try {
      const {
        status,
        data: { data, message },
      } = await request.Mutation<string>({
        url: "/admin/microsoft-login",
        data: { microsoftToken },
        method: HTTPPOST,
      });

      if (status !== 200) throw new NetworkError({ message });

      resolve(data);
    } catch (err) {
      reject(err);
    }
  });

export const logout = (): Promise<void> =>
  new Promise(async (resolve) => {
    try {
      await request.Mutation({
        url: "/admin/logout",
        method: HTTPDELETE,
        headers: {
          access_token: localStorage.getItem("access_token"),
        },
      });

      resolve();
    } catch (err) {
      resolve();
    }
  });
