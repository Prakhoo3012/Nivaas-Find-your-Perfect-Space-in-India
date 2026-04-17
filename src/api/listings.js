import api from "./axiosInstance";

// GET /listings  — all listings
export const allListings = () => api.get("/properties/all-properties");

// GET /property/:id  — single property detail
export const getListingById = (id) => api.get(`/properties/get-property/${id}`);

// GET /users/dashboard - all user bookings
export const getDashboardData = () => api.get("/users/dashboard");
