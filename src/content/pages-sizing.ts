import type { Locale } from "@/i18n/config";
import type { Block, ContentPage } from "@/content/pages-core";

/**
 * Dog collar and lead sizing guide.
 *
 * Why this page exists: the competitor audit found that only one of eight
 * leather pet brands publishes a real sizing chart, and that a wrong collar size
 * is both a returned order and a welfare problem. The method below is
 * dimensional and generic; the chart describes neck measurement bands, which are
 * facts about dogs rather than any one brand's sizing system.
 *
 * Deliberately absent: tensile strength, pull ratings, "escape-proof" and
 * "chew-proof" claims. None of the eight brands examined publishes test data for
 * those, and we have no manufacturer test report, so we do not make them.
 */

export interface SizeRow {
  /** Collar strap width in millimetres. */
  width: number;
  /** Neck circumference range in centimetres, inclusive. */
  minCm: number;
  maxCm: number;
  /** Typical dog size this band suits. Descriptive, not a breed table. */
  suits: Record<Locale, string>;
}

export interface SizingCopy {
  slug: Record<Locale, string>;
  title: Record<Locale, string>;
  metaTitle: Record<Locale, string>;
  metaDescription: Record<Locale, string>;
  intro: Record<Locale, string>;
  tableHeading: Record<Locale, string>;
  columns: Record<Locale, { width: string; range: string; inches: string; suits: string }>;
  blocks: Record<Locale, Block[]>;
  /** Owner action, shown as an honest note rather than hidden. */
  confirmStock: Record<Locale, string>;
}

// Centimetres to inches is a fixed arithmetic conversion, not a measurement
// claim: 1 in = 2.54 cm exactly.
export function cmToInches(cm: number): number {
  return Math.round((cm / 2.54) * 10) / 10;
}

export function formatInches(cm: number): string {
  const inches = cmToInches(cm);
  return Number.isInteger(inches) ? `${inches}` : inches.toFixed(1);
}

/**
 * Neck bands. The nearest-centimetre boundaries are chosen so the guidance is
 * usable with an ordinary tailor's tape, which is what most customers own.
 *
 * These are guidance bands for measuring a neck, not a claim about any single
 * product's leather length. `confirmStock` says so on the page itself.
 */
export const collarSizes: SizeRow[] = [
  { width: 15, minCm: 20, maxCm: 28, suits: { en: "Toy and small breeds", ms: "Baka mainan dan kecil", zh: "玩具犬与小型犬" } },
  { width: 15, minCm: 26, maxCm: 34, suits: { en: "Small breeds", ms: "Baka kecil", zh: "小型犬" } },
  { width: 20, minCm: 30, maxCm: 40, suits: { en: "Small to medium", ms: "Kecil hingga sederhana", zh: "小型至中型" } },
  { width: 20, minCm: 36, maxCm: 46, suits: { en: "Medium breeds", ms: "Baka sederhana", zh: "中型犬" } },
  { width: 25, minCm: 42, maxCm: 52, suits: { en: "Medium to large", ms: "Sederhana hingga besar", zh: "中型至大型" } },
  { width: 25, minCm: 48, maxCm: 58, suits: { en: "Large breeds", ms: "Baka besar", zh: "大型犬" } },
  { width: 25, minCm: 55, maxCm: 66, suits: { en: "Very large breeds", ms: "Baka sangat besar", zh: "超大型犬" } },
];

/**
 * The band a measured neck falls into, preferring the size where the neck sits
 * mid-range. A neck at the very top of a band is better served by the next size
 * up, because a collar adjusted to its last hole looks wrong and wears badly.
 */
export function recommendSize(neckCm: number): SizeRow | null {
  if (!Number.isFinite(neckCm) || neckCm <= 0) return null;
  const candidates = collarSizes.filter((row) => neckCm >= row.minCm - 1 && neckCm <= row.maxCm + 1);
  if (candidates.length === 0) return null;
  // Prefer the row where the measurement sits furthest inside the range.
  return candidates.reduce((best, row) => {
    const slack = (candidate: SizeRow) =>
      Math.min(neckCm - candidate.minCm, candidate.maxCm - neckCm);
    return slack(row) > slack(best) ? row : best;
  });
}

