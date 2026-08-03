const prisma = require("../utils/prisma");
const { asyncHandler } = require("../middleware/error");

function computeStatus(availableQty, requiredQty) {
  if (availableQty >= requiredQty) return "FULFILLED";
  if (availableQty > 0) return "PARTIAL";
  return "OPEN";
}

async function assertOwnership(orgId, userId) {
  const org = await prisma.organization.findUnique({ where: { id: orgId } });
  if (!org) {
    const err = new Error("Organization not found");
    err.status = 404;
    throw err;
  }
  if (org.userId !== userId) {
    const err = new Error("Not authorized to manage this organization's requirements");
    err.status = 403;
    throw err;
  }
  return org;
}

// GET /api/organizations/:orgId/requirements
const list = asyncHandler(async (req, res) => {
  const requirements = await prisma.requirement.findMany({
    where: { organizationId: req.params.orgId },
    orderBy: [{ priority: "desc" }, { updatedAt: "desc" }],
  });
  res.json(requirements);
});

// POST /api/organizations/:orgId/requirements
const create = asyncHandler(async (req, res) => {
  await assertOwnership(req.params.orgId, req.user.id);
  const { itemName, category, requiredQty, availableQty = 0, unit, priority = "MEDIUM" } = req.body;

  const requirement = await prisma.requirement.create({
    data: {
      organizationId: req.params.orgId,
      itemName,
      category,
      requiredQty,
      availableQty,
      unit,
      priority,
      status: computeStatus(availableQty, requiredQty),
    },
  });

  res.status(201).json(requirement);
});

// PATCH /api/requirements/:id
const update = asyncHandler(async (req, res) => {
  const existing = await prisma.requirement.findUnique({ where: { id: req.params.id } });
  if (!existing) return res.status(404).json({ message: "Requirement not found" });
  await assertOwnership(existing.organizationId, req.user.id);

  const requiredQty = req.body.requiredQty ?? existing.requiredQty;
  const availableQty = req.body.availableQty ?? existing.availableQty;

  const updated = await prisma.requirement.update({
    where: { id: req.params.id },
    data: {
      ...req.body,
      status: req.body.status ?? computeStatus(availableQty, requiredQty),
    },
  });

  res.json(updated);
});

// DELETE /api/requirements/:id
const remove = asyncHandler(async (req, res) => {
  const existing = await prisma.requirement.findUnique({ where: { id: req.params.id } });
  if (!existing) return res.status(404).json({ message: "Requirement not found" });
  await assertOwnership(existing.organizationId, req.user.id);

  await prisma.requirement.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

// PATCH /api/requirements/:id/fulfill — mark fully fulfilled
const markFulfilled = asyncHandler(async (req, res) => {
  const existing = await prisma.requirement.findUnique({ where: { id: req.params.id } });
  if (!existing) return res.status(404).json({ message: "Requirement not found" });
  await assertOwnership(existing.organizationId, req.user.id);

  const updated = await prisma.requirement.update({
    where: { id: req.params.id },
    data: { availableQty: existing.requiredQty, status: "FULFILLED" },
  });
  res.json(updated);
});

module.exports = { list, create, update, remove, markFulfilled };
