import api from "./client.js";

export const getRoutes = async () => {
    const res = await api.get("/routes");
    return res.data;
};