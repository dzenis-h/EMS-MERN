import { Types, isValidObjectId } from "mongoose";

export default new (class Helper {
  public countInstallment = (amount: number, period: number, fee = 0) =>
    amount / period + fee;

  public getSortDirection(direction: string) {
    switch (direction.toLowerCase()) {
      case "desc":
      case "descending":
        return -1;
      case "asc":
      case "ascending":
      default:
        return 1;
    }
  }

  public getUserSearch(search: string, prefix?: string) {
    const regex = new RegExp(search);
    const obj = {
      $regex: regex,
      $options: "i",
    };
    return !prefix
      ? [
          {
            position: obj,
          },
          {
            name: obj,
          },
          {
            surname: obj,
          },
          {
            JMBG: obj,
          },
        ]
      : [
          {
            [`${prefix}.position`]: obj,
          },
          {
            [`${prefix}.name`]: obj,
          },
          {
            [`${prefix}.surname`]: obj,
          },
          {
            [`${prefix}.JMBG`]: obj,
          },
        ];
  }

  public allowedSortedField(
    allowed: string[],
    field: string,
    defaultValue: string
  ) {
    return allowed.includes(field) ? field : defaultValue;
  }

  public readableDate(date: Date | string) {
    const d = new Date(date);

    return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
  }

  public mapEmployeeId(datas: { employeeId: string }[]) {
    const employeeIds: Types.ObjectId[] = [];
    for (const data of datas) {
      if (!isValidObjectId(data.employeeId)) continue;

      employeeIds.push(new Types.ObjectId(data.employeeId));
    }
    return employeeIds;
  }

  public parseToFloat(str: string) {
    return Number(parseFloat(str).toFixed(2));
  }

  public getFirstAndLastDate(month: number, year: number) {
    const firstDate = new Date(year, month - 1, 1);
    const lastDate = new Date(firstDate);
    lastDate.setMonth(lastDate.getMonth() + 1);
    lastDate.setDate(lastDate.getDate() - 1);

    return [firstDate, lastDate];
  }
})();
