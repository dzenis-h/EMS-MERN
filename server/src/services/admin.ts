import BaseService from "../base/services";
import type { IAdmin } from "../interfaces/admin";
import admin from "../models/admin";

export default new (class AdminService extends BaseService<IAdmin> {
  constructor() {
    super(admin);
  }

  public async findOneByEmail(email: string) {
    return (await this.model.findOne({ email })) as IAdmin | null;
  }
})();
