const User = require("../models/user.model");
const mongoose = require("mongoose");

const getPendingUsers = async () => {
  try {
    // 1. ค้นหาสมาชิกที่รอการอนุมัติ
    const users = await User.find({
      approvalStatus: "pending",
    })
      .select("-password")
      .sort({ createdAt: -1 });

    // 2. ส่งข้อมูลกลับ
    return users;

  } catch (error) {
    throw error;
  }
};

const updateUserApproval = async (userId, approvalStatus) => {
  try {
    // 1. ตรวจสอบรูปแบบ MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      const error = new Error("User ID ไม่ถูกต้อง");
      error.statusCode = 400;
      throw error;
    }

    // 2. ตรวจสอบสถานะที่อนุญาตให้อัปเดต
    if (!["approved", "rejected"].includes(approvalStatus)) {
      const error = new Error("สถานะการอนุมัติไม่ถูกต้อง");
      error.statusCode = 400;
      throw error;
    }

    // 3. ค้นหา User
    const user = await User.findById(userId);

    if (!user) {
      const error = new Error("ไม่พบสมาชิกที่ต้องการ");
      error.statusCode = 404;
      throw error;
    }

    // 4. ตรวจสอบว่าสมาชิกยังรออนุมัติหรือไม่
    if (user.approvalStatus !== "pending") {
      const error = new Error("สมาชิกนี้ได้รับการพิจารณาแล้ว");
      error.statusCode = 409;
      throw error;
    }

    // 5. อัปเดตสถานะ
    user.approvalStatus = approvalStatus;
    await user.save();

    // 6. ส่งข้อมูลกลับ
    return {
      id: user._id,
      username: user.username,
      role: user.role,
      approvalStatus: user.approvalStatus,
    };

  } catch (error) {
    throw error;
  }
};

// อนุมัติสมาชิก
const approveUser = async (userId) => {
  return await updateUserApproval(userId, "approved");
};

// ปฏิเสธสมาชิก
const rejectUser = async (userId) => {
  return await updateUserApproval(userId, "rejected");
};


module.exports = {
  getPendingUsers,
  approveUser,
  rejectUser
};