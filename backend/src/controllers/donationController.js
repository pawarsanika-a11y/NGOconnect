const prisma = require("../utils/prisma");
const { asyncHandler } = require("../middleware/error");

const BADGE_RULES = [
  { name: "First Donation", description: "Made your very first donation", icon: "Sparkles", test: (count) => count === 1 },
  { name: "Helping Hand", description: "Completed 3 donations", icon: "HeartHandshake", test: (count) => count === 3 },
  { name: "Gold Donor", description: "Crossed 700 impact points", icon: "Medal", test: (_count, score) => score >= 700 },
];

function levelForScore(score) {
  if (score >= 1000) return "DIAMOND";
  if (score >= 700) return "PLATINUM";
  if (score >= 400) return "GOLD";
  if (score >= 150) return "SILVER";
  return "BRONZE";
}

// POST /api/donations — donor pledges items against a requirement
const create = asyncHandler(async (req, res) => {
  const { organizationId, requirementId, items, note } = req.body;

  const donation = await prisma.donation.create({
    data: {
      donorId: req.user.id,
      organizationId,
      note,
      items: {
        create: items.map((i) => ({
          requirementId: i.requirementId ?? requirementId,
          itemName: i.itemName,
          qty: i.qty,
          unit: i.unit,
        })),
      },
    },
    include: { items: true },
  });

  await prisma.notification.create({
    data: {
      userId: req.user.id,
      title: "Donation submitted",
      message: "Your pledge has been sent to the organization for approval.",
      type: "DONATION_APPROVED",
    },
  });

  res.status(201).json(donation);
});

// GET /api/donations?donorId=&organizationId=&status=
const list = asyncHandler(async (req, res) => {
  const { donorId, organizationId, status } = req.query;
  const donations = await prisma.donation.findMany({
    where: {
      ...(donorId && { donorId }),
      ...(organizationId && { organizationId }),
      ...(status && { status }),
    },
    include: { items: true, donor: { select: { name: true } }, organization: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
  res.json(donations);
});

// PATCH /api/donations/:id/approve
// This is the single place all the "Reward System" automation described in
// the spec happens: donor timeline update, badge unlocks, certificate
// generation, and impact score recalculation.
const approve = asyncHandler(async (req, res) => {
  const donation = await prisma.donation.findUnique({
    where: { id: req.params.id },
    include: { organization: true, donor: true, items: true },
  });
  if (!donation) return res.status(404).json({ message: "Donation not found" });
  if (donation.organization.userId !== req.user.id) {
    return res.status(403).json({ message: "Not authorized to approve this donation" });
  }

  const updated = await prisma.$transaction(async (tx) => {
    const don = await tx.donation.update({
      where: { id: donation.id },
      data: {
        status: "APPROVED",
        approvedBy: req.body.approvedBy || req.user.email,
        certificateAvailable: true,
      },
    });

    // Bump matching requirement availableQty and recompute status.
    for (const item of donation.items) {
      if (!item.requirementId) continue;
      const req_ = await tx.requirement.findUnique({ where: { id: item.requirementId } });
      if (!req_) continue;
      const availableQty = Math.min(req_.requiredQty, req_.availableQty + item.qty);
      await tx.requirement.update({
        where: { id: req_.id },
        data: {
          availableQty,
          status: availableQty >= req_.requiredQty ? "FULFILLED" : "PARTIAL",
        },
      });
    }

    // Recalculate donor impact score + level.
    const donorDonationCount = await tx.donation.count({
      where: { donorId: donation.donorId, status: { in: ["APPROVED", "COMPLETED"] } },
    });
    const newScore = donation.donor.impactScore + 50;
    const newLevel = levelForScore(newScore);
    await tx.user.update({
      where: { id: donation.donorId },
      data: { impactScore: newScore, level: newLevel },
    });

    // Unlock badges.
    for (const rule of BADGE_RULES) {
      if (!rule.test(donorDonationCount, newScore)) continue;
      const badge = await tx.badge.upsert({
        where: { name: rule.name },
        update: {},
        create: { name: rule.name, description: rule.description, icon: rule.icon },
      });
      await tx.userBadge.upsert({
        where: { userId_badgeId: { userId: donation.donorId, badgeId: badge.id } },
        update: {},
        create: { userId: donation.donorId, badgeId: badge.id, donationId: donation.id },
      });
      await tx.notification.create({
        data: {
          userId: donation.donorId,
          title: "Reward unlocked",
          message: `You earned the "${rule.name}" badge!`,
          type: "REWARD_UNLOCKED",
        },
      });
    }

    // Generate certificate record.
    await tx.certificate.upsert({
      where: { donationId: donation.id },
      update: {},
      create: {
        donationId: donation.id,
        userId: donation.donorId,
        fileUrl: `/certificates/${donation.id}.pdf`, // generated by a PDF worker in production
      },
    });

    await tx.notification.create({
      data: {
        userId: donation.donorId,
        title: "Donation approved",
        message: `${donation.organization.name} approved your donation. Your certificate is ready.`,
        type: "CERTIFICATE_GENERATED",
      },
    });

    return don;
  });

  res.json(updated);
});

// PATCH /api/donations/:id/reject
const reject = asyncHandler(async (req, res) => {
  const donation = await prisma.donation.findUnique({ where: { id: req.params.id }, include: { organization: true } });
  if (!donation) return res.status(404).json({ message: "Donation not found" });
  if (donation.organization.userId !== req.user.id) {
    return res.status(403).json({ message: "Not authorized to reject this donation" });
  }

  const updated = await prisma.donation.update({ where: { id: donation.id }, data: { status: "REJECTED" } });

  await prisma.notification.create({
    data: {
      userId: donation.donorId,
      title: "Donation rejected",
      message: `${donation.organization.name} was unable to accept this donation.`,
      type: "DONATION_APPROVED",
    },
  });

  res.json(updated);
});

// PATCH /api/donations/:id/complete
const complete = asyncHandler(async (req, res) => {
  const donation = await prisma.donation.findUnique({ where: { id: req.params.id }, include: { organization: true } });
  if (!donation) return res.status(404).json({ message: "Donation not found" });
  if (donation.organization.userId !== req.user.id) {
    return res.status(403).json({ message: "Not authorized to update this donation" });
  }
  const updated = await prisma.donation.update({ where: { id: donation.id }, data: { status: "COMPLETED" } });
  res.json(updated);
});

module.exports = { create, list, approve, reject, complete };
