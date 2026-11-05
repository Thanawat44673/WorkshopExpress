const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes")
const userRoutes = require("./routes/user.routes")
const productRoutes = require("./routes/product.routes")


const app = express();

// Middleware
app.use(cors());    
app.use(express.json());

app.use('/api/v1', authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/product", productRoutes);


module.exports = app;