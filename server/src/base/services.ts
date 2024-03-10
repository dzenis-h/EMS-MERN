import type { Types, MongooseBulkWritePerWriteOptions } from "mongoose";
import type { AnyBulkWriteOperation } from "mongodb";
import type { ApplicationModel, DbOpts } from "../interfaces";
import type { BaseDocument } from "./model";

export default abstract class BaseService<T extends BaseDocument> {
  protected model: ApplicationModel<T>;
  constructor(props: ApplicationModel<T>) {
    this.model = props;
  }

  protected async createOneData(data: any, opts?: DbOpts) {
    const result = await this.model.create([data], { ...opts });

    return Array.isArray(result) ? result[0] : result;
  }

  protected async createMany(data: any[], opts?: DbOpts) {
    return await this.model.insertMany(data, { ...opts });
  }

  public async findById(id: Types.ObjectId) {
    return (await this.model.findById(id)) as T | null;
  }

  public async deleteById(id: Types.ObjectId) {
    return await this.model.findByIdAndDelete(id);
  }

  public async bulkUpdate(
    payload: (AnyBulkWriteOperation<T> & MongooseBulkWritePerWriteOptions)[],
    dbOpts?: DbOpts
  ) {
    return await this.model.bulkWrite(
      payload as (AnyBulkWriteOperation & MongooseBulkWritePerWriteOptions)[],
      { ...dbOpts }
    );
  }
}
