import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { PRESET_CATEGORIES, parseVendorCategories } from "@/lib/vendorCategories";

/**
 * GET /api/vendors/categories
 *
 * Returns all distinct vendor categories in the system (presets merged with
 * any custom categories found in the database).  Used by the tag-input
 * autocomplete dropdown.
 */
export async function GET() {
  try {
    const vendors = await db.vendor.findMany({
      select: { vendorType: true },
    });

    // Collect every individual category from every vendor
    const dbCats = new Set<string>();
    for (const v of vendors) {
      const tags = parseVendorCategories(v.vendorType);
      tags.forEach((t) => dbCats.add(t));
    }

    // Merge presets + DB categories, deduplicated case-insensitively
    const seen = new Set<string>();
    const all: string[] = [];

    for (const cat of PRESET_CATEGORIES) {
      const key = cat.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        all.push(cat);
      }
    }

    for (const cat of dbCats) {
      const key = cat.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        all.push(cat);
      }
    }

    return NextResponse.json({ success: true, categories: all });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
