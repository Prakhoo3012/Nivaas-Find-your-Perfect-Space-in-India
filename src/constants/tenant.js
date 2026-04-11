// ── Tenant mock bookings ──────────────────────────────────────
export const TENANT_BOOKINGS = [
  {
    _id: "b1",
    property: {
      _id: "1",
      title: "Sunlit Studio in Malviya Nagar",
      propertyType: "flat",
      location: { city: "Jaipur", state: "Rajasthan" },
      pricing: { basePrice: 12000, priceType: "per_month" },
      owner: { fullName: "Anjali Mehra", initials: "AM" },
    },
    checkIn:  "2025-08-01",
    checkOut: "2025-08-31",
    guests: { adults: 1 },
    status: "confirmed",
    priceBreakdown: { baseAmount: 12000, cleaningFee: 0, totalAmount: 12000 },
    bookingType: "per_month",
  },
  {
    _id: "b2",
    property: {
      _id: "7",
      title: "Heritage Haveli Suite",
      propertyType: "villa",
      location: { city: "Udaipur", state: "Rajasthan" },
      pricing: { basePrice: 4500, priceType: "per_night" },
      owner: { fullName: "Vikram Rathore", initials: "VR" },
    },
    checkIn:  "2025-07-15",
    checkOut: "2025-07-18",
    guests: { adults: 2 },
    status: "completed",
    priceBreakdown: { baseAmount: 13500, cleaningFee: 500, totalAmount: 14000 },
    bookingType: "per_night",
    review: { rating: 5, text: "Absolutely stunning property. Vikram was a wonderful host!", date: "Jul 2025" },
  },
  {
    _id: "b3",
    property: {
      _id: "9",
      title: "Premium PG — Koregaon Park",
      propertyType: "pg",
      location: { city: "Pune", state: "Maharashtra" },
      pricing: { basePrice: 11000, priceType: "per_month" },
      owner: { fullName: "Sneha Patel", initials: "SP" },
    },
    checkIn:  "2025-09-01",
    checkOut: "2025-11-30",
    guests: { adults: 1 },
    status: "pending",
    priceBreakdown: { baseAmount: 33000, cleaningFee: 0, totalAmount: 33000 },
    bookingType: "per_month",
  },
  {
    _id: "b4",
    property: {
      _id: "4",
      title: "Sea-facing Room, South Goa",
      propertyType: "room",
      location: { city: "Goa", state: "Goa" },
      pricing: { basePrice: 3200, priceType: "per_night" },
      owner: { fullName: "Rajan D'Souza", initials: "RD" },
    },
    checkIn:  "2025-06-01",
    checkOut: "2025-06-05",
    guests: { adults: 2 },
    status: "cancelled",
    priceBreakdown: { baseAmount: 12800, cleaningFee: 300, totalAmount: 13100 },
    bookingType: "per_night",
  },
];

// ── Tenant wishlist ───────────────────────────────────────────
export const TENANT_WISHLIST = [
  {
    _id: "3",
    title: "Spacious 2BHK with Garden View",
    propertyType: "flat",
    location: { city: "Bangalore", state: "Karnataka" },
    pricing: { basePrice: 22000, priceType: "per_month" },
    ratings: { average: 4.9, count: 47 },
    amenities: ["wifi", "ac", "gym", "parking"],
    roomInfo: { areaSqFt: 950 },
  },
  {
    _id: "6",
    title: "Hill-view Studio, Old Manali",
    propertyType: "room",
    location: { city: "Manali", state: "Himachal" },
    pricing: { basePrice: 1800, priceType: "per_night" },
    ratings: { average: 4.6, count: 61 },
    amenities: ["wifi", "hot_water"],
    roomInfo: { areaSqFt: 220 },
    isNew: true,
  },
  {
    _id: "5",
    title: "Minimalist Hostel — Lower Parel",
    propertyType: "hostel",
    location: { city: "Mumbai", state: "Maharashtra" },
    pricing: { basePrice: 6000, priceType: "per_month" },
    ratings: { average: 4.1, count: 14 },
    amenities: ["wifi", "laundry"],
    roomInfo: { areaSqFt: 80 },
  },
];

// ── Tenant notifications ──────────────────────────────────────
export const TENANT_NOTIFICATIONS = [
  { _id: "n1", type: "booking",  title: "Booking confirmed!",          desc: "Your stay at Sunlit Studio in Malviya Nagar has been confirmed by the owner.", time: "2h ago",  unread: true  },
  { _id: "n2", type: "payment",  title: "Payment due in 3 days",       desc: "₹12,000 due for Sunlit Studio — Aug 2025. Pay before Aug 1st to avoid cancellation.", time: "5h ago",  unread: true  },
  { _id: "n3", type: "message",  title: "New message from Anjali Mehra",desc: "Hi! The keys will be handed over on Aug 1st between 10am–1pm. Let me know if this works.", time: "1d ago",  unread: true  },
  { _id: "n4", type: "alert",    title: "Review your past stay",        desc: "How was Heritage Haveli Suite? Leave a review to help other travellers.", time: "3d ago",  unread: false },
  { _id: "n5", type: "system",   title: "Profile 80% complete",         desc: "Add your Aadhaar number and profile photo to get verified badge.", time: "5d ago",  unread: false },
  { _id: "n6", type: "booking",  title: "Booking request sent",         desc: "Your request for Premium PG Koregaon Park is under review.", time: "1w ago",  unread: false },
];

// ── Tenant profile ────────────────────────────────────────────
export const TENANT_PROFILE = {
  fullName:  "Arjun Kumar",
  username:  "arjun_k",
  email:     "arjun.kumar@example.com",
  phone:     "+91 98765 43210",
  city:      "Jaipur",
  state:     "Rajasthan",
  about:     "Software engineer looking for a cozy flat near city centre. I'm a quiet, responsible tenant.",
  verified:  true,
  joinedDate:"Jan 2024",
  initials:  "AK",
  stats: { totalBookings: 4, completed: 1, wishlistCount: 3, reviewsGiven: 1 },
};
