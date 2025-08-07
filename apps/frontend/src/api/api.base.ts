import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { z } from "zod";

// Base response wrapper interface
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// Standard CRUD interfaces (optional)
export interface CreateRequest<T = unknown> {
  data: T;
}

export interface UpdateRequest<T = unknown> {
  data: T;
}

export interface CreateResponse<T = unknown> {
  data: T;
}

export interface GetResponse<T = unknown> {
  data: T;
}

export interface GetAllResponse<T = unknown> {
  data: T[];
}

export interface UpdateResponse<T = unknown> {
  data: T;
}

export interface DeleteResponse {
  success: boolean;
}
interface Schemas<
  TCreateRequest,
  TCreateResponse,
  TGetResponse,
  TGetAllResponse,
  TUpdateRequest,
  TUpdateResponse,
  TDeleteResponse
> {
  createRequest?: z.ZodType<TCreateRequest>;
  createResponse?: z.ZodType<TCreateResponse>;
  getResponse?: z.ZodType<TGetResponse>;
  getAllResponse?: z.ZodType<TGetAllResponse>;
  updateRequest?: z.ZodType<TUpdateRequest>;
  updateResponse?: z.ZodType<TUpdateResponse>;
  deleteResponse?: z.ZodType<TDeleteResponse>;
}

export abstract class ApiBase<
  TCreateRequest = never,
  TCreateResponse = never,
  TGetResponse = never,
  TGetAllResponse = never,
  TUpdateRequest = never,
  TUpdateResponse = never,
  TDeleteResponse = never
> {
  protected axiosInstance: AxiosInstance;
  protected endpoint: string;
  protected schemas: Schemas<
    TCreateRequest,
    TCreateResponse,
    TGetResponse,
    TGetAllResponse,
    TUpdateRequest,
    TUpdateResponse,
    TDeleteResponse
  >;

  constructor(
    endpoint: string,
    schemas: Schemas<
      TCreateRequest,
      TCreateResponse,
      TGetResponse,
      TGetAllResponse,
      TUpdateRequest,
      TUpdateResponse,
      TDeleteResponse
    > = {}
  ) {
    this.endpoint = endpoint;
    this.schemas = schemas;

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

        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !bypassRefresh
        ) {
          originalRequest._retry = true;
          try {
            await axios.post(
              `${baseURL}/auth/refresh-token`,
              {},
              {
                headers: {
                  "Content-Type": "application/json",
                },
                withCredentials: true,
              }
            );
            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            console.error("Refresh token expired or invalid", refreshError);
            const currentPath = window.location.pathname;
            if (currentPath !== "/login" && currentPath !== "/signup") {
              window.location.href = "/login";
            }
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Generic API call method with automatic response validation
a   */
  protected async fetchApi<TRequest, TResponse>(
    method: "get" | "post" | "put" | "delete",
    url: string,
    data?: TRequest,
    responseSchema?: z.ZodType<TResponse>
  ): Promise<TResponse> {
    try {
      const config: AxiosRequestConfig = { method, url, data };
      const response: AxiosResponse = await this.axiosInstance.request(config);

      // Validate response if schema is provided
      if (responseSchema) {
        const parsed = responseSchema.parse(
          response.data.data || response.data
        );
        return parsed;
      }

      return response.data.data || response.data;
    } catch (error: unknown) {
      const isLogoutRequest = url == `${this.endpoint}/logout`;
      const isUnauthorized =
        (error as { response?: { status: number } })?.response?.status === 401;

      if (isLogoutRequest && isUnauthorized) return {} as TResponse;

      console.error(`API call failed for ${url}:`, error);
      throw error;
    }
  }

  /**
   * Standard CRUD operations (only available if interfaces are provided)
   */

  async create(data: TCreateRequest): Promise<TCreateResponse> {
    return this.fetchApi<TCreateRequest, TCreateResponse>(
      "post",
      this.endpoint,
      data,
      this.schemas.createResponse
    );
  }

  async getAll(): Promise<TGetAllResponse> {
    return this.fetchApi<null, TGetAllResponse>(
      "get",
      this.endpoint,
      undefined,
      this.schemas.getAllResponse
    );
  }

  async getById(id: number): Promise<TGetResponse> {
    return this.fetchApi<null, TGetResponse>(
      "get",
      `${this.endpoint}/${id}`,
      undefined,
      this.schemas.getResponse
    );
  }

  async get(): Promise<TGetResponse> {
    return this.fetchApi<null, TGetResponse>(
      "get",
      `${this.endpoint}`,
      undefined,
      this.schemas.getResponse
    );
  }

  async update(id: number, data: TUpdateRequest): Promise<TUpdateResponse> {
    return this.fetchApi<TUpdateRequest, TUpdateResponse>(
      "put",
      `${this.endpoint}/${id}`,
      data,
      this.schemas?.updateResponse
    );
  }

  async delete(id: number): Promise<TDeleteResponse> {
    return this.fetchApi<null, TDeleteResponse>(
      "delete",
      `${this.endpoint}/${id}`,
      undefined,
      this.schemas?.deleteResponse
    );
  }
}
