const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 20,
      select: false,
    },

    role: {
        type: String,
        enum: ["owner", "admin"],
        default: "owner",
    },

    approvalStatus: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
