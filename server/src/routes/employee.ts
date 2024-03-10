import BaseRoutes from "../base/router";
import employeeController from "../controllers/employee";
import checkValidObjectId from "../middlewares/checkValidObjectId";

export default new (class EmployeeRoute extends BaseRoutes {
  routes(): void {
    this.router
      .get("/", employeeController.getAll)
      .get("/name", employeeController.getListName)
      .post("/register", employeeController.registerNewEmployee)
      .post("/register/bulk", employeeController.registerBulkNewEmployee)
      .get(
        "/:employeeId",
        checkValidObjectId("employeeId"),
        employeeController.findByIdentifier
      )
      .delete(
        "/:employeeId",
        checkValidObjectId("employeeId"),
        employeeController.inActiveAnEmployee
      )
      .patch(
        "/:employeeId",
        checkValidObjectId("employeeId"),
        employeeController.activatedAnEmployee
      );
  }
})().router;
