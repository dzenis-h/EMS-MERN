import { Types } from "mongoose";
import BaseService from "../base/services";
import type { ILoanNote } from "../interfaces/loanNote";
import loanNote from "../models/loanNote";
import type { DbOpts } from "../interfaces";

export default new (class LoanNoteService extends BaseService<ILoanNote> {
  constructor() {
    super(loanNote);
  }

  public async createNote(
    {
      description,
      employeeId,
      loanId,
    }: {
      description: string;
      employeeId: Types.ObjectId;
      loanId: Types.ObjectId;
    },
    DbOpts?: DbOpts
  ) {
    return await this.createOneData(
      {
        description,
        employeeId,
        loanId,
      },
      DbOpts
    );
  }

  public async createManyNotes(
    datas: {
      description: string;
      employeeId: Types.ObjectId;
      loanId: Types.ObjectId;
    }[],
    DbOpts?: DbOpts
  ) {
    return await this.createMany(
      datas.map(({ description, employeeId, loanId }) => ({
        description,
        employeeId,
        loanId,
      })),
      DbOpts
    );
  }
})();
