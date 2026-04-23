import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    // ─── Core References ───────────────────────────────────
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: [true, "Property is required"],
    },

    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Tenant is required"],
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner is required"],
    },

    // ─── Booking Type ──────────────────────────────────────
    bookingType: {
      type: String,
      enum: ["per_night", "per_day", "per_month"],
      required: [true, "Booking type is required"],
    },

    // ─── Booking Dates ─────────────────────────────────────
    checkIn: {
      type: Date,
      required: [true, "Check-in date is required"],
    },

    checkOut: {
      type: Date,
      required: [true, "Check-out date is required"],
    },

    // ─── Guests ────────────────────────────────────────────
    guests: {
      adults:   { type: Number, default: 1, min: 1 },
      children: { type: Number, default: 0 },
    },

    // ─── Price Breakdown ───────────────────────────────────
    priceBreakdown: {
      basePrice:          { type: Number, required: [true, "Base price is required"] },
      numberOfNights:     { type: Number },  // used when bookingType is per_night / per_day
      numberOfMonths:     { type: Number },  // used when bookingType is per_month
      securityDeposit:    { type: Number, default: 0 },
      maintenanceCharges: { type: Number, default: 0 },
      discount:           { type: Number, default: 0 },
      totalAmount:        { type: Number, required: [true, "Total amount is required"] },
    },

    // ─── Status ────────────────────────────────────────────
    status: {
      type: String,
      enum: ["pending", "confirmed", "payment_done", "cancelled", "completed", "rejected", "expired"],
      default: "pending",
    },

    // ─── Payment Status ────────────────────────────────────
    paymentStatus: {
      type: String,
      enum: ["unpaid", "partially_paid", "paid", "refunded"],
      default: "unpaid",
    },

    // ─── Cancellation ──────────────────────────────────────
    cancellation: {
      cancelledAt:  { type: Date },
      cancelledBy:  { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      reason:       { type: String },
      refundAmount: { type: Number, default: 0 },
      refundStatus: {
        type: String,
        enum: ["pending", "processed", "failed"],
      },
    },

    // ─── Special Requests ──────────────────────────────────
    specialRequests: {
      type: String,
      maxlength: [500, "Special requests cannot exceed 500 characters"],
    },

    // ─── Timestamps ────────────────────────────────────────
    confirmedAt: { type: Date },
    completedAt: { type: Date },
    expiresAt:   { type: Date }, // auto expire if not paid within time
  },
  {
    timestamps: true,
  }
);

// ─── Indexes ──────────────────────────────────────────────────
bookingSchema.index({ property: 1, status: 1 });
bookingSchema.index({ tenant: 1, status: 1 });
bookingSchema.index({ owner: 1, status: 1 });
bookingSchema.index({ checkIn: 1, checkOut: 1 });
bookingSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL — auto deletes expired unpaid bookings

// ─── Pre Save Middleware ───────────────────────────────────────

// checkOut must be after checkIn
bookingSchema.pre("save", function (next) {
  if (this.checkOut <= this.checkIn) {
    return new Error("Check-out date must be after check-in date");
  }
});

// auto set confirmedAt and completedAt when status changes
bookingSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    if (this.status === "confirmed") this.confirmedAt = new Date();
    if (this.status === "completed") this.completedAt = new Date();
  }
});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;