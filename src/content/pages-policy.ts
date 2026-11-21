import type { ContentPage } from "./pages-core";

/**
 * Service and policy pages.
 *
 * These describe how the business actually intends to operate. Where a figure
 * has not been set by the owner (shipping rate, free-shipping threshold,
 * courier name, return window), the page says it is configured in checkout or
 * is being finalised — it never states an invented number.
 */

export const shippingPage: ContentPage = {
  slug: { en: "shipping", ms: "penghantaran", zh: "pei-song" },
  title: { en: "Shipping and delivery", ms: "Penghantaran dan penghantaran pesanan", zh: "配送说明" },
  metaTitle: {
    en: "Shipping Across Malaysia — Leather Orders Delivered Nationwide",
    ms: "Penghantaran Seluruh Malaysia — Pesanan Kulit Dihantar ke Seluruh Negara",
    zh: "全马配送——真皮订单全国送达",
  },
  metaDescription: {
    en: "How Elvora delivers leather orders across Malaysia: coverage by state, how charges are calculated, address requirements, and what to check on arrival.",
    ms: "Cara Elvora menghantar pesanan kulit ke seluruh Malaysia: liputan mengikut negeri, cara caj dikira, keperluan alamat, dan apa yang perlu diperiksa semasa diterima.",
    zh: "Elvora 如何把真皮订单配送至全马：各州覆盖、运费计算方式、地址填写要求，以及收货时的检查要点。",
  },
  blocks: {
    en: [
      {
        type: "p",
        text: "Orders are packed and dispatched from Malaysia. We deliver to addresses in Peninsular Malaysia, Sabah, Sarawak and Labuan, subject to the coverage our courier actually provides for your postcode.",
      },
      { type: "h", text: "Charges" },
      {
        type: "p",
        text: "The delivery charge for your order is calculated at checkout from your postcode and the weight of the parcel, using the rates set in our shipping settings. The exact figure is shown before you confirm payment, so there is no cost added afterwards.",
      },
      {
        type: "p",
        text: "East Malaysia (Sabah, Sarawak and Labuan) usually carries a higher rate than Peninsular Malaysia. Where we run a free-shipping threshold, the current threshold is displayed in the cart and at checkout rather than in a fixed banner that could become out of date.",
      },
      { type: "h", text: "Address details that prevent delays" },
      {
        type: "list",
        items: [
          "Full street address, including floor and unit number where relevant.",
          "Postcode that matches the town, because couriers route by postcode.",
          "A phone number that will be answered on delivery day.",
          "For Sabah and Sarawak, the district name as well as the town.",
          "For gated communities or offices, the building name and any access instructions.",
        ],
      },
      { type: "h", text: "When your order arrives" },
      {
        type: "p",
        text: "Open the parcel and check the item before discarding the packaging. If the leather, hardware or stitching is damaged, photograph it as it arrived and contact us within the period set out in our returns policy. Keep the outer packaging until you are satisfied, because couriers may ask to inspect it.",
      },
      {
        type: "callout",
        text: "We do not publish guaranteed delivery times. Courier transit varies by destination and season, and we would rather tell you what actually happens than promise a number we cannot control.",
      },
      { type: "h", text: "Tracking" },
      {
        type: "p",
        text: "Once your order is dispatched, the tracking reference and courier name are sent to the email address you used at checkout. If you have not received it, contact us with your order number and we will resend it.",
      },
    ],
    ms: [
      {
        type: "p",
        text: "Pesanan dibungkus dan dihantar dari Malaysia. Kami menghantar ke alamat di Semenanjung Malaysia, Sabah, Sarawak dan Labuan, bergantung pada liputan yang benar-benar disediakan kurier untuk poskod anda.",
      },
      { type: "h", text: "Caj" },
      {
        type: "p",
        text: "Caj penghantaran bagi pesanan anda dikira semasa pembayaran berdasarkan poskod dan berat bungkusan, menggunakan kadar yang ditetapkan dalam tetapan penghantaran kami. Jumlah tepat dipaparkan sebelum anda mengesahkan pembayaran, jadi tiada kos tambahan dikenakan selepas itu.",
      },
      {
        type: "p",
        text: "Malaysia Timur (Sabah, Sarawak dan Labuan) biasanya dikenakan kadar lebih tinggi berbanding Semenanjung. Jika kami menetapkan had penghantaran percuma, had semasa dipaparkan dalam troli dan semasa pembayaran dan bukannya pada sepanduk tetap yang boleh menjadi lapuk.",
      },
      { type: "h", text: "Butiran alamat yang mengelakkan kelewatan" },
      {
        type: "list",
        items: [
          "Alamat jalan penuh, termasuk tingkat dan nombor unit jika berkenaan.",
          "Poskod yang sepadan dengan bandar, kerana kurier menghantar mengikut poskod.",
          "Nombor telefon yang akan dijawab pada hari penghantaran.",
          "Untuk Sabah dan Sarawak, nama daerah serta nama bandar.",
          "Untuk kawasan berpagar atau pejabat, nama bangunan dan sebarang arahan kemasukan.",
        ],
      },
      { type: "h", text: "Apabila pesanan anda tiba" },
      {
        type: "p",
        text: "Buka bungkusan dan periksa barang sebelum membuang pembungkusannya. Jika kulit, perkakasan atau jahitan rosak, ambil gambar keadaan semasa ia tiba dan hubungi kami dalam tempoh yang dinyatakan dalam polisi pemulangan kami. Simpan pembungkusan luar sehingga anda berpuas hati, kerana kurier mungkin meminta untuk memeriksanya.",
      },
      {
        type: "callout",
        text: "Kami tidak menerbitkan masa penghantaran yang dijamin. Masa transit kurier berbeza mengikut destinasi dan musim, dan kami lebih suka memberitahu apa yang benar-benar berlaku daripada menjanjikan angka yang tidak dapat kami kawal.",
      },
      { type: "h", text: "Penjejakan" },
      {
        type: "p",
        text: "Setelah pesanan anda dihantar, rujukan penjejakan dan nama kurier dihantar ke alamat e-mel yang anda gunakan semasa pembayaran. Jika anda belum menerimanya, hubungi kami dengan nombor pesanan anda dan kami akan menghantarnya semula.",
      },
    ],
    zh: [
      {
        type: "p",
        text: "订单在马来西亚本地包装与寄出。我们配送至西马、沙巴、砂拉越与纳闽的地址，实际范围取决于快递公司对你邮政编码所提供的服务覆盖。",
      },
      { type: "h", text: "运费" },
      {
        type: "p",
        text: "订单运费会依据你的邮政编码与包裹重量，按我们配送设置中的费率在结账时计算。确切金额会在你确认付款前显示，之后不会再追加费用。",
      },
      {
        type: "p",
        text: "东马（沙巴、砂拉越与纳闽）的运费通常高于西马。若我们设有免运门槛，当前门槛会显示在购物车与结账页面，而不是放在可能过期的固定横幅上。",
      },
      { type: "h", text: "避免延误的地址填写" },
      {
        type: "list",
        items: [
          "完整街道地址，若适用请注明楼层与单位编号。",
          "邮政编码要与城镇相符，因为快递公司按邮编分派路线。",
          "送货当天能接通的联络电话。",
          "沙巴与砂拉越的地址，请同时填写县区与城镇名称。",
          "若是围篱社区或办公室，请写明建筑物名称与进入方式。",
        ],
      },
      { type: "h", text: "收到订单时" },
      {
        type: "p",
        text: "拆开包裹后先检查商品，再丢弃包装。若皮革、五金或缝线有损坏，请拍下到货时的状态，并在退货政策规定的期限内联系我们。在确认满意之前请保留外包装，因为快递公司可能要求查看。",
      },
      {
        type: "callout",
        text: "我们不公布保证送达的时间。快递时效会因目的地与季节而异，与其承诺一个我们控制不了的数字，不如如实说明实际情况。",
      },
      { type: "h", text: "物流追踪" },
      {
        type: "p",
        text: "订单寄出后，我们会把追踪编号与快递公司名称发送到你结账时使用的电邮地址。若没收到，请带着订单编号联系我们，我们会重新发送。",
      },
    ],
  },
};

