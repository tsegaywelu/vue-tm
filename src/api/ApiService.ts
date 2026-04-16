import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { useAuthStore } from "@/store/authStore";
import type { AsyncResponse } from "./types";

export const backendApi = import.meta.env.v_API_URL;

export default class ApiService {
  api: AxiosInstance;

  constructor(baseURL?: string) {
    this.api = axios.create({
      baseURL: baseURL ?? backendApi,
      timeout: 1000 * 60,
      validateStatus: (status: number) => status >= 200 && status < 300,
    });

    // Request Interceptor: Basic setup
    this.api.interceptors.request.use((config) => {
      // Automatic token injection removed as per explicit addAuthenticationHeader pattern requirement
      return config;
    });

    // Response Interceptor: Wrap responses and handle errors/refresh
    this.api.interceptors.response.use(
      (response: AxiosResponse): any => {
        // Success path: wrap in AsyncResponse
        const async_res: AsyncResponse<any> = {
          success: true,
          status: response.status,
          data: response.data,
          error: "",
        };
        return async_res;
      },
      async (error: any): Promise<AsyncResponse<any>> => {
        const originalRequest = error.config;
        const auth_store = useAuthStore();

        // Handle 401 Unauthorized (Token Expired or Invalid)
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refresh_token = auth_store.refresh_token;
            if (!refresh_token) throw new Error("No refresh token");

            // Perform token refresh call manually
            const res = await axios.post(`${backendApi}/auth/refresh`, {
              refreshToken: refresh_token,
            });

            if (res.status === 200 || res.status === 201) {
              const { accessToken, refreshToken: newRefreshToken } = res.data;
              auth_store.set_tokens(accessToken, newRefreshToken);

              // Retry original request with new token
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              return this.api(originalRequest);
            }
          } catch (refresh_err) {
            auth_store.logout();
            return {
              success: false,
              status: 401,
              data: null,
              error: "Session expired. Please login again.",
            };
          }
        }

        // Generic error path: wrap in AsyncResponse
        return {
          success: false,
          status: error.response?.status || error.code || 500,
          data: null,
          error:
            error.response?.data?.message ||
            error.message ||
            "Unexpected error",
          errorBody: error.response?.data,
        };
      },
    );
  }

  async get<T>(
    url: string,
    config: AxiosRequestConfig = {},
  ): Promise<AsyncResponse<T>> {
    return this.api.get<T>(url, config) as any;
  }

  async post<T, D = any>(
    url: string,
    data: D,
    config: AxiosRequestConfig = {},
  ): Promise<AsyncResponse<T>> {
    return this.api.post<T>(url, data, config) as any;
  }

  async put<T, D = any>(
    url: string,
    data: D,
    config: AxiosRequestConfig = {},
  ): Promise<AsyncResponse<T>> {
    return this.api.put<T>(url, data, config) as any;
  }

  async patch<T, D = any>(
    url: string,
    data: D,
    config: AxiosRequestConfig = {},
  ): Promise<AsyncResponse<T>> {
    return this.api.patch<T>(url, data, config) as any;
  }

  async delete<T>(
    url: string,
    config: AxiosRequestConfig = {},
  ): Promise<AsyncResponse<T>> {
    return this.api.delete<T>(url, config) as any;
  }

  // Matching Raaz explicit authentication pattern
  addAuthenticationHeader() {
    const authStore = useAuthStore();
    const token = authStore.token || localStorage.getItem("access_token");
    if (token) {
      this.api.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
    return this;
  }
}
