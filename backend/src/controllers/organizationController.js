const prisma = require("../utils/prisma");
const { asyncHandler } = require("../middleware/error");

// Haversine distance in km between two lat/lng points.
function distanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// GET /api/organizations
// Query params: q, category, verified, urgent, lat, lng, maxDistance, sort
const list = asyncHandler(async (req, res) => {
  const { q, category, verified, lat, lng, maxDistance, sort } = req.query;

  const where = {
    ...(q && {
      OR: [
        { name: { contains: q } },
        { city: { contains: q } },
      ],
    }),
    ...(category && { category }),
    ...(verified === "true" && { verified: true }),
  };

  let organizations = await prisma.organization.findMany({
    where,
    include: { requirements: true, _count: { select: { requirements: true, donations: true } } },
  });

  if (lat && lng) {
    organizations = organizations.map((o) => ({
      ...o,
      distanceKm: Math.round(distanceKm(Number(lat), Number(lng), o.lat, o.lng) * 10) / 10,
    }));
    if (maxDistance) {
      organizations = organizations.filter((o) => o.distanceKm <= Number(maxDistance));
    }
  }

  switch (sort) {
    case "nearest":
      organizations.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
      break;
    case "mostNeeded":
      organizations.sort((a, b) => a.needsFulfilledPct - b.needsFulfilledPct);
      break;
    case "mostStudents":
      organizations.sort((a, b) => b.studentCount - a.studentCount);
      break;
    case "mostRecent":
      organizations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
  }

  res.json(organizations);
});

// GET /api/organizations/:id
const getById = asyncHandler(async (req, res) => {
  const org = await prisma.organization.findUnique({
    where: { id: req.params.id },
    include: {
      requirements: { orderBy: { updatedAt: "desc" } },
      gallery: true,
      donations: { orderBy: { createdAt: "desc" }, take: 10, include: { items: true, donor: { select: { name: true } } } },
    },
  });
  if (!org) return res.status(404).json({ message: "Organization not found" });
  res.json(org);
});

// PATCH /api/organizations/:id — organization owner updates their profile
const update = asyncHandler(async (req, res) => {
  const org = await prisma.organization.findUnique({ where: { id: req.params.id } });
  if (!org) return res.status(404).json({ message: "Organization not found" });
  if (org.userId !== req.user.id) return res.status(403).json({ message: "Not authorized to edit this organization" });

  const {
    name, about, address, city, coordinatorName, phone, email, website,
    studentCount, teacherCount, staffCount, hostelAvailable, currentBeneficiaries, servicesOffered,
  } = req.body;

  const updated = await prisma.organization.update({
    where: { id: req.params.id },
    data: {
      ...(name && { name }),
      ...(about && { about }),
      ...(address && { address }),
      ...(city && { city }),
      ...(coordinatorName && { coordinatorName }),
      ...(phone && { phone }),
      ...(email && { email }),
      ...(website && { website }),
      ...(studentCount !== undefined && { studentCount }),
      ...(teacherCount !== undefined && { teacherCount }),
      ...(staffCount !== undefined && { staffCount }),
      ...(hostelAvailable !== undefined && { hostelAvailable }),
      ...(currentBeneficiaries !== undefined && { currentBeneficiaries }),
      ...(servicesOffered && { servicesOffered }),
    },
  });

  res.json(updated);
});

module.exports = { list, getById, update };
