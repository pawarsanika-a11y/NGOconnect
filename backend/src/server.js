require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const { errorHandler } = require("./middleware/error");

const authRoutes = require("./routes/authRoutes");
const organizationRoutes = require("./routes/organizationRoutes");
const requirementRoutes = require("./routes/requirementRoutes");
const donationRoutes = require("./routes/donationRoutes");
const rewardRoutes = require("./routes/rewardRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const comparisonRoutes = require("./routes/comparisonRoutes");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => res.json({ status: "ok", service: "ngoconnect-api" }));

app.use("/api/auth", authRoutes);
app.use("/api/organizations", organizationRoutes);
// Nested: /api/organizations/:orgId/requirements
app.use("/api/organizations/:orgId/requirements", requirementRoutes);
// Standalone: /api/requirements/:id (update/delete/fulfill)
app.use("/api/requirements", requirementRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/rewards", rewardRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/comparisons", comparisonRoutes);

app.use((req, res) => res.status(404).json({ message: "Route not found" }));
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`NGOConnect API listening on http://localhost:${PORT}`);
});

module.exports = app;
