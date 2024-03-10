import type { Response } from "express";

export type ResponsePayload = {
  data?: any;
  message?: string;
  res: Response<any, Record<string, any>>;
  code: number;
};

export type ResponseDetail = {
  totalData: number;
  limit: number;
  page: number;
  totalPage: number;
  [key: string]: any;
};
