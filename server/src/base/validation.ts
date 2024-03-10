import * as yup from "yup";
import AppError from "./error";
import type { SearchQuery } from "../interfaces";

export default abstract class BaseValidation {
  protected async validate<T = any>(schema: yup.Schema, data: any): Promise<T> {
    try {
      return (await schema.validate(data, {
        stripUnknown: true,
        abortEarly: false,
      })) as T;
    } catch (err) {
      const { errors } = err as { errors: string[] };

      throw new AppError({
        message: errors?.length > 1 ? errors.join(",\n ") : errors[0],
        statusCode: 400,
      });
    }
  }

  protected passwordValidation(password: string) {
    const requirements = [
      {
        regex: /(?=.*[a-z])/,
        message: "Please input minimum 1 lowercase",
      },
      {
        regex: /(?=.*[A-Z])/,
        message: "Please input minimum 1 uppercase",
      },
      {
        regex: /(?=.*\d)/,
        message: "Please input minimum 1 number",
      },
      {
        regex: /(?=.*[!@#$%^&*])/,
        message: "Please input minimum 1 symbol",
      },
      { regex: /^.{8,}$/, message: "Password minimum length is 8" },
    ];
    const errors = [];

    for (const requirement of requirements)
      if (!requirement.regex.test(password)) errors.push(requirement.message);

    if (errors.length) throw { errors };

    return true;
  }

  protected optionalDate = yup.date().optional().default(new Date());

  protected optionalDesc = yup.string().optional().default("N/A");

  protected requiredUnit = yup
    .string()
    .required("unit is required")
    .oneOf(["BAM", "$"], "invalid unit");

  protected requiredAmount = yup
    .number()
    .required("amount is required")
    .min(1, "amount must be greater than 0");

  protected requiredEmployeeId = yup
    .string()
    .required("employeeId is required");

  public queryValidation = async (data: any) =>
    await this.validate<SearchQuery>(
      yup.object().shape({
        page: yup.number().optional().default(1),
        limit: yup.number().optional().default(20),
        sortBy: yup.string().optional().default("createdAt"),
        direction: yup.string().optional().default("desc"),
        search: yup.string().optional(),
      }),
      data
    );
}
