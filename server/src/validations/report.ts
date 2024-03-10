import * as yup from "yup";
import BaseValidation from "../base/validation";
import type { GenerateSalaryProps } from "../interfaces/salary";

export default new (class ReportValidation extends BaseValidation {
  public validateDate = async (data: any) =>
    await this.validate<GenerateSalaryProps>(
      yup.object().shape({
        month: yup.number().required("month is required"),
        year: yup.number().required("year is required"),
      }),
      data
    );
})();
