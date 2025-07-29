import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { z } from "zod";

export abstract class ApiBase<TRequest, TResponse> {
  protected axiosInstance: AxiosInstance;
  protected endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;

    const baseURL = `${
      process.env.NEXT_PUBLIC_API_URL ||
      `http://localhost:${process.env.BACKEND_PORT || 8080}`
    }/api`;

    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, // 👈 required to include cookies
    });

    const authBypassRoutes = new Set([
      "/auth/login",
      "/auth/signup",
      "/auth/logout",
      "/auth/refresh-token",
    ]);

    // Interceptor for 401
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        const bypassRefresh = authBypassRoutes.has(originalRequest.url);

        // If it's a 401 and we haven't retried yet
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !bypassRefresh
        ) {
          originalRequest._retry = true;
          try {
            // Try to refresh the access token
            await axios.post(`${baseURL}/auth/refresh-token`, {});
            // Retry original request
            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            // If refresh fails, redirect to login
            console.error("Refresh token expired or invalid", refreshError);
            window.location.href = "/login";
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  protected abstract requestSchema(): z.ZodType<TRequest>;
  protected abstract responseSchema(): z.ZodType<TResponse>;

  protected async fetchApi(
    method: "get" | "post" | "put" | "delete",
    url: string,
    data?: TRequest
  ): Promise<TResponse> {
    try {
      // TODO: Validate request data if applicable // C'est pour check qu'on envoit bien ce qu'on veut et pas autre chose, bonne pratique
      // if (data) {
      //   this.requestSchema().parse(data);
      // }

      const config: AxiosRequestConfig = { method, url, data };
      const response: AxiosResponse = await this.axiosInstance.request(config);

      // TODO: Validate response // pour check qu'on recoit bien ce qu'on veut, bonne pratique
      // const parsed = this.responseSchema().parse(response.data);
      // return parsed;
      return response as TResponse; // temporary return to delete
    } catch (error: any) {
      const isLogoutRequest = url == `${this.endpoint}/logout`;
      const isUnauthorized = error?.response?.status === 401;

      // Gracefully fail logout if already logged out
      if (isLogoutRequest && isUnauthorized) return {} as TResponse;

      console.error(`API call failed for ${url}:`, error); // TODO: Not sure we want that to be shown to user
      throw error;
    }
  }

  /**
   * Standard CRUD helpers
   */

  async getAll(): Promise<TResponse[]> {
    const res = await this.axiosInstance.get<TResponse[]>(this.endpoint);
    return res.data.map((item) => this.responseSchema().parse(item));
  }

  async getById(id: number | string): Promise<TResponse> {
    const res = await this.axiosInstance.get<TResponse>(
      `${this.endpoint}/${id}`
    );
    return this.responseSchema().parse(res.data);
  }

  async create(data: TRequest): Promise<TResponse> {
    this.requestSchema().parse(data);
    const res = await this.axiosInstance.post<TResponse>(this.endpoint, data);
    return this.responseSchema().parse(res.data);
  }

  async update(id: number | string, data: TRequest): Promise<TResponse> {
    this.requestSchema().parse(data);
    const res = await this.axiosInstance.put<TResponse>(
      `${this.endpoint}/${id}`,
      data
    );
    return this.responseSchema().parse(res.data);
  }

  async delete(id: number | string): Promise<void> {
    await this.axiosInstance.delete(`${this.endpoint}/${id}`);
  }
}
