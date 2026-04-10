import API from "./api";

export const allListings = async () => {
  try {
    const res = await API.get("/properties/all-properties");

    console.log("✅ API DATA:", res.data);

    return res.data; // ✅ IMPORTANT
  } catch (error) {
    console.log("❌ API ERROR:", error);
    return [];
  }
};

/*
const fetchListings = async (filters = {}) => {
  try {
    const query = new URLSearchParams(filters).toString();

    const res = await fetch(`${BASE_URL}/listings?${query}`);
    if (!res.ok) throw new Error("Failed to fetch listings");

    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
};

const fetchCities = async () => {
  try {
    const res = await fetch(`${BASE_URL}/cities`);
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
};
*/