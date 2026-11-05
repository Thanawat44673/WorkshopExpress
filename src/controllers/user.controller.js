const userService = require("../services/user.service");

// Get Pending Users Controller
const getPendingUsers = async (req, res) => {
  try {
    // 1. เรียก Service เพื่อดึงสมาชิกที่รออนุมัติ
    const users = await userService.getPendingUsers();

    // 2. ส่ง Response กลับ
    return res.status(200).json({
      success: true,
      message: "ดึงรายชื่อสมาชิกที่รออนุมัติสำเร็จ",
      data: users,
    });

  } catch (error) {
    // console.error("Get Pending Users Error:", error);

    return res.status(error.statusCode || 500).json({
      status: error.statusCode || 500,
      message: error.message || "Internal server error", 
      data: {}
    });
  }
};

// Approve User Controller
const approveUser = async (req, res) => {
  try {
    // 1. รับ User ID จาก URL Parameters
    const { id } = req.params;

    // 2. เรียก Service เพื่ออนุมัติสมาชิก
    const user = await userService.approveUser(id);

    // 3. ส่ง Response กลับ
    return res.status(200).json({
      success: true,
      message: "อนุมัติสมาชิกสำเร็จ",
      data: user,
    });

  } catch (error) {
    // console.error("Approve User Error:", error);

    return res.status(error.statusCode || 500).json({
      status: error.statusCode || 500,
      message: error.message || "Internal server error", 
      data: {}
    });
  }
};

// Reject User Controller
const rejectUser = async (req, res) => {
  try {
    // 1. รับ User ID จาก URL Parameters
    const { id } = req.params;

    // 2. เรียก Service เพื่อปฏิเสธสมาชิก
    const user = await userService.rejectUser(id);

    // 3. ส่ง Response กลับ
    return res.status(200).json({
      success: true,
      message: "ปฏิเสธสมาชิกสำเร็จ",
      data: user,
    });

  } catch (error) {
    // console.error("Reject User Error:", error);

    return res.status(error.statusCode || 500).json({
      status: error.statusCode || 500,
      message: error.message || "Internal server error", 
      data: {}
    });
  }
};

module.exports = {
  getPendingUsers,
  approveUser,
  rejectUser,
};
