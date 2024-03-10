import type { IAdmin } from "../interfaces/admin";

declare global {
  namespace Express {
    interface Request {
      guest: IAdmin;
    }
  }
}

export {};
