import { Types } from "mongoose";
import BaseService from "../base/services";
import { DbOpts } from "../interfaces";
import type { BonusFormProps, IBonus } from "../interfaces/bonus";
import bonus from "../models/bonus";

export default new (class BonusService extends BaseService<IBonus> {
  constructor() {
    super(bonus);
  }

  public async createOne(
    employeeId: Types.ObjectId,
    data: BonusFormProps,
    dbOpts?: DbOpts
  ) {
    return await this.createOneData(
      { ...data, employeeId, paymentHistory: [] },
      { ...dbOpts }
    );
  }

  public async findEmployeeBonus(
    _id: Types.ObjectId,
    employeeId: Types.ObjectId
  ) {
    return (await this.model.findOne({ _id, employeeId })) as IBonus | null;
  }
})();
