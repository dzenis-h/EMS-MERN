import * as yup from "yup";
import BaseValidation from "../base/validation";
import type {
  CreateLoanPaymentProps,
  CreateLoanProps,
} from "../interfaces/loan";

export default new (class LoanValidation extends BaseValidation {
  private readonly createLoanSchema = {
    amount: this.requiredAmount,
    date: this.optionalDate,
    description: this.optionalDesc,
    unit: this.requiredUnit,
    period: yup
      .number()
      .required("period is required")
      .min(1, "minimum period is 1")
      .max(12, "maximum period is 12"),
    note: yup.string().optional(),
  };

  public validateCreateLoan = async (data: any) =>
    await this.validate<CreateLoanProps>(
      yup.object().shape(this.createLoanSchema),
      data
    );

  public validateBulkCreateLoan = async (data: any) =>
    await this.validate<{
      datas: (CreateLoanProps & { employeeId: string })[];
    }>(
      yup.object().shape({
        datas: yup
          .array()
          .of(
            yup.object().shape({
              ...this.createLoanSchema,
              employeeId: this.requiredEmployeeId,
            })
          )
          .required("datas is required")
          .min(1, "minimum datas is 1"),
      }),
      data
    );

  public validateCreateLoanPayment = async (data: any) =>
    await this.validate<CreateLoanPaymentProps>(
      yup.object().shape({
        amount: this.requiredAmount,
        description: this.optionalDesc,
        date: this.optionalDate,
        unit: this.requiredUnit,
      }),
      data
    );
})();
