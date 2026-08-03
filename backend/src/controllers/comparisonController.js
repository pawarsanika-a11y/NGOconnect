const prisma = require("../utils/prisma");
const { asyncHandler } = require("../middleware/error");

// POST /api/comparisons — save a comparison of 2-4 organizations
const create = asyncHandler(async (req, res) => {
  const { organizationIds } = req.body;
  if (!Array.isArray(organizationIds) || organizationIds.length < 2 || organizationIds.length > 4) {
    return res.status(400).json({ message: "Provide 2 to 4 organization IDs to compare" });
  }

  const comparison = await prisma.comparisonHistory.create({
    data: {
      userId: req.user.id,
      organizations: { connect: organizationIds.map((id) => ({ id })) },
    },
    include: { organizations: true },
  });

  res.status(201).json(comparison);
});

// GET /api/comparisons — a donor's past comparisons
const list = asyncHandler(async (req, res) => {
  const comparisons = await prisma.comparisonHistory.findMany({
    where: { userId: req.user.id },
    include: { organizations: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(comparisons);
});

module.exports = { create, list };
