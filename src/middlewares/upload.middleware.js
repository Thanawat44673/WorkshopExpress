const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 1. กำหนดตำแหน่งจัดเก็บรูปภาพ
const uploadDir = path.join(__dirname, "../uploads/products");

// 2. สร้าง Folder อัตโนมัติหากยังไม่มี
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 3. กำหนด Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname).toLowerCase();

    cb(null, uniqueName);
  },
});

// 4. ตรวจสอบประเภทไฟล์
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("รองรับเฉพาะไฟล์ JPG, PNG และ WEBP"));
  }
};

// 5. กำหนดข้อจำกัด
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// 6. Export
module.exports = upload;
