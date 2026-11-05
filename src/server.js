require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/database");

const startServer = async () => {
  try {
    // Connect Database first
    await connectDB();

    // Start Express Server
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();