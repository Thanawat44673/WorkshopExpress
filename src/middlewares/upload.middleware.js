const multer = require("multer");

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
  // Keep the upload in memory until the controller has validated and saved
  // the product. Invalid requests must not leave files in the uploads folder.
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// 6. Export
module.exports = upload;
