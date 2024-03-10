import BaseRoutes from "../base/router";
import authentication from "../middlewares/authentication";
import admin from "./admin";
import bonus from "./bonus";
import employee from "./employee";
import loan from "./loan";
import penalty from "./penalty";
import report from "./report";
import salary from "./salary";

export default new (class Routes extends BaseRoutes {
  routes(): void {
    this.router
      .use("/admin", admin)
      .use(authentication)
      .use("/employee", employee)
      .use("/salary", salary)
      .use("/bonus", bonus)
      .use("/penalty", penalty)
      .use("/report", report)
      .use("/loan", loan);
  }
})().router;
