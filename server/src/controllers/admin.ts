import type { Request, Response, NextFunction } from "express";
import adminValidation from "../validations/admin";
import Admin from "../models/admin";
import bcrypt from "../utils/bcrypt";
import AppError from "../base/error";
import jwt from "../utils/jwt";
import response from "../middlewares/response";
import { OAuth2Client, type TokenPayload } from "google-auth-library";
import token from "../models/token";
import adminService from "../services/admin";

export default new (class AdminController {
  public async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password } = await adminValidation.loginValidate(req.body);

      const admin = await Admin.findOne({ email });
      if (!admin || !bcrypt.compare(password, admin.password))
        throw new AppError({
          message: "invalid credentials",
          statusCode: 401,
        });

      const data = jwt.createToken(email);
      await token.create({
        token: data,
        type: "credentials",
      });

      response.createResponse({
        res,
        code: 200,
        message: "OK",
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  public async googleLogin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { googleToken } = await adminValidation.googleLoginValidate(
        req.body
      );

      const client = new OAuth2Client(
        process.env.GOOGLE_OAUTH_CLIENT_ID,
        process.env.GOOGLE_OAUTH_CLIENT_SECRET
      );

      const ticket = await client.verifyIdToken({
        idToken: googleToken as string,
        audience: process.env.GOOGLE_OAUTH_CLIENT_ID,
      });

      const { email } = ticket.getPayload() as TokenPayload;
      if (!email)
        throw new AppError({
          message: "invalid credentials",
          statusCode: 401,
        });

      const appToken = jwt.createTokenEmail(email);
      await token.create({
        token: appToken,
        type: "google",
      });

      response.createResponse({
        res,
        code: 200,
        message: "OK",
        data: appToken,
      });
    } catch (err) {
      next(err);
    }
  }

  public async microsoftLogin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { microsoftToken } = await adminValidation.microsoftLoginValidate(
        req.body
      );

      const { aud, email } = jwt.decodeToken(microsoftToken);
      if (aud !== process.env.MICROSOFT_CLIENT_ID)
        throw new AppError({
          message: "invalid credentials",
          statusCode: 401,
        });

      const data = jwt.createTokenEmail(email);
      await token.create({
        token: data,
        type: "microsoft",
      });

      response.createResponse({
        res,
        code: 200,
        message: "OK",
        data,
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  public async logout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { access_token } = req.headers;

      await token.deleteOne({ token: access_token });
      response.createResponse({
        res,
        code: 200,
        message: "OK",
      });
    } catch (err) {
      next(err);
    }
  }
})();
