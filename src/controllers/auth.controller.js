const authService = require("../services/auth.service");

// Register Controller
const register = async (req, res, next) => {
  try {
    // 1. รับข้อมูลจาก Request Body
    const { username, password } = req.body;

    // 2. เรียกใช้งาน Auth Service
    const newUser = await authService.registerUser({
      username,
      password,
    });

    // 3. ส่ง Response เมื่อสมัครสมาชิกสำเร็จ
    return res.status(201).json({
      success: true,
      message: "สมัครสมาชิกสำเร็จ กรุณารอ Admin อนุมัติ",
      data: newUser,
    });

  } catch (error) {
    // 4. จัดการ Error
    console.error("Register Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก",
    });
  }
};

module.exports = {
  register,
};
