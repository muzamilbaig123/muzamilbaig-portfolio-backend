const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const express = require("express");
const cors = require("cors");
const { testConnection } = require("./config/db");

// Route files (har resource ki apni file)
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const skillRoutes = require("./routes/skillRoutes");
const experienceRoutes = require("./routes/experienceRoutes");
const messageRoutes = require("./routes/messageRoutes");

// JWT_SECRET ke baghair login/auth kaam nahi kar sakte, isliye foran rok do
if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is missing in .env. Server cannot start.");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());

app.get("/", async (req, res) => {
  try {
    await testConnection();
    res.status(200).json({ message: "API running", database: "connected" });
  } catch (err) {
    res.status(500).json({
      message: "API running",
      database: "disconnected",
      error: err.message,
    });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/messages", messageRoutes);

app.use((req, res) => {
  res
    .status(404)
    .json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Invalid JSON in request body" });
  }
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);

  try {
    await testConnection();
    console.log("MySQL connected");
  } catch (err) {
    console.error("MySQL connection failed:", err.message);
  }
});
