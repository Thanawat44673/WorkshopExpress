const authorizeAdmin = (req, res, next) => {
  try {
    // 1. ตรวจสอบว่ามีข้อมูล User ผ่าน Authentication หรือไม่
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "กรุณาเข้าสู่ระบบก่อนใช้งาน",
      });
    }

    // 2. ตรวจสอบ Role ของผู้ใช้งาน
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "คุณไม่มีสิทธิ์เข้าถึงส่วนนี้",
      });
    }

    // 3. อนุญาตให้ Admin ทำงานต่อ
    next();

  } catch (error) {
    console.error("Admin Authorization Error:", error);

    return res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์ Admin",
    });
  }
};

module.exports = {
  authorizeAdmin,
};
