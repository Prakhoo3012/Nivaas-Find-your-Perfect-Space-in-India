import mongoose from "mongoose";
import { FURNISHING_STATUS, GENDER, NEARBY_PLACES, PRICE_TYPE, PROPERTY_TYPE, AVAILABILITY_STATUS, AMENITIES } from "../constants.js";

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    description: {
      type: String,
      required: [true, "Description is required"],
    },

    // ─── Pricing ───────────────────────────────────────────
    pricing: {
      basePrice: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price cannot be negative"],
      },
      priceType: {
        type: String,
        enum: PRICE_TYPE,
        default: "per_month",
      },
      securityDeposit: {
        type: Number,
        default: 0,
      },
      maintenanceCharges: {
        type: Number,
        default: 0,
      },
    },

    // ─── Property Details ───────────────────────────────────
    propertyType: {
      type: String,
      enum: PROPERTY_TYPE,
      required: [true, "Property type is required"],
    },

    furnishingStatus: {
      type: String,
      enum: FURNISHING_STATUS,
      default: "unfurnished",
    },

    gender: {
      type: String,
      enum: GENDER,
      default: "any",
    },

    // ─── Room Info ──────────────────────────────────────────
    roomInfo: {
      totalRooms: { type: Number, default: 1 },
      availableRooms: { type: Number, default: 1 },
      bathrooms: { type: Number, default: 1 },
      balcony: { type: Boolean, default: false },
      floorNumber: { type: Number, default: 0 },
      totalFloors: { type: Number, default: 1 },
      areaSqFt: { type: Number },
    },

    // ─── Location ───────────────────────────────────────────
    location: {
      address: { 
        type: String, 
        required: true, 
      },
      city: { 
        type: String, 
        required: true
       },
      state: { 
        type: String, 
        required: true 
      },
      country: { 
        type: String, 
        required: true, 
        default: "India" 
      },
      pincode: { 
        type: String, 
        required: true
      },
      landmark: { 
        type: String 
      },
      coordinates: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number] }, // [lng, lat]
      },
    },

    // ─── Images ─────────────────────────────────────────────
    images: [
        {
            url: String,
            public_id: String,
        }
    ],

    // ─── Amenities ──────────────────────────────────────────
    amenities: {
      type: [String],
      enum: AMENITIES,
      default: [],
    },

    // ─── Rules ──────────────────────────────────────────────
    rules: {
      petsAllowed: { type: Boolean, default: false },
      smokingAllowed: { type: Boolean, default: false },
      alcoholAllowed: { type: Boolean, default: false },
      guestsAllowed: { type: Boolean, default: true },
      additionalRules: [{ type: String }],
    },

    // ─── Nearby Places ──────────────────────────────────────
    nearbyPlaces: [
      {
        name: { type: String },
        type: {
          type: String,
          enum: NEARBY_PLACES,
        },
        distanceInKm: { type: Number },
      },
    ],

    // ─── Availability ───────────────────────────────────────
    availability: {
      isAvailable: { type: Boolean, default: true },
      availableFrom: { type: Date, default: Date.now },
      minimumStay: { type: Number, default: 1 }, // in months
      maximumStay: { type: Number },             // in months
    },

    // ─── Ratings (cached values) ─────────────────────────────
    ratings: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },

    // ─── Status ─────────────────────────────────────────────
    status: {
      type: String,
      enum: AVAILABILITY_STATUS,
      default: "active",
    },

    // ─── Owner ──────────────────────────────────────────────
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Indexes ─────────────────────────────────────────────────
propertySchema.index({ "location.coordinates": "2dsphere" });
propertySchema.index({ "location.city": 1, status: 1, "pricing.basePrice": 1 });
propertySchema.index({ propertyType: 1, status: 1 });
propertySchema.index({ owner: 1 });

export const Property = mongoose.model("Property", propertySchema);
export default Property;