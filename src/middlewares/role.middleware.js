const authorizeOwnerOrAdmin = (req, res, next) => {
  try {
    // ตรวจสอบว่ามีข้อมูล User จาก Authentication หรือไม่
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "กรุณาเข้าสู่ระบบก่อนใช้งาน",
      });
    }

    // ตรวจสอบ Role
    const allowedRoles = ["owner", "admin"];

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "คุณไม่มีสิทธิ์ดำเนินการนี้",
      });
    }

    next();

  } catch (error) {
    console.error("Role Middleware Error:", error);

    return res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์",
    });
  }
};

module.exports = {
  authorizeOwnerOrAdmin,
};