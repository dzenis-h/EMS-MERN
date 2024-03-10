import BaseValidation from "../base/validation";
import * as yup from "yup";
import type { BonusFormProps } from "../interfaces/bonus";

export default new (class BonusValidation extends BaseValidation {
  public validateCreateBonus = async (data: any) =>
    await this.validate<BonusFormProps>(
      yup.object().shape({
        amount: this.requiredAmount,
        date: this.optionalDate,
        description: this.optionalDesc,
        isRepeating: yup.boolean().optional().default(false),
        unit: this.requiredUnit,
      }),
      data
    );
})();
