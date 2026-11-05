const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
// require("dotenv").config();

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


const loginUser = async ({ username, password }) => {
  try {
    // 1. ตรวจสอบข้อมูลที่จำเป็น
    if (!username || !password) {
      const error = new Error("กรุณากรอก Username และ Password");
      error.statusCode = 400;
      throw error;
    }

    // 2. ค้นหาผู้ใช้งานจาก Username
    const user = await User.findOne({
      username: username.trim(),
    }).select("+password");

    if (!user) {
      const error = new Error("Username หรือ Password ไม่ถูกต้อง");
      error.statusCode = 401;
      throw error;
    }

    // 3. ตรวจสอบ Password ด้วย bcrypt
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      const error = new Error("Username หรือ Password ไม่ถูกต้อง");
      error.statusCode = 401;
      throw error;
    }

    // 4. ตรวจสอบสถานะการอนุมัติ
    if (user.approvalStatus === "pending" || user.approvalStatus === "Rejected") {
      const error = new Error(
        user.approvalStatus === "pending"
          ? "บัญชีของคุณยังไม่ได้รับการอนุมัติจาก Admin"
          : "บัญชีของคุณถูกปฏิเสธ"
      );
      error.statusCode = 403;
      throw error;
    }

    // 5. ตรวจสอบ JWT Secret
    if (!process.env.JWT_SECRET) {
      throw new Error("ไม่พบ JWT_SECRET ใน Environment Variables");
    }

    // 6. สร้าง JWT Token
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // 7. ส่งข้อมูลกลับ
    return {
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        approvalStatus: user.approvalStatus,
      },
    };

  } catch (error) {
    // ส่ง Error กลับไปให้ Controller จัดการ
    throw error;
  }
};

module.exports = {
  registerUser,
  loginUser
};