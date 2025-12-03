const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
// const session = require("express-session");
const mongoose = require("mongoose");

const tasksRouter = require("./routes/tasks");
const classesRouter = require("./routes/classes");
const settingsRouter = require("./routes/settings");
const registerRouter = require("./routes/register");
const loginRouter = require("./routes/login");
const dashboardRouter = require("./routes/dashboard");
const profileRouter = require("./routes/profile");
const aiRouter = require("./routes/ai");
const accountRouter = require("./routes/account");
const authMiddleware = require("./middleware/auth");

dotenv.config();
const app = express();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

// Connect to DB only when server starts (not during tests)
if (require.main === module) {
  connectDB();
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/tasks", tasksRouter);
app.use("/api/classes", classesRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/register", registerRouter);
app.use("/api/login", loginRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/profile", profileRouter);
app.use("/api/ai", aiRouter);
app.use("/api/account", accountRouter);

app.use(express.static(path.join(__dirname, "../front-end/build")));
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../front-end/build", "index.html"));
});

const PORT = process.env.PORT || 5001;

if (require.main === module) {
  app.listen(PORT, () =>
    console.log(`✅ Server running on http://localhost:${PORT}`)
  );
}

module.exports = app;
