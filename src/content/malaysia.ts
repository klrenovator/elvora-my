import type { Locale } from "@/i18n/config";

/**
 * Malaysian states and federal territories.
 *
 * This is the same list used by the checkout address form and, later, by the
 * location SEO architecture in Phase 4 — so it is defined once here rather
 * than duplicated. Names are given in all three storefront languages.
 *
 * Codes follow the official ISO 3166-2:MY subdivisions.
 */
export interface MalaysianState {
  code: string;
  name: Record<Locale, string>;
  /** True for the three federal territories, which are not states. */
  federalTerritory: boolean;
  /** True for Sabah, Sarawak and Labuan — relevant to delivery expectations. */
  eastMalaysia: boolean;
}

export const malaysianStates: MalaysianState[] = [
  {
    code: "JHR",
    name: { en: "Johor", ms: "Johor", zh: "柔佛" },
    federalTerritory: false,
    eastMalaysia: false,
  },
  {
    code: "KDH",
    name: { en: "Kedah", ms: "Kedah", zh: "吉打" },
    federalTerritory: false,
    eastMalaysia: false,
  },
  {
    code: "KTN",
    name: { en: "Kelantan", ms: "Kelantan", zh: "吉兰丹" },
    federalTerritory: false,
    eastMalaysia: false,
  },
  {
    code: "MLK",
    name: { en: "Melaka", ms: "Melaka", zh: "马六甲" },
    federalTerritory: false,
    eastMalaysia: false,
  },
  {
    code: "NSN",
    name: { en: "Negeri Sembilan", ms: "Negeri Sembilan", zh: "森美兰" },
    federalTerritory: false,
    eastMalaysia: false,
  },
  {
    code: "PHG",
    name: { en: "Pahang", ms: "Pahang", zh: "彭亨" },
    federalTerritory: false,
    eastMalaysia: false,
  },
  {
    code: "PRK",
    name: { en: "Perak", ms: "Perak", zh: "霹雳" },
    federalTerritory: false,
    eastMalaysia: false,
  },
  {
    code: "PLS",
    name: { en: "Perlis", ms: "Perlis", zh: "玻璃市" },
    federalTerritory: false,
    eastMalaysia: false,
  },
  {
    code: "PNG",
    name: { en: "Penang", ms: "Pulau Pinang", zh: "槟城" },
    federalTerritory: false,
    eastMalaysia: false,
  },
  {
    code: "SBH",
    name: { en: "Sabah", ms: "Sabah", zh: "沙巴" },
    federalTerritory: false,
    eastMalaysia: true,
  },
  {
    code: "SWK",
    name: { en: "Sarawak", ms: "Sarawak", zh: "砂拉越" },
    federalTerritory: false,
    eastMalaysia: true,
  },
  {
    code: "SGR",
    name: { en: "Selangor", ms: "Selangor", zh: "雪兰莪" },
    federalTerritory: false,
    eastMalaysia: false,
  },
  {
    code: "TRG",
    name: { en: "Terengganu", ms: "Terengganu", zh: "登嘉楼" },
    federalTerritory: false,
    eastMalaysia: false,
  },
  {
    code: "KUL",
    name: { en: "Kuala Lumpur", ms: "Kuala Lumpur", zh: "吉隆坡" },
    federalTerritory: true,
    eastMalaysia: false,
  },
  {
    code: "LBN",
    name: { en: "Labuan", ms: "Labuan", zh: "纳闽" },
    federalTerritory: true,
    eastMalaysia: true,
  },
  {
    code: "PJY",
    name: { en: "Putrajaya", ms: "Putrajaya", zh: "布城" },
    federalTerritory: true,
    eastMalaysia: false,
  },
];

export const stateByCode = new Map(malaysianStates.map((state) => [state.code, state]));

export function isMalaysianStateCode(code: string): boolean {
  return stateByCode.has(code);
}
