const bcrypt = require("bcrypt");
const User = require("../models/user.model");

const registerUser = async ({ username, password }) => {
  try {
    // 1. ตรวจสอบข้อมูลที่จำเป็น
    if (!username || !password) {
      throw new Error("กรุณากรอกข้อมูลให้ครบถ้วน");
    }

    // 2. ตรวจสอบความยาวรหัสผ่าน
    if (password.length < 8) {
      throw new Error("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร");
    }

    // 3. ตรวจสอบ username และ email ซ้ำ
    const existingUser = await User.findOne({
        username: username.trim()
    });

    if (existingUser) {
      throw new Error("Username นี้ถูกใช้งานแล้ว");
    }

    // 4. เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. สร้างสมาชิกใหม่
    const newUser = await User.create({
      username: username.trim(),
      password: hashedPassword,
      role: "user",
      approvalStatus: "pending",
    });

    // 6. ส่งข้อมูลกลับ
    return {
      id: newUser._id,
      username: newUser.username,
      role: newUser.role,
      approvalStatus: newUser.approvalStatus,
    };

  } catch (error) {
    // ส่ง Error กลับไปให้ Controller จัดการ
    throw error;
  }
};

module.exports = {
  registerUser,
};