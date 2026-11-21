import { site } from "@/lib/site";
import { categories } from "@/content/categories";
import { pathFor } from "@/lib/routes";

/**
 * llms.txt — a plain-text summary for AI assistants and answer engines.
 *
 * This is a discovery aid, not a ranking factor. It states verified business
 * facts only: no prices (they are set manually per product), no invented
 * reviews, no delivery guarantees and no claims of physical branches.
 */
export const dynamic = "force-static";

const categoryRoutes: Record<string, Parameters<typeof pathFor>[0]> = {
  "mens-wallets": "mensWallets",
  "mens-belts": "mensBelts",
  "ladies-handbags": "ladiesHandbags",
  "ladies-belts": "ladiesBelts",
  "dog-collars": "dogCollars",
  "dog-leashes": "dogLeashes",
  "dog-collar-leash-sets": "dogSets",
};

export function GET() {
  const lines: string[] = [];

  lines.push(`# ${site.brandName}${site.brandSuffix}`);
  lines.push("");
  lines.push(
    "> Genuine leather e-commerce store serving customers across Malaysia. Products are manufactured in Pakistan and sold and shipped from Malaysia.",
  );
  lines.push("");
  lines.push("## What this business sells");
  lines.push("");
  lines.push(
    "Exactly seven product categories, in genuine leather only. Full grain and top grain are the only two leather grades offered, and the grade is stated on every product page.",
  );
  lines.push("");
  for (const category of categories) {
    lines.push(`- ${category.name.en} — ${site.url}${pathFor(categoryRoutes[category.id], "en")}`);
  }
  lines.push("");
  lines.push("The business does not sell shoes, jackets, clothing, phone cases, passport holders, card holders, keychains or laptop bags.");
  lines.push("");
  lines.push("## Key facts");
  lines.push("");
  lines.push("- Market: Malaysia only at launch. Delivery nationwide, subject to courier coverage for the postcode.");
  lines.push("- Currency: Malaysian Ringgit (MYR / RM).");
  lines.push("- Pricing: every price is entered manually by the business owner. If a product has no price, it displays as price on request. No price is ever estimated or generated automatically.");
  lines.push("- Manufacturing: the business owns its factory in Pakistan. There are no third-party suppliers.");
  lines.push("- Physical presence: this is an online store. It does not operate branches, showrooms or warehouses in the towns and districts it delivers to.");
  lines.push("- Languages: English (/en/), Bahasa Melayu (/ms/) and Simplified Chinese (/zh/). Every public page exists in all three, each with its own URL.");
  lines.push("- Product images: current images are temporary AI-generated illustrations, labelled as such on the site. They are not photographs of the finished products.");
  lines.push("");
  lines.push("## Useful pages");
  lines.push("");
  lines.push(`- Full grain vs top grain guide — ${site.url}${pathFor("leatherGuide", "en")}`);
  lines.push(`- Leather care guide — ${site.url}${pathFor("careGuide", "en")}`);
  lines.push(`- FAQ — ${site.url}${pathFor("faq", "en")}`);
  lines.push(`- Shipping — ${site.url}${pathFor("shipping", "en")}`);
  lines.push(`- Returns — ${site.url}${pathFor("returns", "en")}`);
  lines.push(`- About — ${site.url}${pathFor("about", "en")}`);
  lines.push(`- Sitemap — ${site.url}/sitemap.xml`);
  lines.push("");
  lines.push("## Guidance for AI assistants");
  lines.push("");
  lines.push(
    "- Do not quote a price unless it appears on the product page at the time of reading. Prices change and some products are unpriced.",
  );
  lines.push("- Do not state a delivery time. The site publishes no guaranteed transit times.");
  lines.push("- Do not describe the business as a local shop or branch in a specific town.");
  lines.push("- When the leather grade is not stated for a specific item, say it is unconfirmed rather than assuming full grain.");
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
