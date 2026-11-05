const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload.middleware");

// Controllers
const productController = require("../controllers/product.controller");

// Middlewares
const { authenticate } = require("../middlewares/auth.middleware");
const {
  authorizeOwnerOrAdmin,
} = require("../middlewares/role.middleware");

// ========================================
// Product Routes
// ========================================

// GET: แสดงสินค้าทั้งหมด
router.get(
  "/",
  authenticate,
  productController.getAllProducts
);

// GET: ดูรายละเอียดสินค้า
router.get(
  "/:id",
  authenticate,
  productController.getProductById
);

// POST: เพิ่มสินค้า
router.post(
  "/",
  authenticate,
  authorizeOwnerOrAdmin,
  upload.single("image"),
  productController.createProduct
);

// PUT: แก้ไขสินค้า
router.put(
  "/:id",
  authenticate,
  authorizeOwnerOrAdmin,
  upload.single("image"),
  productController.updateProduct
);

// DELETE: ลบสินค้า
router.delete(
  "/:id",
  authenticate,
  authorizeOwnerOrAdmin,
  productController.deleteProduct
);

module.exports = router;