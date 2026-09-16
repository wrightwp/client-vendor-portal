import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const DEFAULT_TEMPLATES = [
  {
    type: "COMPOSITE",
    name: "Composite",
    sections: [
      {
        id: "sec_composite_admin_net",
        title: "Administration & Network Information",
        fields: [
          { id: "fld_comp_admin", label: "Composite Administration Fee", defaultValue: "$0.00" },
          { id: "fld_med_fee", label: "Medical Fee", defaultValue: "$0.00" },
          { id: "fld_ur_fee", label: "UR Fee", defaultValue: "$0.00" },
          { id: "fld_amwell_fee", label: "Amwell Fee", defaultValue: "$0.00" },
          { id: "fld_phys_fee", label: "Physicians Care / HAP Fee", defaultValue: "$0.00" },
          { id: "fld_wrap_net", label: "Wrap Network", defaultValue: "None" },
          { id: "fld_aetna_fee", label: "Aetna Signature Admin Fee", defaultValue: "$0.00" },
          { id: "fld_net_access", label: "Network Access Fee", defaultValue: "$0.00" },
          { id: "fld_reinsurance", label: "Reinsurance Fee", defaultValue: "$0.00" },
          { id: "fld_lcm_spa", label: "LCM / SPA Fee", defaultValue: "$0.00" },
          { id: "fld_agent_fee", label: "Agent Fee", defaultValue: "$0.00" },
          { id: "fld_ppo_fee", label: "PPO Fee", defaultValue: "$0.00" },
        ],
      },
    ],
  },
  {
    type: "NON_COMPOSITE",
    name: "Non-Composite",
    sections: [
      {
        id: "sec_non_comp_admin",
        title: "Administration",
        fields: [
          { id: "fld_nc_admin_fee", label: "Administration Fee", defaultValue: "$0.00" },
          { id: "fld_nc_med_fee", label: "Medical Fee", defaultValue: "$0.00" },
          { id: "fld_nc_ur_fee", label: "UR Fee", defaultValue: "$0.00" },
          { id: "fld_nc_amwell_fee", label: "Amwell Fee", defaultValue: "$0.00" },
          { id: "fld_nc_phys_fee", label: "Physicians Care / HAP Fee", defaultValue: "$0.00" },
        ],
      },
      {
        id: "sec_non_comp_net",
        title: "Network Information",
        fields: [
          { id: "fld_nc_wrap_net", label: "Wrap Network", defaultValue: "None" },
          { id: "fld_nc_aetna_fee", label: "Aetna Signature Admin Fee", defaultValue: "$0.00" },
          { id: "fld_nc_net_access", label: "Network Access Fee", defaultValue: "$0.00" },
          { id: "fld_nc_reinsurance", label: "Reinsurance Fee", defaultValue: "$0.00" },
          { id: "fld_nc_lcm_spa", label: "LCM / SPA Fee", defaultValue: "$0.00" },
          { id: "fld_nc_agent_fee", label: "Agent Fee", defaultValue: "$0.00" },
          { id: "fld_nc_ppo_fee", label: "PPO Fee", defaultValue: "$0.00" },
        ],
      },
    ],
  },
  {
    type: "NON_MED",
    name: "Non-Med",
    sections: [
      {
        id: "sec_non_med",
        title: "Non-Med",
        fields: [
          { id: "fld_nm_dental_fee", label: "Dental Admin Fee", defaultValue: "$0.00" },
          { id: "fld_nm_vision_fee", label: "Vision Admin Fee", defaultValue: "$0.00" },
          { id: "fld_nm_hearing_fee", label: "Hearing Admin Fee", defaultValue: "$0.00" },
          { id: "fld_nm_std_fee", label: "Short Term Disability (STD) Fee", defaultValue: "$0.00" },
          { id: "fld_nm_life_fee", label: "Life / AD&D Fee", defaultValue: "$0.00" },
        ],
      },
    ],
  },
];

export async function GET() {
  try {
    let templates = await db.bEMasterTemplate.findMany({
      orderBy: { createdAt: "asc" },
    });

    // Seed defaults if empty
    if (templates.length === 0) {
      for (const t of DEFAULT_TEMPLATES) {
        await db.bEMasterTemplate.create({
          data: {
            type: t.type,
            name: t.name,
            sections: JSON.stringify(t.sections),
          },
        });
      }
      templates = await db.bEMasterTemplate.findMany({
        orderBy: { createdAt: "asc" },
      });
    }

    const parsedTemplates = templates.map((t) => ({
      ...t,
      sections: JSON.parse(t.sections || "[]"),
    }));

    return NextResponse.json({
      success: true,
      templates: parsedTemplates,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, name, sections } = body;

    if (!type) {
      return NextResponse.json({ success: false, error: "Template type is required" }, { status: 400 });
    }

    const sectionsJson = JSON.stringify(sections || []);

    const updated = await db.bEMasterTemplate.upsert({
      where: { type },
      update: {
        name: name || (type === "COMPOSITE" ? "Composite" : type === "NON_COMPOSITE" ? "Non-Composite" : "Non-Med"),
        sections: sectionsJson,
      },
      create: {
        type,
        name: name || (type === "COMPOSITE" ? "Composite" : type === "NON_COMPOSITE" ? "Non-Composite" : "Non-Med"),
        sections: sectionsJson,
      },
    });

    return NextResponse.json({
      success: true,
      template: {
        ...updated,
        sections: JSON.parse(updated.sections),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
