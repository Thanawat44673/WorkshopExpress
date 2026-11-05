const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 401,
        message: "กรุณาเข้าสู่ระบบก่อนใช้งาน",
        data: {}
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        status: 403,
        message: "คุณไม่มีสิทธิ์ดำเนินการนี้",
        data: {}
      });
    }

    return next();
  } catch (error) {
    // console.error("Role Middleware Error:", error);

    return res.status(500).json({
      status: 500,
        message: "คุณไม่มีสิทธิ์ดำเนินการนี้",
        data: {}
    });
  }
};

module.exports = {
  authorizeRoles,
};
