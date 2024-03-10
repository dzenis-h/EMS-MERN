import type { BaseDocument } from "../base/model";

export interface IAdmin extends BaseDocument {
  name: string;
  email: string;
  password: string;
}

export interface LoginAdminProps {
  email: string;
  password: string;
}
