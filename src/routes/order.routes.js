const express = require("express");
const router = express.Router();

const orderController = require("../controllers/order.controller");
const { authenticate } = require("../middlewares/auth.middleware");

//* สร้างคำสั่งซื้อสินค้า
router.post(
    "/products/:id/orders",
    authenticate,
    orderController.createOrder
);

//* ดึงรายการ Order ของสินค้า
router.get(
    "/products/:id/orders",
    authenticate,
    orderController.getProductOrders
);

// ดูรายการ Order ทั้งหมดของผู้ใช้งาน
router.get(
  "/orders",
  authenticate,
  orderController.getAllOrders
);

module.exports = router;