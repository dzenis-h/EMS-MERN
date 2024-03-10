import { RESPONSE_NAME } from "../constant";
import type { ResponseDetail, ResponsePayload } from "../interfaces/response";

export default new (class ResponseHandler {
  private baseResponse({
    code,
    message,
    data,
  }: {
    code: number;
    message?: string;
    data?: any;
  }): Record<string, any> {
    return {
      statusCode: code,
      status: RESPONSE_NAME[code ?? 500],
      message,
      data,
    };
  }
  public async createResponse(
    payload: ResponsePayload,
    detail?: ResponseDetail
  ) {
    const { code, message, res, data } = payload;
    const response = this.baseResponse({ code, message, data });

    if (detail) for (const key in detail) response[key] = detail[key];
    response["Content-Type"] = res.req.headers["content-type"];
    response["Path"] = `${res.req.method} ${res.req.originalUrl}`;

    res.status(code).json(response);
  }
})();
