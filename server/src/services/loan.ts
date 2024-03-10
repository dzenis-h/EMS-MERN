import { Types } from "mongoose";
import BaseService from "../base/services";
import type { ILoan, SummaryLoan } from "../interfaces/loan";
import loan from "../models/loan";
import type {
  DataWithTotal,
  DbOpts,
  LoanUnit,
  SearchQuery,
} from "../interfaces";
import helpers from "../helpers";
import type { IEmployee } from "../interfaces/employee";

export default new (class LoanService extends BaseService<ILoan> {
  constructor() {
    super(loan);
  }

  public async findEmployeeProcessedLoan(employeeId: Types.ObjectId) {
    return await this.model.findOne({ employeeId, status: "Process" });
  }

  public async createLoan(
    employeeId: Types.ObjectId,
    {
      amount,
      unit,
      date,
      description,
      period,
    }: {
      amount: number;
      unit: LoanUnit;
      date: Date;
      description: string;
      period: number;
    },
    DbOpts?: DbOpts
  ) {
    return await this.createOneData(
      {
        amount,
        installment: helpers.countInstallment(amount, period),
        date,
        unit,
        description,
        employeeId,
        period,
        paymentHistory: [],
      },
      DbOpts
    );
  }

  public async createManyLoans(
    datas: {
      amount: number;
      unit: LoanUnit;
      date: Date;
      description: string;
      period: number;
      employeeId: Types.ObjectId;
    }[],
    DbOpts?: DbOpts
  ) {
    return await this.createMany(
      datas.map(({ amount, unit, date, description, period, employeeId }) => ({
        amount,
        installment: helpers.countInstallment(amount, period),
        date,
        unit,
        description,
        employeeId,
        period,
        paymentHistory: [],
      })),
      DbOpts
    );
  }

  public async getProcessLoan({
    search,
    sortBy,
    direction,
    limit,
    page,
  }: SearchQuery): Promise<DataWithTotal<(ILoan & { employee: IEmployee })[]>> {
    try {
      const query: any[] = [
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
          $lookup: {
            from: "loannotes",
            localField: "_id",
            foreignField: "loanId",
            as: "note",
          },
        },
        {
          $unwind: {
            preserveNullAndEmptyArrays: true,
            path: "$note",
          },
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
      ];

      if (search)
        query.push({
          $match: {
            $or: helpers.getUserSearch(search, "employee"),
          },
        });

      const [result] = await this.model.aggregate([
        {
          $match: {
            status: "Process",
          },
        },
        {
          $facet: {
            data: query,
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

  public async getSummaryLoan() {
    try {
      const [result] = await this.model.aggregate([
        {
          $facet: {
            data: [
              {
                $match: {
                  status: "Process",
                },
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
                $group: {
                  _id: "$employeeId",
                  surname: {
                    $first: "$employee.name",
                  },
                  totalAmount: {
                    $sum: "$amount",
                  },
                  remainingDebt: {
                    $sum: {
                      $subtract: [
                        {
                          $multiply: ["$installment", "$period"],
                        },
                        {
                          $multiply: [
                            "$installment",
                            {
                              $size: "$paymentHistory",
                            },
                          ],
                        },
                      ],
                    },
                  },
                  remainingInstallment: {
                    $first: "$installment",
                  },
                  status: {
                    $first: "$status",
                  },
                  totalPayed: {
                    $sum: {
                      $multiply: [
                        "$installment",
                        {
                          $size: "$paymentHistory",
                        },
                      ],
                    },
                  },
                },
              },
              {
                $project: {
                  _id: 1,
                  surname: 1,
                  totalAmount: 1,
                  totalPayed: 1,
                  remainingInstallment: 1,
                  remainingDebt: 1,
                },
              },
            ],
            total: [{ $count: "total" }],
          },
        },
        { $unwind: "$total" },
        {
          $project: {
            data: 1,
            total: "$total.total",
          },
        },
      ]);
      return result as { data: SummaryLoan[]; total: number };
    } catch (err) {
      return {
        data: [],
        total: 0,
      };
    }
  }
})();
