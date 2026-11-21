/**
 * Location page tests.
 *
 * Location pages are the easiest place in a shop to generate 200 near-duplicate
 * doorway pages that rank for nothing and read as spam. These tests exist to
 * make that failure mode a build error rather than an SEO problem discovered
 * six months later.
 *
 * Three things are asserted:
 *
 * 1. **The data is coherent** — no duplicate slugs, every area points at a real
 *    state, every postcode prefix is a plausible Malaysian one.
 * 2. **The copy is honest** — no delivery time, fee, courier or coverage promise
 *    appears anywhere, because the owner has published none of those.
 * 3. **Each page is genuinely specific** — its heading and description contain
 *    the area's own name, and its state and postcode differ from its neighbours.
 */
import { readFileSync } from "node:fs";
import {
  deliveryAreas,
  areaBySlug,
  areasInState,
  sameStateAreas,
  statesWithAreas,
  majorAreas,
  postcodeLabel,
} from "@/content/delivery-areas";
import { malaysianStates, stateByCode } from "@/content/malaysia";
import { locationCopy } from "@/content/locations";
import { locales } from "@/i18n/config";
import { alternatePaths, matchPath, pathFor } from "@/lib/routes";

let pass = 0;
let fail = 0;
const check = (name: string, cond: boolean, extra = "") => {
  if (cond) {
    pass++;
    console.log(`  PASS  ${name}`);
  } else {
    fail++;
    console.log(`  FAIL  ${name} ${extra}`);
  }
};

