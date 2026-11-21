import type { Locale } from "@/i18n/config";
import type { DeliveryArea } from "@/content/delivery-areas";
import { stateByCode } from "@/content/malaysia";
import { categories } from "@/content/categories";

/**
 * Copy for location pages.
 *
 * The hard rule for this file: **it states geography, and refuses to state
 * commercial terms the owner has not published.** There is no delivery time, no
 * fee, no courier name and no coverage promise anywhere in this copy, because
 * none of those exist yet. Instead each page explains the real arrangement —
 * order, we confirm on WhatsApp, delivery cost is quoted before dispatch, pay
 * cash on arrival.
 *
 * That is what keeps 35 location pages from being thin duplicates: the specific
 * part of each page is the area, its state, its postcode range and the products
 * made for it, all of which are true and unique to that page.
 */

export interface LocationPageCopy {
  eyebrow: string;
  heading: (area: DeliveryArea, locale: Locale) => string;
  metaTitle: (area: DeliveryArea, locale: Locale) => string;
  metaDescription: (area: DeliveryArea, locale: Locale) => string;
  intro: (area: DeliveryArea, locale: Locale) => string[];
  howTitle: string;
  how: string[];
  honestyTitle: string;
  honesty: string;
  productsTitle: string;
  productsBody: (area: DeliveryArea, locale: Locale) => string;
  postcodeTitle: string;
  postcodeNote: (label: string) => string;
  eastMalaysiaTitle: string;
  eastMalaysia: string;
  sameStateTitle: string;
  otherRegionsTitle: string;
  ctaTitle: string;
  ctaBody: string;
  breadcrumbHome: string;
  breadcrumbLocations: string;
}

const stateName = (area: DeliveryArea, locale: Locale) =>
  stateByCode.get(area.stateCode)?.name[locale] ?? area.stateCode;

const placeName = (area: DeliveryArea, locale: Locale) => area.name[locale];

