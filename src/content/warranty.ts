import type { Locale } from "@/i18n/config";

/**
 * Warranty terms — one source of truth.
 *
 * The terms live here rather than inside the warranty page so that the product
 * page, the FAQ, the structured data and the policy page cannot drift apart. A
 * warranty is a contractual promise, so it must read identically everywhere it
 * appears.
 *
 * Decided by the owner on 2026-11-21:
 *   duration  12 months
 *   scope     workmanship and hardware failure only
 *   remedy    repair first, replacement where repair is not possible
 *   shipping  customer pays to send, we pay to return
 *
 * What is deliberately NOT covered, and must stay excluded: normal wear, leather
 * grain and colour variation, water and heat damage, and any load, pull or
 * tensile rating — no manufacturer test report exists to support one.
 */

export const WARRANTY_MONTHS = 12;

export interface WarrantyTerms {
  months: number;
  /** Short line for a product page badge or summary. */
  summary: Record<Locale, string>;
  covers: Record<Locale, string[]>;
  excludes: Record<Locale, string[]>;
  remedy: Record<Locale, string>;
  shipping: Record<Locale, string>;
  claim: Record<Locale, string>;
}

export const warranty: WarrantyTerms = {
  months: WARRANTY_MONTHS,

  summary: {
    en: `Every piece carries a ${WARRANTY_MONTHS}-month warranty against defects in workmanship and hardware.`,
    ms: `Setiap produk dilindungi jaminan ${WARRANTY_MONTHS} bulan terhadap kecacatan kerja tangan dan perkakasan.`,
    zh: `每件产品均提供 ${WARRANTY_MONTHS} 个月的手工与五金质保。`,
  },

  covers: {
    en: [
      "Stitching that comes apart in normal use — a seam that fails, or thread that breaks where the leather is sound.",
      "Hardware that fails in normal use — a buckle that will not hold, a pin that bends or snaps, a D-ring that deforms or pulls out of intact leather.",
      "A rivet or fastener that gives way without the surrounding leather being torn or stretched.",
    ],
    ms: [
      "Jahitan yang terbuka dalam penggunaan biasa — jahitan yang gagal, atau benang yang putus sedangkan kulit di sekitarnya masih elok.",
      "Perkakasan yang gagal dalam penggunaan biasa — buckle yang tidak dapat mengunci, pin yang bengkok atau patah, cincin D yang berubah bentuk atau tertanggal daripada kulit yang masih utuh.",
      "Rivet atau pengikat yang terlepas tanpa kulit di sekelilingnya terkoyak atau teregang.",
    ],
    zh: [
      "正常使用下开线的缝线——缝线失效，或皮革完好而线断裂。",
      "正常使用下失效的五金——扣件锁不住、扣针弯曲或折断、D 形环变形或从完好的皮革中脱出。",
      "铆钉或固定件脱落，而周围皮革没有撕裂或拉伸。",
    ],
  },

  excludes: {
    en: [
      "Normal wear and tear, and the patina leather develops with use. Scratches, creases, a softened shape and a darkening tone are what leather does, not a fault.",
      "Natural variation in grain, tone, marking and colour between pieces and between batches.",
      "Water damage, including full immersion, and heat damage from drying near a direct source.",
      "Damage from misuse, overloading, alteration, or repair attempted by anyone else.",
      "Belts that have been cut to length or had extra holes punched, and collars chewed by a dog.",
      "Any load, pull or tensile figure. We do not publish one, so no claim can be made against it.",
    ],
    ms: [
      "Haus dan koyak biasa, serta patina yang terbentuk pada kulit dengan penggunaan. Calar, kedutan, bentuk yang melembut dan warna yang menggelap adalah sifat kulit, bukan kecacatan.",
      "Variasi semula jadi pada urat, warna, tanda dan tona antara kepingan dan antara kelompok pengeluaran.",
      "Kerosakan akibat air, termasuk rendaman penuh, dan kerosakan haba akibat pengeringan berhampiran sumber haba langsung.",
      "Kerosakan akibat salah guna, beban berlebihan, pengubahsuaian, atau pembaikan yang dicuba oleh pihak lain.",
      "Tali pinggang yang telah dipotong mengikut panjang atau ditambah lubang, dan kolar yang digigit anjing.",
      "Sebarang angka beban, tarikan atau kekuatan tegangan. Kami tidak menerbitkannya, jadi tiada tuntutan boleh dibuat berdasarkannya.",
    ],
    zh: [
      "正常磨损，以及皮革随使用形成的包浆。划痕、折痕、形状变软与颜色加深都是皮革的自然表现，并非瑕疵。",
      "每件产品之间及不同批次之间在纹理、色调、印记与颜色上的自然差异。",
      "水损（包括整件浸水），以及在直接热源附近烘干造成的热损。",
      "误用、超载、改装，或由他人尝试维修造成的损坏。",
      "已裁短或加打孔的皮带，以及被狗咬过的项圈。",
      "任何承重、拉力或抗张数值。我们并不公布这类数据，因此也不存在可以据此提出的索赔。",
    ],
  },

  remedy: {
    en: "We repair the item first. If it cannot be repaired — because the part is no longer made, or the repair would not hold — we replace it with the same product, or the nearest equivalent if that product has been discontinued. Where neither is possible, we refund the purchase price.",
    ms: "Kami membaiki produk terlebih dahulu. Jika ia tidak dapat dibaiki — kerana komponen itu tidak lagi dihasilkan, atau pembaikan tidak akan bertahan — kami menggantikannya dengan produk yang sama, atau yang paling setara jika produk itu telah dihentikan. Jika kedua-duanya tidak mungkin, kami memulangkan harga belian.",
    zh: "我们优先维修。若无法维修——例如该部件已不再生产，或维修后仍无法维持——则更换同款产品；若该款已停产，则更换最接近的等同产品。两者都无法做到时，我们退回购买价格。",
  },

  shipping: {
    en: "You pay the cost of sending the item to us; we pay the cost of sending it back to you. If we cannot repair or replace the item, we also refund your original delivery charge.",
    ms: "Anda menanggung kos penghantaran produk kepada kami; kami menanggung kos penghantaran semula kepada anda. Jika kami tidak dapat membaiki atau menggantikan produk itu, kami juga memulangkan caj penghantaran asal anda.",
    zh: "你把产品寄给我们的费用由你承担；我们寄回给你的费用由我们承担。若我们无法维修或更换，我们也会退回你原先支付的运费。",
  },

  claim: {
    en: "Message us with your order number, photographs of the fault, and a short description of what happened and when. We will confirm whether it is covered and give you the return address before you send anything. Please do not post an item before you have that confirmation.",
    ms: "Hubungi kami dengan nombor pesanan anda, gambar kecacatan, dan penerangan ringkas tentang apa yang berlaku serta bilakah. Kami akan mengesahkan sama ada ia dilindungi dan memberikan alamat pemulangan sebelum anda menghantar apa-apa. Sila jangan pos produk sebelum mendapat pengesahan itu.",
    zh: "请把订单编号、瑕疵照片，以及问题发生经过与时间的简短说明发送给我们。我们会在你寄出任何物品之前，确认是否在质保范围内并提供退货地址。未获确认前请勿寄出。",
  },
};

/**
 * The warranty starts when the order is delivered, not when it is placed — a
 * distinction that matters on a COD store, where dispatch can follow an order by
 * days. `deliveredAt` is therefore the reference date where the order record has
 * one, falling back to the order date.
 */
export function warrantyEndsOn(startedAt: Date, months = WARRANTY_MONTHS): Date {
  const end = new Date(startedAt.getTime());
  end.setMonth(end.getMonth() + months);
  return end;
}

export function warrantyIsActive(startedAt: Date, now = new Date(), months = WARRANTY_MONTHS): boolean {
  return now.getTime() <= warrantyEndsOn(startedAt, months).getTime();
}
