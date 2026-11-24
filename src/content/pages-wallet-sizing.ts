import type { Locale } from "@/i18n/config";
import type { ContentPage } from "@/content/pages-core";

/**
 * Wallet sizing and fit guide.
 *
 * Why this page exists rather than a set of numbers typed into the catalogue:
 *
 * A wallet's dimensions describe a *specific physical object in the workshop*.
 * Nobody can derive them from a competitor's page, a market average, or a
 * plausible-looking guess — and a wrong figure is worse than no figure, because
 * the customer orders against it and the return is then our fault. The one thing
 * this shop refuses to do is publish a measurement nobody took.
 *
 * So the page does something more useful than a number: it gives the buyer the
 * verified reference points that actually decide whether a wallet works —
 * the dimensions of Malaysian banknotes from Bank Negara Malaysia, the clearance
 * a folded note needs, and a market benchmark for a standard bifold — plus a way
 * to check the wallet they already own. When our own figures are taken, they go
 * on the product page, and this page links to them.
 *
 * Verified sources:
 *   Bank Negara Malaysia, "Distinctively Malaysia — The New Series of Malaysian
 *   Banknotes": RM100 150×69 mm, RM50 145×69 mm, RM20 145×65 mm, RM10 140×65 mm,
 *   RM5 135×65 mm, RM1 120×65 mm. All paper except RM5 and RM1 (polymer).
 *   Checked 2026-11-21.
 *
 *   Bellroy, Hide & Seek product specification: external dimensions
 *   3.4 × 4.6 × 0.5 in. Used only as a labelled market benchmark for "what a
 *   slim bifold typically measures", never as our own product's specification.
 */

/** Verified banknote dimensions, in millimetres. */
export interface BanknoteRow {
  denomination: string;
  lengthMm: number;
  heightMm: number;
  substrate: string;
}

export const malaysianBanknotes: BanknoteRow[] = [
  { denomination: "RM100", lengthMm: 150, heightMm: 69, substrate: "paper" },
  { denomination: "RM50", lengthMm: 145, heightMm: 69, substrate: "paper" },
  { denomination: "RM20", lengthMm: 145, heightMm: 65, substrate: "paper" },
  { denomination: "RM10", lengthMm: 140, heightMm: 65, substrate: "paper" },
  { denomination: "RM5", lengthMm: 135, heightMm: 65, substrate: "polymer" },
  { denomination: "RM1", lengthMm: 120, heightMm: 65, substrate: "polymer" },
];

/** The tallest Malaysian note decides how tall a bifold pocket has to be. */
export const tallestNoteMm = Math.max(...malaysianBanknotes.map((note) => note.heightMm));

/** Clearance a folded note needs beyond its own height, in millimetres. */
export const NOTE_CLEARANCE_MM = 3;

/** Minimum pocket height for a folded Malaysian note, in millimetres. */
export const minimumPocketHeightMm = tallestNoteMm + NOTE_CLEARANCE_MM;

/**
 * Market benchmark for a slim bifold, converted from Bellroy's published
 * 3.4 × 4.6 × 0.5 inches at exactly 25.4 mm per inch.
 * Labelled as a benchmark in every language — never as our specification.
 */
export const marketBenchmarkMm = { width: 86, height: 117, thickness: 13 };

