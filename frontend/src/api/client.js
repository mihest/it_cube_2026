import axios from "axios";
import { useAuthStore } from "../store/authStore.js";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

let isRefreshing = false;
let queue = [];

const processQueue = (token = null, error = null) => {
    queue.forEach(({ resolve, reject, config }) => {
        if (error) {
            reject(error);
            return;
        }

        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
        resolve(api(config));
    });

    queue = [];
};

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
        delete config.headers["Content-Type"];
    } else {
        config.headers["Content-Type"] = "application/json";
    }

    return config;
});

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const original = error.config;

        if (!original) {
            return Promise.reject(error);
        }

        const is401 = error.response?.status === 401;
        const isRefreshRequest = original.url?.includes("/auth/Refresh");
        const isAuthRequest =
            original.url?.includes("/auth/SignIn") ||
            original.url?.includes("/auth/SignUp") ||
            original.url?.includes("/auth/SignOut");

        if (!is401 || original._retry || isRefreshRequest || isAuthRequest) {
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                queue.push({ resolve, reject, config: original });
            });
        }

        original._retry = true;
        isRefreshing = true;

        try {
            const res = await api.post("/auth/Refresh", {});
            const newToken = res.data.access_token;
            const user = res.data.user;

            useAuthStore.getState().setAuth(newToken, user);

            processQueue(newToken, null);
            isRefreshing = false;

            original.headers = original.headers || {};
            original.headers.Authorization = `Bearer ${newToken}`;

            return api(original);
        } catch (refreshError) {
            processQueue(null, refreshError);
            isRefreshing = false;
            useAuthStore.getState().logout();

            return Promise.reject(refreshError);
        }
    }
);

export default api;