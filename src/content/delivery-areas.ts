import type { Locale } from "@/i18n/config";

/**
 * Malaysian delivery areas.
 *
 * Scope, deliberately: **major towns and cities the shop can actually name**,
 * not every mukim and taman in the country. A location page is only worth
 * publishing if it says something true and specific, and inventing 1,000 area
 * pages from a postal-code dump would produce exactly the thin, near-duplicate
 * content search engines penalise and customers bounce from.
 *
 * Every field here is a geographic fact that can be checked against a map or a
 * postal-code directory. Nothing in this file promises anything about delivery
 * times, fees or coverage — those are business commitments the owner has not
 * published, and they are handled (honestly) at the page level.
 *
 * Adding an area means adding an entry here. The page, sitemap, internal links
 * and language switching all derive from this list, so a new city appears
 * everywhere at once.
 */

export interface DeliveryArea {
  /** URL segment, lowercase with hyphens. Stable — do not change casually. */
  slug: string;
  /** Localised display name. */
  name: Record<Locale, string>;
  /** Official state code from `malaysianStates`. */
  stateCode: string;
  /**
   * Representative postcodes, shown as a delivery hint.
   *
   * A two-digit prefix (`50` covers 50000–50999) is the honest granularity:
   * listing every postcode would imply a precision about coverage the shop does
   * not have. Where two towns genuinely share a prefix — Subang Jaya and
   * Puchong both sit under 47 — the five-digit ranges are given instead, so the
   * two pages do not print the identical line.
   */
  postcodes: string[];
  /**
   * Whether this is a major population centre, used to decide which areas get
   * the most prominent internal links. Not a claim about demand.
   */
  major: boolean;
}

