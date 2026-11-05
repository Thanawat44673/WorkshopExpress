const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const authenticate = async (req, res, next) => {
  try {
    // 1. ตรวจสอบว่ามี Authorization Header หรือไม่
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "กรุณาเข้าสู่ระบบก่อนใช้งาน",
      });
    }

    // 2. แยก JWT Token ออกจาก Bearer
    const token = authHeader.split(" ")[1];

    // 3. ตรวจสอบความถูกต้องของ JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // 4. ค้นหาผู้ใช้งานใน MongoDB
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "ไม่พบข้อมูลผู้ใช้งาน",
      });
    }

    // 5. ตรวจสอบสถานะการอนุมัติอีกครั้ง
    if (user.approvalStatus !== "approved") {
      return res.status(403).json({
        success: false,
        message: "บัญชีของคุณไม่ได้รับอนุญาตให้ใช้งาน",
      });
    }

    // 6. เก็บข้อมูลผู้ใช้งานไว้ใน Request
    req.user = {
      id: user._id,
      username: user.username,
      role: user.role,
      approvalStatus: user.approvalStatus,
    };

    // 7. อนุญาตให้ทำงานต่อ
    next();

  } catch (error) {
    console.error("Authentication Error:", error);

    // Token หมดอายุ
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token หมดอายุ กรุณาเข้าสู่ระบบใหม่",
      });
    }

    // Token ไม่ถูกต้อง
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Token ไม่ถูกต้อง",
      });
    }

    return res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์",
    });
  }
};

module.exports = {
  authenticate,
};
