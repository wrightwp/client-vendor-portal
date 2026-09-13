/**
 * One-time migration: Convert all vendorType values from UPPER_SNAKE_CASE
 * to human-readable labels in the SQLite database.
 */
const { PrismaClient } = require("@prisma/client");

const LEGACY_MAP = {
  MEDICAL_SUPPLIES: "Medical Supplies & Equipment",
  IT_SERVICES: "IT & EHR Telehealth",
  LAB_SERVICES: "Lab & Pathology Services",
  BILLING: "Medical Billing & Revenue Cycle",
  PHARMACY: "Pharmaceutical Distribution",
  GENERAL: "General Services",
};

async function migrate() {
  const prisma = new PrismaClient();
  try {
    const vendors = await prisma.vendor.findMany({ select: { id: true, vendorType: true } });
    let updated = 0;
    for (const v of vendors) {
      const mapped = LEGACY_MAP[v.vendorType];
      if (mapped && mapped !== v.vendorType) {
        await prisma.vendor.update({
          where: { id: v.id },
          data: { vendorType: mapped },
        });
        updated++;
        console.log(`  ok ${v.vendorType} -> ${mapped}`);
      }
    }
    console.log(`\nMigration complete: ${updated}/${vendors.length} records updated.`);
  } finally {
    await prisma.$disconnect();
  }
}

migrate().catch((e) => { console.error(e); process.exit(1); });
