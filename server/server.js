require("dotenv").config();
const webpush = require("web-push");
webpush.setVapidDetails(
  "mailto:admin@plantcare.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY,
);

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// connect to DB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // parse JSON requests

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/plants", require("./routes/plantRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/feedback", require("./routes/feedbackRoutes"));
app.use("/api/push", require("./routes/pushRoutes"));

const { startReminderCron } = require("./cron/reminderJobs");
startReminderCron();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