export const returnsPage: ContentPage = {
  slug: { en: "returns", ms: "pemulangan", zh: "tui-huan" },
  title: { en: "Returns and exchanges", ms: "Pemulangan dan pertukaran", zh: "退换货" },
  metaTitle: {
    en: "Returns and Exchanges — Genuine Leather Orders in Malaysia",
    ms: "Pemulangan dan Pertukaran — Pesanan Kulit Asli di Malaysia",
    zh: "退换货——马来西亚真皮订单",
  },
  metaDescription: {
    en: "Our returns and exchange policy for leather wallets, belts, handbags and dog accessories: what qualifies, what does not, and how to start a return.",
    ms: "Polisi pemulangan dan pertukaran kami untuk dompet, tali pinggang, beg tangan dan aksesori anjing kulit: apa yang layak, apa yang tidak, dan cara memulakan pemulangan.",
    zh: "真皮钱包、皮带、手提包与狗狗用品的退换货政策：哪些情况符合条件、哪些不符合，以及如何申请退货。",
  },
  blocks: {
    en: [
      {
        type: "p",
        text: "If a size is wrong or a product is not what you expected, contact us before using it. Unworn items in their original condition can be exchanged or returned, and we would rather sort out a size problem than have you keep something that does not fit.",
      },
      { type: "h", text: "What qualifies" },
      {
        type: "list",
        items: [
          "The item is unused, with no creasing from being carried, worn or filled.",
          "Tags, dust bag and any packaging are intact.",
          "You contacted us within the return window shown on your order confirmation.",
          "The item was purchased directly from this website.",
        ],
      },
      { type: "h", text: "What does not qualify" },
      {
        type: "list",
        items: [
          "Items that have been worn, used, conditioned or altered.",
          "Belts that have had extra holes punched or been cut to length, and collars that have been worn by a dog.",
          "Damage caused after delivery, including water damage from full immersion or heat damage from drying near a direct source.",
          "Natural variation in leather grain, colour tone or marking, which is a property of the material rather than a fault.",
        ],
      },
      { type: "h", text: "How to start a return" },
      {
        type: "p",
        text: "Message us with your order number, the item, and photographs showing its condition and any issue. We will confirm whether the return is approved and give you the return address. Please do not send an item before you have that confirmation, because parcels that arrive without a reference are difficult to match to an order.",
      },
      { type: "h", text: "Refunds" },
      {
        type: "p",
        text: "Once a returned item is received and checked, the refund is issued to the original payment method. Your bank or payment provider may take additional working days to post it. Delivery charges are refunded only where the item was faulty or incorrectly sent.",
      },
      {
        type: "callout",
        text: "The exact return window and return address are confirmed on your order confirmation email and at checkout. They are deliberately not printed as a fixed figure on this page, because they depend on the courier arrangement in place when you ordered.",
      },
    ],
    ms: [
      {
        type: "p",
        text: "Jika saiz tidak padan atau produk bukan seperti yang anda jangkakan, hubungi kami sebelum menggunakannya. Barang yang belum dipakai dalam keadaan asal boleh ditukar atau dipulangkan, dan kami lebih suka menyelesaikan masalah saiz daripada membiarkan anda menyimpan sesuatu yang tidak padan.",
      },
      { type: "h", text: "Apa yang layak" },
      {
        type: "list",
        items: [
          "Barang belum digunakan, tanpa kesan lipatan akibat dibawa, dipakai atau diisi.",
          "Tag, beg habuk dan sebarang pembungkusan masih utuh.",
          "Anda menghubungi kami dalam tempoh pemulangan yang dinyatakan pada pengesahan pesanan anda.",
          "Barang dibeli terus daripada laman web ini.",
        ],
      },
      { type: "h", text: "Apa yang tidak layak" },
      {
        type: "list",
        items: [
          "Barang yang telah dipakai, digunakan, disapu bahan pelembut atau diubah suai.",
          "Tali pinggang yang telah ditebuk lubang tambahan atau dipotong, dan kolar yang telah dipakai oleh anjing.",
          "Kerosakan selepas penghantaran, termasuk kerosakan air akibat direndam sepenuhnya atau kerosakan haba akibat dikeringkan berhampiran sumber haba langsung.",
          "Perbezaan semula jadi pada ira kulit, ton warna atau tanda, yang merupakan sifat bahan dan bukan kecacatan.",
        ],
      },
      { type: "h", text: "Cara memulakan pemulangan" },
      {
        type: "p",
        text: "Hantarkan mesej kepada kami dengan nombor pesanan, barang, dan gambar yang menunjukkan keadaannya serta sebarang isu. Kami akan mengesahkan sama ada pemulangan diluluskan dan memberikan alamat pemulangan. Sila jangan menghantar barang sebelum mendapat pengesahan itu, kerana bungkusan yang tiba tanpa rujukan sukar dipadankan dengan pesanan.",
      },
      { type: "h", text: "Bayaran balik" },
      {
        type: "p",
        text: "Setelah barang yang dipulangkan diterima dan diperiksa, bayaran balik dibuat ke kaedah pembayaran asal. Bank atau penyedia pembayaran anda mungkin mengambil beberapa hari bekerja tambahan untuk memaparkannya. Caj penghantaran hanya dikembalikan jika barang itu rosak atau tersalah hantar.",
      },
      {
        type: "callout",
        text: "Tempoh pemulangan dan alamat pemulangan yang tepat disahkan pada e-mel pengesahan pesanan anda dan semasa pembayaran. Ia sengaja tidak dicetak sebagai angka tetap di halaman ini, kerana ia bergantung pada aturan kurier yang berkuat kuasa semasa anda memesan.",
      },
    ],
    zh: [
      {
        type: "p",
        text: "如果尺码不对，或产品与预期不符，请先联系我们，不要开始使用。未经使用、保持原状的商品可以换货或退货——比起让你留下一件不合用的东西，我们更愿意把尺码问题处理好。",
      },
      { type: "h", text: "符合条件的情况" },
      {
        type: "list",
        items: [
          "商品未曾使用，没有因携带、佩戴或装载而留下的折痕。",
          "吊牌、防尘袋与包装完整。",
          "你在订单确认信所注明的退换期限内联系我们。",
          "商品直接购自本网站。",
        ],
      },
      { type: "h", text: "不符合条件的情况" },
      {
        type: "list",
        items: [
          "已佩戴、使用、上过保养油或经改动的商品。",
          "已额外打孔或裁短的皮带，以及狗狗佩戴过的项圈。",
          "收货后造成的损坏，包括整件浸水造成的损伤，或靠近热源烘干造成的受热损坏。",
          "皮革纹理、色调与斑痕的自然差异——这是材质的特性，而非瑕疵。",
        ],
      },
      { type: "h", text: "如何申请退换" },
      {
        type: "p",
        text: "请把订单编号、商品名称，以及显示其现状与问题的照片发给我们。我们会确认是否批准退换，并提供退货地址。在收到确认之前请勿寄出商品，因为没有编号的包裹很难与订单对应。",
      },
      { type: "h", text: "退款" },
      {
        type: "p",
        text: "退回的商品经收货检查后，退款会退回到原付款方式。你的银行或支付服务商可能需要额外的工作日才显示入账。只有在商品有瑕疵或寄错的情况下，运费才会一并退还。",
      },
      {
        type: "callout",
        text: "确切的退换期限与退货地址会在订单确认电邮及结账页面中确认。我们刻意不在本页印上固定数字，因为它取决于你下单时适用的快递安排。",
      },
    ],
  },
};

