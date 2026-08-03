const express = require("express");
const { myRewards } = require("../controllers/rewardController");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

router.get("/me", authenticate, myRewards);

module.exports = router;
