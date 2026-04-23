import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
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

    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: [true, "Booking is required"],
    },

    // ─── Ratings ───────────────────────────────────────────
    ratings: {
      overall:     { type: Number, required: [true, "Overall rating is required"], min: 1, max: 5 },
      cleanliness: { type: Number, min: 1, max: 5 },
      location:    { type: Number, min: 1, max: 5 },
      value:       { type: Number, min: 1, max: 5 },
      amenities:   { type: Number, min: 1, max: 5 },
      owner:       { type: Number, min: 1, max: 5 }, // how helpful was the owner
    },

    // ─── Review Content ────────────────────────────────────
    comment: {
      type: String,
      required: [true, "Review comment is required"],
      trim: true,
      minlength: [10, "Comment must be at least 10 characters"],
      maxlength: [1000, "Comment cannot exceed 1000 characters"],
    },

    // ─── Owner Reply ───────────────────────────────────────
    ownerReply: {
      comment:     { type: String, trim: true, maxlength: [500, "Reply cannot exceed 500 characters"] },
      repliedAt:   { type: Date },
    },

    // ─── Status ────────────────────────────────────────────
    status: {
      type: String,
      enum: ["active", "deleted", "flagged"],
      default: "active",
    },

    // ─── Helpful Votes ─────────────────────────────────────
    helpfulVotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// ─── Indexes ──────────────────────────────────────────────────
reviewSchema.index({ property: 1, status: 1 });
reviewSchema.index({ tenant: 1 });
reviewSchema.index({ booking: 1 }, { unique: true }); // one review per booking only
reviewSchema.index({ "ratings.overall": -1 });

// ─── Pre Save Middleware ───────────────────────────────────────

// auto set repliedAt when owner adds a reply
reviewSchema.pre("save", function (next) {
  if (this.isModified("ownerReply.comment") && this.ownerReply.comment) {
    this.ownerReply.repliedAt = new Date();
  }
  next();
});

// ─── Post Save Middleware ──────────────────────────────────────

// auto update property ratings after review is saved
reviewSchema.post("save", async function () {
  const result = await mongoose.model("Review").aggregate([
    {
      $match: {
        property: this.property,
        status: "active",
      },
    },
    {
      $group: {
        _id: "$property",
        averageRating: { $avg: "$ratings.overall" },
        count: { $sum: 1 },
      },
    },
  ]);

  if (result.length > 0) {
    await mongoose.model("Property").findByIdAndUpdate(this.property, {
      "ratings.average": result[0].averageRating.toFixed(1),
      "ratings.count":   result[0].count,
    });
  }
});

const Review = mongoose.model("Review", reviewSchema);
export default Review;