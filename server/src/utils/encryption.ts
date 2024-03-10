import { createHmac, createHash } from "crypto";
import minify from "jsonminify";
import { EmployeeSalaryDetail } from "../interfaces/employee";
import { AES, enc } from "crypto-ts";

export default new (class Encryption {
  public objectToSign(data: object) {
    const hash = createHash("sha256");
    hash.update(this.minifyData(data));

    return hash.digest("hex").toLowerCase();
  }

  public encrypt = (data: string): string =>
    AES.encrypt(data, process.env.ENCRYPTION_KEY).toString();

  public decrypt = (data: string): string =>
    AES.decrypt(data, process.env.ENCRYPTION_KEY).toString(enc.Utf8);

  public minifyData = (data: object | any[] | string) =>
    minify(JSON.stringify(data));

  public signSignatureSalary(data: EmployeeSalaryDetail[]) {
    const hmac = createHmac("sha512", "Salary");
    hmac.update(this.objectToSign(data));

    return hmac.digest("base64");
  }
})();
