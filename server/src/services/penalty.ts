import type { Types } from "mongoose";
import BaseService from "../base/services";
import type { DataWithTotal, DbOpts, SearchQuery } from "../interfaces";
import type { CreatePenaltyProps, IPenalty } from "../interfaces/penalty";
import penalty from "../models/penalty";
import helpers from "../helpers";
import type { IEmployee } from "../interfaces/employee";

export default new (class PenaltyService extends BaseService<IPenalty> {
  constructor() {
    super(penalty);
  }

  public async createPenalty(
    employeeId: Types.ObjectId,
    data: CreatePenaltyProps,
    dbOpts?: DbOpts
  ) {
    return await this.createOneData(
      {
        ...data,
        employeeId,
      },
      dbOpts
    );
  }

  public async createBulkPenalty(
    datas: (CreatePenaltyProps & { employeeId: string })[],
    dbOpts?: DbOpts
  ) {
    return await this.createMany(datas, dbOpts);
  }

  public async findEmployeePenalty(
    _id: Types.ObjectId,
    employeeId: Types.ObjectId
  ) {
    return (await this.model.findOne({ _id, employeeId })) as IPenalty | null;
  }

  public async getPenaltyList({
    sortBy,
    direction,
    limit,
    page,
  }: SearchQuery): Promise<
    DataWithTotal<(IPenalty & { employee: IEmployee })[]>
  > {
    try {
      const [result] = await this.model.aggregate([
        {
          $facet: {
            data: [
              {
                $skip: (page - 1) * limit,
              },
              {
                $limit: limit,
              },
              {
                $lookup: {
                  from: "employees",
                  localField: "employeeId",
                  foreignField: "_id",
                  as: "employee",
                },
              },
              {
                $unwind: "$employee",
              },
              {
                $sort: {
                  [helpers.allowedSortedField(
                    ["createdAt", "updatedAt", "_id"],
                    sortBy,
                    "createdAt"
                  )]: helpers.getSortDirection(direction),
                },
              },
            ],
            count: [
              {
                $count: "total",
              },
            ],
          },
        },
        {
          $unwind: "$count",
        },
        {
          $project: {
            data: 1,
            total: "$count.total",
          },
        },
      ]);

      return result;
    } catch (err) {
      return {
        data: [],
        total: 0,
      };
    }
  }
})();
