import type { Router } from "express";

export default interface IRoutes {
  router: Router;

  routes(): void;
}
