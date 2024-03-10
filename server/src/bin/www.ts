import { config } from "dotenv";
import app from "..";
import mongoConnect from "../database/mongo";

config();

(async () => {
  await mongoConnect();
  console.log(`Database connected`);

  const port = process.env.PORT ?? 3000;
  app.listen(port, () => console.log(`app listening on port ${port}`));
})();
