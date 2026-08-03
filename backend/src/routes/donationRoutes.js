const express = require("express");
const { body } = require("express-validator");
const { create, list, approve, reject, complete } = require("../controllers/donationController");
const { authenticate, requireRole } = require("../middleware/auth");
const { handleValidation } = require("../middleware/validate");

const router = express.Router();

router.get("/", authenticate, list);

router.post(
  "/",
  authenticate,
  requireRole("DONOR"),
  [
    body("organizationId").notEmpty(),
    body("items").isArray({ min: 1 }).withMessage("At least one item is required"),
  ],
  handleValidation,
  create
);

router.patch("/:id/approve", authenticate, requireRole("ORGANIZATION"), approve);
router.patch("/:id/reject", authenticate, requireRole("ORGANIZATION"), reject);
router.patch("/:id/complete", authenticate, requireRole("ORGANIZATION"), complete);

module.exports = router;