export const walletSizingPage: ContentPage = {
  slug: {
    en: "wallet-sizing",
    ms: "panduan-saiz-dompet",
    zh: "qian-bao-chi-cun-zhi-nan",
  },
  title: {
    en: "Wallet sizing and fit",
    ms: "Saiz dan kesesuaian dompet",
    zh: "钱包尺寸与适用性",
  },
  metaTitle: {
    en: "Wallet Sizing Guide — Will It Hold Malaysian Notes and Fit Your Pocket?",
    ms: "Panduan Saiz Dompet — Adakah Ia Muat Wang Malaysia dan Poket Anda?",
    zh: "钱包尺寸指南——能否放入马币纸币与你的口袋？",
  },
  metaDescription: {
    en: "Malaysian banknote dimensions, the clearance a folded note needs, how many cards a bifold holds, and the market benchmark for a slim bifold wallet.",
    ms: "Dimensi wang kertas Malaysia, ruang yang diperlukan wang terlipat, berapa kad boleh dimuatkan dompet bifold, dan penanda aras pasaran untuk dompet bifold nipis.",
    zh: "马来西亚纸币尺寸、折起纸币所需的预留空间、对折钱包可放多少张卡，以及纤薄对折钱包的市场参考尺寸。",
  },
  blocks: {
    en: [
      {
        type: "p",
        text: "A wallet fails for one of three reasons: it does not hold the notes you actually carry, it does not fit the pocket you actually use, or it bulges once you put your cards in it. All three are measurable before you buy, which is what this page is for.",
      },
      { type: "h", text: "Malaysian banknote dimensions" },
      {
        type: "p",
        text: "These are the official dimensions of the current Malaysian banknote series, published by Bank Negara Malaysia. The tallest notes matter most, because a bifold folds them in half and the fold is what decides whether the note sits flat or gets crushed.",
      },
      { type: "table", table: "banknotes" },
      {
        type: "p",
        text: `The tallest Malaysian notes are RM50 and RM100, both 69 mm tall. Folded in half they still occupy 69 mm of height, so a bifold's note pocket needs roughly ${minimumPocketHeightMm} mm of internal height to hold them without the edge catching — that is the note height plus about ${NOTE_CLEARANCE_MM} mm of clearance. A pocket shallower than that will take an RM10 comfortably and leave an RM100 permanently creased.`,
      },
      { type: "h", text: "The market benchmark for a slim bifold" },
      {
        type: "p",
        text: `For reference, a widely sold slim bifold wallet in this category measures around ${marketBenchmarkMm.width} × ${marketBenchmarkMm.height} × ${marketBenchmarkMm.thickness} mm externally. That band — roughly 85 to 90 mm wide, 110 to 120 mm tall, and 10 to 15 mm thick when empty — is what most people mean by a normal-sized bifold.`,
      },
      {
        type: "callout",
        text: "That figure is a market benchmark, taken from another maker's published specification. It is not the measurement of our wallet. Our own dimensions are stated on the product page once they have been measured on the actual piece, and we do not publish a number we have not taken ourselves.",
      },
      { type: "h", text: "How many cards a bifold holds" },
      {
        type: "p",
        text: "A bifold with four to six card slots takes five to twelve cards before it starts to distort. The limit is not the slots — it is the leather between them. Once a wallet is packed so that the spine is under constant strain, the seams fail long before the leather does, and that is wear rather than a fault, so it is not something the warranty covers. If you carry more than about ten cards, a wallet with a dedicated card section will last longer than one that relies on slot tension.",
      },
      { type: "h", text: "Check the wallet you already own" },
      {
        type: "list",
        items: [
          "Lay your current wallet flat and measure it closed: width, height, and thickness with your cards in it. Those three numbers are what you are replacing, and they are more reliable than any size label.",
          "Take the tallest note you normally carry, fold it in half, and lay it inside the note pocket. If the note's edge sits above the leather, a wallet of that pocket depth will crease your notes.",
          "Slide the wallet into the pocket you actually use it in — trouser front, jacket inside, or bag. A difference of five millimetres is noticeable by the end of a day.",
          "Count your cards honestly, including the loyalty cards you never use. That number decides which construction suits you, not the other way round.",
        ],
      },
      { type: "h", text: "What we will publish, and when" },
      {
        type: "p",
        text: "Our own wallets are measured on the finished piece — external length, width and thickness, the internal height of the note pocket, the number of card slots, and how many notes and cards the piece holds before it distorts. Those figures go on the product page. Until then the product page says the measurement is in progress, which is the truth, and this page gives you everything needed to judge a wallet in the meantime.",
      },
      {
        type: "callout",
        text: "If the wallet you are considering has not yet been measured and you need a specific figure before ordering, message us with your question. We will measure the actual piece and tell you, rather than quote you a number from a catalogue.",
      },
    ],
    ms: [
      {
        type: "p",
        text: "Dompet gagal kerana salah satu daripada tiga sebab: ia tidak memuatkan wang yang anda benar-benar bawa, ia tidak muat dalam poket yang anda benar-benar guna, atau ia menggelembung apabila kad dimasukkan. Ketiga-tiganya boleh diukur sebelum anda membeli, dan itulah tujuan halaman ini.",
      },
      { type: "h", text: "Dimensi wang kertas Malaysia" },
      {
        type: "p",
        text: "Ini ialah dimensi rasmi siri wang kertas Malaysia semasa, diterbitkan oleh Bank Negara Malaysia. Wang yang paling tinggi paling penting, kerana dompet bifold melipatnya dua kali dan lipatan itulah yang menentukan sama ada wang duduk rata atau kemek.",
      },
      { type: "table", table: "banknotes" },
      {
        type: "p",
        text: `Wang Malaysia yang paling tinggi ialah RM50 dan RM100, kedua-duanya 69 mm tinggi. Dilipat dua, ia masih mengambil ketinggian 69 mm, jadi poket wang sebuah bifold memerlukan kira-kira ${minimumPocketHeightMm} mm ketinggian dalaman supaya wang itu tidak tersangkut di tepi — iaitu ketinggian wang ditambah kira-kira ${NOTE_CLEARANCE_MM} mm ruang lapang. Poket yang lebih cetek boleh memuatkan RM10 dengan selesa tetapi akan sentiasa mengemekkan RM100.`,
      },
      { type: "h", text: "Penanda aras pasaran untuk bifold nipis" },
      {
        type: "p",
        text: `Sebagai rujukan, dompet bifold nipis yang dijual secara meluas dalam kategori ini berukuran sekitar ${marketBenchmarkMm.width} × ${marketBenchmarkMm.height} × ${marketBenchmarkMm.thickness} mm dari luar. Julat itu — kira-kira 85 hingga 90 mm lebar, 110 hingga 120 mm tinggi, dan 10 hingga 15 mm tebal semasa kosong — ialah apa yang kebanyakan orang maksudkan dengan bifold bersaiz biasa.`,
      },
      {
        type: "callout",
        text: "Angka itu ialah penanda aras pasaran, diambil daripada spesifikasi yang diterbitkan oleh pengeluar lain. Ia bukan ukuran dompet kami. Dimensi kami sendiri dinyatakan pada halaman produk setelah ia diukur pada kepingan sebenar, dan kami tidak menerbitkan angka yang tidak kami ukur sendiri.",
      },
      { type: "h", text: "Berapa banyak kad boleh dimuatkan bifold" },
      {
        type: "p",
        text: "Bifold dengan empat hingga enam slot kad boleh memuatkan lima hingga dua belas kad sebelum ia mula berubah bentuk. Hadnya bukan slot — tetapi kulit di antaranya. Setelah dompet dipenuhi sehingga tulang belakangnya sentiasa tegang, jahitan akan gagal jauh sebelum kulitnya, dan itu ialah haus biasa dan bukan kecacatan, jadi ia tidak dilindungi jaminan. Jika anda membawa lebih daripada kira-kira sepuluh kad, dompet dengan bahagian kad khusus akan bertahan lebih lama daripada yang bergantung pada ketegangan slot.",
      },
      { type: "h", text: "Periksa dompet yang anda sudah ada" },
      {
        type: "list",
        items: [
          "Letakkan dompet semasa anda rata dan ukur semasa tertutup: lebar, tinggi, dan ketebalan dengan kad di dalamnya. Tiga angka itu ialah apa yang anda gantikan, dan ia lebih dipercayai daripada apa-apa label saiz.",
          "Ambil wang paling tinggi yang biasa anda bawa, lipat dua, dan letakkan di dalam poket wang. Jika tepi wang berada di atas kulit, dompet dengan kedalaman poket itu akan mengemekkan wang anda.",
          "Masukkan dompet ke dalam poket yang sebenarnya anda gunakan — seluar depan, dalam jaket, atau beg. Perbezaan lima milimeter akan terasa menjelang hujung hari.",
          "Kira kad anda dengan jujur, termasuk kad kesetiaan yang tidak pernah digunakan. Angka itulah yang menentukan binaan mana yang sesuai, bukan sebaliknya.",
        ],
      },
      { type: "h", text: "Apa yang akan kami terbitkan, dan bila" },
      {
        type: "p",
        text: "Dompet kami diukur pada kepingan siap — panjang, lebar dan ketebalan luaran, ketinggian dalaman poket wang, bilangan slot kad, dan berapa banyak wang serta kad yang boleh dimuatkan sebelum ia berubah bentuk. Angka-angka itu akan diletakkan pada halaman produk. Sehingga itu, halaman produk menyatakan ukuran sedang diambil, iaitu kebenarannya, dan halaman ini memberikan segala yang diperlukan untuk menilai sebuah dompet sementara menunggu.",
      },
      {
        type: "callout",
        text: "Jika dompet yang anda pertimbangkan belum diukur dan anda memerlukan angka tertentu sebelum memesan, hubungi kami dengan soalan anda. Kami akan mengukur kepingan sebenar dan memberitahu anda, bukan memetik angka daripada katalog.",
      },
    ],
    zh: [
      {
        type: "p",
        text: "钱包出问题通常是三种原因之一：装不下你实际携带的纸币、放不进你实际使用的口袋，或者装入卡片后鼓胀变形。这三者都能在购买前测量出来，本页正是为此而写。",
      },
      { type: "h", text: "马来西亚纸币尺寸" },
      {
        type: "p",
        text: "以下是马来西亚现行纸币系列的官方尺寸，由马来西亚国家银行公布。最高的纸币最关键，因为对折钱包会把纸币折成两半，而折起后的高度决定了纸币是平放还是被压皱。",
      },
      { type: "table", table: "banknotes" },
      {
        type: "p",
        text: `马来西亚最高的纸币是 RM50 与 RM100，两者高度均为 69 毫米。折成两半后仍占 69 毫米高度，因此对折钱包的纸币夹层内高约需 ${minimumPocketHeightMm} 毫米，才能避免纸币边缘被卡住——即纸币高度加上约 ${NOTE_CLEARANCE_MM} 毫米的余量。夹层更浅的钱包放 RM10 很轻松，却会让 RM100 永远带着折痕。`,
      },
      { type: "h", text: "纤薄对折钱包的市场参考尺寸" },
      {
        type: "p",
        text: `作为参考，此类广受欢迎的纤薄对折钱包，外部尺寸约为 ${marketBenchmarkMm.width} × ${marketBenchmarkMm.height} × ${marketBenchmarkMm.thickness} 毫米。这个区间——宽约 85 至 90 毫米、高约 110 至 120 毫米、空包厚约 10 至 15 毫米——就是多数人所说的「正常尺寸对折钱包」。`,
      },
      {
        type: "callout",
        text: "该数字是市场参考值，取自另一家厂商公布的规格，并非我们钱包的实测尺寸。我们自己的尺寸会在实际成品测量完成后标注于产品页面；未经我们亲自测量的数字，我们不会公布。",
      },
      { type: "h", text: "对折钱包能放多少张卡" },
      {
        type: "p",
        text: "具备四至六个卡位的对折钱包，在开始变形之前可放五至十二张卡。真正的限制不是卡位数量，而是卡位之间的皮革。当钱包被塞到书脊处长期受张力，缝线会比皮革更早失效，而这属于正常磨损而非瑕疵，因此不在质保范围内。若你携带超过约十张卡，设有独立卡夹区的钱包会比依赖卡位张力的款式更耐用。",
      },
      { type: "h", text: "检查你现有的钱包" },
      {
        type: "list",
        items: [
          "把现有钱包平放，合起来量：宽度、高度，以及装入卡片后的厚度。这三个数字就是你要替换的规格，比任何尺码标签都可靠。",
          "取一张你平时携带的最高纸币，对折后放进纸币夹层。若纸币边缘高出皮革，说明该夹层深度的钱包会让你的纸币起折痕。",
          "把钱包放进你实际使用的口袋——前裤袋、外套内袋或包里。五毫米的差异，到一天结束时就能感觉到。",
          "如实清点你的卡片，包括那些从不使用的会员卡。是这个数字决定哪种结构适合你，而不是反过来。",
        ],
      },
      { type: "h", text: "我们会公布什么，以及何时公布" },
      {
        type: "p",
        text: "我们的钱包会在成品上测量——外部长、宽、厚，纸币夹层的内高，卡位数量，以及在开始变形前可装多少张纸币与卡片。这些数字会登上产品页面。在此之前的说明是「尺寸测量中」，这是事实；而本页已提供判断一只钱包所需的全部依据。",
      },
      {
        type: "callout",
        text: "如果你正在考虑的钱包尚未测量，而你在下单前需要确切数字，请把问题发给我们。我们会测量实际成品后再告诉你，而不是从目录里引一个数字。",
      },
    ],
  },
};

/**
 * Bilingual column labels for the banknote table rendered by `PageBlocks`.
 * Kept beside the data so the table cannot be relabelled into something the
 * source does not say.
 */
export const banknoteColumns: Record<
  Locale,
  { denomination: string; size: string; substrate: string; note: string }
> = {
  en: {
    denomination: "Note",
    size: "Size (mm)",
    substrate: "Material",
    note: "Diameter of the tallest Malaysian note",
  },
  ms: {
    denomination: "Wang",
    size: "Saiz (mm)",
    substrate: "Bahan",
    note: "Ketinggian wang Malaysia yang paling tinggi",
  },
  zh: {
    denomination: "面额",
    size: "尺寸（毫米）",
    substrate: "材质",
    note: "马来西亚纸币中的最高高度",
  },
};

export const substrateLabel: Record<Locale, Record<string, string>> = {
  en: { paper: "Paper", polymer: "Polymer" },
  ms: { paper: "Kertas", polymer: "Polimer" },
  zh: { paper: "纸质", polymer: "聚合物" },
};