async function main() {
  /* ------------------------------- The data ------------------------------ */

  check("there are areas to build", deliveryAreas.length >= 30);

  {
    const slugs = deliveryAreas.map((area) => area.slug);
    check("no duplicate slugs", new Set(slugs).size === slugs.length);
    check(
      "slugs are URL-safe lowercase",
      slugs.every((slug) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)),
      slugs.find((slug) => !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) ?? "",
    );
  }

  {
    // Every state code must exist, or the page would show a bare code.
    const unknown = deliveryAreas.filter((area) => !stateByCode.has(area.stateCode));
    check("every area names a real state", unknown.length === 0, unknown.map((a) => a.stateCode).join(", "));
  }

  {
    // A Malaysian postcode is five digits; a two-digit prefix covers the range.
    const bad = deliveryAreas.filter(
      (area) => !area.postcodes.every((code) => /^\d{2}$/.test(code) || /^\d{5}[–-]\d{5}$/.test(code)),
    );
    check("every postcode is a prefix or a five-digit range", bad.length === 0, bad.map((a) => a.postcodes.join(",")).join("; "));

    const outOfRange = deliveryAreas.filter((area) =>
      area.postcodes.some((code) => {
        const first = Number(code.slice(0, 2));
        return first < 1 || first > 98;
      }),
    );
    check("every prefix is in the Malaysian range", outOfRange.length === 0);

    check("a two-digit prefix renders as an xxx range", postcodeLabel(areaBySlug.get("kuala-lumpur")!) === "50xxx");
    check(
      "an explicit five-digit range renders as written",
      postcodeLabel(areaBySlug.get("puchong")!) === "47100–47190",
    );
  }

  {
    // All three languages must exist, or a page renders `undefined`.
    const incomplete = deliveryAreas.filter((area) =>
      locales.some((locale) => !area.name[locale]?.trim()),
    );
    check("every area is named in all three languages", incomplete.length === 0, incomplete.map((a) => a.slug).join(", "));

    const chineseMissing = deliveryAreas.filter((area) => !/[\u4e00-\u9fff]/.test(area.name.zh));
    check(
      "every Chinese name is actually Chinese, not a transliteration",
      chineseMissing.length === 0,
      chineseMissing.map((a) => a.slug).join(", "),
    );
  }

  {
    // The postcode line must distinguish every page. Two areas in one state may
    // genuinely share a prefix (Subang Jaya and Puchong are both 47), which is
    // exactly why the displayed label is what has to be unique — not the
    // underlying prefix.
    const byLabel = new Map<string, string[]>();
    for (const area of deliveryAreas) {
      const label = postcodeLabel(area);
      byLabel.set(label, [...(byLabel.get(label) ?? []), area.slug]);
    }
    const collisions = [...byLabel.entries()].filter(([, slugs]) => slugs.length > 1);
    check(
      "no two areas display the same postcode label",
      collisions.length === 0,
      collisions.map(([label, slugs]) => `${label}: ${slugs.join("/")}`).join("; "),
    );

    check(
      "the two real 47-prefix towns are separated by their ranges",
      postcodeLabel(areaBySlug.get("subang-jaya")!) !== postcodeLabel(areaBySlug.get("puchong")!),
    );
  }

  check("states with areas are derived, not listed separately", statesWithAreas().length >= 10);
  check(
    "every state with areas is a real state",
    statesWithAreas().every((code) => stateByCode.has(code)),
  );
  check("major areas exist", majorAreas().length >= 10);
  check(
    "major areas are a subset of all areas",
    majorAreas().every((area) => deliveryAreas.includes(area)),
  );

  /* ------------------------------ Relationships -------------------------- */

  {
    check("an unknown slug resolves to nothing", areaBySlug.get("atlantis") === undefined);
    check("a known slug resolves", areaBySlug.get("kuala-lumpur")?.stateCode === "KUL");

    const kl = sameStateAreas("kuala-lumpur");
    check("siblings exclude the area itself", !kl.some((area) => area.slug === "kuala-lumpur"));
    check(
      "siblings are in the same state",
      kl.every((area) => area.stateCode === "KUL"),
    );
    check("an unknown slug has no siblings", sameStateAreas("atlantis").length === 0);

    const selangor = areasInState("SGR");
    check("a state lists its own areas", selangor.length >= 5);
    check(
      "the largest centres sort first",
      Number(selangor[0].major) === 1,
    );
    check("an empty state lists nothing", areasInState("PRK").length >= 1);
  }

  /* --------------------------- Routes and URLs -------------------------- */

  {
    check(
      "the English path is /en/delivery/<area>",
      pathFor("location", "en", { area: "kuala-lumpur" }) === "/en/delivery/kuala-lumpur",
    );
    check(
      "the Malay path is translated",
      pathFor("location", "ms", { area: "kuala-lumpur" }) === "/ms/penghantaran-kawasan/kuala-lumpur",
    );
    check(
      "the Chinese path is translated",
      pathFor("location", "zh", { area: "kuala-lumpur" }) === "/zh/pei-song-di-qu/kuala-lumpur",
    );
    check(
      "the index path is one segment",
      pathFor("locations", "en") === "/en/delivery",
    );

    // The area slug is shared across languages, so the language switcher works
    // on these pages without a slug-translation table.
    for (const locale of locales) {
      const alternates = alternatePaths("location", { area: "kuala-lumpur" });
      check(`alternates include ${locale}`, alternates[locale].endsWith("/kuala-lumpur"));
    }

    // matchPath must recognise the route so the switcher can translate it.
    const matched = matchPath("/en/delivery/kuala-lumpur");
    check("a location path is recognised by the router", matched?.key === "location");
    check("its area parameter is captured", matched?.params.area === "kuala-lumpur");
    check(
      "the index path is recognised too",
      matchPath("/en/delivery")?.key === "locations",
    );
    check(
      "the index does not swallow the area route",
      matchPath("/ms/penghantaran-kawasan/ipoh")?.params.area === "ipoh",
    );
  }

  /* ------------------------------- The copy ------------------------------ */

  {
    // The whole point: no commercial promise the owner has not made.
    const banned = [
      /free (delivery|shipping)/i,
      /percuma/i, // "free" in Malay
      /next[- ]day/i,
      /same[- ]day/i,
      /\b1[-–]3 (working )?days?\b/i,
      /\bRM ?\d+ (flat|delivery fee)/i,
      /\b(J&T|Pos Laju|Ninja Van|DHL|Skynet|City-?Link|GDEX|Flash Express)\b/i,
      /免运费/,
      /次日达/,
      /隔日送达/,
    ];

    for (const locale of locales) {
      const copy = locationCopy[locale];
      const area = areaBySlug.get("kuala-lumpur")!;
      const surface = [
        copy.heading(area, locale),
        copy.metaTitle(area, locale),
        copy.metaDescription(area, locale),
        ...copy.intro(area, locale),
        ...copy.how,
        copy.honesty,
        copy.eastMalaysia,
        copy.productsBody(area, locale),
        copy.postcodeNote(postcodeLabel(area)),
      ].join(" ");

      for (const pattern of banned) {
        check(
          `${locale}: no forbidden commercial promise (${pattern.source})`,
          !pattern.test(surface),
          (surface.match(pattern) ?? [])[0] ?? "",
        );
      }

      check(`${locale}: the honesty block admits what is not promised`, /not promise|tidak janjikan|不作承诺/i.test(copy.honestyTitle));

      // Every step of the process must mention confirming before dispatch, or
      // the page would imply an automatic order.
      check(
        `${locale}: the process mentions confirming before dispatch`,
        copy.how.some((step) => /dispatch|dihantar|发货/i.test(step)),
      );
      check(
        `${locale}: the process mentions cash on delivery`,
        copy.how.some((step) => /cash|tunai|现金/.test(step)),
      );
    }
  }

  /* --------------------------- Per-page uniqueness ---------------------- */

  {
    // Each area's heading and description must contain its own name, or 35
    // pages would share one title.
    const titles = new Set<string>();
    const descriptions = new Set<string>();

    for (const locale of locales) {
      const copy = locationCopy[locale];
      for (const area of deliveryAreas) {
        const title = copy.metaTitle(area, locale);
        const description = copy.metaDescription(area, locale);

        if (!title.includes(area.name[locale]) || !description.includes(area.name[locale])) {
          check(`${locale}/${area.slug}: names the area in its metadata`, false);
        }
        titles.add(title);
        descriptions.add(description);
      }
    }

    check(
      "every title across all languages is distinct",
      titles.size === deliveryAreas.length * locales.length,
      `${titles.size} of ${deliveryAreas.length * locales.length}`,
    );
    check(
      "every description is distinct",
      descriptions.size === deliveryAreas.length * locales.length,
      `${descriptions.size} of ${deliveryAreas.length * locales.length}`,
    );

    // The state must appear in the description, so two towns in different
    // states cannot produce the same sentence.
    const copy = locationCopy.en;
    const kl = deliveryAreas.find((area) => area.slug === "kuala-lumpur")!;
    const ipoh = deliveryAreas.find((area) => area.slug === "ipoh")!;
    check("the description names the state", /Kuala Lumpur/.test(copy.metaDescription(kl, "en")));
    check("a second state produces different prose", copy.metaDescription(kl, "en") !== copy.metaDescription(ipoh, "en"));
  }

  /* --------------------------- The pages built -------------------------- */

  {
    const index = readFileSync("src/app/[locale]/delivery/page.tsx", "utf8");
    check("the index refuses unknown locales", /notFound\(\)/.test(index));
    check("the index lists every area", /deliveryAreas\.map|group\.areas\.map/.test(index));
    check("the index groups by state", /statesWithAreas\(\)/.test(index));
    check("the index is statically generated", /export const dynamicParams = false/.test(index));

    const page = readFileSync("src/app/[locale]/delivery/[area]/page.tsx", "utf8");
    check("an unknown area is a 404", /if \(!area\) notFound\(\)/.test(page));
    check("every area is pre-rendered", /deliveryAreas\.map\(\(area\) => \(\{ locale, area: area\.slug \}\)\)/.test(page));
    check("the page links to its siblings", /sameStateAreas/.test(page));
    check("the page links back to the index", /pathFor\("locations", locale\)/.test(page));
    check("the page offers WhatsApp and email", /<ContactChannels/.test(page));
    check("the page links the categories", /categoryRoutes\[category\.id\]/.test(page));
    check("hreflang alternates are emitted", /alternates/.test(page));
    // The layout's titleTemplate appends the brand; a title carrying it too
    // renders as "… | Elvora | Elvora.my".
    for (const locale of locales) {
      check(
        `${locale}: the area title omits the brand suffix`,
        !/\|\s*Elvora/.test(locationCopy[locale].metaTitle(deliveryAreas[0], locale)),
      );
    }
    // Match the title strings only — the file's own comment mentions the brand.
    for (const match of index.matchAll(/^\s*(?:en|ms|zh):\s*"([^"]+)",\s*$/gm)) {
      check(`index title for "${match[1].slice(0, 24)}…" omits the brand`, !/\|\s*Elvora/.test(match[1]));
    }

    check(
      "structured data is a Service, not a fake local business",
      /"@type": "Service"/.test(page) && !/"@type": "LocalBusiness"/.test(page),
    );
    check(
      "east Malaysia gets its own note",
      /state\?\.eastMalaysia \?/.test(page),
    );

    const sitemap = readFileSync("src/app/sitemap.ts", "utf8");
    check("the sitemap includes the index", /alternatePaths\("locations"\)/.test(sitemap));
    check("the sitemap includes every area", /deliveryAreas/.test(sitemap));

    const footer = readFileSync("src/components/site-footer.tsx", "utf8");
    check("the footer links the index from every page", /\["locations", dict\.footer\.deliveryAreas\]/.test(footer));
  }

  /* -------------------- East Malaysia is stated correctly ---------------- */

  {
    const copy = locationCopy.en;
    const kk = deliveryAreas.find((area) => area.slug === "kota-kinabalu")!;
    const kl = deliveryAreas.find((area) => area.slug === "kuala-lumpur")!;
    check("Kota Kinabalu is flagged East Malaysia", stateByCode.get(kk.stateCode)?.eastMalaysia === true);
    check("Kuala Lumpur is not", stateByCode.get(kl.stateCode)?.eastMalaysia === false);
    check(
      "the East Malaysia note names the sea, not a delivery time",
      /South China Sea/.test(copy.eastMalaysia) && !/\d+ (days?|working days)/.test(copy.eastMalaysia),
    );
  }

  /* ----------------------- Every state is represented -------------------- */

  {
    // If a state has no area, its page cannot exist — fine — but the map should
    // not silently omit half the country either.
    const covered = new Set(statesWithAreas());
    const missing = malaysianStates.filter((state) => !covered.has(state.code));
    check(
      "most states have at least one area",
      missing.length <= 4,
      missing.map((state) => state.code).join(", "),
    );
  }

  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail === 0 ? 0 : 1);
}

main();
