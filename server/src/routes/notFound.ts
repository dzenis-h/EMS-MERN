import AppError from "../base/error";
import BaseRoutes from "../base/router";

export default new (class NotFoundRoute extends BaseRoutes {
  routes(): void {
    this.router.use("/*", (req, res, next) => {
      next(
        new AppError({
          message: `Cannot ${req.method} ${req.originalUrl}`,
          statusCode: 404,
        })
      );
    });
  }
})().router;