export const faqPage: ContentPage = {
  slug: { en: "faq", ms: "soalan-lazim", zh: "chang-jian-wen-ti" },
  title: { en: "Frequently asked questions", ms: "Soalan lazim", zh: "常见问题" },
  metaTitle: {
    en: "Elvora FAQ — Leather Types, Sizing, Delivery and Orders",
    ms: "Soalan Lazim Elvora — Jenis Kulit, Saiz, Penghantaran dan Pesanan",
    zh: "Elvora 常见问题——皮革种类、尺寸、配送与订单",
  },
  metaDescription: {
    en: "Direct answers about our leather grades, pricing, sizes, delivery across Malaysia, and how to contact us in English, Malay or Chinese.",
    ms: "Jawapan langsung tentang gred kulit kami, harga, saiz, penghantaran ke seluruh Malaysia, dan cara menghubungi kami dalam bahasa Inggeris, Melayu atau Cina.",
    zh: "关于皮革等级、定价、尺寸、全马配送，以及如何以英语、马来语或中文联系我们的直接解答。",
  },
  blocks: {
    en: [{ type: "p", text: "The questions we are asked most often, answered without padding. If yours is not here, ask us directly — we would rather answer once than have you order the wrong size." }],
    ms: [{ type: "p", text: "Soalan yang paling kerap ditanya, dijawab tanpa berpanjangan. Jika soalan anda tiada di sini, tanya kami terus — kami lebih suka menjawab sekali daripada anda memesan saiz yang salah." }],
    zh: [{ type: "p", text: "以下是客户最常问的问题，直接回答，不加赘述。若你的问题不在这里，直接问我们——与其让你买错尺寸，我们更愿意先回答清楚。" }],
  },
  faqs: {
    en: [
      {
        q: "What kind of leather do you sell?",
        a: "Full grain and top grain genuine leather, and nothing else. Each product page states which grade a specific item uses. We do not sell bonded, reconstituted or PU leather in any of our seven categories.",
      },
      {
        q: "Where are the products made?",
        a: "They are manufactured in our own factory in Pakistan and sold from Malaysia. Orders are packed and dispatched locally.",
      },
      {
        q: "How are prices set?",
        a: "Every price is entered manually by our team in Malaysian Ringgit. We do not generate prices automatically and we do not create artificial discounts. If a product has no price yet, it shows as price on request and you can ask us for a quotation.",
      },
      {
        q: "Do you deliver to Sabah, Sarawak and Labuan?",
        a: "Yes, subject to our courier's coverage for your postcode. East Malaysia usually carries a higher delivery rate, which is calculated at checkout before you pay.",
      },
      {
        q: "Can I order without creating an account?",
        a: "Yes. Guest checkout is available, so you can order with just a delivery address and contact details.",
      },
      {
        q: "Which payment methods are accepted?",
        a: "Payment methods appear at checkout only after they have been configured and tested. If a method you expect is not shown, it is not yet active — contact us and we will confirm the current options.",
      },
      {
        q: "Can you help me choose a size?",
        a: "Yes. Send us the measurement you have taken, or the item you are replacing, and we will advise. Our leather guide and category pages also explain how to measure for belts, collars and bags.",
      },
      {
        q: "In which languages can I contact you?",
        a: "English, Bahasa Melayu and Simplified Chinese. We reply in the language you write in.",
      },
      {
        q: "Do the images show the actual product?",
        a: "Not yet. The images currently on the website are temporary illustrations, clearly labelled as such, and will be replaced with original product photography. Do not treat a pictured buckle, colour or detail as a confirmed specification until it appears in the written product specification.",
      },
      {
        q: "Are you a physical shop?",
        a: "We are an online store serving customers across Malaysia. We do not operate branches in the towns and districts we deliver to, and we do not claim to.",
      },
    ],
    ms: [
      {
        q: "Apakah jenis kulit yang anda jual?",
        a: "Kulit asli full grain dan top grain, dan tiada yang lain. Setiap halaman produk menyatakan gred yang digunakan oleh barang tertentu. Kami tidak menjual kulit bonded, binaan semula atau PU dalam mana-mana tujuh kategori kami.",
      },
      {
        q: "Di mana produk dihasilkan?",
        a: "Ia dihasilkan di kilang kami sendiri di Pakistan dan dijual dari Malaysia. Pesanan dibungkus dan dihantar dari dalam negara.",
      },
      {
        q: "Bagaimana harga ditetapkan?",
        a: "Setiap harga dimasukkan secara manual oleh pasukan kami dalam Ringgit Malaysia. Kami tidak menjana harga secara automatik dan tidak mencipta diskaun buatan. Jika produk belum berharga, ia dipaparkan sebagai harga atas permintaan dan anda boleh meminta sebut harga.",
      },
      {
        q: "Adakah anda menghantar ke Sabah, Sarawak dan Labuan?",
        a: "Ya, bergantung pada liputan kurier untuk poskod anda. Malaysia Timur biasanya dikenakan kadar penghantaran lebih tinggi, yang dikira semasa pembayaran sebelum anda membayar.",
      },
      {
        q: "Bolehkah saya memesan tanpa membuka akaun?",
        a: "Boleh. Pembayaran sebagai tetamu tersedia, jadi anda boleh memesan hanya dengan alamat penghantaran dan butiran hubungan.",
      },
      {
        q: "Kaedah pembayaran apa yang diterima?",
        a: "Kaedah pembayaran dipaparkan semasa pembayaran hanya selepas ia dikonfigurasi dan diuji. Jika kaedah yang anda jangkakan tidak dipaparkan, ia belum aktif — hubungi kami dan kami akan mengesahkan pilihan semasa.",
      },
      {
        q: "Bolehkah anda membantu saya memilih saiz?",
        a: "Boleh. Hantarkan ukuran yang telah anda ambil, atau barang yang sedang anda ganti, dan kami akan menasihati. Panduan kulit dan halaman kategori kami juga menerangkan cara mengukur untuk tali pinggang, kolar dan beg.",
      },
      {
        q: "Dalam bahasa apa saya boleh menghubungi anda?",
        a: "Bahasa Inggeris, Bahasa Melayu dan bahasa Cina ringkas. Kami membalas dalam bahasa yang anda gunakan.",
      },
      {
        q: "Adakah gambar menunjukkan produk sebenar?",
        a: "Belum. Gambar yang ada di laman web sekarang ialah ilustrasi sementara yang dilabel dengan jelas, dan akan digantikan dengan fotografi produk asal. Jangan anggap buckle, warna atau butiran dalam gambar sebagai spesifikasi yang disahkan sehingga ia muncul dalam spesifikasi produk bertulis.",
      },
      {
        q: "Adakah anda kedai fizikal?",
        a: "Kami kedai online yang melayani pelanggan di seluruh Malaysia. Kami tidak mengendalikan cawangan di bandar dan daerah yang kami hantar, dan kami tidak mendakwa berbuat demikian.",
      },
    ],
    zh: [
      {
        q: "你们卖的是哪种皮革？",
        a: "全粒面与头层真皮，只有这两种。每个产品页都会注明该款使用哪一种等级。我们的七个分类都不售卖再生皮、重组皮或 PU 皮。",
      },
      {
        q: "产品在哪里生产？",
        a: "由我们在巴基斯坦的自有工厂生产，在马来西亚销售。订单在本地包装与寄出。",
      },
      {
        q: "价格是怎么定的？",
        a: "每个价格都由团队以令吉手动输入。我们不自动生成价格，也不制造虚假折扣。若某款尚未定价，页面显示「价格面议」，你可以向我们询价。",
      },
      {
        q: "有配送到沙巴、砂拉越与纳闽吗？",
        a: "有，实际取决于快递公司对你邮政编码的服务覆盖。东马运费通常较高，会在付款前的结账页面计算清楚。",
      },
      {
        q: "可以不注册账号直接下单吗？",
        a: "可以。我们提供访客结账，只需填写收货地址与联络资料即可下单。",
      },
      {
        q: "接受哪些付款方式？",
        a: "付款方式必须经过设置与测试后才会出现在结账页面。若你预期的方式没有显示，说明它尚未启用——请联系我们确认目前可用的选项。",
      },
      {
        q: "可以帮我选尺寸吗？",
        a: "可以。把你量好的数据，或你正在替换的旧件告诉我们，我们会给你建议。我们的皮革指南与分类页也说明了皮带、项圈与包袋的测量方法。",
      },
      {
        q: "可以用哪些语言联系你们？",
        a: "英语、马来语与简体中文。你用哪种语言写信，我们就用哪种语言回覆。",
      },
      {
        q: "图片是实物照片吗？",
        a: "目前还不是。网站上现有的图片是清楚标示的临时示意图，之后会替换为原创产品摄影。在图示的扣头、颜色或细节尚未写入书面产品规格之前，请不要把它当作已确认的规格。",
      },
      {
        q: "你们有实体店吗？",
        a: "我们是服务全马客户的网络商店。我们并未在配送覆盖的城镇与县区设立分店，也不会如此宣称。",
      },
    ],
  },
};

