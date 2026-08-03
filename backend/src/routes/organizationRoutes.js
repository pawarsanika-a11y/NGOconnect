const express = require("express");
const { list, getById, update } = require("../controllers/organizationController");
const { authenticate, requireRole } = require("../middleware/auth");

const router = express.Router();

router.get("/", list);
router.get("/:id", getById);
router.patch("/:id", authenticate, requireRole("ORGANIZATION", "ADMIN"), update);

module.exports = router;
