const express = require("express");
const router = express.Router();

const {
  getPendingUsers,
  approveUser,
  rejectUser,
} = require("../controllers/user.controller");

const { authenticate } = require("../middlewares/auth.middleware");
const { authorizeAdmin } = require("../middlewares/admin.middleware");

// ดูรายชื่อสมาชิกที่รออนุมัติ
router.get(
  "/pending",
  authenticate,
  authorizeAdmin,
  getPendingUsers
);

// อนุมัติสมาชิก
router.put(
  "/:id/approve",
  authenticate,
  authorizeAdmin,
  approveUser
);

// ปฏิเสธสมาชิก
router.put(
  "/:id/reject",
  authenticate,
  authorizeAdmin,
  rejectUser
);

module.exports = router;
