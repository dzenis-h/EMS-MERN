import express, { type Application } from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import morgan from "morgan";
import { format } from "date-fns";
import AppError from "./base/error";
import { BASE_URL } from "./constant";
import routes from "./routes";
import notFound from "./routes/notFound";
import errorHandler from "./middlewares/errorHandler";
import { join } from "path";

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.useFe();
    this.feRoute();
    this.plugins();
    this.appRoute();
    this.errorHandling();
  }

  private useFe() {
    this.app.use(
      express.static(join(__dirname, "../../client/build")),
      (req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader(
          "Content-Security-Policy",
          "script-src 'self'  https://accounts.google.com/gsi/client http://oss.maxcdn.com"
        );
        next();
      }
    );
  }

  private plugins(): void {
    this.app.use(
      helmet({
        referrerPolicy: { policy: "same-origin" },
      })
    );
    this.app.use(cors());
    morgan.token("date", () =>
      format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")
    );
    morgan.format(
      "production",
      '[:date[Asia/Jakarta]] ":method :url" :status :res[content-length] - :response-time ms'
    );
    morgan.format(
      "dev",
      '[:date[Asia/Jakarta]] ":method :url" :status :res[content-length] - :response-time ms'
    );
    this.app.use(morgan("combined"));
    this.app.use(express.static("public"));
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(
      express.urlencoded({
        extended: true,
        limit: "50mb",
        parameterLimit: 100000000,
      })
    );
    this.app.disable("x-powered-by");
  }

  private appRoute(): void {
    this.app.use(BASE_URL, routes).use(notFound);
    // lo life for life
  }

  private feRoute(): void {
    this.app.use(/^(?!\/api\/v1\/).*/, (req, res) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.setHeader(
        "Content-Security-Policy",
        "script-src 'self' https://accounts.google.com/gsi/client http://oss.maxcdn.com"
      );

      res.sendFile(join(__dirname, "../../client/build/index.html"));
    });
  }

  private errorHandling(): void {
    this.app.use(errorHandler);
  }
}

export default new App().app;
