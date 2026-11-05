
const express = require("express");
const cors = require("cors");

const User = require("./models/user.model");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test User Schema
app.get("/api/v1/test/user-schema", (req, res) => {
  try {
    const schemaFields = Object.keys(User.schema.paths);

    return res.status(200).json({
      success: true,
      message: "User Schema created successfully",
      data: {
        // ตัวแสดงช้อมูลใน database 
        modelName: User.modelName,
        collectionName: User.collection.name,
        fields: schemaFields,
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User Schema test failed",
      error: error.message,
    });
  }
});

module.exports = app;