export const dogSizingPage: ContentPage & SizingCopy = {
  slug: {
    en: "dog-collar-sizing",
    ms: "panduan-saiz-kolar-anjing",
    zh: "gou-bo-quan-chi-cun-zhi-nan",
  },
  title: {
    en: "Dog collar sizing guide",
    ms: "Panduan saiz kolar anjing",
    zh: "狗狗项圈尺寸指南",
  },
  metaTitle: {
    en: "Dog Collar Sizing Guide — Measure Your Dog's Neck in cm and Inches",
    ms: "Panduan Saiz Kolar Anjing — Ukur Leher Anjing Anda dalam cm dan Inci",
    zh: "狗狗项圈尺寸指南——用厘米与英寸测量颈围",
  },
  metaDescription: {
    en: "How to measure a dog's neck and choose a leather collar size. Neck ranges in centimetres and inches, strap widths, how much slack to allow, and how to check the fit.",
    ms: "Cara mengukur leher anjing dan memilih saiz kolar kulit. Julat leher dalam sentimeter dan inci, lebar tali, berapa kelonggaran yang perlu diberi, dan cara menyemak kesesuaian.",
    zh: "如何测量狗狗颈围并选择真皮项圈尺寸。以厘米与英寸列出的颈围范围、皮带宽度、应预留多少松动空间，以及如何检查佩戴是否合适。",
  },
  intro: {
    en: "A collar is bought by neck measurement, not by breed. Two dogs of the same breed can differ by several centimetres, so the tape measure is the only reliable guide.",
    ms: "Kolar dibeli berdasarkan ukuran leher, bukan baka. Dua anjing daripada baka yang sama boleh berbeza beberapa sentimeter, jadi pita ukur ialah satu-satunya panduan yang boleh dipercayai.",
    zh: "购买项圈要看颈围，而不是看犬种。同一种狗的两只个体可能相差数厘米，所以只有量尺才是可靠的依据。",
  },
  tableHeading: {
    en: "Neck measurement bands",
    ms: "Julat ukuran leher",
    zh: "颈围尺寸区间",
  },
  columns: {
    en: { width: "Strap width", range: "Neck range", inches: "In inches", suits: "Usually suits" },
    ms: { width: "Lebar tali", range: "Julat leher", inches: "Dalam inci", suits: "Biasanya sesuai untuk" },
    zh: { width: "皮带宽度", range: "颈围范围", inches: "英寸换算", suits: "通常适合" },
  },
  confirmStock: {
    en: "The bands below are guidance for measuring a neck. The adjustment range of each collar we sell depends on the strap length and where the buckle sits, so it is confirmed against stock before launch and stated on each product page. If your dog measures close to a boundary, ask us and we will check the actual strap for you.",
    ms: "Julat di bawah ialah panduan untuk mengukur leher. Julat larasan setiap kolar yang kami jual bergantung pada panjang tali dan kedudukan gesper, jadi ia disahkan dengan stok sebelum pelancaran dan dinyatakan pada setiap halaman produk. Jika anjing anda hampir dengan sempadan, tanyakan kepada kami dan kami akan menyemak tali sebenar untuk anda.",
    zh: "以下区间是量度颈围的参考。我们销售的每个项圈可调节范围取决于皮带长度和扣件位置，因此在正式上线前会按库存核实，并在每个产品页面注明。如果你的狗狗尺寸接近分界线，请告诉我们，我们会为你核对实际皮带长度。",
  },
  blocks: {
    en: [
      { type: "h", text: "Measure the neck, not the old collar" },
      {
        type: "p",
        text: "A leather collar that has been worn for a year is not a reliable ruler. It stretches where it is pulled and the buckle sits in a hole that has been eased open. Measure the dog.",
      },
      {
        type: "list",
        items: [
          "Use a soft tailor's tape, or a strip of paper you can mark and then lay flat against a ruler.",
          "Measure the middle of the neck, where the collar naturally rests — not the widest point at the base of the neck.",
          "Keep the tape snug against the coat but do not pull it tight. On a long-haired dog, part the coat so the tape sits against the skin rather than on top of the fur.",
          "Write the number down in centimetres. If you only have inches, multiply by 2.54.",
          "Measure twice. A one-centimetre error is the difference between a collar that sits properly and one that is always on its last hole.",
        ],
      },
      { type: "sizes" },
      { type: "h", text: "Allow room to breathe" },
      {
        type: "p",
        text: "A collar should be loose enough to slide two fingers under it at the top of the neck, and snug enough that it cannot be pulled over the head. For a full-grown dog, roughly two centimetres of adjustment remaining on either side of the buckle is comfortable. A collar tightened to its final hole is not the right size, even if it fastens.",
      },
      { type: "h", text: "Choosing a strap width" },
      {
        type: "p",
        text: "A wider strap spreads the pressure of a lead across a larger area of the neck, which matters more on a strong dog than on a small one. A 15 mm strap suits a small dog; 20 mm is the usual middle ground; 25 mm is for medium and large dogs. Width is a comfort and control choice — it is not a rating, and we do not publish a load or pull capacity for any collar because we have no manufacturer test report to support one.",
      },
      { type: "h", text: "Check the fit when it arrives" },
      {
        type: "list",
        items: [
          "Fasten the collar and slide two fingers underneath. If you cannot, it is too tight.",
          "Watch the dog walk, turn and sit. A collar that rides up over the ears or drops to the base of the neck is the wrong size.",
          "Check the buckle and D-ring sit flat and are not twisting the strap.",
          "For a puppy, measure again every few weeks. A collar bought at eight weeks will not fit at six months, and a tight collar on a growing dog is uncomfortable and unsafe.",
        ],
      },
      { type: "h", text: "What this guide cannot tell you" },
      {
        type: "p",
        text: "It cannot tell you a size from a photograph, a breed name, or a weight in kilograms. Neck shape varies too much for any of those to be dependable. If you measure your dog and the number falls between two bands, or you are unsure, send us the measurement and a photo and we will tell you which of our collars suits it — or that none of them do.",
      },
      {
        type: "callout",
        text: "Never tighten a collar to make a size fit. If the neck measurement falls outside a strap's range, the collar is the wrong size, not the dog.",
      },
    ],
    ms: [
      { type: "h", text: "Ukur leher, bukan kolar lama" },
      {
        type: "p",
        text: "Kolar kulit yang telah dipakai setahun bukan pembaris yang boleh dipercayai. Ia melonggar di bahagian yang ditarik dan gesper berada di lubang yang telah terbuka. Ukur anjing itu sendiri.",
      },
      {
        type: "list",
        items: [
          "Gunakan pita ukur lembut, atau jalur kertas yang boleh anda tandakan dan kemudian letakkan rata pada pembaris.",
          "Ukur di tengah leher, tempat kolar biasanya terletak — bukan di bahagian paling lebar di pangkal leher.",
          "Rapatkan pita pada bulu tetapi jangan tarik terlalu ketat. Pada anjing berbulu panjang, selakkan bulu supaya pita berada pada kulit, bukan di atas bulu.",
          "Catat nombor dalam sentimeter. Jika anda hanya ada inci, darab dengan 2.54.",
          "Ukur dua kali. Kesilapan satu sentimeter menentukan sama ada kolar duduk elok atau sentiasa berada di lubang terakhir.",
        ],
      },
      { type: "sizes" },
      { type: "h", text: "Beri ruang untuk bernafas" },
      {
        type: "p",
        text: "Kolar harus cukup longgar untuk dua jari masuk di bahagian atas leher, dan cukup ketat supaya tidak boleh ditarik melepasi kepala. Untuk anjing dewasa, kira-kira dua sentimeter baki larasan pada setiap sisi gesper adalah selesa. Kolar yang diketatkan hingga lubang terakhir bukan saiz yang betul, walaupun ia boleh dikancing.",
      },
      { type: "h", text: "Memilih lebar tali" },
      {
        type: "p",
        text: "Tali yang lebih lebar menyebarkan tekanan tali cawak ke kawasan leher yang lebih luas, dan ini lebih penting pada anjing kuat berbanding anjing kecil. Tali 15 mm sesuai untuk anjing kecil; 20 mm ialah pilihan pertengahan yang biasa; 25 mm untuk anjing sederhana dan besar. Lebar ialah pilihan keselesaan dan kawalan — ia bukan penarafan, dan kami tidak menerbitkan had beban atau kapasiti tarikan untuk mana-mana kolar kerana kami tiada laporan ujian pengilang yang menyokongnya.",
      },
      { type: "h", text: "Semak kesesuaian apabila ia tiba" },
      {
        type: "list",
        items: [
          "Kancingkan kolar dan masukkan dua jari di bawahnya. Jika tidak boleh, ia terlalu ketat.",
          "Perhatikan anjing berjalan, berpusing dan duduk. Kolar yang naik melepasi telinga atau jatuh ke pangkal leher ialah saiz yang salah.",
          "Pastikan gesper dan gelang D duduk rata dan tidak memulas tali.",
          "Untuk anak anjing, ukur semula setiap beberapa minggu. Kolar yang dibeli pada usia lapan minggu tidak akan muat pada usia enam bulan, dan kolar ketat pada anjing yang sedang membesar tidak selesa serta tidak selamat.",
        ],
      },
      { type: "h", text: "Apa yang panduan ini tidak dapat beritahu" },
      {
        type: "p",
        text: "Ia tidak dapat menentukan saiz daripada gambar, nama baka, atau berat dalam kilogram. Bentuk leher terlalu berbeza untuk mana-mana daripadanya dipercayai. Jika ukuran anjing anda jatuh antara dua julat, atau anda tidak pasti, hantarkan ukuran dan gambar kepada kami dan kami akan beritahu kolar mana yang sesuai — atau tiada yang sesuai.",
      },
      {
        type: "callout",
        text: "Jangan sekali-kali mengetatkan kolar untuk memaksa saiz muat. Jika ukuran leher berada di luar julat tali, kolar itu saiz yang salah, bukan anjingnya.",
      },
    ],
    zh: [
      { type: "h", text: "量颈围，不要量旧项圈" },
      {
        type: "p",
        text: "戴了一年的真皮项圈并不是可靠的尺子。它会在被拉扯的位置变长，扣件也会停在已被撑开的孔位。请直接量狗。",
      },
      {
        type: "list",
        items: [
          "使用软质裁缝尺，或用一条纸条做标记后再平放在直尺上量。",
          "量颈部中段，也就是项圈自然停留的位置——不是颈部最宽的根部。",
          "让尺子贴住毛发但不要拉紧。长毛犬要拨开毛发，让尺子贴住皮肤而不是压在毛上。",
          "以厘米记录数字。如果只有英寸，请乘以 2.54。",
          "量两次。一厘米的误差，就是「戴起来刚好」和「永远只用最后一个孔」的区别。",
        ],
      },
      { type: "sizes" },
      { type: "h", text: "留出呼吸空间" },
      {
        type: "p",
        text: "项圈应在颈部上方能塞进两根手指，同时紧到无法从头上脱出。成年犬在扣件两侧各留约两厘米的调节余量比较舒适。必须扣到最后一个孔才合用的项圈，并不是合适的尺寸。",
      },
      { type: "h", text: "如何选择皮带宽度" },
      {
        type: "p",
        text: "较宽的皮带能把牵引绳的压力分散到更大的颈部面积，这对力气大的狗比对小型犬更重要。15 毫米适合小型犬；20 毫米是常见的中庸选择；25 毫米适合中型与大型犬。宽度是舒适度与控制力的选择——它不是规格等级。我们没有针对任何项圈公布承重或拉力数值，因为目前没有可依据的厂家测试报告。",
      },
      { type: "h", text: "收到后如何检查是否合适" },
      {
        type: "list",
        items: [
          "扣好项圈，试着塞进两根手指。塞不进就是太紧。",
          "观察狗行走、转身和坐下。项圈若往上滑到耳朵上方，或掉到颈部根部，就是尺寸不对。",
          "确认扣件与 D 形环平贴，没有把皮带扭歪。",
          "幼犬每隔几周就要重新量。八周时买的项圈到六个月就戴不下了，而在成长中的狗身上用偏紧的项圈既不舒适也不安全。",
        ],
      },
      { type: "h", text: "这份指南无法告诉你的事" },
      {
        type: "p",
        text: "它无法凭照片、犬种名称或体重公斤数判断尺寸。颈部形状差异太大，这些依据都不可靠。如果你量出的数值落在两个区间之间，或你不确定，请把测量结果和照片发给我们，我们会告诉你哪一款合适——或者告诉你没有一款合适。",
      },
      {
        type: "callout",
        text: "绝不要为了迁就尺寸而把项圈收紧。如果颈围超出皮带的调节范围，那是项圈尺寸不对，不是狗的问题。",
      },
    ],
  },
};
