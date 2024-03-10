import type { Types } from "mongoose";
import BaseService from "../base/services";
import type { DbOpts } from "../interfaces";
import type {
  HistoryRaises,
  ISalary,
  PaymentHistory,
  SalaryPaymentDetail,
} from "../interfaces/salary";
import salary from "../models/salary";

export default new (class SalaryService extends BaseService<ISalary> {
  constructor() {
    super(salary);
  }

  public async updateData(
    employeeId: Types.ObjectId,
    data: { amount: number; description: string; previousSalary: number },
    opts?: DbOpts
  ) {
    const now = new Date();
    return await this.model.findOneAndUpdate(
      { employeeId },
      {
        $set: {
          ...data,
          date: now,
        },
        $push: {
          historyRaises: {
            amount: data.previousSalary,
            date: now,
          },
        },
      },
      { ...opts, new: true }
    );
  }

  public async findEmployeeSalary(employeeId: Types.ObjectId) {
    return (await this.model.findOne({ employeeId })) as ISalary | null;
  }

  public async createSalary(
    {
      date,
      amount,
      employeeId,
    }: {
      date: Date;
      amount: number;
      employeeId: Types.ObjectId;
    },
    DbOpts?: DbOpts
  ) {
    return await this.createOneData(
      {
        amount,
        date,
        description: "N/A",
        employeeId,
        historyRaises: [] as HistoryRaises[],
        paymentHistory: [] as PaymentHistory[],
      },
      DbOpts
    );
  }

  public async createManySalary(data: ISalary[], dbOpts?: DbOpts) {
    return await this.createMany(data, dbOpts);
  }

  public async getDetailSalaryPayment() {
    return await this.model.aggregate<SalaryPaymentDetail>([
      {
        $match: {
          $expr: {
            $gt: [
              {
                $size: "$paymentHistory",
              },
              0,
            ],
          },
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
        $unwind: {
          path: "$paymentHistory",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          salaryPaymentMonth: {
            $month: "$paymentHistory.date",
          },
          salaryPaymentYear: {
            $year: "$paymentHistory.date",
          },
        },
      },
      {
        $lookup: {
          from: "penalties",
          let: {
            userId: "$employeeId",
            dateMonth: "$salaryPaymentMonth",
            dateYear: "$salaryPaymentYear",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$isPayed", true],
                    },
                    {
                      $eq: ["$employeeId", "$$userId"],
                    },
                    {
                      $and: [
                        {
                          $eq: [
                            {
                              $month: "$date",
                            },
                            "$$dateMonth",
                          ],
                        },
                        {
                          $eq: [
                            {
                              $year: "$date",
                            },
                            "$$dateYear",
                          ],
                        },
                      ],
                    },
                  ],
                },
              },
            },
          ],
          as: "penalties",
        },
      },
      {
        $unwind: {
          path: "$penalties",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "bonus",
          let: {
            userId: "$employeeId",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$employeeId", "$$userId"],
                    },
                  ],
                },
              },
            },
          ],
          as: "bonuses",
        },
      },
      {
        $unwind: {
          path: "$bonuses",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$bonuses.paymentHistory",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: {
            month: "$salaryPaymentMonth",
            year: "$salaryPaymentYear",
            employeeId: "$employeeId",
            employeeName: "$employee.surname",
          },
          totalBonus: {
            $sum: {
              $cond: [
                {
                  $and: [
                    {
                      $eq: [
                        "$salaryPaymentMonth",
                        {
                          $month: "$bonuses.paymentHistory.date",
                        },
                      ],
                    },
                    {
                      $eq: [
                        "$salaryPaymentYear",
                        {
                          $year: "$bonuses.paymentHistory.date",
                        },
                      ],
                    },
                  ],
                },
                "$bonuses.paymentHistory.amount",
                0,
              ],
            },
          },
          totalSalary: {
            $sum: "$amount",
          },
          totalPenalties: {
            $sum: "$penalties.amount",
          },
          totalTax: {
            $sum: {
              $switch: {
                branches: [
                  {
                    case: {
                      $lte: ["$amount", 1000],
                    },
                    then: 0,
                  },
                  {
                    case: {
                      $lte: ["$amount", 2000],
                    },
                    then: {
                      $multiply: ["$amount", 0.1],
                    },
                  },
                  {
                    case: {
                      $lte: ["$amount", 3000],
                    },
                    then: {
                      $multiply: ["$amount", 0.2],
                    },
                  },
                ],
                default: {
                  $multiply: ["$amount", 0.3],
                },
              },
            },
          },
        },
      },
      {
        $project: {
          _id: "$_id.employeeId",
          month: "$_id.month",
          year: "$_id.year",
          gross: {
            $add: ["$totalSalary", "$totalBonus"],
          },
          tax: "$totalTax",
          salary: "$totalSalary",
          surname: "$_id.employeeName",
          penalties: "$totalPenalties",
          bonuses: "$totalBonus",
        },
      },
      {
        $addFields: {
          net: {
            $subtract: [
              "$gross",
              {
                $add: ["$tax", "$penalties"],
              },
            ],
          },
        },
      },
      {
        $sort: {
          month: -1,
          year: -1,
        },
      },
    ]);
  }
})();
