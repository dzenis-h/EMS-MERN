import { isValidObjectId, Types } from "mongoose";
import BaseService from "../base/services";
import type {
  EmployeeDetail,
  EmployeeName,
  GeneratedSalaryData,
  IEmployee,
  NewEmployeeProps,
  SummaryData,
} from "../interfaces/employee";
import employee from "../models/employee";
import type {
  DataWithTotal,
  DbOpts,
  EmployeeStatistic,
  Gender,
  SearchQuery,
} from "../interfaces";
import helpers from "../helpers";
import type { ILoan } from "../interfaces/loan";
import type { ISalary } from "../interfaces/salary";
import type {
  EmployeeSalaryDetailPerMonth,
  SalaryPerEmployee,
} from "../interfaces/report";

export default new (class Employee extends BaseService<IEmployee> {
  constructor() {
    super(employee);
  }

  public async getByIdentifier(identifier: string) {
    const condition: any[] = [{ JMBG: identifier }];
    if (isValidObjectId(identifier))
      condition.push({ _id: new Types.ObjectId(identifier) });

    return (await this.model.findOne({ $or: condition })) as IEmployee | null;
  }

  public async createEmployee(
    payload: {
      name: string;
      surname: string;
      JMBG: string;
      birthdate: Date;
      gender: Gender;
      position: string;
      isPayoneer: boolean;
      startdate: Date;
    },
    DbOpts?: DbOpts
  ) {
    return await this.createOneData(payload, DbOpts);
  }

  public async createManyEmployee(data: NewEmployeeProps[], DbOpts?: DbOpts) {
    return await this.createMany(data, DbOpts);
  }

  public async findEmployeeDetail(_id: Types.ObjectId) {
    try {
      const agg = await this.model.aggregate([
        {
          $match: {
            _id,
          },
        },
        {
          $lookup: {
            from: "salaries",
            localField: "_id",
            foreignField: "employeeId",
            as: "salary",
          },
        },
        {
          $unwind: "$salary",
        },
        {
          $lookup: {
            from: "loans",
            localField: "_id",
            foreignField: "employeeId",
            as: "loans",
          },
        },
        {
          $lookup: {
            from: "loanpayments",
            localField: "_id",
            foreignField: "employeeId",
            as: "loanPayments",
          },
        },
        {
          $lookup: {
            from: "bonus",
            localField: "_id",
            foreignField: "employeeId",
            as: "bonuses",
          },
        },
        {
          $lookup: {
            from: "penalties",
            localField: "_id",
            foreignField: "employeeId",
            as: "penalties",
          },
        },
      ]);

      return Array.isArray(agg) ? (agg[0] as EmployeeDetail) : null;
    } catch (err) {
      return null;
    }
  }

  public async findEmployees({
    search,
    sortBy,
    direction,
    limit,
    page,
  }: SearchQuery): Promise<DataWithTotal<IEmployee[]>> {
    const query: any[] = [];

    if (search)
      query.push({
        $match: {
          $or: helpers.getUserSearch(search),
        },
      });

    query.push(
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
                from: "salaries",
                localField: "_id",
                foreignField: "employeeId",
                as: "salary",
              },
            },
            {
              $unwind: "$salary",
            },
            {
              $lookup: {
                from: "loans",
                localField: "_id",
                foreignField: "employeeId",
                as: "loans",
              },
            },
            {
              $sort: {
                [helpers.allowedSortedField(
                  ["createdAt", "updatedAt", "gender", "_id"],
                  sortBy,
                  "createdAt"
                )]: helpers.getSortDirection(direction),
              },
            },
          ],
          count: [{ $count: "total" }],
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
      }
    );
    try {
      const [result] = await this.model.aggregate<DataWithTotal<IEmployee[]>>(
        query
      );
      return result;
    } catch (err) {
      return {
        data: [],
        total: 0,
      };
    }
  }

  public async getListEmployeeName() {
    try {
      const [result] = await this.model.aggregate([
        {
          $facet: {
            data: [
              {
                $project: {
                  _id: 1,
                  surname: 1,
                },
              },
            ],
            total: [
              {
                $count: "total",
              },
            ],
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
      return result as { data: EmployeeName[]; total: number };
    } catch (err) {
      return {
        data: [],
        total: 0,
      };
    }
  }

  public async inActivatedAnEmployee(_id: Types.ObjectId, dbOpts?: DbOpts) {
    return await this.model.findByIdAndUpdate(
      _id,
      {
        $set: {
          enddate: new Date(),
        },
      },
      { ...dbOpts, new: true }
    );
  }

  public async activatedAnEmployee(_id: Types.ObjectId, dbOpts?: DbOpts) {
    return await this.model.findByIdAndUpdate(
      _id,
      {
        $set: {
          enddate: null,
        },
      },
      { ...dbOpts, new: true }
    );
  }

  public async findMultipleByJMBG(jmbg: string[]) {
    return await this.model.find({ JMBG: { $in: jmbg } });
  }

  public async findMultipleByIds(ids: Types.ObjectId[]) {
    return await this.model.find({ _id: { $in: ids } });
  }

  public async findMultipleByIdsAndPopulate(ids: Types.ObjectId[]) {
    return (await this.model.aggregate([
      {
        $match: {
          _id: { $in: ids },
        },
      },
      {
        $lookup: {
          from: "loans",
          localField: "_id",
          foreignField: "employeeId",
          as: "loans",
        },
      },
      {
        $lookup: {
          from: "salaries",
          localField: "_id",
          foreignField: "employeeId",
          as: "salary",
        },
      },
      {
        $unwind: "$salary",
      },
    ])) as (IEmployee & { loans: ILoan[]; salary: ISalary })[];
  }

  public async getEmployeeSalary(exchangeRate: number, date: Date) {
    const [result] = await this.model.aggregate<GeneratedSalaryData>([
      {
        $match: {
          startdate: {
            $lte: date,
          },
          $or: [
            {
              enddate: null,
            },
            {
              enddate: {
                $exists: false,
              },
            },
          ],
        },
      },
      {
        $facet: {
          data: [
            {
              $lookup: {
                from: "loans",
                let: {
                  userId: "$_id",
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          {
                            $eq: ["$employeeId", "$$userId"],
                          },
                          {
                            $eq: ["$status", "Process"],
                          },
                        ],
                      },
                    },
                  },
                ],
                as: "loan",
              },
            },
            {
              $unwind: {
                path: "$loan",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $lookup: {
                from: "loannotes",
                localField: "loan._id",
                foreignField: "loanId",
                as: "note",
              },
            },
            {
              $unwind: {
                path: "$note",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $lookup: {
                from: "salaries",
                localField: "_id",
                foreignField: "employeeId",
                as: "salary",
              },
            },
            {
              $unwind: "$salary",
            },
            {
              $lookup: {
                from: "penalties",
                let: {
                  userId: "$_id",
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          {
                            $eq: ["$isPayed", false],
                          },
                          {
                            $eq: ["$employeeId", "$$userId"],
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
                  userId: "$_id",
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
                  {
                    $match: {
                      $expr: {
                        $or: [
                          {
                            $eq: ["$isRepeating", true],
                          },
                          {
                            $eq: [
                              {
                                $size: "$paymentHistory",
                              },
                              0,
                            ],
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
              $group: {
                _id: "$_id",
                totalInstallment: {
                  $sum: {
                    $cond: [
                      {
                        $eq: ["$loan.unit", "BAM"],
                      },
                      {
                        $multiply: ["$loan.installment", exchangeRate],
                      },
                      "$loan.installment",
                    ],
                  },
                },
                loan: {
                  $first: "$loan",
                },
                loanNote: {
                  $first: "$note",
                },
                totalBonus: {
                  $sum: {
                    $cond: [
                      {
                        $eq: ["$bonuses.unit", "BAM"],
                      },
                      {
                        $multiply: ["$bonuses.amount", exchangeRate],
                      },
                      "$bonuses.amount",
                    ],
                  },
                },
                bonuses: {
                  $push: "$bonuses",
                },
                totalPenalties: {
                  $sum: {
                    $cond: [
                      {
                        $eq: ["$penalties.unit", "BAM"],
                      },
                      {
                        $multiply: ["$penalties.amount", exchangeRate],
                      },
                      "$penalties.amount",
                    ],
                  },
                },
                penalties: {
                  $push: "$penalties",
                },
                surname: {
                  $first: "$surname",
                },
                salary: {
                  $first: "$salary",
                },
              },
            },
            {
              $addFields: {
                bonuses: {
                  $cond: {
                    if: {
                      $gt: ["$totalBonus", 0],
                    },
                    then: {
                      $map: {
                        input: "$bonuses",
                        as: "bonus",
                        in: {
                          _id: "$$bonus._id",
                          amount: {
                            $cond: [
                              {
                                $eq: ["$$bonus.unit", "BAM"],
                              },
                              {
                                $multiply: ["$$bonus.amount", exchangeRate],
                              },
                              "$$bonus.amount",
                            ],
                          },
                          description: {
                            $cond: [
                              {
                                $or: [
                                  {
                                    $eq: ["$$bonus.description", ""],
                                  },
                                  {
                                    $eq: ["$$bonus.description", null],
                                  },
                                ],
                              },
                              "N/A",
                              "$$bonus.description",
                            ],
                          },
                          date: "$$bonus.date",
                        },
                      },
                    },
                    else: [],
                  },
                },
                penalties: {
                  $cond: {
                    if: {
                      $gt: ["$totalPenalties", 0],
                    },
                    then: {
                      $map: {
                        input: "$penalties",
                        as: "penalty",
                        in: {
                          _id: "$$penalty._id",
                          amount: {
                            $cond: [
                              {
                                $eq: ["$$penalty.unit", "BAM"],
                              },
                              {
                                $multiply: ["$$penalty.amount", exchangeRate],
                              },
                              "$$penalty.amount",
                            ],
                          },
                          description: {
                            $cond: [
                              {
                                $or: [
                                  {
                                    $eq: ["$$penalty.description", ""],
                                  },
                                  {
                                    $eq: ["$$penalty.description", null],
                                  },
                                ],
                              },
                              "N/A",
                              "$$penalty.description",
                            ],
                          },
                          date: "$$penalty.date",
                        },
                      },
                    },
                    else: [],
                  },
                },
                isLastInstallment: {
                  $cond: {
                    if: {
                      $gt: [
                        {
                          $type: "$loan",
                        },
                        "Missing",
                      ],
                    },
                    then: {
                      $cond: {
                        if: {
                          $eq: [
                            {
                              $subtract: ["$loan.period", 1],
                            },
                            {
                              $size: {
                                $ifNull: ["$loan.paymentHistory", []],
                              },
                            },
                          ],
                        },
                        then: true,
                        else: false,
                      },
                    },
                    else: false,
                  },
                },
                loanDetail: {
                  $cond: {
                    if: {
                      $gt: [
                        {
                          $type: "$loan",
                        },
                        "missing",
                      ],
                    },
                    then: {
                      _id: "$loan._id",
                      installment: "$totalInstallment",
                      note: {
                        $cond: {
                          if: {
                            $eq: ["$loanNote", null],
                          },
                          then: "N/A",
                          else: "$loanNote.description",
                        },
                      },
                      totalLoan: "$loan.amount",
                    },
                    else: null,
                  },
                },
                tax: {
                  $switch: {
                    branches: [
                      {
                        case: {
                          $lte: ["$salary.amount", 1000],
                        },
                        then: 0,
                      },
                      {
                        case: {
                          $lte: ["$salary.amount", 2000],
                        },
                        then: {
                          $multiply: ["$salary.amount", 0.1],
                        },
                      },
                      {
                        case: {
                          $lte: ["$salary.amount", 3000],
                        },
                        then: {
                          $multiply: ["$salary.amount", 0.2],
                        },
                      },
                    ],
                    default: {
                      $multiply: ["$salary.amount", 0.3],
                    },
                  },
                },
              },
            },
            {
              $addFields: {
                takeHomePay: {
                  $subtract: [
                    {
                      $add: ["$salary.amount", "$totalBonus"],
                    },
                    {
                      $add: ["$totalPenalties", "$totalInstallment", "$tax"],
                    },
                  ],
                },
              },
            },
            {
              $project: {
                loan: 0,
                loanNote: 0,
              },
            },
            {
              $addFields: {
                salary: "$salary.amount",
              },
            },
          ],
          thisMonthPayment: [
            {
              $lookup: {
                from: "salaries",
                localField: "_id",
                foreignField: "employeeId",
                as: "salary",
              },
            },
            {
              $unwind: "$salary",
            },
            {
              $unwind: "$salary.paymentHistory",
            },
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: [
                        { $year: "$salary.paymentHistory.date" },
                        { $year: date },
                      ],
                    },
                    {
                      $eq: [
                        { $month: "$salary.paymentHistory.date" },
                        { $month: date },
                      ],
                    },
                  ],
                },
              },
            },
            {
              $project: {
                _id: "$salary.paymentHistory._id",
                date: "$salary.paymentHistory.date",
                unit: "$salary.paymentHistory.unit",
                amount: "$salary.paymentHistory.amount",
                description: "$salary.paymentHistory.description",
              },
            },
          ],
        },
      },
    ]);
    return result;
  }

  public async getReportSummary() {
    return await this.model.aggregate<SummaryData>([
      {
        $lookup: {
          from: "salaries",
          localField: "_id",
          foreignField: "employeeId",
          as: "salary",
        },
      },
      {
        $unwind: "$salary",
      },
      {
        $unwind: {
          path: "$salary.paymentHistory",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          salaryPaymentMonth: {
            $month: "$salary.paymentHistory.date",
          },
          salaryPaymentYear: {
            $year: "$salary.paymentHistory.date",
          },
        },
      },
      {
        $match: {
          $expr: {
            $and: [
              {
                $ne: ["$salaryPaymentMonth", null],
              },
              {
                $ne: ["$salaryPaymentYear", null],
              },
            ],
          },
        },
      },
      {
        $lookup: {
          from: "penalties",
          let: {
            userId: "$_id",
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
            userId: "$_id",
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
            $sum: "$salary.amount",
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
                      $lte: ["$salary.amount", 1000],
                    },
                    then: 0,
                  },
                  {
                    case: {
                      $lte: ["$salary.amount", 2000],
                    },
                    then: {
                      $multiply: ["$salary.amount", 0.1],
                    },
                  },
                  {
                    case: {
                      $lte: ["$salary.amount", 3000],
                    },
                    then: {
                      $multiply: ["$salary.amount", 0.2],
                    },
                  },
                ],
                default: {
                  $multiply: ["$salary.amount", 0.3],
                },
              },
            },
          },
          totalEmployee: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          year: "$_id.year",
          gross: {
            $add: ["$totalSalary", "$totalBonus"],
          },
          tax: "$totalTax",
          salary: "$totalSalary",
          employees: "$totalEmployee",
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

  public async getEmployeeSalaryDetailPerMonth(
    firstDate: Date,
    lastDate: Date
  ) {
    return await this.model.aggregate<EmployeeSalaryDetailPerMonth>([
      {
        $match: {
          startdate: {
            $lte: new Date(),
          },
          $expr: {
            $or: [
              {
                enddate: null,
              },
              {
                $not: {
                  $gt: ["$enddate", null],
                },
              },
            ],
          },
        },
      },
      {
        $lookup: {
          from: "salaries",
          localField: "_id",
          foreignField: "employeeId",
          as: "salary",
        },
      },
      {
        $unwind: "$salary",
      },
      {
        $unwind: {
          path: "$salary.paymentHistory",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          "salary.paymentHistory.date": {
            $lt: lastDate,
            $gte: firstDate,
          },
        },
      },
      {
        $addFields: {
          salaryPaymentMonth: {
            $month: "$salary.paymentHistory.date",
          },
          salaryPaymentYear: {
            $year: "$salary.paymentHistory.date",
          },
        },
      },
      {
        $lookup: {
          from: "penalties",
          let: {
            userId: "$_id",
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
            userId: "$_id",
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
          _id: "$_id",
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
            $sum: "$salary.amount",
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
                      $lte: ["$salary.amount", 1000],
                    },
                    then: 0,
                  },
                  {
                    case: {
                      $lte: ["$salary.amount", 2000],
                    },
                    then: {
                      $multiply: ["$salary.amount", 0.1],
                    },
                  },
                  {
                    case: {
                      $lte: ["$salary.amount", 3000],
                    },
                    then: {
                      $multiply: ["$salary.amount", 0.2],
                    },
                  },
                ],
                default: {
                  $multiply: ["$salary.amount", 0.3],
                },
              },
            },
          },
          surname: {
            $first: "$surname",
          },
        },
      },
      {
        $project: {
          _id: 1,
          month: "$_id.month",
          year: "$_id.year",
          gross: {
            $add: ["$totalSalary", "$totalBonus"],
          },
          tax: "$totalTax",
          salary: "$totalSalary",
          employees: "$totalEmployee",
          penalties: "$totalPenalties",
          bonuses: "$totalBonus",
          surname: 1,
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
    ]);
  }

  public async getStatistic(fromDate: Date, endDate: Date) {
    const [result] = await this.model.aggregate<EmployeeStatistic>([
      {
        $lookup: {
          from: "salaries",
          localField: "_id",
          foreignField: "employeeId",
          as: "salary",
        },
      },
      {
        $unwind: "$salary",
      },
      {
        $facet: {
          genderPrecentage: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $lte: ["$startdate", endDate],
                    },
                    {
                      $or: [
                        {
                          enddate: null,
                        },
                        {
                          $gt: ["$enddate", endDate],
                        },
                      ],
                    },
                  ],
                },
              },
            },
            {
              $group: {
                _id: "$gender",
                total: {
                  $sum: 1,
                },
              },
            },
          ],
          rolePrecentage: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $lte: ["$startdate", endDate],
                    },
                    {
                      $or: [
                        {
                          enddate: null,
                        },
                        {
                          $gt: ["$enddate", endDate],
                        },
                      ],
                    },
                  ],
                },
              },
            },
            {
              $group: {
                _id: "$position",
                total: {
                  $sum: 1,
                },
              },
            },
          ],
          activeEmployeePrecentage: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $lte: ["$startdate", endDate],
                    },
                  ],
                },
              },
            },
            {
              $group: {
                _id: {
                  $cond: [
                    {
                      $and: [
                        {
                          $lte: ["$startdate", endDate],
                        },
                        {
                          $or: [
                            {
                              enddate: null,
                            },
                            {
                              $gt: ["$enddate", endDate],
                            },
                          ],
                        },
                      ],
                    },
                    "Active",
                    "Inactive",
                  ],
                },
                total: {
                  $sum: 1,
                },
              },
            },
          ],
          agePrecentage: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $lte: ["$startdate", endDate],
                    },
                    {
                      $or: [
                        {
                          enddate: null,
                        },
                        {
                          $gt: ["$enddate", endDate],
                        },
                      ],
                    },
                  ],
                },
              },
            },
            {
              $group: {
                _id: {
                  $year: "$birthdate",
                },
                total: {
                  $sum: 1,
                },
              },
            },
          ],
          salaryPercentage: [
            {
              $unwind: {
                path: "$salary.paymentHistory",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $gte: ["$salary.paymentHistory.date", fromDate],
                    },
                    {
                      $lte: ["$salary.paymentHistory.date", endDate],
                    },
                  ],
                },
              },
            },
            {
              $group: {
                _id: {
                  $switch: {
                    branches: [
                      {
                        case: {
                          $lte: ["$salary.amount", 1000],
                        },
                        then: 1,
                      },
                      {
                        case: {
                          $lte: ["$salary.amount", 2000],
                        },
                        then: 2,
                      },
                      {
                        case: {
                          $lte: ["$salary.amount", 3000],
                        },
                        then: 3,
                      },
                      {
                        case: {
                          $lte: ["$salary.amount", 4000],
                        },
                        then: 4,
                      },
                      {
                        case: {
                          $lte: ["$salary.amount", 5000],
                        },
                        then: 5,
                      },
                    ],
                    default: 6,
                  },
                },
                total: {
                  $sum: 1,
                },
              },
            },
          ],
        },
      },
    ]);
    return result;
  }

  public async getSalaryPaymentPerEmployee(
    _id: Types.ObjectId,
    fromDate: Date,
    endDate: Date
  ) {
    return await this.model.aggregate<SalaryPerEmployee>([
      {
        $match: {
          _id,
        },
      },
      {
        $lookup: {
          from: "salaries",
          localField: "_id",
          foreignField: "employeeId",
          as: "salary",
        },
      },
      {
        $unwind: "$salary",
      },
      {
        $unwind: {
          path: "$salary.paymentHistory",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          "salary.paymentHistory.date": {
            $lt: endDate,
            $gte: fromDate,
          },
        },
      },
      {
        $addFields: {
          salaryPaymentMonth: {
            $month: "$salary.paymentHistory.date",
          },
          salaryPaymentYear: {
            $year: "$salary.paymentHistory.date",
          },
        },
      },
      {
        $lookup: {
          from: "penalties",
          let: {
            userId: "$_id",
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
            userId: "$_id",
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
            paymentId: "$salary.paymentHistory._id",
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
            $sum: "$salary.amount",
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
                      $lte: ["$salary.amount", 1000],
                    },
                    then: 0,
                  },
                  {
                    case: {
                      $lte: ["$salary.amount", 2000],
                    },
                    then: {
                      $multiply: ["$salary.amount", 0.1],
                    },
                  },
                  {
                    case: {
                      $lte: ["$salary.amount", 3000],
                    },
                    then: {
                      $multiply: ["$salary.amount", 0.2],
                    },
                  },
                ],
                default: {
                  $multiply: ["$salary.amount", 0.3],
                },
              },
            },
          },
          surname: {
            $first: "$surname",
          },
        },
      },
      {
        $project: {
          _id: "$_id.paymentId",
          month: "$_id.month",
          year: "$_id.year",
          gross: {
            $add: ["$totalSalary", "$totalBonus"],
          },
          tax: "$totalTax",
          penalties: "$totalPenalties",
          bonuses: "$totalBonus",
          surname: 1,
          salary: "$totalSalary",
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
    ]);
  }
})();
