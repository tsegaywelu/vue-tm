import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import router from "@/router";
import { updateSocketToken } from "@/utils/socket";

const API_URL = import.meta.env.VITE_API_URL;

const baseService = axios.create({
  baseURL: API_URL,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Add an interceptor for basic request configuration
baseService.interceptors.request.use(
  (config) => {
    // Automatic token injection removed as per explicit addAuthenticationHeader pattern requirement
    if (config.data && !(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle 401 errors globally
baseService.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const auth_store = useAuthStore();

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return baseService(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refresh_token = auth_store.refresh_token;

        if (!refresh_token) {
          throw new Error("No refresh token available");
        }

        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken: refresh_token,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        auth_store.set_tokens(accessToken, newRefreshToken);
        updateSocketToken(accessToken);

        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        baseService.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

        processQueue(null, accessToken);
        isRefreshing = false;

        return baseService(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        auth_store.logout();
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 401) {
      auth_store.logout();
    }

    return Promise.reject(error);
  }
);

export default baseService;
