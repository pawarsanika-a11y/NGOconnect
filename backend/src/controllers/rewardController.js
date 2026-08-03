const prisma = require("../utils/prisma");
const { asyncHandler } = require("../middleware/error");

// GET /api/rewards/me — badges, certificates, level, and score for the logged-in donor
const myRewards = asyncHandler(async (req, res) => {
  const [user, badges, certificates] = await Promise.all([
    prisma.user.findUnique({
      where: { id: req.user.id },
      select: { impactScore: true, level: true, volunteerHours: true },
    }),
    prisma.userBadge.findMany({
      where: { userId: req.user.id },
      include: { badge: true },
      orderBy: { earnedOn: "desc" },
    }),
    prisma.certificate.findMany({
      where: { userId: req.user.id },
      include: { donation: { include: { organization: { select: { name: true } } } } },
      orderBy: { issuedOn: "desc" },
    }),
  ]);

  res.json({ ...user, badges, certificates });
});

module.exports = { myRewards };