export const privacyPage: ContentPage = {
  slug: { en: "privacy-policy", ms: "dasar-privasi", zh: "yin-si-zheng-ce" },
  title: { en: "Privacy policy", ms: "Dasar privasi", zh: "隐私政策" },
  metaTitle: {
    en: "Privacy Policy — How Elvora Handles Your Personal Data",
    ms: "Dasar Privasi — Cara Elvora Mengendalikan Data Peribadi Anda",
    zh: "隐私政策——Elvora 如何处理你的个人资料",
  },
  metaDescription: {
    en: "What personal data we collect when you order or enquire, why we collect it, who processes it, and how to exercise your rights under Malaysia's PDPA.",
    ms: "Data peribadi apa yang kami kumpul apabila anda memesan atau bertanya, mengapa kami mengumpulnya, siapa memprosesnya, dan cara menggunakan hak anda di bawah PDPA Malaysia.",
    zh: "你在下单或查询时我们会收集哪些个人资料、收集原因、由谁处理，以及如何在马来西亚《个人资料保护法》下行使你的权利。",
  },
  blocks: {
    en: [
      {
        type: "p",
        text: "This policy explains what we collect and why, in line with Malaysia's Personal Data Protection Act 2010 (PDPA). We keep collection to what is needed to fulfil an order or answer an enquiry.",
      },
      { type: "h", text: "What we collect" },
      {
        type: "list",
        items: [
          "Order details: name, delivery address, phone number, email address and the items purchased.",
          "Payment information: handled by our payment provider. We do not store full card numbers on our servers.",
          "Enquiry content: whatever you include in a contact form, chat message or WhatsApp message.",
          "Technical data: pages visited and general device information, used to keep the site working and to understand which pages are useful.",
        ],
      },
      { type: "h", text: "Why we collect it" },
      {
        type: "p",
        text: "To process and deliver orders, to answer questions, to handle returns, to keep records required for accounting, and to improve the site. We do not sell personal data, and we do not add you to a marketing list unless you ask to be added.",
      },
      { type: "h", text: "Who processes it" },
      {
        type: "p",
        text: "Our payment provider processes payment data, and our courier receives the name, address and phone number needed to deliver your parcel. Our hosting and analytics providers process technical data on our behalf. Each of these receives only what is necessary for its role.",
      },
      { type: "h", text: "Cookies" },
      {
        type: "p",
        text: "We use a small number of cookies: one to remember your chosen language, and, where analytics is enabled, cookies that help us understand site usage. Non-essential cookies are only set after you consent, and you can withdraw consent at any time by clearing the site's cookies in your browser.",
      },
      { type: "h", text: "Your rights" },
      {
        type: "p",
        text: "Under the PDPA you may request access to the personal data we hold about you, ask us to correct it, or ask us to stop processing it for a particular purpose. Send your request through the contact page and we will respond within a reasonable period.",
      },
      {
        type: "callout",
        text: "The identity of the data controller, the registered business address and the specific retention periods will be published here once the business registration details are confirmed. We do not invent them.",
      },
    ],
    ms: [
      {
        type: "p",
        text: "Dasar ini menerangkan apa yang kami kumpul dan mengapa, selaras dengan Akta Perlindungan Data Peribadi 2010 (PDPA) Malaysia. Kami mengehadkan pengumpulan kepada apa yang diperlukan untuk memenuhi pesanan atau menjawab pertanyaan.",
      },
      { type: "h", text: "Apa yang kami kumpul" },
      {
        type: "list",
        items: [
          "Butiran pesanan: nama, alamat penghantaran, nombor telefon, alamat e-mel dan barang yang dibeli.",
          "Maklumat pembayaran: dikendalikan oleh penyedia pembayaran kami. Kami tidak menyimpan nombor kad penuh pada pelayan kami.",
          "Kandungan pertanyaan: apa sahaja yang anda masukkan dalam borang hubungan, mesej chat atau mesej WhatsApp.",
          "Data teknikal: halaman yang dilawati dan maklumat peranti secara umum, digunakan untuk memastikan laman berfungsi dan memahami halaman mana yang berguna.",
        ],
      },
      { type: "h", text: "Mengapa kami mengumpulnya" },
      {
        type: "p",
        text: "Untuk memproses dan menghantar pesanan, menjawab soalan, mengendalikan pemulangan, menyimpan rekod yang diperlukan untuk perakaunan, dan menambah baik laman. Kami tidak menjual data peribadi, dan kami tidak menambah anda ke senarai pemasaran melainkan anda memintanya.",
      },
      { type: "h", text: "Siapa memprosesnya" },
      {
        type: "p",
        text: "Penyedia pembayaran kami memproses data pembayaran, dan kurier kami menerima nama, alamat dan nombor telefon yang diperlukan untuk menghantar bungkusan anda. Penyedia hosting dan analitik memproses data teknikal bagi pihak kami. Setiap pihak hanya menerima apa yang perlu untuk peranannya.",
      },
      { type: "h", text: "Kuki" },
      {
        type: "p",
        text: "Kami menggunakan sebilangan kecil kuki: satu untuk mengingati bahasa pilihan anda, dan jika analitik diaktifkan, kuki yang membantu kami memahami penggunaan laman. Kuki bukan penting hanya ditetapkan selepas anda bersetuju, dan anda boleh menarik balik persetujuan pada bila-bila masa dengan memadam kuki laman ini dalam pelayar anda.",
      },
      { type: "h", text: "Hak anda" },
      {
        type: "p",
        text: "Di bawah PDPA, anda boleh meminta akses kepada data peribadi yang kami simpan tentang anda, meminta pembetulan, atau meminta kami berhenti memprosesnya untuk tujuan tertentu. Hantarkan permintaan melalui halaman hubungan dan kami akan membalas dalam tempoh yang munasabah.",
      },
      {
        type: "callout",
        text: "Identiti pengawal data, alamat perniagaan berdaftar dan tempoh penyimpanan khusus akan diterbitkan di sini setelah butiran pendaftaran perniagaan disahkan. Kami tidak menciptanya.",
      },
    ],
    zh: [
      {
        type: "p",
        text: "本政策说明我们收集哪些资料、为什么收集，并遵循马来西亚《2010 年个人资料保护法》（PDPA）。我们只收集完成订单或回答查询所必需的内容。",
      },
      { type: "h", text: "我们收集什么" },
      {
        type: "list",
        items: [
          "订单资料：姓名、收货地址、电话、电邮，以及购买的商品。",
          "付款资讯：由我们的支付服务商处理。我们的伺服器不会储存完整的卡号。",
          "查询内容：你在联络表单、聊天或 WhatsApp 讯息中填写的任何资料。",
          "技术资料：浏览的页面与一般设备资讯，用于维持网站运作并了解哪些页面有用。",
        ],
      },
      { type: "h", text: "收集的原因" },
      {
        type: "p",
        text: "用于处理与配送订单、回答提问、处理退换、保存会计所需的纪录，以及改进网站。我们不会出售个人资料，也不会在你未要求的情况下把你加入行销名单。",
      },
      { type: "h", text: "由谁处理" },
      {
        type: "p",
        text: "支付服务商处理付款资料；快递公司会收到配送包裹所需的姓名、地址与电话。我们的主机与数据分析服务商代我们处理技术资料。各方只取得其职责所需的资料。",
      },
      { type: "h", text: "Cookie" },
      {
        type: "p",
        text: "我们使用少量 Cookie：一个用来记住你选择的语言；若启用数据分析，另有协助我们了解网站使用情况的 Cookie。非必要 Cookie 只会在你同意后设定，你也可随时在浏览器中清除本网站的 Cookie 来撤回同意。",
      },
      { type: "h", text: "你的权利" },
      {
        type: "p",
        text: "根据 PDPA，你可以要求查阅我们所持有关于你的个人资料、要求更正，或要求我们停止为特定目的处理这些资料。请透过联络页面提出，我们会在合理期限内回覆。",
      },
      {
        type: "callout",
        text: "资料控制者身份、注册营业地址与具体保存期限，将在商业登记资料确认后于此处公布。我们不会凭空填写。",
      },
    ],
  },
};

