import api from "./client.js";

export const getAdminBookings = async () => {
    const res = await api.get("/admin/bookings");
    return res.data;
};

export const updateAdminBookingStatus = async (bookingId, status) => {
    const res = await api.patch(`/admin/bookings/${bookingId}/status`, {
        status,
    });

    return res.data;
};

export const createAdminRoute = async (payload) => {
    const formData = new FormData();

    formData.append("title", payload.title);
    formData.append("shortDescription", payload.shortDescription);
    formData.append("fullDescription", payload.fullDescription);
    formData.append("duration", payload.duration);
    formData.append("transport", payload.transport);
    formData.append("budget", payload.budget);
    formData.append("volunteer", payload.volunteer ? "1" : "0");
    formData.append("volunteerImpact", payload.volunteerImpact || "");
    formData.append("petsAllowed", payload.petsAllowed ? "1" : "0");
    formData.append("kidsAllowed", payload.kidsAllowed ? "1" : "0");
    formData.append("typeLabel", payload.typeLabel);
    formData.append("place", payload.place);
    formData.append("priceFrom", payload.priceFrom);

    (payload.company || []).forEach((item, index) => {
        formData.append(`company[${index}]`, item);
    });

    (payload.interests || []).forEach((item, index) => {
        formData.append(`interests[${index}]`, item);
    });

    (payload.tips || []).forEach((item, index) => {
        formData.append(`tips[${index}]`, item);
    });

    if (payload.coordinates?.lat !== undefined) {
        formData.append("coordinates[lat]", String(payload.coordinates.lat));
    }

    if (payload.coordinates?.lng !== undefined) {
        formData.append("coordinates[lng]", String(payload.coordinates.lng));
    }

    (payload.slots || []).forEach((slot, index) => {
        formData.append(`slots[${index}][date]`, slot.date);
        formData.append(`slots[${index}][capacity]`, String(slot.capacity));
    });

    if (payload.image instanceof File) {
        formData.append("image", payload.image, payload.image.name);
    }

    (payload.gallery || []).forEach((file) => {
        if (file instanceof File) {
            formData.append("gallery[]", file, file.name);
        }
    });

    const res = await api.post("/admin/routes", formData);
    return res.data;
};

export const updateAdminRoute = async (routeId, payload) => {
    const formData = new FormData();

    formData.append("_method", "PUT");
    formData.append("title", payload.title);
    formData.append("shortDescription", payload.shortDescription);
    formData.append("fullDescription", payload.fullDescription);
    formData.append("duration", payload.duration);
    formData.append("transport", payload.transport);
    formData.append("budget", payload.budget);
    formData.append("volunteer", payload.volunteer ? "1" : "0");
    formData.append("volunteerImpact", payload.volunteerImpact || "");
    formData.append("petsAllowed", payload.petsAllowed ? "1" : "0");
    formData.append("kidsAllowed", payload.kidsAllowed ? "1" : "0");
    formData.append("typeLabel", payload.typeLabel);
    formData.append("place", payload.place);
    formData.append("priceFrom", payload.priceFrom);

    (payload.company || []).forEach((item, index) => {
        formData.append(`company[${index}]`, item);
    });

    (payload.interests || []).forEach((item, index) => {
        formData.append(`interests[${index}]`, item);
    });

    (payload.tips || []).forEach((item, index) => {
        formData.append(`tips[${index}]`, item);
    });

    if (payload.coordinates?.lat !== undefined) {
        formData.append("coordinates[lat]", String(payload.coordinates.lat));
    }

    if (payload.coordinates?.lng !== undefined) {
        formData.append("coordinates[lng]", String(payload.coordinates.lng));
    }

    (payload.slots || []).forEach((slot, index) => {
        formData.append(`slots[${index}][date]`, slot.date);
        formData.append(`slots[${index}][capacity]`, String(slot.capacity));
    });

    if (payload.image instanceof File) {
        formData.append("image", payload.image, payload.image.name);
    }

    (payload.gallery || []).forEach((file) => {
        if (file instanceof File) {
            formData.append("gallery[]", file, file.name);
        }
    });

    const res = await api.post(`/admin/routes/${routeId}`, formData);
    return res.data;
};

export const deleteAdminRoute = async (routeId) => {
    const res = await api.delete(`/admin/routes/${routeId}`);
    return res.data;
};