const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding NGOConnect database...");

  const passwordHash = await bcrypt.hash("password123", 10);

  // Donor
  const donor = await prisma.user.upsert({
    where: { email: "rahul.mehta@example.com" },
    update: {},
    create: {
      name: "Rahul Mehta",
      email: "rahul.mehta@example.com",
      passwordHash,
      role: "DONOR",
      phone: "+91 98765 43210",
      impactScore: 742,
      level: "PLATINUM",
      volunteerHours: 12,
    },
  });

  // Organization owner accounts + organizations
  const orgSeeds = [
    {
      email: "contact@ashavidya.org",
      name: "Asha Vidya School for the Blind",
      category: "NGO",
      city: "Pune, Maharashtra",
      lat: 18.5074,
      lng: 73.8077,
      about: "Asha Vidya runs a residential school for visually impaired children, offering Braille education, mobility training and vocational skills.",
      coordinatorName: "Mrs. Sunita Deshmukh",
      phone: "+91 98220 11234",
      studentCount: 180,
      teacherCount: 22,
      staffCount: 34,
      hostelAvailable: true,
      currentBeneficiaries: 210,
      servicesOffered: ["Braille Education", "Mobility Training", "Vocational Skills", "Residential Hostel"],
      requirements: [
        { itemName: "Rice", category: "Food", requiredQty: 50, availableQty: 20, unit: "kg", priority: "HIGH" },
        { itemName: "Braille Slates", category: "Education", requiredQty: 40, availableQty: 5, unit: "units", priority: "CRITICAL" },
      ],
    },
    {
      email: "gidd.nagpur@gov.in",
      name: "Government Institute for the Deaf & Dumb",
      category: "GOVERNMENT",
      city: "Nagpur, Maharashtra",
      lat: 21.1458,
      lng: 79.0882,
      about: "A state-run institution providing sign-language based education and speech therapy to hearing and speech impaired students.",
      coordinatorName: "Mr. Ramesh Patil",
      phone: "+91 71223 45678",
      studentCount: 260,
      teacherCount: 31,
      staffCount: 45,
      hostelAvailable: true,
      currentBeneficiaries: 305,
      servicesOffered: ["Sign Language Education", "Speech Therapy", "Skill Development"],
      requirements: [
        { itemName: "Hearing Aid Batteries", category: "Medical", requiredQty: 500, availableQty: 60, unit: "units", priority: "CRITICAL" },
      ],
    },
    {
      email: "care@shantiniwas.org",
      name: "Shanti Niwas Old Age Home",
      category: "OLD_AGE_HOME",
      city: "Pune, Maharashtra",
      lat: 18.5590,
      lng: 73.7868,
      about: "Shanti Niwas provides shelter, medical care and companionship to elderly residents, many of them without family support.",
      coordinatorName: "Mr. Anil Kulkarni",
      phone: "+91 98221 76543",
      studentCount: 0,
      teacherCount: 0,
      staffCount: 19,
      hostelAvailable: true,
      currentBeneficiaries: 68,
      servicesOffered: ["Medical Care", "Physiotherapy", "Nutrition", "Recreation"],
      requirements: [
        { itemName: "Diapers (Adult)", category: "Medical", requiredQty: 300, availableQty: 150, unit: "units", priority: "HIGH" },
      ],
    },
    {
      email: "trust@gopalgaushala.org",
      name: "Gopal Gaushala Trust",
      category: "ANIMAL_SHELTER",
      city: "Pune, Maharashtra",
      lat: 18.7621,
      lng: 73.8478,
      about: "Gopal Gaushala shelters abandoned and injured cattle, providing fodder, veterinary care, and rehabilitation.",
      coordinatorName: "Mr. Vishnu Yadav",
      phone: "+91 98230 98761",
      studentCount: 0,
      teacherCount: 0,
      staffCount: 27,
      hostelAvailable: false,
      currentBeneficiaries: 420,
      servicesOffered: ["Veterinary Care", "Fodder Supply", "Rescue & Rehabilitation"],
      requirements: [
        { itemName: "Dry Fodder", category: "Food", requiredQty: 2000, availableQty: 600, unit: "kg", priority: "CRITICAL" },
      ],
    },
  ];

  for (const seed of orgSeeds) {
    const ownerUser = await prisma.user.upsert({
      where: { email: seed.email },
      update: {},
      create: { name: seed.name, email: seed.email, passwordHash, role: "ORGANIZATION" },
    });

    const org = await prisma.organization.upsert({
      where: { userId: ownerUser.id },
      update: {},
      create: {
        userId: ownerUser.id,
        name: seed.name,
        category: seed.category,
        verified: true,
        about: seed.about,
        address: seed.city,
        city: seed.city,
        lat: seed.lat,
        lng: seed.lng,
        coordinatorName: seed.coordinatorName,
        phone: seed.phone,
        email: seed.email,
        website: `www.${seed.email.split("@")[1]}`,
        studentCount: seed.studentCount,
        teacherCount: seed.teacherCount,
        staffCount: seed.staffCount,
        hostelAvailable: seed.hostelAvailable,
        currentBeneficiaries: seed.currentBeneficiaries,
        servicesOffered: seed.servicesOffered,
        needsFulfilledPct: 55,
        mealsSupported: 10000,
        studentsBenefited: seed.studentCount,
        totalDonations: 120,
      },
    });

    for (const r of seed.requirements) {
      await prisma.requirement.create({
        data: {
          organizationId: org.id,
          itemName: r.itemName,
          category: r.category,
          requiredQty: r.requiredQty,
          availableQty: r.availableQty,
          unit: r.unit,
          priority: r.priority,
          status: r.availableQty >= r.requiredQty ? "FULFILLED" : r.availableQty > 0 ? "PARTIAL" : "OPEN",
        },
      });
    }
  }

  // A sample completed donation with a badge + certificate, to show the
  // reward pipeline pre-populated.
  const firstOrg = await prisma.organization.findFirst({ where: { name: orgSeeds[0].name } });
  if (firstOrg) {
    const donation = await prisma.donation.create({
      data: {
        donorId: donor.id,
        organizationId: firstOrg.id,
        status: "COMPLETED",
        approvedBy: firstOrg.coordinatorName,
        certificateAvailable: true,
        items: { create: [{ itemName: "Rice", qty: 20, unit: "kg" }] },
      },
    });

    const badge = await prisma.badge.upsert({
      where: { name: "First Donation" },
      update: {},
      create: { name: "First Donation", description: "Made your very first donation", icon: "Sparkles" },
    });
    await prisma.userBadge.upsert({
      where: { userId_badgeId: { userId: donor.id, badgeId: badge.id } },
      update: {},
      create: { userId: donor.id, badgeId: badge.id, donationId: donation.id },
    });
    await prisma.certificate.upsert({
      where: { donationId: donation.id },
      update: {},
      create: { donationId: donation.id, userId: donor.id, fileUrl: `/certificates/${donation.id}.pdf` },
    });
  }

  console.log("Seed complete. Demo login: rahul.mehta@example.com / password123 (donor)");
  console.log("Org logins: contact@ashavidya.org, gidd.nagpur@gov.in, care@shantiniwas.org, trust@gopalgaushala.org (password: password123)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
