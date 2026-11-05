const express = require('express');
const router = express.Router();

const { register, login } = require('../controllers/auth.controller');

// Register
router.post('/register', register);
router.post('/login', login);

const { authenticate } = require("../middlewares/auth.middleware");

// Test Authentication
router.get("/test-auth", authenticate, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "ยืนยันตัวตนสำเร็จ",
    data: req.user,
  });
});

module.exports = router;
