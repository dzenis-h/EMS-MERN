import * as yup from "yup";
import BaseValidation from "../base/validation";
import type { LoginAdminProps } from "../interfaces/admin";

export default new (class AdminValidations extends BaseValidation {
  public loginValidate = (data: any) =>
    this.validate<LoginAdminProps>(
      yup.object().shape({
        email: yup
          .string()
          .required("email is required")
          .email("invalid email format"),
        password: yup.string().required("password is required"),
      }),
      data
    );

  public googleLoginValidate = async (data: any) =>
    await this.validate<{ googleToken: string }>(
      yup.object().shape({
        googleToken: yup.string().required("googleToken is required"),
      }),
      data
    );

  public microsoftLoginValidate = async (data: any) =>
    await this.validate<{ microsoftToken: string }>(
      yup.object().shape({
        microsoftToken: yup.string().required("microsoftToken is required"),
      }),
      data
    );
})();
