const express = require("express");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/auth.routes")
const userRoutes = require("./routes/user.routes")
const productRoutes = require("./routes/product.routes")
const orderRoutes = require("./routes/order.routes")


const app = express();

// Middleware
app.use(cors());    
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use('/api/v1', authRoutes, orderRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);


module.exports = app;
