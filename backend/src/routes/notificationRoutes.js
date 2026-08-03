const express = require("express");
const { list, markRead } = require("../controllers/notificationController");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

router.get("/", authenticate, list);
router.patch("/:id/read", authenticate, markRead);

module.exports = router;
