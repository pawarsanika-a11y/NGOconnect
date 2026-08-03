const express = require("express");
const { body } = require("express-validator");
const { register, login, forgotPassword, me } = require("../controllers/authController");
const { handleValidation } = require("../middleware/validate");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("A valid email is required"),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
    body("role").optional().isIn(["DONOR", "ORGANIZATION"]),
  ],
  handleValidation,
  register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("A valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  handleValidation,
  login
);

router.post(
  "/forgot-password",
  [body("email").isEmail().withMessage("A valid email is required")],
  handleValidation,
  forgotPassword
);

router.get("/me", authenticate, me);

module.exports = router;
