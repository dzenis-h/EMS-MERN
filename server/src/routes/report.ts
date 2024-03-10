import BaseRoutes from "../base/router";
import reportController from "../controllers/report";
import checkValidObjectId from "../middlewares/checkValidObjectId";

export default new (class ReportRoute extends BaseRoutes {
  routes(): void {
    this.router
      .get("/summary", reportController.getSummaryData)
      .get("/summary/detail", reportController.getSummaryDetail)
      .get("/statistic", reportController.getEmployeeStatistic)
      .get(
        "/summary/detail/:employeeId",
        checkValidObjectId("employeeId"),
        reportController.getEmployeeSalary
      );
  }
})().router;
