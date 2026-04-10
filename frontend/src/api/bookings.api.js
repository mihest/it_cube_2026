import api from "./client.js";

export const createBooking = async ({ routeId, slotId, people, phone, comment }) => {
    const res = await api.post("/bookings", {
        routeId,
        slotId,
        people,
        phone,
        comment,
    });

    return res.data;
};

export const getMyBookings = async () => {
    const res = await api.get("/bookings/my");
    return res.data;
};