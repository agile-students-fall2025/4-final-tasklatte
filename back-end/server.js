const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const session = require("express-session");

const tasksRouter = require("./routes/tasks");
const settingsRouter = require("./routes/settings");
const registerRouter = require("./routes/register");
const loginRouter = require("./routes/login");
const dashboardRouter = require("./routes/dashboard");
const profileRouter = require("./routes/profile")
const aiRouter = require("./routes/ai");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use("/api/tasks", tasksRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/register", registerRouter);
app.use("/api/login", loginRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/profile", profileRouter);
app.use("/api/ai", aiRouter);

app.use(express.static(path.join(__dirname, "../front-end/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../front-end/build", "index.html"));
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));

module.exports = app;
