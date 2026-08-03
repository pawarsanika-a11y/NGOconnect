const bcrypt = require("bcryptjs");
const prisma = require("../utils/prisma");
const { signToken } = require("../utils/jwt");
const { asyncHandler } = require("../middleware/error");

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ message: "An account with this email already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, passwordHash, role: role || "DONOR" },
  });

  const token = signToken({ id: user.id, role: user.role, email: user.email });
  res.status(201).json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = signToken({ id: user.id, role: user.role, email: user.email });
  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});

// POST /api/auth/forgot-password
// In production this generates a signed reset token and emails a reset
// link. For this scaffold it just acknowledges the request without leaking
// whether the email exists.
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    // TODO: generate reset token, store it (or sign a short-lived JWT),
    // and send it via an email provider (e.g. Resend, SendGrid).
  }
  res.json({ message: "If an account exists for this email, a reset link has been sent." });
});

// GET /api/auth/me
const me = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, name: true, email: true, role: true, phone: true, avatarUrl: true, impactScore: true, level: true, volunteerHours: true },
  });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

module.exports = { register, login, forgotPassword, me };