export const locationCopy: Record<Locale, LocationPageCopy> = {
  en: {
    eyebrow: "Delivery",
    heading: (area, locale) => `Genuine leather delivered to ${placeName(area, locale)}`,
    // No brand suffix: the layout's titleTemplate appends "| Elvora.my".
    metaTitle: (area, locale) =>
      `Leather Wallets, Belts & Bags Delivered to ${placeName(area, locale)}`,
    metaDescription: (area, locale) =>
      `Genuine leather wallets, belts, handbags, collars and leashes delivered to ${placeName(
        area,
        locale,
      )}, ${stateName(area, locale)}. Cash on delivery, with stock and delivery cost confirmed before dispatch.`,
    intro: (area, locale) => [
      `Elvora makes full grain and top grain leather goods in seven categories, and delivers to ${placeName(
        area,
        locale,
      )} in ${stateName(area, locale)}.`,
      `Order online, then confirm stock and delivery cost with us on WhatsApp before your order is dispatched. You pay the courier in cash when it arrives.`,
    ],
    howTitle: "How an order reaches you",
    how: [
      "Choose your product and variant, and place the order through checkout.",
      "We reply on WhatsApp to confirm the item is in stock, the exact total, and the delivery cost to your address.",
      "Nothing is charged when you order. You pay the courier in cash when the parcel arrives.",
      "If the item is not available in your variant, we say so before dispatch rather than after.",
    ],
    honestyTitle: "What we do not promise",
    honesty:
      "We have not published delivery times or flat rates. Delivery cost depends on the courier and your address, so it is quoted to you before dispatch — never after. We do not name a courier we have not appointed.",
    productsTitle: "What is made for this area",
    productsBody: (area, locale) =>
      `The full range is available to ${placeName(
        area,
        locale,
      )} — there is no regional product list, because the range does not change by state.`,
    postcodeTitle: "Postcode area",
    postcodeNote: (label) =>
      `This page covers addresses in postcode area ${label}. If your postcode is elsewhere in the state, the same process applies — ask us on WhatsApp.`,
    eastMalaysiaTitle: "Delivering to East Malaysia",
    eastMalaysia:
      "Sabah, Sarawak and Labuan are separated from Peninsular Malaysia by the South China Sea, so delivery is slower and costs more than on the peninsula. Ask for a quote before ordering if timing matters.",
    sameStateTitle: "Other areas in this state",
    otherRegionsTitle: "Other regions",
    ctaTitle: "Questions before you order?",
    ctaBody: "Ask about stock, sizing or delivery to your address.",
    breadcrumbHome: "Home",
    breadcrumbLocations: "Delivery areas",
  },

  ms: {
    eyebrow: "Penghantaran",
    heading: (area, locale) => `Kulit asli dihantar ke ${placeName(area, locale)}`,
    metaTitle: (area, locale) =>
      `Dompet, Tali Pinggang & Beg Kulit Dihantar ke ${placeName(area, locale)}`,
    metaDescription: (area, locale) =>
      `Dompet, tali pinggang, beg tangan, kolar dan tali cawak kulit asli dihantar ke ${placeName(
        area,
        locale,
      )}, ${stateName(area, locale)}. Tunai semasa penghantaran, dengan stok dan kos penghantaran disahkan sebelum dihantar.`,
    intro: (area, locale) => [
      `Elvora menghasilkan barangan kulit full grain dan top grain dalam tujuh kategori, dan menghantar ke ${placeName(
        area,
        locale,
      )} di ${stateName(area, locale)}.`,
      `Buat pesanan dalam talian, kemudian sahkan stok dan kos penghantaran dengan kami di WhatsApp sebelum pesanan dihantar. Anda membayar kurier secara tunai apabila barang tiba.`,
    ],
    howTitle: "Bagaimana pesanan sampai kepada anda",
    how: [
      "Pilih produk dan variasi anda, dan buat pesanan melalui pembayaran.",
      "Kami membalas di WhatsApp untuk mengesahkan stok, jumlah sebenar, dan kos penghantaran ke alamat anda.",
      "Tiada caj semasa anda membuat pesanan. Anda membayar kurier secara tunai apabila barang tiba.",
      "Jika barang tidak tersedia dalam variasi anda, kami beritahu sebelum dihantar, bukan selepas.",
    ],
    honestyTitle: "Apa yang kami tidak janjikan",
    honesty:
      "Kami belum menerbitkan masa penghantaran atau kadar tetap. Kos penghantaran bergantung pada kurier dan alamat anda, jadi ia disebut kepada anda sebelum dihantar — tidak pernah selepas. Kami tidak menamakan kurier yang belum dilantik.",
    productsTitle: "Apa yang dibuat untuk kawasan ini",
    productsBody: (area, locale) =>
      `Semua kategori tersedia untuk ${placeName(
        area,
        locale,
      )} — tiada senarai produk serantau, kerana julat produk tidak berubah mengikut negeri.`,
    postcodeTitle: "Kawasan poskod",
    postcodeNote: (label) =>
      `Halaman ini merangkumi alamat dalam kawasan poskod ${label}. Jika poskod anda di tempat lain dalam negeri ini, proses yang sama terpakai — tanya kami di WhatsApp.`,
    eastMalaysiaTitle: "Penghantaran ke Malaysia Timur",
    eastMalaysia:
      "Sabah, Sarawak dan Labuan dipisahkan dari Semenanjung Malaysia oleh Laut China Selatan, jadi penghantaran lebih lambat dan lebih mahal berbanding di semenanjung. Minta sebut harga sebelum membuat pesanan jika masa penting.",
    sameStateTitle: "Kawasan lain di negeri ini",
    otherRegionsTitle: "Wilayah lain",
    ctaTitle: "Ada soalan sebelum membuat pesanan?",
    ctaBody: "Tanya tentang stok, saiz atau penghantaran ke alamat anda.",
    breadcrumbHome: "Laman utama",
    breadcrumbLocations: "Kawasan penghantaran",
  },

  zh: {
    eyebrow: "配送",
    heading: (area, locale) => `真皮产品配送至${placeName(area, locale)}`,
    metaTitle: (area, locale) => `真皮钱包、皮带与包袋配送至${placeName(area, locale)}`,
    metaDescription: (area, locale) =>
      `真皮钱包、皮带、手提包、项圈与牵绳配送至${placeName(area, locale)}（${stateName(
        area,
        locale,
      )}）。货到付款，发货前先确认库存与运费。`,
    intro: (area, locale) => [
      `Elvora 制作全粒面与头层牛皮制品，涵盖七个分类，并配送至${stateName(
        area,
        locale,
      )}的${placeName(area, locale)}。`,
      `在线下单后，我们会在发货前通过 WhatsApp 与你确认库存与运费。收到货时以现金支付给快递员。`,
    ],
    howTitle: "订单如何送达",
    how: [
      "选择产品与规格，通过结账页面下单。",
      "我们会在 WhatsApp 上回覆，确认库存、实际总额，以及寄到你的地址的运费。",
      "下单时不收取任何费用。收到货时以现金支付给快递员。",
      "若你所选的规格缺货，我们会在发货前告知，而不是在发货后。",
    ],
    honestyTitle: "我们不作承诺的部分",
    honesty:
      "我们尚未公布配送时效与统一运费。运费取决于快递与你的地址，因此会在发货前向你报价——绝不在事后追加。我们不会列出尚未签约合作的快递公司。",
    productsTitle: "为这一地区准备的产品",
    productsBody: (area, locale) =>
      `全系列均可配送至${placeName(area, locale)}——我们不设地区性产品清单，因为产品范围不因州属而异。`,
    postcodeTitle: "邮政编码区域",
    postcodeNote: (label) =>
      `本页涵盖邮政编码区域 ${label} 的地址。若你的邮编位于本州其他地区，流程相同——请通过 WhatsApp 询问我们。`,
    eastMalaysiaTitle: "配送至东马",
    eastMalaysia:
      "沙巴、砂拉越与纳闽与马来半岛隔南中国海相望，因此配送较慢、费用高于半岛。若时间重要，请在下单前索取报价。",
    sameStateTitle: "本州其他地区",
    otherRegionsTitle: "其他区域",
    ctaTitle: "下单前有疑问？",
    ctaBody: "询问库存、尺寸或寄到你地址的配送。",
    breadcrumbHome: "首页",
    breadcrumbLocations: "配送地区",
  },
};

/**
 * The seven categories, linked from every location page.
 *
 * Same list the rest of the site uses, so a category added later appears here
 * without this file changing.
 */
export const locationCategoryLinks = categories.map((category) => category.id);