export const deliveryAreas: DeliveryArea[] = [
  // --- Klang Valley -------------------------------------------------------
  {
    slug: "kuala-lumpur",
    name: { en: "Kuala Lumpur", ms: "Kuala Lumpur", zh: "吉隆坡" },
    stateCode: "KUL",
    postcodes: ["50"],
    major: true,
  },
  {
    slug: "petaling-jaya",
    name: { en: "Petaling Jaya", ms: "Petaling Jaya", zh: "八打灵再也" },
    stateCode: "SGR",
    postcodes: ["46"],
    major: true,
  },
  {
    slug: "shah-alam",
    name: { en: "Shah Alam", ms: "Shah Alam", zh: "莎阿南" },
    stateCode: "SGR",
    postcodes: ["40"],
    major: true,
  },
  {
    slug: "subang-jaya",
    name: { en: "Subang Jaya", ms: "Subang Jaya", zh: "梳邦再也" },
    stateCode: "SGR",
    // USJ 47500–47630. Puchong shares the 47 prefix, so the range is needed.
    postcodes: ["47500–47630"],
    major: true,
  },
  {
    slug: "klang",
    name: { en: "Klang", ms: "Klang", zh: "巴生" },
    stateCode: "SGR",
    postcodes: ["41"],
    major: false,
  },
  {
    slug: "puchong",
    name: { en: "Puchong", ms: "Puchong", zh: "蒲种" },
    stateCode: "SGR",
    postcodes: ["47100–47190"],
    major: false,
  },
  {
    slug: "cheras",
    name: { en: "Cheras", ms: "Cheras", zh: "蕉赖" },
    stateCode: "KUL",
    postcodes: ["56"],
    major: false,
  },
  {
    slug: "ampang",
    name: { en: "Ampang", ms: "Ampang", zh: "安邦" },
    stateCode: "SGR",
    postcodes: ["68"],
    major: false,
  },
  {
    slug: "kajang",
    name: { en: "Kajang", ms: "Kajang", zh: "加影" },
    stateCode: "SGR",
    postcodes: ["43"],
    major: false,
  },
  {
    slug: "putrajaya",
    name: { en: "Putrajaya", ms: "Putrajaya", zh: "布城" },
    stateCode: "PJY",
    postcodes: ["62"],
    major: false,
  },
  {
    slug: "cyberjaya",
    name: { en: "Cyberjaya", ms: "Cyberjaya", zh: "赛城" },
    stateCode: "SGR",
    postcodes: ["63"],
    major: false,
  },
  {
    slug: "rawang",
    name: { en: "Rawang", ms: "Rawang", zh: "万挠" },
    stateCode: "SGR",
    postcodes: ["48"],
    major: false,
  },

  // --- Northern region ----------------------------------------------------
  {
    slug: "george-town",
    name: { en: "George Town", ms: "George Town", zh: "乔治市" },
    stateCode: "PNG",
    postcodes: ["10"],
    major: true,
  },
  {
    slug: "butterworth",
    name: { en: "Butterworth", ms: "Butterworth", zh: "北海" },
    stateCode: "PNG",
    postcodes: ["12"],
    major: false,
  },
  {
    slug: "bukit-mertajam",
    name: { en: "Bukit Mertajam", ms: "Bukit Mertajam", zh: "大山脚" },
    stateCode: "PNG",
    postcodes: ["14"],
    major: false,
  },
  {
    slug: "ipoh",
    name: { en: "Ipoh", ms: "Ipoh", zh: "怡保" },
    stateCode: "PRK",
    postcodes: ["30"],
    major: true,
  },
  {
    slug: "alor-setar",
    name: { en: "Alor Setar", ms: "Alor Setar", zh: "亚罗士打" },
    stateCode: "KDH",
    postcodes: ["05"],
    major: true,
  },
  {
    slug: "sungai-petani",
    name: { en: "Sungai Petani", ms: "Sungai Petani", zh: "双溪大年" },
    stateCode: "KDH",
    postcodes: ["08"],
    major: false,
  },
  {
    slug: "kangar",
    name: { en: "Kangar", ms: "Kangar", zh: "加央" },
    stateCode: "PLS",
    postcodes: ["01"],
    major: false,
  },

  // --- Southern region ----------------------------------------------------
  {
    slug: "johor-bahru",
    name: { en: "Johor Bahru", ms: "Johor Bahru", zh: "新山" },
    stateCode: "JHR",
    postcodes: ["80"],
    major: true,
  },
  {
    slug: "batu-pahat",
    name: { en: "Batu Pahat", ms: "Batu Pahat", zh: "峇株巴辖" },
    stateCode: "JHR",
    postcodes: ["83"],
    major: false,
  },
  {
    slug: "muar",
    name: { en: "Muar", ms: "Muar", zh: "麻坡" },
    stateCode: "JHR",
    postcodes: ["84"],
    major: false,
  },
  {
    slug: "melaka-city",
    name: { en: "Melaka City", ms: "Bandar Melaka", zh: "马六甲市" },
    stateCode: "MLK",
    postcodes: ["75"],
    major: true,
  },
  {
    slug: "seremban",
    name: { en: "Seremban", ms: "Seremban", zh: "芙蓉" },
    stateCode: "NSN",
    postcodes: ["70"],
    major: true,
  },

  // --- East coast ---------------------------------------------------------
  {
    slug: "kuantan",
    name: { en: "Kuantan", ms: "Kuantan", zh: "关丹" },
    stateCode: "PHG",
    postcodes: ["25"],
    major: true,
  },
  {
    slug: "kota-bharu",
    name: { en: "Kota Bharu", ms: "Kota Bharu", zh: "哥打巴鲁" },
    stateCode: "KTN",
    postcodes: ["15"],
    major: true,
  },
  {
    slug: "kuala-terengganu",
    name: { en: "Kuala Terengganu", ms: "Kuala Terengganu", zh: "瓜拉登嘉楼" },
    stateCode: "TRG",
    postcodes: ["20"],
    major: true,
  },

  // --- East Malaysia ------------------------------------------------------
  {
    slug: "kota-kinabalu",
    name: { en: "Kota Kinabalu", ms: "Kota Kinabalu", zh: "亚庇" },
    stateCode: "SBH",
    postcodes: ["88"],
    major: true,
  },
  {
    slug: "sandakan",
    name: { en: "Sandakan", ms: "Sandakan", zh: "山打根" },
    stateCode: "SBH",
    postcodes: ["90"],
    major: false,
  },
  {
    slug: "tawau",
    name: { en: "Tawau", ms: "Tawau", zh: "斗湖" },
    stateCode: "SBH",
    postcodes: ["91"],
    major: false,
  },
  {
    slug: "kuching",
    name: { en: "Kuching", ms: "Kuching", zh: "古晋" },
    stateCode: "SWK",
    postcodes: ["93"],
    major: true,
  },
  {
    slug: "miri",
    name: { en: "Miri", ms: "Miri", zh: "美里" },
    stateCode: "SWK",
    postcodes: ["98"],
    major: false,
  },
  {
    slug: "sibu",
    name: { en: "Sibu", ms: "Sibu", zh: "诗巫" },
    stateCode: "SWK",
    postcodes: ["96"],
    major: false,
  },
  {
    slug: "labuan",
    name: { en: "Labuan", ms: "Labuan", zh: "纳闽" },
    stateCode: "LBN",
    postcodes: ["87"],
    major: false,
  },
];

export const areaBySlug = new Map(deliveryAreas.map((area) => [area.slug, area]));

/**
 * The postcode label to display for an area.
 *
 * A bare two-digit prefix renders as a range ("50xxx") because that is what it
 * means; an explicit five-digit range is shown as written.
 */
export function postcodeLabel(area: DeliveryArea): string {
  const [first] = area.postcodes;
  return /^\d{2}$/.test(first) ? `${first}xxx` : first;
}

/** Areas in one state, largest centres first. */
export function areasInState(stateCode: string): DeliveryArea[] {
  return deliveryAreas
    .filter((area) => area.stateCode === stateCode)
    .sort((a, b) => Number(b.major) - Number(a.major) || a.slug.localeCompare(b.slug));
}

/** States that have at least one area page, in the order states are defined. */
export function statesWithAreas(): string[] {
  return [...new Set(deliveryAreas.map((area) => area.stateCode))];
}

/**
 * Nearby areas: same state first, then adjacent population centres.
 *
 * "Adjacent" here means adjacent in this list, not geographically verified, so
 * it is presented as *more areas in the same state* rather than as "nearby" —
 * calling Cyberjaya and Rawang neighbours would be a geographic claim the data
 * does not support.
 */
export function sameStateAreas(slug: string): DeliveryArea[] {
  const area = areaBySlug.get(slug);
  if (!area) return [];
  return areasInState(area.stateCode).filter((entry) => entry.slug !== slug);
}

/** The largest centres, for the locations index and footer. */
export function majorAreas(): DeliveryArea[] {
  return deliveryAreas.filter((area) => area.major);
}
