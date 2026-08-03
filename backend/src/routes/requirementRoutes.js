const express = require("express");
const { body } = require("express-validator");
const { list, create, update, remove, markFulfilled } = require("../controllers/requirementController");
const { authenticate, requireRole } = require("../middleware/auth");
const { handleValidation } = require("../middleware/validate");

// Mounted twice: at /api/organizations/:orgId/requirements (list/create)
// and /api/requirements/:id (update/delete/fulfill). mergeParams lets the
// nested router read :orgId.
const router = express.Router({ mergeParams: true });

router.get("/", list);

router.post(
  "/",
  authenticate,
  requireRole("ORGANIZATION"),
  [
    body("itemName").trim().notEmpty(),
    body("category").trim().notEmpty(),
    body("requiredQty").isInt({ min: 1 }),
    body("unit").trim().notEmpty(),
    body("priority").optional().isIn(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  ],
  handleValidation,
  create
);

router.patch("/:id", authenticate, requireRole("ORGANIZATION"), update);
router.delete("/:id", authenticate, requireRole("ORGANIZATION"), remove);
router.patch("/:id/fulfill", authenticate, requireRole("ORGANIZATION"), markFulfilled);

module.exports = router;
