import { create } from "zustand";

export const useAuthStore = create((set) => ({
    accessToken: null,
    user: null,
    isAuth: false,
    isLoading: true,

    setAuth: (token, user) =>
        set({
            accessToken: token,
            user,
            isAuth: true,
            isLoading: false
        }),

    setLoading: (v) => set({ isLoading: v }),

    logout: () =>
        set({
            accessToken: null,
            user: null,
            isAuth: false,
            isLoading: false
        })
}));