import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    // ─── Core References ───────────────────────────────────
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: [true, "Booking is required"],
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

    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: [true, "Property is required"],
    },

    // ─── Payment Info ──────────────────────────────────────
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },

    currency: {
      type: String,
      default: "INR",
    },

    method: {
      type: String,
      enum: ["upi", "card", "netbanking", "wallet", "cash"],
      required: [true, "Payment method is required"],
    },

    // ─── Payment Type ──────────────────────────────────────
    paymentType: {
      type: String,
      enum: [
        "booking_payment",    // initial booking amount
        "security_deposit",   // refundable deposit
        "maintenance",        // monthly maintenance
        "refund",             // refund to tenant
      ],
      required: [true, "Payment type is required"],
    },

    // ─── Status ────────────────────────────────────────────
    status: {
      type: String,
      enum: ["pending", "success", "failed", "refunded"],
      default: "pending",
    },

    // ─── Gateway Info ──────────────────────────────────────
    gateway: {
      name: {
        type: String,
        enum: ["razorpay", "stripe", "manual"],
        default: "razorpay",
      },
      transactionId:  { type: String },  // gateway's transaction id
      orderId:        { type: String },  // razorpay order id
      paymentId:      { type: String },  // razorpay payment id
      signature:      { type: String },  // razorpay signature for verification
      gatewayResponse:{ type: mongoose.Schema.Types.Mixed }, // raw response from gateway
    },

    // ─── Refund Info ───────────────────────────────────────
    refund: {
      refundId:     { type: String },   // gateway refund id
      refundAmount: { type: Number },
      refundedAt:   { type: Date },
      reason:       { type: String },
    },

    // ─── Timestamps ────────────────────────────────────────
    paidAt:     { type: Date },
    failedAt:   { type: Date },
  },
  {
    timestamps: true,
  }
);

// ─── Indexes ──────────────────────────────────────────────────
paymentSchema.index({ booking: 1 });
paymentSchema.index({ tenant: 1, status: 1 });
paymentSchema.index({ owner: 1, status: 1 });
paymentSchema.index({ "gateway.transactionId": 1 });
paymentSchema.index({ "gateway.orderId": 1 });
paymentSchema.index({ status: 1, createdAt: -1 });

// ─── Pre Save Middleware ───────────────────────────────────────

// auto set paidAt and failedAt when status changes
paymentSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    if (this.status === "success") this.paidAt = new Date();
    if (this.status === "failed")  this.failedAt = new Date();
  }
  next();
});

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;