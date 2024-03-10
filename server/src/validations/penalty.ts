import * as yup from "yup";
import BaseValidation from "../base/validation";
import type { CreatePenaltyProps } from "../interfaces/penalty";

export default new (class PenaltyValidation extends BaseValidation {
  private readonly createPenaltySchema = {
    amount: this.requiredAmount,
    unit: this.requiredUnit,
    description: this.optionalDesc,
    date: this.optionalDate,
  };

  public validateCreatePenalty = async (data: any) =>
    await this.validate<CreatePenaltyProps>(
      yup.object().shape(this.createPenaltySchema),
      data
    );

  public validateCreateBulkPenalty = async (data: any) =>
    await this.validate<{
      datas: (CreatePenaltyProps & { employeeId: string })[];
    }>(
      yup.object().shape({
        datas: yup
          .array()
          .of(
            yup.object().shape({
              ...this.createPenaltySchema,
              employeeId: this.requiredEmployeeId,
            })
          )
          .required("datas is required")
          .min(1, "minimum input datas is 1"),
      }),
      data
    );
})();
