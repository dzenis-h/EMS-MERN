import Axios, { AxiosInstance, AxiosResponse } from "axios";

interface Query {
  url: string;
  headers?: any;
  params?: any;
}

interface Mutation {
  url: string;
  headers?: any;
  params?: any;
  method: "POST" | "PATCH" | "DELETE" | "PUT";
  data?: any;
}

export default abstract class ThirdPartyRequest {
  private axios: AxiosInstance;

  constructor(baseURL: string, headers?: any) {
    this.axios = Axios.create({
      baseURL,
      headers,
      validateStatus: (s) => !!s,
    });
  }

  protected async baseQuery<T>({
    url,
    headers,
    params,
  }: Query): Promise<AxiosResponse<T>> {
    return this.axios<T>({
      url,
      headers,
      method: "GET",
      params,
    });
  }

  protected async baseMutation<T>({
    url,
    headers,
    data,
    method,
  }: Mutation): Promise<AxiosResponse<T>> {
    return this.axios<T>({
      url,
      headers,
      method,
      data,
    });
  }
}