export const termsPage: ContentPage = {
  slug: { en: "terms", ms: "terma", zh: "tiao-kuan" },
  title: { en: "Terms of sale", ms: "Terma jualan", zh: "销售条款" },
  metaTitle: {
    en: "Terms of Sale — Elvora Leather Orders",
    ms: "Terma Jualan — Pesanan Kulit Elvora",
    zh: "销售条款——Elvora 真皮订单",
  },
  metaDescription: {
    en: "The terms that apply when you order genuine leather from this website: pricing, availability, delivery, returns and governing law in Malaysia.",
    ms: "Terma yang terpakai apabila anda memesan kulit asli daripada laman web ini: harga, ketersediaan, penghantaran, pemulangan dan undang-undang yang mentadbir di Malaysia.",
    zh: "你从本网站订购真皮时适用的条款：价格、供应情况、配送、退换，以及马来西亚的适用法律。",
  },
  blocks: {
    en: [
      {
        type: "p",
        text: "These terms apply to orders placed through this website. By placing an order you accept them. They sit alongside our shipping and returns pages, which form part of the same agreement.",
      },
      { type: "h", text: "Products and specifications" },
      {
        type: "p",
        text: "Products are described as accurately as we can. Leather is a natural material, so grain, tone and marking vary between pieces and between batches. Those variations are not defects. Where an image on the site is a temporary illustration, the written product specification takes precedence over the image.",
      },
      { type: "h", text: "Pricing" },
      {
        type: "p",
        text: "All prices are in Malaysian Ringgit and include any applicable tax where stated. Prices are entered manually per product and may change. If a price error is discovered before we dispatch an order, we will contact you and offer to proceed at the corrected price or cancel and refund in full.",
      },
      { type: "h", text: "Availability" },
      {
        type: "p",
        text: "Stock figures reflect what we believe is available at the time of display. If an item becomes unavailable after you order, we will tell you promptly and offer an alternative, a delay, or a refund.",
      },
      { type: "h", text: "Delivery" },
      {
        type: "p",
        text: "Delivery is made to the address you supply, subject to courier coverage. Risk passes to you on delivery. We are not responsible for delays caused by incorrect address details, an unanswered phone number, or events outside our reasonable control.",
      },
      { type: "h", text: "Returns" },
      {
        type: "p",
        text: "Returns and exchanges are governed by our returns policy. Items must be unused and in their original condition.",
      },
      { type: "h", text: "Liability" },
      {
        type: "p",
        text: "Nothing in these terms excludes rights you have under Malaysian consumer law. Beyond that, our liability for any order is limited to the amount you paid for it.",
      },
      { type: "h", text: "Governing law" },
      {
        type: "p",
        text: "These terms are governed by the laws of Malaysia, and disputes are subject to the jurisdiction of the Malaysian courts.",
      },
      {
        type: "callout",
        text: "The registered business entity name and registration number will be added here once supplied. Until then, this page states the policy we operate by, without inventing company details.",
      },
    ],
    ms: [
      {
        type: "p",
        text: "Terma ini terpakai kepada pesanan yang dibuat melalui laman web ini. Dengan membuat pesanan, anda menerimanya. Ia terpakai bersama halaman penghantaran dan pemulangan kami, yang merupakan sebahagian daripada perjanjian yang sama.",
      },
      { type: "h", text: "Produk dan spesifikasi" },
      {
        type: "p",
        text: "Produk diterangkan setepat yang mampu. Kulit ialah bahan semula jadi, jadi ira, ton dan tanda berbeza antara kepingan dan antara kelompok. Perbezaan itu bukan kecacatan. Jika sesuatu gambar di laman ini ialah ilustrasi sementara, spesifikasi produk bertulis mengatasi gambar tersebut.",
      },
      { type: "h", text: "Harga" },
      {
        type: "p",
        text: "Semua harga dalam Ringgit Malaysia dan termasuk apa-apa cukai yang berkenaan jika dinyatakan. Harga dimasukkan secara manual bagi setiap produk dan boleh berubah. Jika kesilapan harga ditemui sebelum pesanan dihantar, kami akan menghubungi anda dan menawarkan untuk meneruskan pada harga yang diperbetulkan atau membatalkan dan membayar balik sepenuhnya.",
      },
      { type: "h", text: "Ketersediaan" },
      {
        type: "p",
        text: "Angka stok mencerminkan apa yang kami percaya tersedia pada masa dipaparkan. Jika sesuatu barang menjadi tidak tersedia selepas anda memesan, kami akan memberitahu anda dengan segera dan menawarkan alternatif, kelewatan, atau bayaran balik.",
      },
      { type: "h", text: "Penghantaran" },
      {
        type: "p",
        text: "Penghantaran dibuat ke alamat yang anda berikan, bergantung pada liputan kurier. Risiko berpindah kepada anda semasa penghantaran. Kami tidak bertanggungjawab atas kelewatan yang disebabkan oleh butiran alamat yang salah, nombor telefon yang tidak dijawab, atau keadaan di luar kawalan munasabah kami.",
      },
      { type: "h", text: "Pemulangan" },
      {
        type: "p",
        text: "Pemulangan dan pertukaran tertakluk kepada polisi pemulangan kami. Barang mesti belum digunakan dan dalam keadaan asal.",
      },
      { type: "h", text: "Liabiliti" },
      {
        type: "p",
        text: "Tiada apa-apa dalam terma ini yang mengecualikan hak anda di bawah undang-undang pengguna Malaysia. Selain itu, liabiliti kami bagi mana-mana pesanan terhad kepada jumlah yang anda bayar untuknya.",
      },
      { type: "h", text: "Undang-undang yang mentadbir" },
      {
        type: "p",
        text: "Terma ini ditadbir oleh undang-undang Malaysia, dan pertikaian tertakluk kepada bidang kuasa mahkamah Malaysia.",
      },
      {
        type: "callout",
        text: "Nama entiti perniagaan berdaftar dan nombor pendaftaran akan ditambah di sini setelah diberikan. Sementara itu, halaman ini menyatakan polisi yang kami amalkan, tanpa mencipta butiran syarikat.",
      },
    ],
    zh: [
      {
        type: "p",
        text: "本条款适用于通过本网站提交的订单。下单即表示你接受这些条款。本条款与我们的配送页、退换货页共同构成同一份协议。",
      },
      { type: "h", text: "产品与规格" },
      {
        type: "p",
        text: "我们尽力准确描述产品。皮革是天然材料，纹理、色调与斑痕会因皮料与批次而异，这些差异不属瑕疵。若网站上的图片是临时示意图，则以书面产品规格为准。",
      },
      { type: "h", text: "价格" },
      {
        type: "p",
        text: "所有价格以令吉标示，并在注明时包含适用税费。价格按每款产品手动输入，可能调整。若在发货前发现价格错误，我们会联系你，可选择按更正后的价格购买，或取消订单并全额退款。",
      },
      { type: "h", text: "供应情况" },
      {
        type: "p",
        text: "库存数字反映我们在展示时认为可用的数量。若你下单后商品缺货，我们会尽快通知你，并提供替代方案、延期或退款。",
      },
      { type: "h", text: "配送" },
      {
        type: "p",
        text: "配送至你提供的地址，实际取决于快递服务覆盖。风险在送达时转移给你。因地址错误、电话无人接听，或超出我们合理控制范围的事件所造成的延误，我们不承担责任。",
      },
      { type: "h", text: "退换货" },
      {
        type: "p",
        text: "退换货依据我们的退换货政策处理，商品须未经使用并保持原状。",
      },
      { type: "h", text: "责任" },
      {
        type: "p",
        text: "本条款不排除你在马来西亚消费者法令下的权利。除此之外，我们对任何订单的责任以你为该订单支付的金额为限。",
      },
      { type: "h", text: "适用法律" },
      {
        type: "p",
        text: "本条款受马来西亚法律管辖，争议提交马来西亚法院管辖。",
      },
      {
        type: "callout",
        text: "注册商号与注册编号将在取得后补充于此。在此之前，本页说明我们所遵循的政策，而不虚构公司资料。",
      },
    ],
  },
};
