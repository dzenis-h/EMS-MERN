import {
  type JwtPayload,
  sign,
  type SignOptions,
  verify,
  decode,
} from "jsonwebtoken";
import { config } from "dotenv";

config();

export interface JwtValue extends JwtPayload {
  _id: string;
  email: string;
}

class JWT {
  private readonly SECRET = process.env.TOKEN_SECRET;

  public createToken = (_id: string, options?: SignOptions) =>
    sign({ _id }, this.SECRET, options);

  public createTokenEmail = (email: string, options?: SignOptions) =>
    sign({ email }, this.SECRET, options);

  public createMicrosoftToken = (credential: string, options?: SignOptions) =>
    sign({ credential }, this.SECRET, options);

  public verifyToken = (token: string) =>
    verify(token, this.SECRET) as JwtValue;

  public decodeToken = (token: string) => decode(token) as JwtValue;
}

export default new JWT();
