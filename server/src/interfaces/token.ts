import type { BaseDocument } from "../base/model";

export interface IToken extends BaseDocument {
  token: string;
  type: TokenType;
}

export type TokenType = "credentials" | "google" | "microsoft";
