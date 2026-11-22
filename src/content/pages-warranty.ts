import type { ContentPage } from "@/content/pages-core";
import { WARRANTY_MONTHS, warranty } from "@/content/warranty";

/**
 * Warranty policy page.
 *
 * Written from the terms the owner agreed on 2026-11-21 (see `content/warranty.ts`)
 * and from the competitor evidence gathered the same week:
 *
 * - Bellroy: 3 years on wallets, 6 on bags, 10 on luggage.
 * - Mackenzie & George: no-quibble workmanship guarantee, repair free, no
 *   published time limit; 90-day free UK returns.
 * - BONIA: **no workmanship warranty published at all** — a 30-day return window
 *   and a faulty-item channel.
 * - Braun Büffel: **no workmanship warranty published** — 30-day change of mind
 *   and a 14-day faulty window.
 *
 * So twelve months on workmanship and hardware puts us ahead of both Malaysian
 * competitors while staying a promise a small workshop can actually honour. Being
 * shorter than Bellroy and M&G is stated plainly rather than glossed.
 */
export const warrantyPage: ContentPage = {
  slug: { en: "warranty", ms: "jaminan", zh: "bao-xiu" },
  title: { en: "Warranty", ms: "Jaminan", zh: "质保" },
  metaTitle: {
    en: `Leather Warranty — ${WARRANTY_MONTHS} Months on Workmanship and Hardware`,
    ms: `Jaminan Kulit — ${WARRANTY_MONTHS} Bulan untuk Kerja Tangan dan Perkakasan`,
    zh: `真皮质保——手工与五金 ${WARRANTY_MONTHS} 个月`,
  },
  metaDescription: {
    en: `What our ${WARRANTY_MONTHS}-month leather warranty covers, what it does not, how a repair or replacement is handled, and who pays return delivery.`,
    ms: `Apa yang dilindungi jaminan kulit ${WARRANTY_MONTHS} bulan kami, apa yang tidak, cara pembaikan atau penggantian diuruskan, dan siapa menanggung penghantaran pemulangan.`,
    zh: `了解我们 ${WARRANTY_MONTHS} 个月真皮质保涵盖什么、不涵盖什么、维修或更换如何处理，以及退货运费由谁承担。`,
  },
  blocks: {
    en: [
      { type: "p", text: warranty.summary.en },
      {
        type: "p",
        text: "The warranty starts on the day your order is delivered, not the day it was placed. It covers the parts of a leather product that should not fail — the stitching and the metalwork — and it does not cover the leather ageing, because ageing is what leather is supposed to do.",
      },
      { type: "h", text: `What the ${WARRANTY_MONTHS} months cover` },
      { type: "list", items: warranty.covers.en },
      { type: "h", text: "What it does not cover" },
      { type: "list", items: warranty.excludes.en },
      { type: "h", text: "Repair first, then replacement" },
      { type: "p", text: warranty.remedy.en },
      { type: "h", text: "Who pays delivery" },
      { type: "p", text: warranty.shipping.en },
      { type: "h", text: "How to make a claim" },
      { type: "p", text: warranty.claim.en },
      {
        type: "callout",
        text: "This warranty is in addition to your rights under Malaysian consumer law. Nothing here limits a remedy you are entitled to by law.",
      },
    ],
    ms: [
      { type: "p", text: warranty.summary.ms },
      {
        type: "p",
        text: "Jaminan bermula pada hari pesanan anda dihantar, bukan hari ia dibuat. Ia melindungi bahagian produk kulit yang sepatutnya tidak gagal — jahitan dan perkakasan logam — dan ia tidak melindungi penuaan kulit, kerana penuaan ialah sifat semula jadi kulit.",
      },
      { type: "h", text: `Apa yang dilindungi selama ${WARRANTY_MONTHS} bulan` },
      { type: "list", items: warranty.covers.ms },
      { type: "h", text: "Apa yang tidak dilindungi" },
      { type: "list", items: warranty.excludes.ms },
      { type: "h", text: "Baiki dahulu, kemudian ganti" },
      { type: "p", text: warranty.remedy.ms },
      { type: "h", text: "Siapa menanggung kos penghantaran" },
      { type: "p", text: warranty.shipping.ms },
      { type: "h", text: "Cara membuat tuntutan" },
      { type: "p", text: warranty.claim.ms },
      {
        type: "callout",
        text: "Jaminan ini adalah tambahan kepada hak anda di bawah undang-undang pengguna Malaysia. Tiada apa-apa di sini mengehadkan remedi yang anda berhak dapat di sisi undang-undang.",
      },
    ],
    zh: [
      { type: "p", text: warranty.summary.zh },
      {
        type: "p",
        text: "质保自订单送达当日起算，而不是下单当日。它涵盖真皮产品中本不应失效的部分——缝线与金属配件——但不涵盖皮革的老化，因为老化正是皮革应有的表现。",
      },
      { type: "h", text: `${WARRANTY_MONTHS} 个月涵盖什么` },
      { type: "list", items: warranty.covers.zh },
      { type: "h", text: "不涵盖什么" },
      { type: "list", items: warranty.excludes.zh },
      { type: "h", text: "先维修，再更换" },
      { type: "p", text: warranty.remedy.zh },
      { type: "h", text: "运费由谁承担" },
      { type: "p", text: warranty.shipping.zh },
      { type: "h", text: "如何申请质保" },
      { type: "p", text: warranty.claim.zh },
      {
        type: "callout",
        text: "本质保是对马来西亚消费者法律所赋予权利的补充。本页任何内容都不限制你依法应得的救济。",
      },
    ],
  },
  faqs: {
    en: [
      {
        q: "My wallet has darkened and softened. Is that a fault?",
        a: "No. Leather darkens, softens and takes on a patina with use, and that is the material behaving correctly. A fault is something failing that should not — a seam opening, or a buckle that no longer holds. Those are covered.",
      },
      {
        q: "I have had the belt for four months and the stitching has come apart.",
        a: "That is exactly what the warranty is for. Send us your order number and photographs of the seam, and we will confirm the repair and give you a return address.",
      },
      {
        q: "My dog chewed the collar.",
        a: "Chewing is not a workmanship fault, so it is not covered. Send us photographs anyway — where the leather is sound and only a part is damaged, we will tell you honestly whether a repair is possible and what it would cost.",
      },
      {
        q: "The belt is too long. Can you shorten it under warranty?",
        a: "Alteration is not a warranty matter, and a belt that has been cut cannot be returned. Ordering the wrong length is not a fault with the product, so it is outside the 30-day returns policy as well. Please measure before ordering, or ask us to check the length with you first.",
      },
      {
        q: "Do you cover a load or pull rating on dog collars?",
        a: "No, and we do not publish one. We have no manufacturer test report to support a strength figure, so there is no rating for a claim to be measured against. The collar's construction and dimensions are on its product page instead.",
      },
      {
        q: `What happens after ${WARRANTY_MONTHS} months?`,
        a: "The warranty ends, but we do not disappear. Message us and we will tell you what a repair would involve and what it would cost. We would rather a piece be repaired than replaced.",
      },
    ],
    ms: [
      {
        q: "Dompet saya telah menggelap dan melembut. Adakah itu kecacatan?",
        a: "Tidak. Kulit menggelap, melembut dan membentuk patina dengan penggunaan, dan itu ialah tingkah laku bahan yang betul. Kecacatan ialah sesuatu yang gagal sedangkan ia sepatutnya tidak — jahitan terbuka, atau buckle yang tidak lagi mengunci. Itu dilindungi.",
      },
      {
        q: "Tali pinggang sudah empat bulan dan jahitannya terbuka.",
        a: "Itulah tujuan jaminan ini. Hantarkan nombor pesanan dan gambar jahitan itu, dan kami akan mengesahkan pembaikan serta memberikan alamat pemulangan.",
      },
      {
        q: "Anjing saya menggigit kolar itu.",
        a: "Menggigit bukan kecacatan kerja tangan, jadi ia tidak dilindungi. Namun hantarkan gambar — jika kulit di sekitarnya masih elok dan hanya sebahagian yang rosak, kami akan beritahu dengan jujur sama ada pembaikan mungkin dan berapa kosnya.",
      },
      {
        q: "Tali pinggang terlalu panjang. Boleh dipendekkan di bawah jaminan?",
        a: "Pengubahsuaian bukan perkara jaminan, dan tali pinggang yang telah dipotong tidak boleh dipulangkan. Memesan panjang yang salah bukan kecacatan produk, jadi ia juga di luar polisi pemulangan 30 hari. Sila ukur sebelum memesan, atau minta kami semak panjangnya bersama anda dahulu.",
      },
      {
        q: "Adakah anda melindungi penarafan beban atau tarikan pada kolar anjing?",
        a: "Tidak, dan kami tidak menerbitkannya. Kami tiada laporan ujian pengilang untuk menyokong angka kekuatan, jadi tiada penarafan untuk dijadikan asas tuntutan. Binaan dan dimensi kolar dinyatakan pada halaman produknya.",
      },
      {
        q: `Apa berlaku selepas ${WARRANTY_MONTHS} bulan?`,
        a: "Jaminan tamat, tetapi kami tidak hilang. Hubungi kami dan kami akan beritahu apa yang diperlukan untuk pembaikan dan berapa kosnya. Kami lebih suka sesuatu produk dibaiki daripada diganti.",
      },
    ],
    zh: [
      {
        q: "我的钱包颜色变深、质地变软了，这是瑕疵吗？",
        a: "不是。皮革会随使用而变深、变软并形成包浆，这正是材料应有的表现。瑕疵是指本不应失效的部分失效了——例如缝线开裂，或扣件无法再固定。这些都在质保范围内。",
      },
      {
        q: "皮带用了四个月，缝线开线了。",
        a: "这正是质保的用途。请把订单编号和缝线处的照片发给我们，我们会确认维修方案并提供退货地址。",
      },
      {
        q: "我的狗把项圈咬坏了。",
        a: "啃咬不属于手工瑕疵，因此不在质保范围。不过仍欢迎发照片给我们——若周围皮革完好、只有局部损坏，我们会如实告知能否维修以及费用。",
      },
      {
        q: "皮带太长，可以在质保内改短吗？",
        a: "改装不属于质保事项，而且裁短后的皮带无法退货。订错长度并非商品瑕疵，因此同样不在 30 天退货政策之内。请在订购前量好尺寸，或先让我们与你一起核对长度。",
      },
      {
        q: "狗狗项圈有承重或拉力规格的质保吗？",
        a: "没有，我们也不公布这类数值。我们没有可支撑强度数值的厂家测试报告，因此不存在可供索赔比对的规格等级。产品页面改为说明项圈的结构与尺寸。",
      },
      {
        q: `${WARRANTY_MONTHS} 个月之后怎么办？`,
        a: "质保期结束后我们依然在。请联系我们，我们会告知维修方式和费用。我们更希望产品被修好，而不是被替换。",
      },
    ],
  },
};
