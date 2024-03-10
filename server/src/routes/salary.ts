import BaseRoutes from "../base/router";
import salaryController from "../controllers/salary";

export default new (class SalaryRoute extends BaseRoutes {
  routes(): void {
    this.router
      .get("/", salaryController.generateSalary)
      .post("/", salaryController.releaseSalary)
      .patch("/:employeeId", salaryController.raiseUp);
  }
})().router;
