import AppError from "../base/error";
import ThirdPartyRequest from "../base/thirdparty";
import type { CurrencyExchangerResp } from "../interfaces/currencyExchanger";

export default new (class CurrencyExchanger extends ThirdPartyRequest {
  constructor() {
    super(process.env.ALPHA_VANTAGE_BASE_URL);
  }

  public async getUsdExchangeRate() {
    try {
      const { status, data } = await this.baseQuery<CurrencyExchangerResp>({
        url: "/query",
        params: {
          function: "CURRENCY_EXCHANGE_RATE",
          from_currency: "BAM",
          to_currency: "USD",
          apikey: process.env.ALPHA_VANTAGE_APIKEY,
        },
      });
      if (status !== 200)
        throw new AppError({
          message: "Bad Gateway",
          statusCode: 502,
        });
      return data;
    } catch (err) {
      return null;
    }
  }
})();
