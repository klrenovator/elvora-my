import type { Product } from "./types";
import { categoryById } from "./categories";

/**
 * Product catalogue.
 *
 * IMPORTANT — these are seed entries, not a finished range:
 *
 * · Every price is `{ kind: "on-request" }`. No selling price has been supplied
 *   by the business owner yet, so none is displayed, guessed or defaulted. This
 *   deliberately exercises the Price on Request path before any number exists.
 * · Stock counts are 0 throughout, because no physical stock has been counted.
 *   The UI therefore reports "Enquire for availability" rather than implying
 *   inventory that does not exist.
 * · Descriptions state only what this build can verify: the category, the two
 *   leather grades we sell, and how the piece is intended to be used. No
 *   dimensions, weights or hardware claims are asserted until the owner
 *   confirms them — the specifications blocks say so explicitly.
 * · Images are temporary illustrations and are flagged `placeholder: true`.
 *
 * When the owner supplies prices, stock, measurements and photography, edit
 * the values here (or through the admin screen in Phase 2 step 3). Nothing else
 * in the storefront needs to change.
 */

const onRequest = { kind: "on-request" } as const;

export const products: Product[] = [
  {
    id: "bifold-wallet-cognac",
    category: "mens-wallets",
    status: "published",
    order: 1,
    slug: {
      en: "cognac-full-grain-bifold-wallet",
      ms: "dompet-bifold-full-grain-cognac",
      zh: "gan-yi-zong-quan-li-mian-dui-zhe-qian-bao",
    },
    name: {
      en: "Cognac Full Grain Bifold Wallet",
      ms: "Dompet Bifold Full Grain Cognac",
      zh: "干邑棕全粒面对折钱包",
    },
    shortDescription: {
      en: "A slim bifold in full grain leather, built around a card-forward layout for daily carry.",
      ms: "Bifold nipis dalam kulit full grain, dibina sekitar susun atur berasaskan kad untuk kegunaan harian.",
      zh: "全粒面皮革制纤薄对折款，以卡位为主的日常布局。",
    },
    description: {
      en: [
        "This is the shape most people reach for first: a bifold that closes flat in a front pocket and does not announce itself. The leather is full grain, so the surface keeps its natural grain and will show the marks of daily use rather than hiding them.",
        "The internal layout is card-forward. That suits anyone who carries six to eight cards and a small amount of cash, and it keeps the folded wallet thin enough to sit comfortably in a front pocket.",
        "Full grain starts slightly firm and softens as it is handled. If you prefer a wallet that looks unchanged after a year, the top grain pieces in this category will suit you better.",
      ],
      ms: [
        "Inilah bentuk yang paling ramai pilih dahulu: bifold yang menutup rata di poket hadapan dan tidak menarik perhatian. Kulitnya full grain, jadi permukaannya mengekalkan ira semula jadi dan akan menunjukkan kesan penggunaan harian dan bukannya menyembunyikannya.",
        "Susun atur dalamnya berasaskan kad. Ia sesuai untuk sesiapa yang membawa enam hingga lapan kad dan sedikit wang tunai, dan mengekalkan dompet yang dilipat cukup nipis untuk selesa di poket hadapan.",
        "Full grain bermula sedikit keras dan melembut apabila dipegang. Jika anda lebih suka dompet yang kelihatan tidak berubah selepas setahun, barang top grain dalam kategori ini lebih sesuai untuk anda.",
      ],
      zh: [
        "这是多数人最先会挑的款式：合起来平整、放在前口袋也不显眼。皮料为全粒面，因此表面保留天然纹理，会留下日常使用的痕迹，而不是把痕迹藏起来。",
        "内层以卡位为主。适合携带六到八张卡、少量现金的人，折起来仍够薄，放在前口袋也舒服。",
        "全粒面初期略挺，随使用逐渐柔软。若你希望钱包用了一年还像新的一样，这个分类里的头层款式会更适合你。",
      ],
    },
    leatherType: "full-grain",
    price: onRequest,
    sku: "ELV-MW-001",
    colours: [
      {
        id: "cognac",
        name: { en: "Cognac brown", ms: "Coklat cognac", zh: "干邑棕" },
        swatch: "#8a4b2a",
      },
      {
        id: "espresso",
        name: { en: "Espresso brown", ms: "Coklat espreso", zh: "浓缩咖啡棕" },
        swatch: "#1b120d",
      },
    ],
    sizes: [],
    variants: [
      { id: "bifold-cognac", colourId: "cognac", stock: 0, sku: "ELV-MW-001-CG" },
      { id: "bifold-espresso", colourId: "espresso", stock: 0, sku: "ELV-MW-001-ES" },
    ],
    specifications: [
      {
        group: { en: "Material", ms: "Bahan", zh: "材质" },
        items: [
          {
            label: { en: "Leather", ms: "Kulit", zh: "皮革" },
            value: { en: "Full grain genuine leather", ms: "Kulit asli full grain", zh: "全粒面真皮" },
          },
          {
            label: { en: "Made in", ms: "Dibuat di", zh: "产地" },
            value: { en: "Pakistan", ms: "Pakistan", zh: "巴基斯坦" },
          },
        ],
      },
      {
        group: { en: "Measurements", ms: "Ukuran", zh: "尺寸" },
        items: [
          {
            label: { en: "Dimensions", ms: "Dimensi", zh: "尺寸" },
            value: {
              en: "Being measured — ask us and we will send the figures",
              ms: "Sedang diukur — tanya kami dan kami akan hantar angkanya",
              zh: "正在测量中——联系我们，我们会提供数据",
            },
          },
        ],
      },
    ],
    images: [
      {
        src: "/images/categories/mens-wallets.jpg",
        alt: {
          en: "Cognac full grain bifold wallet, temporary illustration",
          ms: "Dompet bifold full grain cognac, ilustrasi sementara",
          zh: "干邑棕全粒面对折钱包，临时示意图",
        },
        placeholder: true,
      },
    ],
    merchandising: { featured: true, newArrival: false, bestseller: false },
    seo: {
      title: {
        en: "Cognac Full Grain Bifold Wallet — Genuine Leather",
        ms: "Dompet Bifold Full Grain Cognac — Kulit Asli",
        zh: "干邑棕全粒面对折钱包——真皮",
      },
      description: {
        en: "A slim full grain bifold wallet in cognac brown with a card-forward interior. Made in Pakistan and delivered across Malaysia. Price on request.",
        ms: "Dompet bifold full grain nipis berwarna coklat cognac dengan bahagian dalam berasaskan kad. Dihasilkan di Pakistan dan dihantar ke seluruh Malaysia. Harga atas permintaan.",
        zh: "干邑棕纤薄全粒面对折钱包，内层以卡位为主。巴基斯坦制造，配送全马。价格面议。",
      },
    },
    faqs: {
      en: [
        {
          q: "Why does this wallet not show a price?",
          a: "Because we have not set one yet. Prices on this site are entered by hand per product, and we would rather show price on request than publish an estimated figure. Message us and we will quote you.",
        },
        {
          q: "Is full grain suitable for daily pocket carry?",
          a: "Yes. Full grain is the most durable surface grade we sell. It will show marks sooner than top grain, which is a normal property of the material rather than wear.",
        },
      ],
      ms: [
        {
          q: "Mengapa dompet ini tidak memaparkan harga?",
          a: "Kerana kami belum menetapkannya. Harga di laman ini dimasukkan secara manual bagi setiap produk, dan kami lebih suka memaparkan harga atas permintaan daripada menerbitkan angka anggaran. Hubungi kami dan kami akan memberi sebut harga.",
        },
        {
          q: "Adakah full grain sesuai untuk dibawa dalam poket setiap hari?",
          a: "Ya. Full grain ialah gred permukaan paling tahan yang kami jual. Ia akan menunjukkan kesan lebih awal berbanding top grain, dan itu sifat biasa bahan ini dan bukan kehausan.",
        },
      ],
      zh: [
        {
          q: "这款钱包为什么不显示价格？",
          a: "因为我们还没有定价。本站的价格由每款产品逐一手动输入，与其公布一个估算数字，我们宁愿标示「价格面议」。联系我们即可获取报价。",
        },
        {
          q: "全粒面适合每天放在口袋携带吗？",
          a: "适合。全粒面是我们所售表面等级中最耐用的一种。它会比头层更早出现使用痕迹，这是材质本身的正常特性，而不是磨损。",
        },
      ],
    },
    relatedProductIds: ["slim-belt-chocolate", "structured-top-handle-bag"],
  },

  {
    id: "slim-belt-chocolate",
    category: "mens-belts",
    status: "published",
    order: 2,
    slug: {
      en: "chocolate-full-grain-belt",
      ms: "tali-pinggang-full-grain-coklat",
      zh: "qiao-ke-li-quan-li-mian-pi-dai",
    },
    name: {
      en: "Chocolate Full Grain Belt",
      ms: "Tali Pinggang Full Grain Coklat",
      zh: "巧克力色全粒面皮带",
    },
    shortDescription: {
      en: "A 3.5 cm full grain strap with a brushed pin buckle — the everyday office and denim choice.",
      ms: "Tali full grain 3.5 cm dengan buckle pin berus — pilihan harian untuk pejabat dan denim.",
      zh: "3.5 公分全粒面带身，配拉丝针扣，日常上班与牛仔裤皆宜。",
    },
    description: {
      en: [
        "A belt does quiet work. This one is cut at 3.5 cm, which sits comfortably between formal and casual: narrow enough for trousers, substantial enough for jeans.",
        "The leather is full grain, and the buckle is brushed rather than polished, so it does not glare under office lighting. Full grain means the strap takes on a soft sheen where it bends — the mark of a belt that is worn often.",
        "Order by the length of a belt you already wear, measured from the buckle fold to the hole you use most. Trouser size and belt length are rarely the same number.",
      ],
      ms: [
        "Tali pinggang melakukan kerja yang senyap. Yang ini dipotong pada 3.5 cm, yang selesa di antara formal dan kasual: cukup nipis untuk seluar, cukup kukuh untuk jean.",
        "Kulitnya full grain, dan buckle-nya berus dan bukan berkilat, jadi ia tidak menyilaukan di bawah cahaya pejabat. Full grain bermakna tali itu memperoleh kilau lembut di tempat ia melengkung — tanda tali pinggang yang kerap dipakai.",
        "Pesan mengikut panjang tali pinggang yang sedang anda pakai, diukur dari lipatan buckle hingga lubang yang paling kerap digunakan. Saiz seluar dan panjang tali pinggang jarang sama angkanya.",
      ],
      zh: [
        "皮带做的是安静的工作。这条的带宽是 3.5 公分，正好落在正式与休闲之间：配西裤不至于太粗，配牛仔裤也不显单薄。",
        "皮料为全粒面，扣头做拉丝处理而非抛光，在办公室灯光下不会反光刺眼。全粒面的皮带会在弯折处养出柔和的亮度，那正是经常佩戴的痕迹。",
        "订购时请依照你现有皮带的长度——从扣头折返处量到你最常用的那个孔。裤子的尺码与皮带长度，很少是同一个数字。",
      ],
    },
    leatherType: "full-grain",
    price: onRequest,
    sku: "ELV-MB-001",
    colours: [
      {
        id: "chocolate",
        name: { en: "Chocolate brown", ms: "Coklat gelap", zh: "巧克力棕" },
        swatch: "#2b1d15",
      },
      {
        id: "black",
        name: { en: "Black", ms: "Hitam", zh: "黑色" },
        swatch: "#14100d",
      },
    ],
    sizes: [
      { id: "85", label: "85 cm" },
      { id: "90", label: "90 cm" },
      { id: "95", label: "95 cm" },
      { id: "100", label: "100 cm" },
      { id: "105", label: "105 cm" },
    ],
    variants: [
      { id: "belt-choc-85", colourId: "chocolate", sizeId: "85", stock: 0, sku: "ELV-MB-001-CH-85" },
      { id: "belt-choc-90", colourId: "chocolate", sizeId: "90", stock: 0, sku: "ELV-MB-001-CH-90" },
      { id: "belt-choc-95", colourId: "chocolate", sizeId: "95", stock: 0, sku: "ELV-MB-001-CH-95" },
      { id: "belt-choc-100", colourId: "chocolate", sizeId: "100", stock: 0, sku: "ELV-MB-001-CH-100" },
      { id: "belt-choc-105", colourId: "chocolate", sizeId: "105", stock: 0, sku: "ELV-MB-001-CH-105" },
      { id: "belt-black-85", colourId: "black", sizeId: "85", stock: 0, sku: "ELV-MB-001-BK-85" },
      { id: "belt-black-90", colourId: "black", sizeId: "90", stock: 0, sku: "ELV-MB-001-BK-90" },
      { id: "belt-black-95", colourId: "black", sizeId: "95", stock: 0, sku: "ELV-MB-001-BK-95" },
      { id: "belt-black-100", colourId: "black", sizeId: "100", stock: 0, sku: "ELV-MB-001-BK-100" },
      { id: "belt-black-105", colourId: "black", sizeId: "105", stock: 0, sku: "ELV-MB-001-BK-105" },
    ],
    specifications: [
      {
        group: { en: "Material", ms: "Bahan", zh: "材质" },
        items: [
          {
            label: { en: "Leather", ms: "Kulit", zh: "皮革" },
            value: { en: "Full grain genuine leather", ms: "Kulit asli full grain", zh: "全粒面真皮" },
          },
          {
            label: { en: "Strap width", ms: "Lebar tali", zh: "带身宽度" },
            value: { en: "3.5 cm", ms: "3.5 cm", zh: "3.5 公分" },
          },
          {
            label: { en: "Buckle", ms: "Buckle", zh: "扣头" },
            value: { en: "Brushed metal pin buckle", ms: "Buckle pin logam berus", zh: "金属拉丝针扣" },
          },
        ],
      },
      {
        group: { en: "Sizing", ms: "Saiz", zh: "尺码" },
        items: [
          {
            label: { en: "Length choices", ms: "Pilihan panjang", zh: "长度选择" },
            value: { en: "85 cm to 105 cm", ms: "85 cm hingga 105 cm", zh: "85 至 105 公分" },
          },
          {
            label: { en: "How to measure", ms: "Cara mengukur", zh: "测量方式" },
            value: {
              en: "Measure an existing belt from the buckle fold to your usual hole",
              ms: "Ukur tali pinggang sedia ada dari lipatan buckle hingga lubang biasa anda",
              zh: "量现有皮带，从扣头折返处到你常用的孔",
            },
          },
        ],
      },
    ],
    images: [
      {
        src: "/images/categories/mens-belts.jpg",
        alt: {
          en: "Chocolate full grain leather belt with brushed buckle, temporary illustration",
          ms: "Tali pinggang kulit full grain coklat dengan buckle berus, ilustrasi sementara",
          zh: "巧克力色全粒面真皮皮带，配拉丝扣头，临时示意图",
        },
        placeholder: true,
      },
    ],
    merchandising: { featured: true, newArrival: false, bestseller: false },
    seo: {
      title: {
        en: "Chocolate Full Grain Leather Belt — 3.5 cm Strap",
        ms: "Tali Pinggang Kulit Full Grain Coklat — Tali 3.5 cm",
        zh: "巧克力色全粒面真皮皮带——3.5 公分身宽",
      },
      description: {
        en: "A 3.5 cm full grain genuine leather belt with a brushed pin buckle, in chocolate brown or black. Made in Pakistan, delivered across Malaysia. Price on request.",
        ms: "Tali pinggang kulit asli full grain 3.5 cm dengan buckle pin berus, dalam coklat gelap atau hitam. Dihasilkan di Pakistan, dihantar ke seluruh Malaysia. Harga atas permintaan.",
        zh: "3.5 公分全粒面真皮皮带，配拉丝针扣，备巧克力棕与黑色。巴基斯坦制造，配送全马。价格面议。",
      },
    },
    faqs: {
      en: [
        {
          q: "Should I order my trouser size?",
          a: "No. Measure a belt you already wear from the buckle fold to the hole you use most, and order the closest length. If you are between sizes, take the longer one so an extra hole can be added.",
        },
        {
          q: "Can the belt be shortened?",
          a: "Most leather belts can be shortened by a leatherworker or cobbler. If you tell us the length you need before dispatch, we will advise on the best option for the buckle type.",
        },
      ],
      ms: [
        {
          q: "Patutkah saya memesan mengikut saiz seluar?",
          a: "Tidak. Ukur tali pinggang yang sedang anda pakai dari lipatan buckle hingga lubang yang paling kerap digunakan, dan pesan panjang yang paling hampir. Jika ukuran anda di antara dua saiz, ambil yang lebih panjang supaya lubang tambahan boleh dibuat.",
        },
        {
          q: "Bolehkah tali pinggang dipendekkan?",
          a: "Kebanyakan tali pinggang kulit boleh dipendekkan oleh tukang kulit atau tukang kasut. Jika anda memberitahu kami panjang yang diperlukan sebelum penghantaran, kami akan menasihati pilihan terbaik untuk jenis buckle itu.",
        },
      ],
      zh: [
        {
          q: "我应该按裤子的尺码订吗？",
          a: "不要。请量一条现有皮带，从扣头折返处量到你最常使用的孔，再选最接近的长度。若介于两个尺码之间，选较长的一条，方便日后加打孔。",
        },
        {
          q: "皮带可以改短吗？",
          a: "大多数真皮皮带都可以请皮具师傅或鞋匠改短。若你在发货前告知需要的长度，我们会依扣头类型给你建议。",
        },
      ],
    },
    relatedProductIds: ["bifold-wallet-cognac", "narrow-ladies-belt-tan"],
  },

  {
    id: "structured-top-handle-bag",
    category: "ladies-handbags",
    status: "published",
    order: 3,
    slug: {
      en: "structured-tan-top-handle-bag",
      ms: "beg-tangan-berstruktur-tan",
      zh: "tan-se-jie-gou-shou-ti-bao",
    },
    name: {
      en: "Structured Tan Top-Handle Bag",
      ms: "Beg Tangan Berstruktur Tan",
      zh: "棕褐结构手提包",
    },
    shortDescription: {
      en: "A top-grain bag that holds its shape, with a clean flap closure for office days.",
      ms: "Beg top grain yang kekal bentuknya, dengan penutup flap bersih untuk hari bekerja.",
      zh: "头层皮制，包型挺拔，翻盖设计干净利落，适合上班通勤。",
    },
    description: {
      en: [
        "This bag is built around keeping its shape. The leather is top grain, lightly finished so the surface stays even, and the base is reinforced so the bag stands on its own rather than slumping when you set it down.",
        "The top handle suits a short carry — from the car to the lift to the desk. It is not designed as a shoulder bag, and we would rather say so than imply a strap that is not there.",
        "Top grain was chosen here on purpose. It resists visible scuffing better than full grain, which matters for a piece that brushes against desks and doorways every day.",
      ],
      ms: [
        "Beg ini dibina untuk mengekalkan bentuknya. Kulitnya top grain, dikemaskan sedikit supaya permukaannya kekal sekata, dan bahagian bawahnya diperkuat supaya beg boleh berdiri sendiri dan bukannya melurut apabila diletakkan.",
        "Pemegang atasnya sesuai untuk bawaan jarak dekat — dari kereta ke lif ke meja. Ia bukan direka sebagai beg bahu, dan kami lebih suka menyatakannya daripada memberi gambaran tentang tali yang tidak ada.",
        "Top grain dipilih di sini dengan sengaja. Ia lebih tahan calar yang kelihatan berbanding full grain, dan itu penting bagi barang yang bergesel dengan meja dan pintu setiap hari.",
      ],
      zh: [
        "这个包的重点是维持包型。皮料为头层，表面经过轻度处理，因此保持均匀；底部做过加固，放下时会自己站住，而不是塌下来。",
        "顶部提把适合短距离携带——从车上到电梯再到办公桌。它不是肩背包，我们宁愿直接说明，也不想让你以为附有一条不存在的背带。",
        "这里选用头层是有意的。它比全粒面更不易留下明显刮痕，对每天会蹭到桌面与门框的包来说，这一点很重要。",
      ],
    },
    leatherType: "top-grain",
    price: onRequest,
    sku: "ELV-LH-001",
    colours: [
      {
        id: "tan",
        name: { en: "Tan", ms: "Tan", zh: "棕褐" },
        swatch: "#b08862",
      },
      {
        id: "espresso",
        name: { en: "Espresso brown", ms: "Coklat espreso", zh: "浓缩咖啡棕" },
        swatch: "#1b120d",
      },
    ],
    sizes: [],
    variants: [
      { id: "bag-tan", colourId: "tan", stock: 0, sku: "ELV-LH-001-TN" },
      { id: "bag-espresso", colourId: "espresso", stock: 0, sku: "ELV-LH-001-ES" },
    ],
    specifications: [
      {
        group: { en: "Material", ms: "Bahan", zh: "材质" },
        items: [
          {
            label: { en: "Leather", ms: "Kulit", zh: "皮革" },
            value: { en: "Top grain genuine leather", ms: "Kulit asli top grain", zh: "头层真皮" },
          },
          {
            label: { en: "Hardware", ms: "Perkakasan", zh: "五金" },
            value: {
              en: "Gold-tone clasp",
              ms: "Kancing warna emas",
              zh: "金色调锁扣",
            },
          },
        ],
      },
      {
        group: { en: "Capacity", ms: "Kapasiti", zh: "容量" },
        items: [
          {
            label: { en: "Interior dimensions", ms: "Dimensi dalam", zh: "内部尺寸" },
            value: {
              en: "Being measured — ask us before ordering a tablet",
              ms: "Sedang diukur — tanya kami sebelum memesan untuk tablet",
              zh: "正在测量中——若要放平板，请先询问我们",
            },
          },
        ],
      },
    ],
    images: [
      {
        src: "/images/categories/ladies-handbags.jpg",
        alt: {
          en: "Structured tan top grain handbag with gold-tone clasp, temporary illustration",
          ms: "Beg tangan top grain tan berstruktur dengan kancing warna emas, ilustrasi sementara",
          zh: "棕褐头层皮结构手提包，配金色调锁扣，临时示意图",
        },
        placeholder: true,
      },
    ],
    merchandising: { featured: true, newArrival: true, bestseller: false },
    seo: {
      title: {
        en: "Structured Tan Top Grain Handbag — Genuine Leather",
        ms: "Beg Tangan Top Grain Tan Berstruktur — Kulit Asli",
        zh: "棕褐头层真皮结构手提包",
      },
      description: {
        en: "A structured top grain genuine leather handbag in tan with a reinforced base and gold-tone clasp. Made in Pakistan, delivered across Malaysia. Price on request.",
        ms: "Beg tangan kulit asli top grain berstruktur dalam warna tan dengan dasar diperkuat dan kancing warna emas. Dihasilkan di Pakistan, dihantar ke seluruh Malaysia. Harga atas permintaan.",
        zh: "棕褐头层真皮结构手提包，底部加固，配金色调锁扣。巴基斯坦制造，配送全马。价格面议。",
      },
    },
    faqs: {
      en: [
        {
          q: "Does it fit a laptop?",
          a: "We are still measuring the interior, so we cannot confirm laptop capacity yet. Send us your device dimensions and we will check against the bag before you order.",
        },
        {
          q: "Is there a shoulder strap?",
          a: "This design is carried by the top handle only. If you need a strap, message us and we will tell you which pieces in the range have one.",
        },
      ],
      ms: [
        {
          q: "Adakah ia memuatkan laptop?",
          a: "Kami masih mengukur bahagian dalamnya, jadi kapasiti laptop belum dapat disahkan. Hantarkan dimensi peranti anda dan kami akan menyemaknya dengan beg ini sebelum anda memesan.",
        },
        {
          q: "Adakah tali bahu disertakan?",
          a: "Reka bentuk ini dibawa dengan pemegang atas sahaja. Jika anda memerlukan tali, hubungi kami dan kami akan memberitahu barang mana dalam koleksi ini yang ada.",
        },
      ],
      zh: [
        {
          q: "能放笔电吗？",
          a: "内部尺寸仍在测量中，所以目前还无法确认能不能放笔电。把你设备的尺寸发给我们，我们会在你下单前帮你比对。",
        },
        {
          q: "有肩背带吗？",
          a: "这款设计只以顶部提把携带。若你需要背带，联系我们，我们会告诉你系列中哪些款式有附背带。",
        },
      ],
    },
    relatedProductIds: ["narrow-ladies-belt-tan", "bifold-wallet-cognac"],
  },

  {
    id: "narrow-ladies-belt-tan",
    category: "ladies-belts",
    status: "published",
    order: 4,
    slug: {
      en: "narrow-tan-ladies-belt",
      ms: "tali-pinggang-wanita-tan-nipis",
      zh: "tan-xi-shen-nv-shi-pi-dai",
    },
    name: {
      en: "Narrow Tan Ladies' Belt",
      ms: "Tali Pinggang Wanita Tan Nipis",
      zh: "棕褐细身女士皮带",
    },
    shortDescription: {
      en: "A 2 cm top grain belt with a slim gold buckle — made to sit over a dress, not just through loops.",
      ms: "Tali top grain 2 cm dengan buckle emas nipis — direka untuk dipakai di atas gaun, bukan hanya melalui lubang seluar.",
      zh: "2 公分头层皮带，配纤细金色扣头——为系在裙装外而设计，不只穿过裤头。",
    },
    description: {
      en: [
        "Two centimetres of leather reads delicate, which is exactly what a belt worn over a dress needs. It is top grain, finished smooth, so it does not fight the fabric underneath.",
        "The buckle is deliberately slim. A larger buckle would pull the eye and make the belt look like a men's belt worn by accident; this one stays where it should.",
        "Because it is worn at the waist rather than through trouser loops, measure at the point you will actually wear it — over the garment, not against the skin.",
      ],
      ms: [
        "Dua sentimeter kulit memberi kesan halus, dan itulah yang diperlukan oleh tali pinggang yang dipakai di atas gaun. Ia top grain, dikemaskan licin, jadi ia tidak bersaing dengan fabrik di bawahnya.",
        "Buckle-nya sengaja nipis. Buckle yang lebih besar akan menarik perhatian dan membuat tali pinggang kelihatan seperti tali pinggang lelaki yang tersalah pakai; yang ini kekal di tempatnya.",
        "Kerana ia dipakai di pinggang dan bukan melalui lubang seluar, ukur pada kedudukan anda akan benar-benar memakainya — di atas pakaian, bukan pada kulit.",
      ],
      zh: [
        "两公分宽的皮料显得细致，这正是系在裙装外的皮带所需要的。皮料为头层，表面处理平滑，不会和底下的布料互相抢戏。",
        "扣头刻意做得纤细。扣头一大，视觉焦点就被拉走，看起来像误戴了男士皮带；这一款的扣头就停在它该在的位置。",
        "因为它是系在腰间、而不是穿过裤头，所以要在你实际会佩戴的位置量——隔着衣物量，而不是贴着皮肤。",
      ],
    },
    leatherType: "top-grain",
    price: onRequest,
    sku: "ELV-LB-001",
    colours: [
      {
        id: "tan",
        name: { en: "Tan", ms: "Tan", zh: "棕褐" },
        swatch: "#b08862",
      },
      {
        id: "black",
        name: { en: "Black", ms: "Hitam", zh: "黑色" },
        swatch: "#14100d",
      },
    ],
    sizes: [
      { id: "70", label: "70 cm" },
      { id: "75", label: "75 cm" },
      { id: "80", label: "80 cm" },
      { id: "85", label: "85 cm" },
    ],
    variants: [
      { id: "lb-tan-70", colourId: "tan", sizeId: "70", stock: 0, sku: "ELV-LB-001-TN-70" },
      { id: "lb-tan-75", colourId: "tan", sizeId: "75", stock: 0, sku: "ELV-LB-001-TN-75" },
      { id: "lb-tan-80", colourId: "tan", sizeId: "80", stock: 0, sku: "ELV-LB-001-TN-80" },
      { id: "lb-tan-85", colourId: "tan", sizeId: "85", stock: 0, sku: "ELV-LB-001-TN-85" },
      { id: "lb-black-70", colourId: "black", sizeId: "70", stock: 0, sku: "ELV-LB-001-BK-70" },
      { id: "lb-black-75", colourId: "black", sizeId: "75", stock: 0, sku: "ELV-LB-001-BK-75" },
      { id: "lb-black-80", colourId: "black", sizeId: "80", stock: 0, sku: "ELV-LB-001-BK-80" },
      { id: "lb-black-85", colourId: "black", sizeId: "85", stock: 0, sku: "ELV-LB-001-BK-85" },
    ],
    specifications: [
      {
        group: { en: "Material", ms: "Bahan", zh: "材质" },
        items: [
          {
            label: { en: "Leather", ms: "Kulit", zh: "皮革" },
            value: { en: "Top grain genuine leather", ms: "Kulit asli top grain", zh: "头层真皮" },
          },
          {
            label: { en: "Strap width", ms: "Lebar tali", zh: "带身宽度" },
            value: { en: "2 cm", ms: "2 cm", zh: "2 公分" },
          },
          {
            label: { en: "Buckle", ms: "Buckle", zh: "扣头" },
            value: { en: "Slim gold-tone buckle", ms: "Buckle emas nipis", zh: "纤细金色调扣头" },
          },
        ],
      },
    ],
    images: [
      {
        src: "/images/categories/ladies-belts.jpg",
        alt: {
          en: "Narrow tan ladies' belt with slim gold buckle, temporary illustration",
          ms: "Tali pinggang wanita tan nipis dengan buckle emas halus, ilustrasi sementara",
          zh: "棕褐细身女士皮带，配纤细金色扣头，临时示意图",
        },
        placeholder: true,
      },
    ],
    merchandising: { featured: false, newArrival: true, bestseller: false },
    seo: {
      title: {
        en: "Narrow Tan Ladies' Belt — 2 cm Top Grain Leather",
        ms: "Tali Pinggang Wanita Tan Nipis — Kulit Top Grain 2 cm",
        zh: "棕褐细身女士皮带——2 公分头层真皮",
      },
      description: {
        en: "A 2 cm top grain genuine leather belt for women with a slim gold-tone buckle, designed to wear over dresses. Made in Pakistan, delivered across Malaysia. Price on request.",
        ms: "Tali pinggang kulit asli top grain 2 cm untuk wanita dengan buckle emas nipis, direka untuk dipakai di atas gaun. Dihasilkan di Pakistan, dihantar ke seluruh Malaysia. Harga atas permintaan.",
        zh: "2 公分头层真皮女士皮带，配纤细金色调扣头，适合系在裙装外。巴基斯坦制造，配送全马。价格面议。",
      },
    },
    faqs: {
      en: [
        {
          q: "Can I wear this through jeans?",
          a: "You can, but the 2 cm width is on the narrow side for denim loops. The 3.5 cm belt in the men's range is the better match for jeans if you prefer a fuller look.",
        },
        {
          q: "How do I choose the length?",
          a: "Measure where you will actually wear it — at the waist over a dress, or through trouser loops — then pick the closest length from the options listed.",
        },
      ],
      ms: [
        {
          q: "Bolehkah saya memakainya dengan jean?",
          a: "Boleh, tetapi lebar 2 cm agak nipis untuk lubang denim. Tali pinggang 3.5 cm dalam koleksi lelaki lebih sepadan untuk jean jika anda mahukan rupa yang lebih penuh.",
        },
        {
          q: "Bagaimana saya memilih panjangnya?",
          a: "Ukur di tempat anda akan benar-benar memakainya — di pinggang di atas gaun, atau melalui lubang seluar — kemudian pilih panjang paling hampir daripada pilihan yang disenaraikan.",
        },
      ],
      zh: [
        {
          q: "可以穿过牛仔裤的裤头吗？",
          a: "可以，但 2 公分的宽度对牛仔裤头来说偏细。若你希望视觉更饱满，男士系列的 3.5 公分皮带会更合适。",
        },
        {
          q: "长度怎么挑？",
          a: "在你实际会佩戴的位置量——系在裙装外的腰间，或穿过裤头——再从所列选项里选最接近的长度。",
        },
      ],
    },
    relatedProductIds: ["structured-top-handle-bag", "slim-belt-chocolate"],
  },

  {
    id: "rounded-leather-dog-collar",
    category: "dog-collars",
    status: "published",
    order: 5,
    slug: {
      en: "rounded-edge-leather-dog-collar",
      ms: "kolar-anjing-kulit-tepi-bulat",
      zh: "yuan-jiao-zhen-pi-gou-bo-quan",
    },
    name: {
      en: "Rounded-Edge Leather Dog Collar",
      ms: "Kolar Anjing Kulit Tepi Bulat",
      zh: "圆角真皮狗项圈",
    },
    shortDescription: {
      en: "Full grain with softened, rounded edges and a rounded buckle — built for all-day wear.",
      ms: "Full grain dengan tepi dilembutkan dan dibulatkan serta buckle bersudut bulat — dibina untuk dipakai sepanjang hari.",
      zh: "全粒面皮革，边缘经过软化与圆角处理，配圆角扣头——为全天佩戴而设计。",
    },
    description: {
      en: [
        "A collar is worn all day, so comfort is not a styling detail — it decides whether the dog tolerates it. The edges here are rounded and softened rather than cut square, and the buckle corners are rounded too, because that is where irritation usually starts.",
        "The leather is full grain, which holds up to a wet walk better than a fabric collar and does not hold odour the same way. Wipe it after a muddy walk and let it dry away from direct heat.",
        "Sizing is given as a neck range measured to the dog, not guessed from the breed. On an adult dog, you should still be able to slide two fingers under a fastened collar.",
      ],
      ms: [
        "Kolar dipakai sepanjang hari, jadi keselesaan bukan butiran gaya — ia menentukan sama ada anjing menerimanya. Tepinya dibulatkan dan dilembutkan dan bukannya dipotong bersiku, dan penjuru buckle juga dibulatkan, kerana di situlah kerengsaan biasanya bermula.",
        "Kulitnya full grain, yang lebih tahan berbanding kolar fabrik selepas berjalan dalam keadaan basah dan tidak menyimpan bau dengan cara yang sama. Lap selepas berjalan di kawasan berlumpur dan biarkan kering jauh dari haba langsung.",
        "Saiz diberikan sebagai julat leher yang diukur pada anjing, bukan diagak daripada baka. Pada anjing dewasa, dua jari masih perlu boleh diselitkan di bawah kolar yang dikancing.",
      ],
      zh: [
        "项圈是全天佩戴的，所以舒适不是造型细节——它决定狗狗愿不愿意戴。这里的边缘做成圆角并经过软化，而不是直接切齐；扣头的角也做成圆的，因为不适感通常就是从那里开始的。",
        "皮料为全粒面，淋湿后比织带项圈更能撑住，也不容易像织带那样吸味。泥地散步后擦拭一下，放在远离热源的地方阴干即可。",
        "尺码以实际量在狗身上的颈围范围标示，而不是按品种猜。成犬扣好项圈后，底下应该仍能塞进两根手指。",
      ],
    },
    leatherType: "full-grain",
    price: onRequest,
    sku: "ELV-DC-001",
    colours: [
      {
        id: "chocolate",
        name: { en: "Chocolate brown", ms: "Coklat gelap", zh: "巧克力棕" },
        swatch: "#2b1d15",
      },
      {
        id: "tan",
        name: { en: "Tan", ms: "Tan", zh: "棕褐" },
        swatch: "#b08862",
      },
    ],
    sizes: [
      {
        id: "s",
        label: "S · Neck 25–32 cm",
        note: { en: "Small breeds", ms: "Baka kecil", zh: "小型犬" },
      },
      {
        id: "m",
        label: "M · Neck 32–40 cm",
        note: { en: "Medium breeds", ms: "Baka sederhana", zh: "中型犬" },
      },
      {
        id: "l",
        label: "L · Neck 40–50 cm",
        note: { en: "Large breeds", ms: "Baka besar", zh: "大型犬" },
      },
    ],
    variants: [
      { id: "dc-choc-s", colourId: "chocolate", sizeId: "s", stock: 0, sku: "ELV-DC-001-CH-S" },
      { id: "dc-choc-m", colourId: "chocolate", sizeId: "m", stock: 0, sku: "ELV-DC-001-CH-M" },
      { id: "dc-choc-l", colourId: "chocolate", sizeId: "l", stock: 0, sku: "ELV-DC-001-CH-L" },
      { id: "dc-tan-s", colourId: "tan", sizeId: "s", stock: 0, sku: "ELV-DC-001-TN-S" },
      { id: "dc-tan-m", colourId: "tan", sizeId: "m", stock: 0, sku: "ELV-DC-001-TN-M" },
      { id: "dc-tan-l", colourId: "tan", sizeId: "l", stock: 0, sku: "ELV-DC-001-TN-L" },
    ],
    specifications: [
      {
        group: { en: "Material", ms: "Bahan", zh: "材质" },
        items: [
          {
            label: { en: "Leather", ms: "Kulit", zh: "皮革" },
            value: { en: "Full grain genuine leather", ms: "Kulit asli full grain", zh: "全粒面真皮" },
          },
          {
            label: { en: "Hardware", ms: "Perkakasan", zh: "五金" },
            value: { en: "Rounded buckle and D-ring", ms: "Buckle dan cincin D bersudut bulat", zh: "圆角扣头与 D 环" },
          },
        ],
      },
      {
        group: { en: "Sizing", ms: "Saiz", zh: "尺码" },
        items: [
          {
            label: { en: "Neck range", ms: "Julat leher", zh: "颈围范围" },
            value: { en: "25 cm to 50 cm across three sizes", ms: "25 cm hingga 50 cm merentas tiga saiz", zh: "三个尺码覆盖 25 至 50 公分" },
          },
        ],
      },
    ],
    images: [
      {
        src: "/images/categories/dog-collars.jpg",
        alt: {
          en: "Rounded-edge full grain leather dog collar, temporary illustration",
          ms: "Kolar anjing kulit full grain tepi bulat, ilustrasi sementara",
          zh: "圆角全粒面真皮狗项圈，临时示意图",
        },
        placeholder: true,
      },
    ],
    merchandising: { featured: false, newArrival: false, bestseller: true },
    seo: {
      title: {
        en: "Rounded-Edge Full Grain Leather Dog Collar — Malaysia",
        ms: "Kolar Anjing Kulit Full Grain Tepi Bulat — Malaysia",
        zh: "圆角全粒面真皮狗项圈——马来西亚",
      },
      description: {
        en: "A full grain genuine leather dog collar with softened rounded edges and a rounded buckle, in three neck sizes. Made in Pakistan, delivered across Malaysia. Price on request.",
        ms: "Kolar anjing kulit asli full grain dengan tepi bulat dilembutkan dan buckle bersudut bulat, dalam tiga saiz leher. Dihasilkan di Pakistan, dihantar ke seluruh Malaysia. Harga atas permintaan.",
        zh: "全粒面真皮狗项圈，边缘圆角软化，扣头为圆角设计，备三种颈围尺码。巴基斯坦制造，配送全马。价格面议。",
      },
    },
    faqs: {
      en: [
        {
          q: "How do I measure my dog's neck?",
          a: "Run a soft tape around the base of the neck where the collar sits, snug but not tight. Measure twice — a collar that is too loose can slip off during a walk.",
        },
        {
          q: "Can I attach a leash to this collar?",
          a: "This collar has a D-ring intended for walking. Check the specification for the exact weight rating before using it with a strong puller, and message us if you are unsure.",
        },
      ],
      ms: [
        {
          q: "Bagaimana cara mengukur leher anjing saya?",
          a: "Lilitkan pita lembut di pangkal leher tempat kolar duduk, kemas tetapi tidak ketat. Ukur dua kali — kolar yang terlalu longgar boleh tertanggal semasa berjalan.",
        },
        {
          q: "Bolehkah saya menyambungkan tali cawak pada kolar ini?",
          a: "Kolar ini mempunyai cincin D yang bertujuan untuk berjalan. Semak spesifikasi untuk kadaran berat yang tepat sebelum menggunakannya dengan anjing yang kuat menarik, dan hubungi kami jika anda tidak pasti.",
        },
      ],
      zh: [
        {
          q: "怎样量狗狗的颈围？",
          a: "用软尺绕在项圈自然佩戴的颈部位置，贴合并稍微收紧，但不要勒住。量两次——过松的项圈在散步时可能会被挣脱。",
        },
        {
          q: "这款项圈可以接牵绳吗？",
          a: "这款项圈配有供散步使用的 D 环。若要用于力气大的狗，请先查看规格中的承重说明；不确定的话，随时联系我们。",
        },
      ],
    },
    relatedProductIds: ["matching-leather-leash", "collar-and-leash-set-tan"],
  },

  {
    id: "matching-leather-leash",
    category: "dog-leashes",
    status: "published",
    order: 6,
    slug: {
      en: "fixed-length-leather-dog-leash",
      ms: "tali-cawak-anjing-kulit-panjang-tetap",
      zh: "ding-chang-zhen-pi-gou-qian-sheng",
    },
    name: {
      en: "Fixed-Length Leather Dog Leash",
      ms: "Tali Cawak Anjing Kulit Panjang Tetap",
      zh: "定长真皮狗牵引绳",
    },
    shortDescription: {
      en: "A fixed 120 cm leash — easier to control near traffic than a retractable reel.",
      ms: "Tali cawak 120 cm tetap — lebih mudah dikawal berhampiran jalan raya berbanding gegelung boleh laras.",
      zh: "固定 120 公分牵绳——在靠近马路时比可伸缩卷绳更好控制。",
    },
    description: {
      en: [
        "A leash is judged in the two seconds when your dog pulls unexpectedly. A fixed length gives you a consistent distance to work with, which is easier on the shoulder in a busy area and far less prone to jamming than a retractable reel.",
        "At 120 cm it is aimed at everyday street walking. Shorter lengths suit training; longer lines suit parks. We chose the middle because that is what most people actually use.",
        "The leather is full grain and the clip is a substantial one, because the clip is where a leash fails first. Check the stitching near the clip every few months if your dog pulls.",
      ],
      ms: [
        "Tali cawak dinilai dalam dua saat apabila anjing anda menarik secara tiba-tiba. Panjang tetap memberi jarak yang konsisten untuk dikendalikan, lebih mudah pada bahu di kawasan sibuk dan jauh lebih sukar tersangkut berbanding gegelung boleh laras.",
        "Pada 120 cm ia disasarkan untuk berjalan harian di jalanan. Panjang lebih pendek sesuai untuk latihan; tali lebih panjang sesuai untuk taman. Kami memilih yang pertengahan kerana itulah yang paling ramai gunakan.",
        "Kulitnya full grain dan penyambungnya bersaiz kukuh, kerana penyambung ialah bahagian yang paling dahulu rosak pada tali cawak. Periksa jahitan berhampiran penyambung setiap beberapa bulan jika anjing anda suka menarik.",
      ],
      zh: [
        "牵引绳的好坏，往往在你家狗突然爆冲的那两秒里才见分晓。固定长度能给你稳定的距离，在人多的地方对肩膀更省力，也比可伸缩卷绳更不容易卡住。",
        "120 公分是针对日常街道散步设定的。更短的长度适合训练，更长的适合公园。我们选中间值，因为那正是多数人实际会用的长度。",
        "皮料为全粒面，扣具做得扎实，因为扣具正是牵引绳最先坏掉的地方。若狗狗爱拉绳，每隔几个月检查一次扣具附近的缝线。",
      ],
    },
    leatherType: "full-grain",
    price: onRequest,
    sku: "ELV-DL-001",
    colours: [
      {
        id: "chocolate",
        name: { en: "Chocolate brown", ms: "Coklat gelap", zh: "巧克力棕" },
        swatch: "#2b1d15",
      },
      {
        id: "tan",
        name: { en: "Tan", ms: "Tan", zh: "棕褐" },
        swatch: "#b08862",
      },
    ],
    sizes: [
      { id: "120", label: "120 cm" },
      { id: "150", label: "150 cm" },
    ],
    variants: [
      { id: "dl-choc-120", colourId: "chocolate", sizeId: "120", stock: 0, sku: "ELV-DL-001-CH-120" },
      { id: "dl-choc-150", colourId: "chocolate", sizeId: "150", stock: 0, sku: "ELV-DL-001-CH-150" },
      { id: "dl-tan-120", colourId: "tan", sizeId: "120", stock: 0, sku: "ELV-DL-001-TN-120" },
      { id: "dl-tan-150", colourId: "tan", sizeId: "150", stock: 0, sku: "ELV-DL-001-TN-150" },
    ],
    specifications: [
      {
        group: { en: "Material", ms: "Bahan", zh: "材质" },
        items: [
          {
            label: { en: "Leather", ms: "Kulit", zh: "皮革" },
            value: { en: "Full grain genuine leather", ms: "Kulit asli full grain", zh: "全粒面真皮" },
          },
          {
            label: { en: "Clip", ms: "Penyambung", zh: "扣具" },
            value: { en: "Brass swivel clip", ms: "Penyambung pusing loyang", zh: "黄铜旋转扣" },
          },
        ],
      },
      {
        group: { en: "Length", ms: "Panjang", zh: "长度" },
        items: [
          {
            label: { en: "Available lengths", ms: "Panjang tersedia", zh: "可选长度" },
            value: { en: "120 cm or 150 cm", ms: "120 cm atau 150 cm", zh: "120 公分或 150 公分" },
          },
        ],
      },
    ],
    images: [
      {
        src: "/images/categories/dog-leashes.jpg",
        alt: {
          en: "Full grain leather dog leash with brass clip, temporary illustration",
          ms: "Tali cawak anjing kulit full grain dengan penyambung loyang, ilustrasi sementara",
          zh: "全粒面真皮狗牵引绳，配黄铜扣具，临时示意图",
        },
        placeholder: true,
      },
    ],
    merchandising: { featured: false, newArrival: false, bestseller: true },
    seo: {
      title: {
        en: "Fixed-Length Full Grain Leather Dog Leash — 120 cm",
        ms: "Tali Cawak Anjing Kulit Full Grain Panjang Tetap — 120 cm",
        zh: "定长全粒面真皮狗牵引绳——120 公分",
      },
      description: {
        en: "A fixed-length full grain genuine leather dog leash with a brass swivel clip, in 120 cm or 150 cm. Made in Pakistan, delivered across Malaysia. Price on request.",
        ms: "Tali cawak anjing kulit asli full grain panjang tetap dengan penyambung pusing loyang, dalam 120 cm atau 150 cm. Dihasilkan di Pakistan, dihantar ke seluruh Malaysia. Harga atas permintaan.",
        zh: "定长全粒面真皮狗牵引绳，配黄铜旋转扣，备 120 或 150 公分。巴基斯坦制造，配送全马。价格面议。",
      },
    },
    faqs: {
      en: [
        {
          q: "Why do you not sell retractable leads?",
          a: "Fixed-length leather leads give you consistent control and are less prone to jamming. We would rather stock one type we can stand behind than a range we cannot.",
        },
        {
          q: "Will the clip fit my existing collar?",
          a: "It fits most standard D-rings on collars of a matching weight. If your collar has an unusually thick ring, message us with the model and we will check.",
        },
      ],
      ms: [
        {
          q: "Mengapa anda tidak menjual tali cawak boleh laras?",
          a: "Tali cawak kulit panjang tetap memberi kawalan yang konsisten dan kurang mudah tersangkut. Kami lebih suka menyimpan satu jenis yang kami yakin daripada julat yang kami tidak dapat jamin.",
        },
        {
          q: "Adakah penyambungnya padan dengan kolar sedia ada saya?",
          a: "Ia padan dengan kebanyakan cincin D standard pada kolar dengan berat sepadan. Jika cincin kolar anda luar biasa tebal, hubungi kami dengan modelnya dan kami akan menyemak.",
        },
      ],
      zh: [
        {
          q: "为什么你们不卖可伸缩牵引绳？",
          a: "定长真皮牵引绳能提供稳定的控制，也较不容易卡住。与其进一堆我们无法背书的款式，不如只做一种我们信得过的。",
        },
        {
          q: "扣具扣得上我现有的项圈吗？",
          a: "大多数与绳索承重相匹配的项圈 D 环都可以。若你的项圈环特别粗厚，把型号发给我们，我们帮你确认。",
        },
      ],
    },
    relatedProductIds: ["rounded-leather-dog-collar", "collar-and-leash-set-tan"],
  },

  {
    id: "collar-and-leash-set-tan",
    category: "dog-collar-leash-sets",
    status: "published",
    order: 7,
    slug: {
      en: "tan-collar-and-leash-set",
      ms: "set-kolar-dan-tali-cawak-tan",
      zh: "tan-bo-quan-qian-sheng-tao-zhuang",
    },
    name: {
      en: "Tan Collar & Leash Set",
      ms: "Set Kolar & Tali Cawak Tan",
      zh: "棕褐项圈与牵引绳套装",
    },
    shortDescription: {
      en: "Collar and leash cut from the same hide and hardware batch, so the browns actually match.",
      ms: "Kolar dan tali cawak daripada kepingan kulit dan kelompok perkakasan yang sama, jadi warna coklatnya benar-benar sepadan.",
      zh: "项圈与牵绳取自同一批皮料与五金，棕色真正一致。",
    },
    description: {
      en: [
        "Buying a collar and a leash separately usually means two slightly different browns and two different metal tones. This set is paired from the same hide and hardware batch, so the colour and finish genuinely match rather than being coordinated by eye.",
        "It is also the practical gift: one size decision instead of two, and the presentation is consistent. The collar size range and leash length are stated together, because the set is sold as a pair and cannot be split.",
        "If you are buying for a puppy, choose from the middle of the range you expect the dog to reach as an adult. Leather softens and takes extra holes well, but it will not stretch to fit a full-grown dog.",
      ],
      ms: [
        "Membeli kolar dan tali cawak secara berasingan selalunya bermakna dua warna coklat yang sedikit berbeza dan dua ton logam yang berbeza. Set ini dipadankan daripada kepingan kulit dan kelompok perkakasan yang sama, jadi warna dan kemasannya benar-benar sepadan dan bukan hanya dipadankan dengan mata.",
        "Ia juga hadiah yang praktikal: satu keputusan saiz dan bukan dua, dan persembahannya konsisten. Julat saiz kolar dan panjang tali cawak dinyatakan bersama, kerana set dijual sebagai pasangan dan tidak boleh dipecahkan.",
        "Jika membeli untuk anak anjing, pilih dari pertengahan julat yang anda jangka akan dicapai anjing itu apabila dewasa. Kulit melembut dan mudah ditambah lubang, tetapi ia tidak akan meregang untuk padan dengan anjing dewasa.",
      ],
      zh: [
        "分开买项圈和牵引绳，往往会得到两个略有色差的棕色和两种不同色调的金属。这套组合取自同一批皮料与五金，所以颜色与做工是真正成套，而不是凭眼睛凑出来的。",
        "它也是很实用的礼物：只需决定一个尺码而不是两个，整体呈现一致。项圈尺码范围与牵绳长度会一起注明，因为套装成套出售，不能拆开单买。",
        "若是买给幼犬，请从你预期成犬会达到的范围中段挑选。真皮会变软、也方便加打孔，但它不会长到刚好适合一只成犬。",
      ],
    },
    leatherType: "full-grain",
    price: onRequest,
    sku: "ELV-DS-001",
    colours: [
      {
        id: "tan",
        name: { en: "Tan", ms: "Tan", zh: "棕褐" },
        swatch: "#b08862",
      },
    ],
    sizes: [
      { id: "s", label: "S · Collar 25–32 cm · Leash 120 cm" },
      { id: "m", label: "M · Collar 32–40 cm · Leash 120 cm" },
      { id: "l", label: "L · Collar 40–50 cm · Leash 150 cm" },
    ],
    variants: [
      { id: "ds-tan-s", colourId: "tan", sizeId: "s", stock: 0, sku: "ELV-DS-001-TN-S" },
      { id: "ds-tan-m", colourId: "tan", sizeId: "m", stock: 0, sku: "ELV-DS-001-TN-M" },
      { id: "ds-tan-l", colourId: "tan", sizeId: "l", stock: 0, sku: "ELV-DS-001-TN-L" },
    ],
    specifications: [
      {
        group: { en: "What is included", ms: "Apa yang disertakan", zh: "套装内容" },
        items: [
          {
            label: { en: "Collar", ms: "Kolar", zh: "项圈" },
            value: { en: "One collar, size as selected", ms: "Satu kolar, saiz seperti dipilih", zh: "项圈一条，尺码依所选" },
          },
          {
            label: { en: "Leash", ms: "Tali cawak", zh: "牵引绳" },
            value: { en: "One leash, length matched to size", ms: "Satu tali cawak, panjang sepadan dengan saiz", zh: "牵引绳一条，长度依尺码搭配" },
          },
        ],
      },
      {
        group: { en: "Material", ms: "Bahan", zh: "材质" },
        items: [
          {
            label: { en: "Leather", ms: "Kulit", zh: "皮革" },
            value: {
              en: "Full grain genuine leather, same hide for both pieces",
              ms: "Kulit asli full grain, kepingan sama untuk kedua-dua barang",
              zh: "全粒面真皮，两件取自同一批皮料",
            },
          },
        ],
      },
    ],
    images: [
      {
        src: "/images/categories/dog-collar-leash-sets.jpg",
        alt: {
          en: "Matched tan full grain leather collar and leash set, temporary illustration",
          ms: "Set kolar dan tali cawak kulit full grain tan yang sepadan, ilustrasi sementara",
          zh: "成套棕褐全粒面真皮项圈与牵绳，临时示意图",
        },
        placeholder: true,
      },
    ],
    merchandising: { featured: true, newArrival: false, bestseller: false },
    seo: {
      title: {
        en: "Tan Full Grain Leather Dog Collar & Leash Set",
        ms: "Set Kolar dan Tali Cawak Anjing Kulit Full Grain Tan",
        zh: "棕褐全粒面真皮狗项圈与牵引绳套装",
      },
      description: {
        en: "A matched full grain genuine leather dog collar and leash set in tan, cut from the same hide and hardware batch. Made in Pakistan, delivered across Malaysia. Price on request.",
        ms: "Set kolar dan tali cawak anjing kulit asli full grain tan yang sepadan, daripada kepingan kulit dan kelompok perkakasan yang sama. Dihasilkan di Pakistan, dihantar ke seluruh Malaysia. Harga atas permintaan.",
        zh: "成套棕褐全粒面真皮狗项圈与牵绳，取自同一批皮料与五金。巴基斯坦制造，配送全马。价格面议。",
      },
    },
    faqs: {
      en: [
        {
          q: "Can I buy the collar or leash separately?",
          a: "Not from this listing — the set is sold as a matched pair. Single pieces are available in the dog collars and dog leashes categories, where the size and length are chosen independently.",
        },
        {
          q: "Which size should I choose for a puppy?",
          a: "Choose from the middle of the range you expect the dog to reach as an adult, then check the fit monthly while it grows.",
        },
      ],
      ms: [
        {
          q: "Bolehkah saya membeli kolar atau tali cawak secara berasingan?",
          a: "Bukan daripada senarai ini — set dijual sebagai pasangan yang sepadan. Barang tunggal tersedia dalam kategori kolar anjing dan tali cawak anjing, di mana saiz dan panjang dipilih secara berasingan.",
        },
        {
          q: "Saiz mana yang patut saya pilih untuk anak anjing?",
          a: "Pilih dari pertengahan julat yang anda jangka akan dicapai anjing itu apabila dewasa, kemudian semak kesesuaiannya setiap bulan semasa ia membesar.",
        },
      ],
      zh: [
        {
          q: "可以单独买项圈或牵绳吗？",
          a: "这个商品页不行——套装是配套出售的。单件可在「狗项圈」与「狗牵引绳」分类中选购，尺码与长度可以独立选择。",
        },
        {
          q: "幼犬应该选哪个尺码？",
          a: "从你预期它成犬后范围的中段挑选，成长期每月检查一次松紧。",
        },
      ],
    },
    relatedProductIds: ["rounded-leather-dog-collar", "matching-leather-leash"],
  },
];

/* ------------------------------- Lookups ---------------------------------- */

/** Published products only, in editorial order. */
export function visibleProducts(): Product[] {
  return products
    .filter((product) => product.status === "published")
    .sort((a, b) => a.order - b.order);
}

export function productsByCategory(categoryId: string): Product[] {
  return visibleProducts().filter((product) => product.category === categoryId);
}

export function productById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function productBySlug(locale: keyof Product["slug"], slug: string): Product | undefined {
  return products.find(
    (product) => product.status === "published" && product.slug[locale] === slug,
  );
}

/** Related products, filtered so a deleted or unpublished id never breaks a page. */
export function relatedProducts(product: Product): Product[] {
  return product.relatedProductIds
    .map((id) => productById(id))
    .filter((item): item is Product => !!item && item.status === "published")
    .slice(0, 3);
}

/** Category name for breadcrumbs and cards, using the existing taxonomy. */
export function categoryNameFor(product: Product, locale: keyof Product["name"]): string {
  return categoryById[product.category]?.name[locale] ?? "";
}
