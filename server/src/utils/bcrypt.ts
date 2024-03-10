import { hashSync, compareSync } from "bcryptjs";

export default new (class Bcrypt {
  public hash = (data: string) => hashSync(data, 10);

  public compare = (data: string, hashData: string) =>
    compareSync(data, hashData);
})();
