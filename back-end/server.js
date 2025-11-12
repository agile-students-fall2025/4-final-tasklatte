const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const tasksRouter = require("./routes/tasks");
const settingsRouter = require("./routes/settings");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/tasks", tasksRouter);
app.use("/api/settings", settingsRouter);

app.use(express.static(path.join(__dirname, "../front-end/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../front-end/build", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));

module.exports = app;
