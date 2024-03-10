import { Router } from "express";
import type IRoutes from "../interfaces/router";

export default abstract class BaseRoutes implements IRoutes {
  public router: Router;

  abstract routes(): void;

  constructor() {
    this.router = Router();
    this.routes();
  }
}
