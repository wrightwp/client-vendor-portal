import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database with extensive mock data (28 Groups, 42 Vendors, Multi-Year B&E)...");

  // Clean existing data
  await prisma.contact.deleteMany();
  await prisma.changeHistory.deleteMany();
  await prisma.clientVendor.deleteMany();
  await prisma.clientBillingEnrollment.deleteMany();
  await prisma.client.deleteMany();
  await prisma.vendor.deleteMany();

  // Helper arrays for generating rich healthcare mock data
  const clientData = [
    {
      name: "Apex Healthcare Network",
      taxId: "12-3456789",
      npiNumber: "GRP-1001",
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
    {
      name: "Valley Pediatrics & Family Care",
      taxId: "98-7654321",
      npiNumber: "GRP-1002",
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
    {
      name: "Horizon Orthopedic Group",
      taxId: "45-6789012",
      npiNumber: "GRP-1003",
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
    {
      name: "Sunrise Community Health Center",
      taxId: "33-4455667",
      npiNumber: "GRP-1004",
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
    {
      name: "Beacon Cardiac & Vascular Institute",
      taxId: "21-9876543",
      npiNumber: "GRP-1005",
      phone: "(555) 412-9800",
      email: "info@beaconcardiac.com",
      address: "88 Cardiology Plaza",
      city: "Chicago",
      state: "IL",
      zipCode: "60611",
      status: "ACTIVE",
      specialty: "Cardiology & Vascular Surgery",
      notes: "State-of-the-art cardiovascular diagnostic and surgical institute.",
    },
    {
      name: "Northwoods Health Alliance",
      taxId: "74-5512389",
      npiNumber: "GRP-1006",
      phone: "(555) 671-3321",
      email: "admin@northwoodshealth.org",
      address: "305 Pine Tree Lane",
      city: "Minneapolis",
      state: "MN",
      zipCode: "55401",
      status: "ACTIVE",
      specialty: "Integrated Rural Health Network",
      notes: "Network serving rural Minnesota and western Wisconsin clinics.",
    },
    {
      name: "Pacific Neuroscience Associates",
      taxId: "91-2345678",
      npiNumber: "GRP-1007",
      phone: "(555) 206-8899",
      email: "contact@pacificneuro.org",
      address: "500 University Street, Suite 800",
      city: "Seattle",
      state: "WA",
      zipCode: "98101",
      status: "ACTIVE",
      specialty: "Neurology & Neurosurgery",
      notes: "Comprehensive brain, spine, and peripheral nerve care center.",
    },
    {
      name: "Summit Women's Health & Obstetrics",
      taxId: "36-7890123",
      npiNumber: "GRP-1008",
      phone: "(555) 303-4411",
      email: "care@summitwomenshealth.com",
      address: "1400 Mountain View Blvd",
      city: "Salt Lake City",
      state: "UT",
      zipCode: "84101",
      status: "ACTIVE",
      specialty: "Obstetrics & Gynecology",
      notes: "Full spectrum OB/GYN practice with high-risk maternal fetal care.",
    },
    {
      name: "Chesapeake Regional Surgeons",
      taxId: "52-1098765",
      npiNumber: "GRP-1009",
      phone: "(555) 410-7766",
      email: "info@chesapeakesurgeons.com",
      address: "220 Bayfront Parkway",
      city: "Baltimore",
      state: "MD",
      zipCode: "21201",
      status: "ACTIVE",
      specialty: "General & Bariatric Surgery",
      notes: "Robotic and minimally invasive general surgery specialists.",
    },
    {
      name: "Midwest Dermatology & Skin Cancer Center",
      taxId: "61-2345678",
      npiNumber: "GRP-1010",
      phone: "(555) 312-5544",
      email: "appointments@midwestderm.com",
      address: "710 Michigan Avenue",
      city: "Chicago",
      state: "IL",
      zipCode: "60605",
      status: "ACTIVE",
      specialty: "Dermatology & Mohs Surgery",
      notes: "Clinical dermatology, Mohs micrographic surgery, and aesthetic care.",
    },
    {
      name: "Evergreen Behavioral Health Systems",
      taxId: "84-9012345",
      npiNumber: "GRP-1011",
      phone: "(555) 503-9988",
      email: "intake@evergreenmental.org",
      address: "920 SW 5th Ave",
      city: "Portland",
      state: "OR",
      zipCode: "97204",
      status: "ACTIVE",
      specialty: "Psychiatry & Mental Wellness",
      notes: "Inpatient, outpatient, and intensive outpatient behavioral programs.",
    },
    {
      name: "Sun City Oncology & Infusion Center",
      taxId: "47-5678901",
      npiNumber: "GRP-1012",
      phone: "(555) 702-3344",
      email: "info@suncityoncology.com",
      address: "3100 Medical Center Drive",
      city: "Las Vegas",
      state: "NV",
      zipCode: "89109",
      status: "ACTIVE",
      specialty: "Medical & Hematological Oncology",
      notes: "Cancer care, chemotherapy, immunotherapy, and clinical trials.",
    },
    {
      name: "Piedmont Gastroenterology Specialists",
      taxId: "58-1234567",
      npiNumber: "GRP-1013",
      phone: "(555) 404-6677",
      email: "admin@piedmontgi.com",
      address: "1800 Peachtree Rd NW",
      city: "Atlanta",
      state: "GA",
      zipCode: "30309",
      status: "ACTIVE",
      specialty: "Gastroenterology & Endoscopy",
      notes: "Outpatient endoscopy center and hepatology consultation clinic.",
    },
    {
      name: "Lone Star Emergency Physicians",
      taxId: "75-9876543",
      npiNumber: "GRP-1014",
      phone: "(555) 214-8800",
      email: "contact@lonestarep.com",
      address: "2000 Ross Ave",
      city: "Dallas",
      state: "TX",
      zipCode: "75201",
      status: "ACTIVE",
      specialty: "Emergency Medicine Group",
      notes: "Staffing emergency departments across 12 regional Texas hospitals.",
    },
    {
      name: "Great Lakes Urgent Care Network",
      taxId: "38-4567890",
      npiNumber: "GRP-1015",
      phone: "(555) 313-2211",
      email: "care@greatlakesuc.com",
      address: "400 Renaissance Center",
      city: "Detroit",
      state: "MI",
      zipCode: "48243",
      status: "ACTIVE",
      specialty: "Urgent & Walk-In Care",
      notes: "Operates 15 walk-in clinics with occupational health services.",
    },
    {
      name: "Magnolia Family Health Centers",
      taxId: "64-8901234",
      npiNumber: "GRP-1016",
      phone: "(555) 504-7722",
      email: "contact@magnoliafamily.org",
      address: "650 Poydras St",
      city: "New Orleans",
      state: "LA",
      zipCode: "70130",
      status: "ACTIVE",
      specialty: "Family Medicine Network",
      notes: "Primary care network serving urban and suburban New Orleans.",
    },
    {
      name: "Blue Ridge Pulmonary & Sleep Medicine",
      taxId: "54-2345678",
      npiNumber: "GRP-1017",
      phone: "(555) 828-9900",
      email: "sleep@blueridgepulm.com",
      address: "105 Doctors Park",
      city: "Asheville",
      state: "NC",
      zipCode: "28801",
      status: "ACTIVE",
      specialty: "Pulmonology & Sleep Disorders",
      notes: "Specialized respiratory therapy, asthma, and sleep labs.",
    },
    {
      name: "Sonoran Eye & Retinal Surgeons",
      taxId: "86-1234567",
      npiNumber: "GRP-1018",
      phone: "(555) 520-4455",
      email: "info@sonoraneye.com",
      address: "4800 E Camp Lowell Dr",
      city: "Tucson",
      state: "AZ",
      zipCode: "85712",
      status: "ACTIVE",
      specialty: "Ophthalmology & Retina Care",
      notes: "Cataract surgery, macular degeneration, and LASIK vision care.",
    },
    {
      name: "Keystone Endocrine & Diabetes Center",
      taxId: "23-7890123",
      npiNumber: "GRP-1019",
      phone: "(555) 215-6688",
      email: "diabetes@keystoneendo.org",
      address: "1600 JFK Blvd",
      city: "Philadelphia",
      state: "PA",
      zipCode: "19103",
      specialty: "Endocrinology & Diabetes",
      status: "ACTIVE",
      notes: "Type 1 & 2 diabetes management, thyroid, and metabolic care.",
    },
    {
      name: "Cascade Allergy & Asthma Specialists",
      taxId: "93-4567890",
      npiNumber: "GRP-1020",
      phone: "(555) 425-3377",
      email: "admin@cascadeallergy.com",
      address: "10800 NE 8th St",
      city: "Bellevue",
      state: "WA",
      zipCode: "98004",
      status: "ACTIVE",
      specialty: "Allergy, Asthma & Immunology",
      notes: "Immunotherapy, food allergy testing, and biologic treatments.",
    },
    {
      name: "Red River Nephrology Group",
      taxId: "73-1234567",
      npiNumber: "GRP-1021",
      phone: "(555) 405-5599",
      email: "info@redriverkidney.com",
      address: "100 N Broadway",
      city: "Oklahoma City",
      state: "OK",
      zipCode: "73102",
      status: "ACTIVE",
      specialty: "Nephrology & Dialysis Care",
      notes: "Chronic kidney disease management and outpatient dialysis supervision.",
    },
    {
      name: "Atlantic Physical Therapy & Rehab",
      taxId: "22-8901234",
      npiNumber: "GRP-1022",
      phone: "(555) 757-4411",
      email: "rehab@atlanticpt.com",
      address: "500 Virginia Beach Blvd",
      city: "Virginia Beach",
      state: "VA",
      zipCode: "23451",
      status: "ACTIVE",
      specialty: "Physical & Occupational Therapy",
      notes: "Post-surgical rehabilitation, sports injuries, and aquatic therapy.",
    },
    {
      name: "Gotham Anesthesia Associates",
      taxId: "13-5678901",
      npiNumber: "GRP-1023",
      phone: "(555) 212-9900",
      email: "billing@gothamanesthesia.com",
      address: "575 Lexington Ave",
      city: "New York",
      state: "NY",
      zipCode: "10022",
      status: "ACTIVE",
      specialty: "Anesthesiology & Pain Management",
      notes: "Hospital anesthesia services and interventional pain management.",
    },
    {
      name: "Prairie State Pathology Labs",
      taxId: "37-1234567",
      npiNumber: "GRP-1024",
      phone: "(555) 217-3344",
      email: "lab@prairiepathology.com",
      address: "600 S Sixth St",
      city: "Springfield",
      state: "IL",
      zipCode: "62701",
      status: "ACTIVE",
      specialty: "Anatomic & Clinical Pathology",
      notes: "Diagnostic tissue pathology and cytology reference laboratory.",
    },
    {
      name: "Sunshine State Rheumatology",
      taxId: "59-6789012",
      npiNumber: "GRP-1025",
      phone: "(555) 407-8822",
      email: "care@sunshinerheum.com",
      address: "200 S Orange Ave",
      city: "Orlando",
      state: "FL",
      zipCode: "32801",
      status: "ACTIVE",
      specialty: "Rheumatology & Autoimmune Care",
      notes: "Treatment of rheumatoid arthritis, lupus, and osteoporosis.",
    },
    {
      name: "Ozark Regional Healthcare System",
      taxId: "43-9012345",
      npiNumber: "GRP-1026",
      phone: "(555) 417-6655",
      email: "info@ozarkhealth.org",
      address: "1234 S Glenstone Ave",
      city: "Springfield",
      state: "MO",
      zipCode: "65804",
      status: "ACTIVE",
      specialty: "Regional Health System",
      notes: "Multi-hospital network serving southwest Missouri and northern Arkansas.",
    },
    {
      name: "Alamo Vascular & Endovascular Center",
      taxId: "74-1234567",
      npiNumber: "GRP-1027",
      phone: "(555) 210-9944",
      email: "contact@alamovascular.com",
      address: "300 E Houston St",
      city: "San Antonio",
      state: "TX",
      zipCode: "78205",
      status: "ACTIVE",
      specialty: "Vascular Surgery & Vein Care",
      notes: "Peripheral artery disease treatments, vein surgery, and dialysis access.",
    },
    {
      name: "Aloha State Internal Medicine",
      taxId: "99-8765432",
      npiNumber: "GRP-1028",
      phone: "(555) 808-5522",
      email: "admin@alohainternalmed.com",
      address: "1001 Bishop St",
      city: "Honolulu",
      state: "HI",
      zipCode: "96813",
      status: "PENDING",
      specialty: "Internal Medicine & Wellness",
      notes: "Primary internal medicine group undergoing credentialing onboarding.",
    },
  ];

  // Vendor Categories
  const vendorData = [
    { name: "MedSupply Direct Inc.", taxId: "55-1122334", phone: "(800) 555-0199", email: "orders@medsupplydirect.com", city: "Chicago", state: "IL", vendorType: "MEDICAL_SUPPLIES", notes: "Surgical supplies, PPE, and disposable equipment." },
    { name: "HealthTech EHR Solutions", taxId: "77-8899001", phone: "(888) 555-0244", email: "sales@healthtechehr.com", city: "Seattle", state: "WA", vendorType: "IT_SERVICES", notes: "Cloud EHR and HIPAA-compliant telemedicine." },
    { name: "Precision BioLab Services", taxId: "66-5544332", phone: "(800) 555-0377", email: "labresults@precisionbiolab.com", city: "San Diego", state: "CA", vendorType: "LAB_SERVICES", notes: "Diagnostic pathology and bloodwork testing." },
    { name: "OmniBilling & Revenue Cycle", taxId: "22-3344556", phone: "(877) 555-0488", email: "support@omnibilling.com", city: "Atlanta", state: "GA", vendorType: "BILLING", notes: "Medical coding, claims, and revenue management." },
    { name: "PharmaCare Distributing", taxId: "11-2233445", phone: "(800) 555-0511", email: "pharmacy@pharmacaredist.com", city: "Philadelphia", state: "PA", vendorType: "PHARMACY", notes: "Pharmaceutical distribution and specialty drugs." },

    { name: "BioRad Medical Devices", taxId: "94-1122334", phone: "(800) 424-6723", email: "info@bioradmed.com", city: "Hercules", state: "CA", vendorType: "MEDICAL_SUPPLIES", notes: "Laboratory diagnostic equipment and reagent kits." },
    { name: "Epic Systems Integration Co.", taxId: "39-4455667", phone: "(800) 374-2797", email: "integrations@epicsystems.com", city: "Verona", state: "WI", vendorType: "IT_SERVICES", notes: "Enterprise hospital EHR software integration." },
    { name: "Quest Diagnostic Partners", taxId: "16-7788990", phone: "(800) 222-0446", email: "corporate@questdx.com", city: "Secaucus", state: "NJ", vendorType: "LAB_SERVICES", notes: "National clinical laboratory test provider." },
    { name: "Change Healthcare Solutions", taxId: "58-9900112", phone: "(877) 363-7466", email: "claims@changehealth.com", city: "Nashville", state: "TN", vendorType: "BILLING", notes: "Clearinghouse and electronic claims submission." },
    { name: "McKesson Rx Logistics", taxId: "94-3344556", phone: "(800) 482-3784", email: "distribution@mckesson.com", city: "Irving", state: "TX", vendorType: "PHARMACY", notes: "Hospital wholesale drug distribution." },

    { name: "Stryker Orthopedic Supplies", taxId: "38-1234567", phone: "(800) 253-3210", email: "orders@stryker.com", city: "Kalamazoo", state: "MI", vendorType: "MEDICAL_SUPPLIES", notes: "Joint implants, surgical power tools, and beds." },
    { name: "AthenaHealth Practice Software", taxId: "04-3456789", phone: "(888) 652-8200", email: "sales@athenahealth.com", city: "Watertown", state: "MA", vendorType: "IT_SERVICES", notes: "Cloud billing, EHR, and patient engagement." },
    { name: "LabCorp Reference Laboratories", taxId: "13-4567890", phone: "(800) 845-6167", email: "info@labcorp.com", city: "Burlington", state: "NC", vendorType: "LAB_SERVICES", notes: "Reference lab testing and genomic diagnostics." },
    { name: "R1 RCM Revenue Management", taxId: "36-5678901", phone: "(800) 560-4300", email: "contact@r1rcm.com", city: "Chicago", state: "IL", vendorType: "BILLING", notes: "End-to-end revenue cycle management for hospitals." },
    { name: "Cardinal Health Specialty Rx", taxId: "31-6789012", phone: "(800) 234-8700", email: "rx@cardinalhealth.com", city: "Dublin", state: "OH", vendorType: "PHARMACY", notes: "Specialty oncology and immunology drug supply." },

    { name: "Medtronic Surgical Technologies", taxId: "41-7890123", phone: "(800) 633-8766", email: "orders@medtronic.com", city: "Minneapolis", state: "MN", vendorType: "MEDICAL_SUPPLIES", notes: "Pacemakers, insulin pumps, and surgical instruments." },
    { name: "Cerner Health IT Consultants", taxId: "43-8901234", phone: "(816) 221-1024", email: "support@cerner.com", city: "Kansas City", state: "MO", vendorType: "IT_SERVICES", notes: "Clinical information systems and data analytics." },
    { name: "Mayo Clinic Laboratories", taxId: "41-9012345", phone: "(800) 533-1710", email: "mcl@mayo.edu", city: "Rochester", state: "MN", vendorType: "LAB_SERVICES", notes: "Specialized pathology and rare disease testing." },
    { name: "Waystar Billing Clearinghouse", taxId: "82-0123456", phone: "(844) 692-9782", email: "support@waystar.com", city: "Louisville", state: "KY", vendorType: "BILLING", notes: "Revenue management and patient payment portal." },
    { name: "AmerisourceBergen Drug Corp", taxId: "23-1234567", phone: "(800) 829-3139", email: "orders@amerisourcebergen.com", city: "Conshohocken", state: "PA", vendorType: "PHARMACY", notes: "Pharmaceutical distribution and vaccine cold storage." },

    { name: "Johnson & Johnson MedTech", taxId: "22-2345678", phone: "(800) 255-2500", email: "medtech@jnj.com", city: "New Brunswick", state: "NJ", vendorType: "MEDICAL_SUPPLIES", notes: "Sutures, wound closure, and orthopedic implants." },
    { name: "Allscripts Healthcare IT", taxId: "36-3456789", phone: "(800) 334-8534", email: "info@allscripts.com", city: "Chicago", state: "IL", vendorType: "IT_SERVICES", notes: "Outpatient EHR and practice management." },
    { name: "Genoptix Oncology Diagnostics", taxId: "33-4567890", phone: "(800) 755-9596", email: "results@genoptix.com", city: "Carlsbad", state: "CA", vendorType: "LAB_SERVICES", notes: "Hematopathology and molecular cancer testing." },
    { name: "Conifer Health Solutions", taxId: "27-5678901", phone: "(877) 266-4337", email: "info@coniferhealth.com", city: "Frisco", state: "TX", vendorType: "BILLING", notes: "Patient access, financial clearance, and billing." },
    { name: "GoodRx Pro Partner Network", taxId: "45-6789012", phone: "(888) 799-2553", email: "partners@goodrx.com", city: "Santa Monica", state: "CA", vendorType: "PHARMACY", notes: "Prescription savings programs and pharmacy integration." },

    { name: "Baxter Healthcare Products", taxId: "36-7890123", phone: "(800) 422-9837", email: "customer_service@baxter.com", city: "Deerfield", state: "IL", vendorType: "MEDICAL_SUPPLIES", notes: "IV fluids, renal dialysis supplies, and infusion pumps." },
    { name: "eClinicalWorks EHR Solutions", taxId: "04-8901234", phone: "(866) 888-6929", email: "sales@eclinicalworks.com", city: "Westborough", state: "MA", vendorType: "IT_SERVICES", notes: "Ambulatory EHR and population health software." },
    { name: "NeoGenomics Laboratories", taxId: "20-9012345", phone: "(866) 776-5907", email: "client.services@neogenomics.com", city: "Fort Myers", state: "FL", vendorType: "LAB_SERVICES", notes: "Cancer genetics and cytogenetics reference lab." },
    { name: "Navicure Billing & Claims", taxId: "58-0123456", phone: "(877) 628-4287", email: "support@navicure.com", city: "Duluth", state: "GA", vendorType: "BILLING", notes: "Medical claim rejection management and analytics." },
    { name: "Express Scripts Pharmacy Direct", taxId: "43-1234567", phone: "(800) 282-2881", email: "specialty@express-scripts.com", city: "St. Louis", state: "MO", vendorType: "PHARMACY", notes: "Mail-order pharmacy and specialty medication delivery." },

    { name: "Becton Dickinson (BD) Med", taxId: "22-3456789", phone: "(800) 631-8067", email: "orders@bd.com", city: "Franklin Lakes", state: "NJ", vendorType: "MEDICAL_SUPPLIES", notes: "Syringes, needles, blood collection, and IV catheters." },
    { name: "NextGen Healthcare Systems", taxId: "95-4567890", phone: "(800) 888-8092", email: "info@nextgen.com", city: "Irvine", state: "CA", vendorType: "IT_SERVICES", notes: "Specialty-specific EHR and practice analytics." },
    { name: "Myriad Genetics Services", taxId: "87-5678901", phone: "(800) 469-7423", email: "support@myriad.com", city: "Salt Lake City", state: "UT", vendorType: "LAB_SERVICES", notes: "Hereditary cancer testing and biomarker panels." },
    { name: "GeBBS Healthcare Solutions", taxId: "20-6789012", phone: "(888) 924-3227", email: "info@gebbs.com", city: "Towson", state: "MD", vendorType: "BILLING", notes: "HIM coding, auditing, and clinical documentation." },
    { name: "OptumRx Pharmacy Solutions", taxId: "41-7890123", phone: "(800) 791-7658", email: "pharmacy@optum.com", city: "Eden Prairie", state: "MN", vendorType: "PHARMACY", notes: "Integrated pharmacy care and specialty dispensing." },

    { name: "Olympus Medical Systems", taxId: "11-8901234", phone: "(800) 848-9024", email: "service@olympus.com", city: "Center Valley", state: "PA", vendorType: "MEDICAL_SUPPLIES", notes: "Endoscopes, surgical videoscopes, and reprocessing equipment." },
    { name: "Teladoc Health Integration", taxId: "30-9012345", phone: "(800) 835-2362", email: "enterprise@teladochealth.com", city: "Purchase", state: "NY", vendorType: "IT_SERVICES", notes: "Virtual care platform, remote patient monitoring." },
    { name: "Aegis Sciences Reference Lab", taxId: "62-0123456", phone: "(800) 533-7052", email: "info@aegislabs.com", city: "Nashville", state: "TN", vendorType: "LAB_SERVICES", notes: "Toxicology, medication monitoring, and sports testing." },
    { name: "Availity Revenue Clearinghouse", taxId: "59-1234567", phone: "(800) 282-4548", email: "support@availity.com", city: "Jacksonville", state: "FL", vendorType: "BILLING", notes: "Payer coverage verification and claims management." },
    { name: "Liviniti PBM Network", taxId: "47-2345678", phone: "(800) 710-9341", email: "clients@liviniti.com", city: "Conway", state: "AR", vendorType: "PHARMACY", notes: "Transparent PBM and prescription rebate administration." },

    { name: "Zimmer Biomet Devices", taxId: "35-3456789", phone: "(800) 613-6131", email: "orders@zimmerbiomet.com", city: "Warsaw", state: "IN", vendorType: "MEDICAL_SUPPLIES", notes: "Joint replacement implants and dental bone grafts." },
    { name: "Kareo Clinical Software", taxId: "20-4567890", phone: "(888) 773-2401", email: "sales@kareo.com", city: "Irvine", state: "CA", vendorType: "IT_SERVICES", notes: "Independent practice EHR and patient billing." },
  ];

  // Stop-Loss Carriers & Underwriters Pool for randomized realistic B&E multi-year seeding
  const stopLossCarriers = [
    { carrier: "HCC Life", mgu: "HCC Life Insurance" },
    { carrier: "Sun Life Assurance", mgu: "Sun Life Financial" },
    { carrier: "Voya Financial", mgu: "Voya Stop-Loss" },
    { carrier: "Symetra Life Insurance", mgu: "Symetra Financial" },
    { carrier: "Tokio Marine HCC", mgu: "Tokio Marine Stop-Loss" },
    { carrier: "Swiss Re Corporate Solutions", mgu: "Swiss Re Underwriters" },
    { carrier: "Optum Financial", mgu: "Optum Stop-Loss" },
    { carrier: "Companion Life", mgu: "Companion MGU" },
    { carrier: "Berkshire Hathaway Specialty", mgu: "Berkshire Hathaway Underwriters" },
    { carrier: "HM Insurance Group", mgu: "HM Stop-Loss Services" },
  ];

  const pbmProviders = [
    "Liviniti",
    "Express Scripts",
    "CVS Caremark",
    "OptumRx",
    "MedImpact",
    "Capital Rx",
    "Elixir Rx",
    "Navitus Health Solutions",
  ];

  // 1. Create Clients / Groups
  const createdClients = [];
  for (const c of clientData) {
    const client = await prisma.client.create({
      data: c,
    });
    createdClients.push(client);
  }

  // 2. Create Vendors
  const createdVendors = [];
  for (const v of vendorData) {
    const vendor = await prisma.vendor.create({
      data: {
        ...v,
        address: `${Math.floor(100 + Math.random() * 9000)} Main St`,
        zipCode: String(10000 + Math.floor(Math.random() * 89999)),
        status: "ACTIVE",
      },
    });
    createdVendors.push(vendor);
  }

  // 3. Create Multi-Year B&E Records for each Group (2026, 2025, 2024, 2023)
  console.log("Generating multi-year B&E records for all 28 groups...");
  const planYears = ["2026", "2025", "2024", "2023"];

  for (let i = 0; i < createdClients.length; i++) {
    const client = createdClients[i];

    for (let yIdx = 0; yIdx < planYears.length; yIdx++) {
      const year = planYears[yIdx];
      const isCurrent = yIdx === 0; // 2026 is current

      const carrierObj = stopLossCarriers[(i + yIdx) % stopLossCarriers.length];
      const priorCarrierObj = stopLossCarriers[(i + yIdx + 1) % stopLossCarriers.length];
      const pbm = pbmProviders[(i + yIdx) % pbmProviders.length];

      const singleCount = Math.floor(80 + Math.random() * 150 - yIdx * 5);
      const emp1Count = Math.floor(25 + Math.random() * 50 - yIdx * 2);
      const familyCount = Math.floor(20 + Math.random() * 40 - yIdx * 2);
      const totalCount = singleCount + emp1Count + familyCount;

      const specDeductible = `$${(50 + ((i * 5 + yIdx * 10) % 75)).toFixed(0)},000.00 per individual`;
      const specSingle = `$${(140 + i * 2.5 + yIdx * 8).toFixed(2)}`;
      const specEmp1 = `$${(260 + i * 4.5 + yIdx * 14).toFixed(2)}`;
      const specFam = `$${(400 + i * 6.5 + yIdx * 20).toFixed(2)}`;

      const aggPrem = `$${(6.5 + (i % 4) * 0.4 + yIdx * 0.3).toFixed(2)}`;
      const aggFactorSingle = `$${(380 + i * 5).toFixed(2)}`;
      const aggFactorEmp1 = `$${(720 + i * 8).toFixed(2)}`;
      const aggFactorFam = `$${(1100 + i * 12).toFixed(2)}`;

      const compAdmin = `$${(48 + (i % 6) + yIdx * 2).toFixed(2)} per employee per month`;
      const medFee = `Included ($${(45 + (i % 5)).toFixed(2)} PEPM)`;

      await prisma.clientBillingEnrollment.create({
        data: {
          clientId: client.id,
          planYear: year,
          startDate: `${year}-01-01`,
          endDate: `${year}-12-31`,
          isCurrent,
          currentStopLossCarrier: carrierObj.carrier,
          currentManagingGeneralUnderwriter: carrierObj.mgu,
          priorStopLossCarrier: priorCarrierObj.carrier,
          priorManagingGeneralUnderwriter: priorCarrierObj.mgu,
          specificDeductible: specDeductible,
          aggregatingSpecificDeductible: i % 3 === 0 ? "$10,000.00" : "No",
          noLaserRenewalGuarantee: i % 2 === 0 ? "Yes" : "No",
          maxSpecificPremiumRenewalIncrease: `${30 + (i % 4) * 5}%`,
          laseredIndividuals: i % 5 === 0 ? "1 individual at $150k" : "No",
          specificPremiumSingle: specSingle,
          specificPremiumEmployeePlusOne: specEmp1,
          specificPremiumFamily: specFam,
          specificBenefitsCovered: "Med/Rx",
          specificContract: "pi (paid & incurred) 12/12",
          aggregatePremium: aggPrem,
          monthlyAggregateAccommodation: "$1.50 (not included in aggregate premium)",
          aggregateFactorSingle: aggFactorSingle,
          aggregateFactorEmployeePlusOne: aggFactorEmp1,
          aggregateFactorFamily: aggFactorFam,
          aggregateMinAttachmentPoint: `$${(1200000 + i * 45000 - yIdx * 50000).toLocaleString("en-US")}.00`,
          aggregateBenefitsCovered: "Med/Rx",
          aggregateContract: "pi (paid & incurred) 12/12",
          aggregateRunInLimit: "No",
          organTransplantPolicy: i % 4 === 0 ? "Yes (Rider Included)" : "No",
          compositeAdminFee: compAdmin,
          medicalFee: medFee,
          urFee: "Included ($2.85 per employee per month)",
          amwellFee: "Included ($0.45 per employee per month)",
          physiciansCareHapFee: "Included ($10.00 per employee per month)",
          wrapNetwork: "Aetna 25% | Valenz Open Access 25% | Fair Cost 25%",
          aetnaSignatureAdminFee: "Included ($17.00 per employee per month)",
          networkAccessFee: "Included ($16.25 per employee per month)",
          reinsuranceFee: "Included ($0.75 per employee per month)",
          lcmSpaFee: "$149.00 per hour ($18.00 to ASR)",
          agentFee: `$${(28 + (i % 5)).toFixed(2)} per employee per month`,
          ppoFee: "$9.00 per employee per month for primary network option enrollees",
          pbmRx: pbm,
          rxIncludedInAsrReporting: "Yes",
          isRxAsrContract: i % 2 === 0 ? "Yes" : "No",
          pbmAgentCompensation: "No",
          stopLossCommission: "0% of stop-loss premium",
          stopLossOtherCompensation: "3% of stop-loss premium",
          commissionAgentCompensation: "No",
          figuresSingle: String(singleCount),
          figuresEmployeePlusOne: String(emp1Count),
          figuresFamily: String(familyCount),
          figuresTotal: String(totalCount),
          domesticClaims: "No",
          notes: `${year} Plan Year specifications for ${client.name}. Contract executed and active.`,
        },
      });
    }
  }

  // 4. Link Clients and Vendors (3-5 Vendors per Client)
  console.log("Linking Clients and Vendors (many-to-many)...");
  const associations = [];
  for (let i = 0; i < createdClients.length; i++) {
    const client = createdClients[i];
    // Pick 3 to 5 vendors deterministically for each client
    const numVendors = 3 + (i % 3);
    for (let v = 0; v < numVendors; v++) {
      const vendorIdx = (i * 3 + v) % createdVendors.length;
      const vendor = createdVendors[vendorIdx];
      associations.push({
        clientId: client.id,
        vendorId: vendor.id,
        notes: `Primary vendor for ${vendor.vendorType.replace("_", " ").toLowerCase()} services under contract #${1000 + i * 10 + v}.`,
      });
    }
  }
  await prisma.clientVendor.createMany({ data: associations });

  // 5. Seed Point of Contacts for Clients and Vendors
  console.log("Seeding Key Contacts...");
  const contactList = [];
  const titles = [
    "Chief Executive Officer",
    "Chief Medical Officer",
    "VP of Supply Chain",
    "Director of Human Resources",
    "Billing Manager",
    "Chief Information Officer",
    "Practice Administrator",
  ];

  for (let i = 0; i < createdClients.length; i++) {
    const client = createdClients[i];
    const domain = client.email ? client.email.split("@")[1] : "healthorg.com";
    contactList.push({
      clientId: client.id,
      name: `Dr. ${["Sarah Jenkins", "Michael Vance", "Amanda Ross", "David Sterling", "Elizabeth Taylor", "Robert Chen"][i % 6]}`,
      title: titles[i % titles.length],
      phone: `(555) ${100 + i}-${2000 + i}`,
      email: `contact_${i + 1}@${domain}`,
      notes: "Primary executive point of contact for network operations.",
    });
  }

  for (let v = 0; v < createdVendors.length; v += 2) {
    const vendor = createdVendors[v];
    const domain = vendor.email ? vendor.email.split("@")[1] : "vendor.com";
    contactList.push({
      vendorId: vendor.id,
      name: `${["James Wilson", "Karen Martinez", "Christopher Lee", "Laura Adams", "Daniel Kowalski"][v % 5]}`,
      title: "Senior Account Manager",
      phone: vendor.phone,
      email: `account_rep@${domain}`,
      notes: "Dedicated client account executive for escalation and orders.",
    });
  }
  await prisma.contact.createMany({ data: contactList });

  // 6. Seed Change History Timelines
  console.log("Seeding Change History Timelines...");
  const historyList = [];
  const now = Date.now();

  for (let i = 0; i < createdClients.length; i += 2) {
    const client = createdClients[i];
    const t0 = new Date(now - (60 + i * 2) * 24 * 60 * 60 * 1000);
    const t1 = new Date(now - (30 + i) * 24 * 60 * 60 * 1000);

    historyList.push(
      {
        entityType: "CLIENT",
        entityId: client.id,
        clientId: client.id,
        action: "CREATE",
        summary: "Initial group registration created",
        changes: JSON.stringify([]),
        snapshot: JSON.stringify({
          name: client.name,
          taxId: client.taxId,
          npiNumber: client.npiNumber,
          phone: client.phone,
          email: client.email,
          status: "PENDING",
          notes: "Initial registration submission.",
        }),
        createdAt: t0,
      },
      {
        entityType: "CLIENT",
        entityId: client.id,
        clientId: client.id,
        action: "STATUS_CHANGE",
        summary: "Updated Account Status to ACTIVE",
        changes: JSON.stringify([
          { field: "status", label: "Account Status", oldValue: "PENDING", newValue: "ACTIVE" },
        ]),
        snapshot: JSON.stringify({
          name: client.name,
          taxId: client.taxId,
          npiNumber: client.npiNumber,
          phone: client.phone,
          email: client.email,
          status: "ACTIVE",
          notes: client.notes,
        }),
        createdAt: t1,
      }
    );
  }
  await prisma.changeHistory.createMany({ data: historyList });

  console.log("Database successfully seeded with 28 Groups, 42 Vendors, 112 B&E records, and rich histories!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
