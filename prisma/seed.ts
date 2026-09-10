import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.changeHistory.deleteMany();
  await prisma.clientVendor.deleteMany();
  await prisma.client.deleteMany();
  await prisma.vendor.deleteMany();

  // Create Healthcare Clients / Groups
  const client1 = await prisma.client.create({
    data: {
      name: "Apex Healthcare Network",
      taxId: "12-3456789",
      npiNumber: "1982736450",
      phone: "(555) 234-5678",
      email: "contact@apexhealth.org",
      address: "100 Medical Center Blvd",
      city: "Boston",
      state: "MA",
      zipCode: "02115",
      status: "ACTIVE",
      specialty: "Multi-Specialty Hospital System",
      notes: "Primary regional hospital system with 4 outpatient clinics.",
    },
  });

  // Seed sample change history steps for Client 1
  const t0 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const t1 = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  const t2 = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

  await prisma.changeHistory.createMany({
    data: [
      {
        entityType: "CLIENT",
        entityId: client1.id,
        clientId: client1.id,
        action: "CREATE",
        summary: "Initial client profile created",
        changes: JSON.stringify([]),
        snapshot: JSON.stringify({
          name: "Apex Healthcare Network",
          taxId: "12-3456789",
          npiNumber: "1982736450",
          phone: "(555) 100-0000",
          email: "info@apexhealth.org",
          address: "10 Main Street",
          city: "Boston",
          state: "MA",
          zipCode: "02115",
          status: "PENDING",
          specialty: "General Hospital",
          notes: "Initial registration.",
        }),
        createdAt: t0,
      },
      {
        entityType: "CLIENT",
        entityId: client1.id,
        clientId: client1.id,
        action: "STATUS_CHANGE",
        summary: "Updated Account Status to ACTIVE",
        changes: JSON.stringify([
          { field: "status", label: "Account Status", oldValue: "PENDING", newValue: "ACTIVE" },
        ]),
        snapshot: JSON.stringify({
          name: "Apex Healthcare Network",
          taxId: "12-3456789",
          npiNumber: "1982736450",
          phone: "(555) 100-0000",
          email: "info@apexhealth.org",
          address: "10 Main Street",
          city: "Boston",
          state: "MA",
          zipCode: "02115",
          status: "ACTIVE",
          specialty: "General Hospital",
          notes: "Credentialing verified. Account activated.",
        }),
        createdAt: t1,
      },
      {
        entityType: "CLIENT",
        entityId: client1.id,
        clientId: client1.id,
        action: "UPDATE",
        summary: "Updated Phone Number, Street Address",
        changes: JSON.stringify([
          { field: "phone", label: "Phone Number", oldValue: "(555) 100-0000", newValue: "(555) 234-5678" },
          { field: "address", label: "Street Address", oldValue: "10 Main Street", newValue: "100 Medical Center Blvd" },
        ]),
        snapshot: JSON.stringify({
          name: "Apex Healthcare Network",
          taxId: "12-3456789",
          npiNumber: "1982736450",
          phone: "(555) 234-5678",
          email: "contact@apexhealth.org",
          address: "100 Medical Center Blvd",
          city: "Boston",
          state: "MA",
          zipCode: "02115",
          status: "ACTIVE",
          specialty: "Multi-Specialty Hospital System",
          notes: "Primary regional hospital system with 4 outpatient clinics.",
        }),
        createdAt: t2,
      },
    ],
  });

  const client2 = await prisma.client.create({
    data: {
      name: "Valley Pediatrics & Family Care",
      taxId: "98-7654321",
      npiNumber: "1234567890",
      phone: "(555) 876-5432",
      email: "admin@valleypediatrics.com",
      address: "450 Oak Avenue, Suite 200",
      city: "Austin",
      state: "TX",
      zipCode: "78701",
      status: "ACTIVE",
      specialty: "Pediatrics & Primary Care",
      notes: "Comprehensive pediatric and family health group.",
    },
  });

  const client3 = await prisma.client.create({
    data: {
      name: "Horizon Orthopedic Group",
      taxId: "45-6789012",
      npiNumber: "1593572846",
      phone: "(555) 345-6789",
      email: "info@horizonortho.com",
      address: "789 Wellness Way",
      city: "Denver",
      state: "CO",
      zipCode: "80202",
      status: "ACTIVE",
      specialty: "Orthopedic Surgery & Rehabilitation",
      notes: "Specializes in joint replacements, sports medicine, and physical therapy.",
    },
  });

  const client4 = await prisma.client.create({
    data: {
      name: "Sunrise Community Health Center",
      taxId: "33-4455667",
      npiNumber: "1827364519",
      phone: "(555) 901-2345",
      email: "support@sunrisecommunityhealth.org",
      address: "1200 Hope Street",
      city: "Phoenix",
      state: "AZ",
      zipCode: "85001",
      status: "ACTIVE",
      specialty: "Community Health Clinic",
      notes: "FQHC providing affordable care and community outreach.",
    },
  });

  // Create Vendors
  const vendor1 = await prisma.vendor.create({
    data: {
      name: "MedSupply Direct Inc.",
      taxId: "55-1122334",
      phone: "(800) 555-0199",
      email: "orders@medsupplydirect.com",
      address: "500 Logistics Parkway",
      city: "Chicago",
      state: "IL",
      zipCode: "60601",
      vendorType: "MEDICAL_SUPPLIES",
      status: "ACTIVE",
      notes: "Surgical supplies, PPE, and disposable medical equipment.",
    },
  });

  const vendor2 = await prisma.vendor.create({
    data: {
      name: "HealthTech EHR Solutions",
      taxId: "77-8899001",
      phone: "(888) 555-0244",
      email: "sales@healthtechehr.com",
      address: "101 Innovation Way",
      city: "Seattle",
      state: "WA",
      zipCode: "98101",
      vendorType: "IT_SERVICES",
      status: "ACTIVE",
      notes: "Cloud EHR, patient portal, and HIPAA-compliant telemedicine platform.",
    },
  });

  const vendor3 = await prisma.vendor.create({
    data: {
      name: "Precision BioLab Services",
      taxId: "66-5544332",
      phone: "(800) 555-0377",
      email: "labresults@precisionbiolab.com",
      address: "330 Science Drive",
      city: "San Diego",
      state: "CA",
      zipCode: "92101",
      vendorType: "LAB_SERVICES",
      status: "ACTIVE",
      notes: "Full-service diagnostic pathology, bloodwork, and genetics testing.",
    },
  });

  const vendor4 = await prisma.vendor.create({
    data: {
      name: "OmniBilling & Revenue Cycle",
      taxId: "22-3344556",
      phone: "(877) 555-0488",
      email: "support@omnibilling.com",
      address: "800 Financial Plaza",
      city: "Atlanta",
      state: "GA",
      zipCode: "30303",
      vendorType: "BILLING",
      status: "ACTIVE",
      notes: "Medical coding, claims processing, and revenue cycle management.",
    },
  });

  const vendor5 = await prisma.vendor.create({
    data: {
      name: "PharmaCare Distributing",
      taxId: "11-2233445",
      phone: "(800) 555-0511",
      email: "pharmacy@pharmacaredist.com",
      address: "250 Distribution Way",
      city: "Philadelphia",
      state: "PA",
      zipCode: "19104",
      vendorType: "PHARMACY",
      status: "ACTIVE",
      notes: "Pharmaceutical distribution, specialty drugs, and vaccine supply.",
    },
  });

  // Link Clients and Vendors (Many-to-Many)
  await prisma.clientVendor.createMany({
    data: [
      {
        clientId: client1.id,
        vendorId: vendor1.id,
        notes: "Primary hospital PPE and surgical tray vendor.",
      },
      {
        clientId: client1.id,
        vendorId: vendor2.id,
        notes: "Enterprise EHR software license & maintenance.",
      },
      {
        clientId: client1.id,
        vendorId: vendor3.id,
        notes: "Outsourced inpatient lab testing.",
      },
      {
        clientId: client2.id,
        vendorId: vendor2.id,
        notes: "Pediatric clinic EHR & Telehealth portal.",
      },
      {
        clientId: client2.id,
        vendorId: vendor5.id,
        notes: "Vaccine and routine pediatric medication supplier.",
      },
      {
        clientId: client3.id,
        vendorId: vendor1.id,
        notes: "Orthopedic implants and casting material supplier.",
      },
      {
        clientId: client3.id,
        vendorId: vendor4.id,
        notes: "Billing vendor for surgical claims processing.",
      },
      {
        clientId: client4.id,
        vendorId: vendor1.id,
        notes: "Community clinic general medical consumables.",
      },
      {
        clientId: client4.id,
        vendorId: vendor4.id,
        notes: "Medicaid & FQHC specialized billing service.",
      },
    ],
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
