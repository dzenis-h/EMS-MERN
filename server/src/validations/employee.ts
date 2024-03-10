import BaseValidation from "../base/validation";
import * as yup from "yup";
import type { NewEmployeeProps } from "../interfaces/employee";

export default new (class EmployeeValidations extends BaseValidation {
  private readonly validateNewEmployeeSchema = yup.object().shape({
    name: yup.string().required("name is required"),
    surname: yup.string().required("surname is required"),
    JMBG: yup
      .string()
      .required("JMBG is required")
      .test(
        "13 characters",
        "JMBG must 13 character",
        (val) => val.length === 13
      )
      .test(
        "numeric only",
        "only numeric character allowed for JMBG",
        (val) => !isNaN(Number(val))
      ),
    birthdate: yup.date().required("birthdate is required"),
    gender: yup
      .string()
      .required("gender is required")
      .oneOf(["M", "F"], "invalid gender"),
    position: yup.string().required("position is required"),
    startdate: yup.date().optional().default(new Date()),
    isPayoneer: yup.boolean().optional().default(false),
    salaryAmount: yup
      .number()
      .required("salaryAmount is required")
      .min(1, "salaryAmount must greater than 0"),
  });

  public validateNewEmployee = async (data: any) =>
    await this.validate<NewEmployeeProps>(this.validateNewEmployeeSchema, data);

  public validateBulkNewEmployee = async (data: any) =>
    await this.validate<{ datas: NewEmployeeProps[] }>(
      yup.object().shape({
        datas: yup
          .array()
          .of(this.validateNewEmployeeSchema)
          .required("datas is required")
          .min(1, "minimum input value is 1"),
      }),
      data
    );
})();
