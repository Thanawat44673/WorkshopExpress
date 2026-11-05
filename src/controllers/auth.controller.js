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
      status: 201,
      message: "create success",
      data: {
        newUser,
      }
    });

  } catch (error) {
    // 4. จัดการ Error
    // console.error("Register Error:", error);

    return res.status(error.statusCode || 500).json({
      status: error.statusCode || 500,
      message: error.message || "Internal server error", 
      data: {}
    });
  }
};


// Login Controller
const login = async (req, res) => {
  try {
    // 1. รับข้อมูลจาก Request Body
    const { username, password } = req.body;

    // 2. เรียกใช้งาน Auth Service
    const data = await authService.loginUser({
      username,
      password,
    });

    // 3. ส่ง Response เมื่อเข้าสู่ระบบสำเร็จ
    return res.status(201).json({
      status: 201,
      message: "login success",
      data
    });

  } catch (error) {
    // 4. จัดการ Error
    // console.error("Login Error:", error);

    return res.status(error.statusCode || 500).json({
      status: error.statusCode || 500,
      message: error.message || "Internal server error", 
      data: {}
    });
  }
};


module.exports = {
  register,
  login
};
