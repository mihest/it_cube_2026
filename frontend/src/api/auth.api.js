import api from "./client.js";
import { useAuthStore } from "../store/authStore.js";

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

    const { access_token, user } = res.data;
    useAuthStore.getState().setAuth(access_token, user);

    return res.data;
};

export const refreshSession = async () => {
    const store = useAuthStore.getState();
    store.setLoading(true);

    try {
        const res = await api.post("/auth/Refresh", {});
        const { access_token, user } = res.data;
        store.setAuth(access_token, user);
        return user;
    } catch (e) {
        store.logout();
        return null;
    } finally {
        useAuthStore.getState().setLoading(false);
    }
};

export const logout = async () => {
    try {
        await api.post("/auth/SignOut", {});
    } catch (e) {
        console.error(e);
    }

    useAuthStore.getState().logout();
};