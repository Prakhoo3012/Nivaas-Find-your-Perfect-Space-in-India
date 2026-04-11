// ─── Cities ────────────────────────────────────────────
export const CITIES = [
  { name: "Jaipur",     icon: "🏯", count: 142 },
  { name: "Delhi",      icon: "🌆", count: 389 },
  { name: "Mumbai",     icon: "🌊", count: 512 },
  { name: "Bangalore",  icon: "🌿", count: 448 },
  { name: "Goa",        icon: "🏖️", count: 96  },
  { name: "Pune",       icon: "🎓", count: 203 },
];

// ─── Categories ────────────────────────────────────────
export const CATEGORIES = [
  { label: "All",    value: "all"    },
  { label: "Room",   value: "room"   },
  { label: "Flat",   value: "flat"   },
  { label: "PG",     value: "pg"     },
  { label: "Hostel", value: "hostel" },
  { label: "House",  value: "house"  },
  { label: "Villa",  value: "villa"  },
];

// ─── Amenity filters ───────────────────────────────────
export const AMENITY_FILTERS = [
  { label: "WiFi",      value: "wifi",           count: 387 },
  { label: "AC",        value: "ac",             count: 241 },
  { label: "Parking",   value: "parking",        count: 198 },
  { label: "Gym",       value: "gym",            count: 84  },
  { label: "Meals",     value: "meals_included", count: 112 },
  { label: "Laundry",   value: "laundry",        count: 156 },
  { label: "Hot Water", value: "hot_water",      count: 329 },
];

// ─── Amenity label maps ────────────────────────────────
export const AMENITY_LABEL_MAP = {
  wifi:           "WiFi",
  ac:             "AC",
  parking:        "Parking",
  gym:            "Gym",
  meals_included: "Meals",
  laundry:        "Laundry",
  hot_water:      "Hot Water",
  power_backup:   "Power",
};

export const AMENITY_DETAIL_LABELS = {
  wifi:           "High-speed WiFi",
  ac:             "Air conditioning",
  parking:        "Secure parking",
  hot_water:      "24h hot water",
  power_backup:   "Power backup",
  meals_included: "Meals included",
  laundry:        "Laundry service",
  security:       "24h security",
  garden:         "Private garden",
  terrace:        "Rooftop terrace",
};

// ─── Mock data (fallback / dev) ────────────────────────
export const MOCK_LISTINGS = [
  {
    _id: "1", title: "Sunlit Studio in Malviya Nagar", propertyType: "flat",
    location: { city: "Jaipur", state: "Rajasthan" },
    pricing: { basePrice: 12000, priceType: "per_month" },
    ratings: { average: 4.8, count: 32 },
    amenities: ["wifi", "ac", "parking"],
    roomInfo: { availableRooms: 1, bathrooms: 1, areaSqFt: 380 }, isNew: true,
  },
  {
    _id: "2", title: "Cozy PG Near IIT Delhi", propertyType: "pg",
    location: { city: "Delhi", state: "Delhi" },
    pricing: { basePrice: 8500, priceType: "per_month" },
    ratings: { average: 4.3, count: 18 },
    amenities: ["wifi", "meals_included", "laundry"],
    roomInfo: { availableRooms: 3, bathrooms: 2, areaSqFt: 120 },
  },
  {
    _id: "3", title: "Spacious 2BHK with Garden View", propertyType: "flat",
    location: { city: "Bangalore", state: "Karnataka" },
    pricing: { basePrice: 22000, priceType: "per_month" },
    ratings: { average: 4.9, count: 47 },
    amenities: ["wifi", "ac", "gym", "parking"],
    roomInfo: { availableRooms: 1, bathrooms: 2, areaSqFt: 950 },
  },
  {
    _id: "4", title: "Sea-facing Room, South Goa", propertyType: "room",
    location: { city: "Goa", state: "Goa" },
    pricing: { basePrice: 3200, priceType: "per_night" },
    ratings: { average: 4.7, count: 89 },
    amenities: ["wifi", "ac"],
    roomInfo: { availableRooms: 1, bathrooms: 1, areaSqFt: 280 },
  },
  {
    _id: "5", title: "Minimalist Hostel — Lower Parel", propertyType: "hostel",
    location: { city: "Mumbai", state: "Maharashtra" },
    pricing: { basePrice: 6000, priceType: "per_month" },
    ratings: { average: 4.1, count: 14 },
    amenities: ["wifi", "laundry"],
    roomInfo: { availableRooms: 5, bathrooms: 3, areaSqFt: 80 },
  },
  {
    _id: "6", title: "Hill-view Studio, Old Manali", propertyType: "room",
    location: { city: "Manali", state: "Himachal" },
    pricing: { basePrice: 1800, priceType: "per_night" },
    ratings: { average: 4.6, count: 61 },
    amenities: ["wifi", "hot_water"],
    roomInfo: { availableRooms: 1, bathrooms: 1, areaSqFt: 220 }, isNew: true,
  },
  {
    _id: "7", title: "Heritage Haveli Suite", propertyType: "villa",
    location: { city: "Udaipur", state: "Rajasthan" },
    pricing: { basePrice: 4500, priceType: "per_night" },
    ratings: { average: 5.0, count: 22 },
    amenities: ["wifi", "ac", "parking"],
    roomInfo: { availableRooms: 1, bathrooms: 2, areaSqFt: 600 },
  },
  {
    _id: "8", title: "Furnished Room in HSR Layout", propertyType: "room",
    location: { city: "Bangalore", state: "Karnataka" },
    pricing: { basePrice: 9500, priceType: "per_month" },
    ratings: { average: 4.4, count: 9 },
    amenities: ["wifi", "ac"],
    roomInfo: { availableRooms: 1, bathrooms: 1, areaSqFt: 200 },
  },
  {
    _id: "9", title: "Premium PG — Koregaon Park", propertyType: "pg",
    location: { city: "Pune", state: "Maharashtra" },
    pricing: { basePrice: 11000, priceType: "per_month" },
    ratings: { average: 4.6, count: 28 },
    amenities: ["wifi", "ac", "gym", "meals_included"],
    roomInfo: { availableRooms: 2, bathrooms: 2, areaSqFt: 180 },
  },
];

export const INIT_REQUESTS = [
  {
    _id: "r1", tenant: { fullName: "Priya Sharma" },
    property: { title: "Sunlit Studio in Malviya Nagar" },
    checkIn: "2025-08-01", checkOut: "2025-08-31",
    guests: { adults: 1 }, bookingType: "per_month",
    priceBreakdown: { totalAmount: 12000 }, status: "pending",
  },
  {
    _id: "r2", tenant: { fullName: "Rahul Mehta" },
    property: { title: "Heritage Haveli Suite" },
    checkIn: "2025-07-15", checkOut: "2025-07-18",
    guests: { adults: 2 }, bookingType: "per_night",
    priceBreakdown: { totalAmount: 13500 }, status: "pending",
  },
  {
    _id: "r3", tenant: { fullName: "Ananya Krishnamurthy" },
    property: { title: "Sunlit Studio in Malviya Nagar" },
    checkIn: "2025-07-01", checkOut: "2025-07-31",
    guests: { adults: 1 }, bookingType: "per_month",
    priceBreakdown: { totalAmount: 12000 }, status: "confirmed",
  },
  {
    _id: "r4", tenant: { fullName: "Karan Singh" },
    property: { title: "Heritage Haveli Suite" },
    checkIn: "2025-06-10", checkOut: "2025-06-12",
    guests: { adults: 2 }, bookingType: "per_night",
    priceBreakdown: { totalAmount: 9000 }, status: "completed",
  },
];
