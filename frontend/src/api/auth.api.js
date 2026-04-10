import api from "./client";
import { useAuthStore } from "../store/authStore";

export const login = async (username, password) => {
    const res = await api.post("/auth/SignIn", {
        username,
        password,
    });

    const { access_token, user } = res.data;
    useAuthStore.getState().setAuth(access_token, user);
    return res.data;
};

export const register = async ({ username, email, password, fullName }) => {
    const res = await api.post("/auth/SignUp", {
        username,
        email,
        password,
        fullName,
    });

    const { access_token, user } = res.data || {};

    if (access_token && user) {
        useAuthStore.getState().setAuth(access_token, user);
    }

    return res.data;
};

export const logout = async () => {
    try {
        await api.post("/auth/SignOut");
    } catch (e) {
        console.error(e);
    }

    useAuthStore.getState().logout();
};