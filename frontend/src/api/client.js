import axios from "axios";
import { useAuthStore } from "../store/authStore.js";

const api = axios.create({
    baseURL: "/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

let isRefreshing = false;
let queue = [];

const processQueue = (token) => {
    queue.forEach((cb) => cb(token));
    queue = [];
};

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const original = error.config;

        if (error.response?.status === 401 && !original._retry) {
            if (original.url.includes("/auth/Refresh")) {
                useAuthStore.getState().logout();
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise((resolve) => {
                    queue.push((token) => {
                        original.headers.Authorization = `Bearer ${token}`;
                        resolve(api(original));
                    });
                });
            }

            original._retry = true;
            isRefreshing = true;

            try {
                const res = await api.post(
                    "/auth/Refresh",
                    {},
                    { withCredentials: true }
                );

                const newToken = res.data.access_token;
                const user = res.data.user;

                useAuthStore.getState().setAuth(newToken, user);

                processQueue(newToken);
                isRefreshing = false;

                original.headers.Authorization = `Bearer ${newToken}`;
                return api(original);
            } catch (err) {
                useAuthStore.getState().logout();
                isRefreshing = false;
                window.location.href = "/";
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default api;