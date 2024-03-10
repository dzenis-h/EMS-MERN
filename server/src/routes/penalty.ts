import BaseRoutes from "../base/router";
import penaltyController from "../controllers/penalty";
import checkValidObjectId from "../middlewares/checkValidObjectId";

export default new (class PenaltyRoute extends BaseRoutes {
  routes(): void {
    this.router
      .get("/", penaltyController.getAll)
      .post("/bulk", penaltyController.createBulkPenalty)
      .post("/:employeeId", penaltyController.createPenalty)
      .delete(
        "/:employeeId/:penaltyId",
        checkValidObjectId("employeeId"),
        checkValidObjectId("penaltyId"),
        penaltyController.deletePenalty
      );
  }
})().router;
