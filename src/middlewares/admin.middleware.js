const authorizeAdmin = (req, res, next) => {
  try {
    // 1. ตรวจสอบว่ามีข้อมูล User ผ่าน Authentication หรือไม่
    if (!req.user) {
      return res.status(401).json({
        status: 401,
        message: "กรุณาเข้าสู่ระบบก่อนใช้งาน",
        data: {}
      });
    }

    // 2. ตรวจสอบ Role ของผู้ใช้งาน
    if (req.user.role !== "admin") {
      return res.status(403).json({
        status: 401,
        message: "คุณไม่มีสิทธิ์เข้าถึงส่วนนี้",
        data: {}
      });
    }

    // 3. อนุญาตให้ Admin ทำงานต่อ
    next();

  } catch (error) {
    // console.error("Admin Authorization Error:", error);

    return res.status(500).json({
      status: 500,
      message: "เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์ Admin",
      data: {}
    });
  }
};

module.exports = {
  authorizeAdmin,
};
