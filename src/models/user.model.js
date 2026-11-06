const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      // ห้ามซ้ำ
      unique: true,
      // ลบช่องว่างหน้าหลัง
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },

    role: {
        type: String,
        // เป็นได้แค่ 1 สิทธิ์
        enum: ["user", "owner", "admin"],
        default: "user",
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
