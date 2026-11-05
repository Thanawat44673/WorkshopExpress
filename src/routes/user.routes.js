const express = require("express");
const router = express.Router();

const userRouter = require("../controllers/user.controller");

const { authenticate } = require("../middlewares/auth.middleware");
const { authorizeRoles } = require("../middlewares/role.middleware");

// ดูรายชื่อสมาชิกที่รออนุมัติ
router.get(
  "/pending",
  authenticate,
  authorizeRoles("admin"),
  userRouter.getPendingUsers
);

// อนุมัติสมาชิก
router.put(
  "/:id/approve",
  authenticate,
  authorizeRoles("admin"),
  userRouter.approveUser
);

// ปฏิเสธสมาชิก
router.put(
  "/:id/reject",
  authenticate,
  authorizeRoles("admin"),
  userRouter.rejectUser
);

module.exports = router;
