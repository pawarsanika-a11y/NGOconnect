const express = require("express");
const { create, list } = require("../controllers/comparisonController");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

router.get("/", authenticate, list);
router.post("/", authenticate, create);

module.exports = router;
