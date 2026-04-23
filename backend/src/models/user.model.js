import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { USER_ROLE } from "../constants.js";

const userSchema = new mongoose.Schema({
    // ─── Basic Info ────────────────────────────────────────
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    username: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      index: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      unique: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
    },

    // ─── Profile ───────────────────────────────────────────
    avatar: {
      type: String, // Cloudinary URL
      default: null,
    },

    // ─── Role ──────────────────────────────────────────────
    role: {
      type: String,
      enum: USER_ROLE,
      default: "tenant",
    },

    // ─── Account Status ────────────────────────────────────
    isVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // ─── Auth Tokens ───────────────────────────────────────
    refreshToken: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  });

userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
})

// ─── Methods ─────────────────────────────────────────────────

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function() {
    
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName,
            role: this.role, // added role in token payload
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    )
}

export const User = mongoose.model("User", userSchema);



/*
export const isOwner = (req, res, next) => {
  if (req.user.role !== "owner") {
    return res.status(403).json({ message: "Only owners can perform this action" });
  }
  next();
};

// usage in route
router.post("/create", protect, isOwner, createProperty);
*/