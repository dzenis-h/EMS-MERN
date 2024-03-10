import BaseRoutes from "../base/router";
import bonusController from "../controllers/bonus";
import checkValidObjectId from "../middlewares/checkValidObjectId";

export default new (class BonusRoute extends BaseRoutes {
  routes(): void {
    this.router
      .post(
        "/:employeeId",
        checkValidObjectId("employeeId"),
        bonusController.createBonus
      )
      .delete(
        "/:employeeId/:bonusId",
        checkValidObjectId("employeeId"),
        checkValidObjectId("bonusId"),
        bonusController.deleteBonus
      );
  }
})().router;
