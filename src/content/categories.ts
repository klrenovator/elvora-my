import type { Category } from "./types";

/**
 * The complete, fixed product taxonomy: seven categories, grouped into three
 * collections for navigation. Content is written per language rather than
 * translated mechanically, and describes only verified material facts —
 * no prices, no stock claims, no invented certifications.
 */
export const categories: Category[] = [
  {
    id: "mens-wallets",
    collection: "men",
    order: 1,
    slug: {
      en: "mens-wallets",
      ms: "dompet-lelaki",
      zh: "nan-shi-qian-bao",
    },
    name: {
      en: "Men's Wallets",
      ms: "Dompet Lelaki",
      zh: "男士钱包",
    },
    tagline: {
      en: "Slim silhouettes that age with the person carrying them.",
      ms: "Reka bentuk nipis yang terus kelihatan elok semakin lama dipakai.",
      zh: "纤薄轮廓，越用越有味道。",
    },
    metaTitle: {
      en: "Genuine Leather Men's Wallets Online in Malaysia",
      ms: "Dompet Lelaki Kulit Asli Online di Malaysia",
      zh: "马来西亚真皮男士钱包网上选购",
    },
    metaDescription: {
      en: "Browse genuine leather men's wallets in full grain and top grain leather, delivered across Malaysia. Compare sizes, colours and internal layouts before you order.",
      ms: "Lihat dompet lelaki kulit asli jenis full grain dan top grain, dihantar ke seluruh Malaysia. Bandingkan saiz, warna dan susun atur dalam sebelum membuat pesanan.",
      zh: "浏览全粒面与头层真皮男士钱包款式，马来西亚全国配送。下单前可先比较尺寸、颜色与内层布局。",
    },
    intro: {
      en: [
        "A man's wallet is handled more often than almost anything else he owns, so it should feel right in the hand from the first week and still look considered years later. Our men's wallets are cut from genuine leather, imported from our own manufacturer in Pakistan and offered in both full grain and top grain.",
        "Most Malaysians carry a slim bifold day to day and switch to something roomier for work travel. That is why the range deliberately mixes compact card-forward wallets with fuller compartments for notes, coins and receipts — and why every product page states the exact leather type and dimensions rather than a vague promise of quality.",
        "Prices are entered by hand for each wallet, so what you see is the real selling price in Ringgit. If a wallet has not been priced yet, the page will say price on request rather than showing a guess.",
      ],
      ms: [
        "Dompet dipegang lebih kerap daripada hampir apa-apa barang lain yang kita miliki, jadi ia perlu selesa sejak minggu pertama dan masih kelihatan kemas bertahun-tahun kemudian. Dompet lelaki kami dipotong daripada kulit asli, diimport daripada kilang kami sendiri di Pakistan, dan ditawarkan dalam gred full grain serta top grain.",
        "Kebanyakan pengguna di Malaysia memilih bifold nipis untuk kegunaan harian dan bertukar kepada dompet yang lebih lapang apabila memerlukan ruang tambahan. Sebab itu koleksi ini menggabungkan dompet padat berasaskan kad dengan ruang lebih besar untuk wang kertas, syiling dan resit — dan sebab itu setiap halaman produk menyatakan jenis kulit serta ukuran sebenar, bukan janji umum tentang kualiti.",
        "Harga dimasukkan secara manual untuk setiap dompet, jadi angka yang dipaparkan ialah harga jualan sebenar dalam Ringgit. Jika sesuatu dompet belum ditetapkan harganya, halaman akan memaparkan harga atas permintaan dan bukannya anggaran.",
      ],
      zh: [
        "钱包几乎是男人每天接触最频繁的物件之一，所以它最好在第一周就顺手，多年后依旧显得体面。我们的男士钱包采用真皮裁制，由我们在巴基斯坦的自有工厂生产进口，提供全粒面与头层两种选择。",
        "在马来西亚，多数人日常使用纤薄的对折款，出差或旅行时才换用容量更大的款式。因此这个系列刻意同时收录以卡位为主的紧凑款和可放纸币、零钱与收据的宽裕款，并且每个产品页都会写明确切的皮革等级与尺寸，而不是笼统地谈「高品质」。",
        "每款钱包的价格都由店主逐一手动输入，所以你看到的就是实际令吉售价。若某款尚未定价，页面会标示为「价格面议」，而不会显示任何猜测的金额。",
      ],
    },
    guidance: {
      en: [
        "Count your cards first. Most people carry six to eight; a wallet built for twelve usually ends up thicker than it needs to be.",
        "Full grain keeps the natural grain of the hide and shows character over time. Top grain is sanded for a smoother, more uniform surface and a slightly lighter feel.",
        "Malaysia's humidity rewards a wallet that is allowed to dry naturally. Avoid leaving leather in a hot car or against a damp pocket for long stretches.",
        "If you are buying as a gift, a slim bifold in a dark neutral colour is the safest choice when you do not know the recipient's habits.",
      ],
      ms: [
        "Kira kad anda dahulu. Kebanyakan orang membawa enam hingga lapan kad; dompet yang dibina untuk dua belas kad selalunya berakhir lebih tebal daripada keperluan.",
        "Kulit full grain mengekalkan ira semula jadi dan makin berkarakter dengan usia. Kulit top grain digilap untuk permukaan yang lebih licin dan seragam, serta terasa sedikit lebih ringan.",
        "Cuaca lembap di Malaysia lebih mesra kepada dompet yang dibiarkan kering secara semula jadi. Elakkan meninggalkan kulit di dalam kereta panas atau bersentuhan dengan poket lembap terlalu lama.",
        "Jika membeli sebagai hadiah, bifold nipis dalam warna neutral gelap ialah pilihan paling selamat apabila anda tidak pasti tabiat pemakainya.",
      ],
      zh: [
        "先数一数你有多少张卡。多数人携带六到八张，为十二张卡设计的钱包往往比实际需要更厚。",
        "全粒面保留皮料天然纹理，用得越久越有层次感；头层经过打磨，表面更平滑均匀，重量也稍轻一些。",
        "马来西亚气候潮湿，让皮革自然风干最稳妥。避免把皮革长时间留在闷热的车内或贴着潮湿的口袋。",
        "若是送礼又不清楚对方的习惯，深色系的纤薄对折款是最稳妥的选择。",
      ],
    },
    faqs: {
      en: [
        {
          q: "Are these wallets made of genuine leather?",
          a: "Every wallet in this category is listed as genuine leather. Each product page names the specific grade — full grain or top grain — and that grade is set by our team, not generated automatically. We do not label a wallet full grain unless it is confirmed as full grain.",
        },
        {
          q: "Where are the wallets made and shipped from?",
          a: "They are manufactured by our own factory in Pakistan and sold from Malaysia. Orders are packed and dispatched locally to addresses across the country.",
        },
        {
          q: "Can you deliver to my area?",
          a: "We deliver nationwide, subject to our courier's coverage for your postcode. Enter your address at checkout and the available delivery option will be shown before you pay.",
        },
      ],
      ms: [
        {
          q: "Adakah dompet ini diperbuat daripada kulit asli?",
          a: "Setiap dompet dalam kategori ini disenaraikan sebagai kulit asli. Setiap halaman produk menyatakan grednya — full grain atau top grain — dan gred itu ditetapkan oleh pasukan kami, bukan dijana secara automatik. Kami tidak melabelkan dompet sebagai full grain melainkan ia benar-benar disahkan begitu.",
        },
        {
          q: "Di mana dompet ini dihasilkan dan dihantar dari?",
          a: "Ia dihasilkan oleh kilang kami sendiri di Pakistan dan dijual dari Malaysia. Pesanan dibungkus dan dihantar dari dalam negara ke alamat di seluruh Malaysia.",
        },
        {
          q: "Bolehkah anda menghantar ke kawasan saya?",
          a: "Kami menghantar ke seluruh negara, bergantung pada liputan kurier untuk poskod anda. Masukkan alamat anda semasa pembayaran dan pilihan penghantaran yang tersedia akan dipaparkan sebelum anda membayar.",
        },
      ],
      zh: [
        {
          q: "这些钱包是真皮的吗？",
          a: "本类别的每一款钱包都标示为真皮。每个产品页会注明具体等级——全粒面或头层——该等级由我们团队设定，不自动生成。未确认是全粒面的皮料，我们不会标示为全粒面。",
        },
        {
          q: "钱包在哪里生产，从哪里发货？",
          a: "由我们在巴基斯坦的自有工厂生产，在马来西亚销售。订单在本地包装并寄往全国各地的地址。",
        },
        {
          q: "可以送到我所在的地区吗？",
          a: "我们提供全国配送，实际取决于快递公司对您邮政编码的服务覆盖。结账时填写地址，系统会在付款前显示可用的配送选项。",
        },
      ],
    },
    image: "/images/categories/mens-wallets.jpg",
    imageAlt: {
      en: "Folded genuine leather men's wallet in cognac brown, placeholder product illustration",
      ms: "Dompet lelaki kulit asli berwarna coklat cognac yang dilipat, ilustrasi produk sementara",
      zh: "折叠的干邑棕真皮男士钱包，临时产品示意图",
    },
  },
  {
    id: "mens-belts",
    collection: "men",
    order: 2,
    slug: {
      en: "mens-belts",
      ms: "tali-pinggang-lelaki",
      zh: "nan-shi-pi-dai",
    },
    name: {
      en: "Men's Belts",
      ms: "Tali Pinggang Lelaki",
      zh: "男士皮带",
    },
    tagline: {
      en: "One good belt quietly fixes the whole outfit.",
      ms: "Sebatang tali pinggang yang baik senyap-senyap merapikan seluruh penampilan.",
      zh: "一条好皮带，悄悄撑起整套穿着。",
    },
    metaTitle: {
      en: "Genuine Leather Men's Belts in Malaysia",
      ms: "Tali Pinggang Lelaki Kulit Asli di Malaysia",
      zh: "马来西亚真皮男士皮带",
    },
    metaDescription: {
      en: "Genuine leather belts for men in full grain and top grain, with classic and casual buckle styles. Order online from Malaysia with nationwide delivery.",
      ms: "Tali pinggang lelaki kulit asli jenis full grain dan top grain, dengan gaya buckle klasik dan kasual. Pesan online dari Malaysia, penghantaran ke seluruh negara.",
      zh: "全粒面与头层真皮男士皮带，备有经典与休闲扣款。马来西亚网上订购，全国配送。",
    },
    intro: {
      en: [
        "A belt takes the load of a full day without being noticed, which is exactly what it should do. Every belt here is cut from genuine leather, and the strap width, buckle finish and length range are stated on each product page so you can judge it before it arrives.",
        "Office wear usually calls for something narrower and restrained. Weekend jeans suit a wider strap with a matte buckle. Because the range covers both, the supporting side matters more than the belt itself — strap thickness and edge finishing are what keep a belt from curling at the tip after a year.",
        "Sizing is the point most people get wrong, so our guide measures a belt from the fold to the middle hole rather than matching your trouser size. When in doubt, choose the larger length and punch an extra hole rather than wearing one too short.",
      ],
      ms: [
        "Tali pinggang menanggung beban sepanjang hari tanpa perlu diberi perhatian, dan memang itu tugasnya. Setiap tali pinggang di sini dipotong daripada kulit asli, dan lebar tali, kemasan buckle serta julat panjang dinyatakan pada setiap halaman produk supaya anda boleh menilainya sebelum ia tiba.",
        "Pakaian pejabat biasanya memerlukan tali yang lebih nipis dan tenang. Seluar jean hujung minggu lebih sesuai dengan tali lebar dan buckle matte. Kerana koleksi ini merangkumi kedua-duanya, bahagian sokongan lebih penting daripada tali itu sendiri — ketebalan tali dan kemasan tepi inilah yang menghalang tali pinggang daripada melengkung di hujungnya selepas setahun.",
        "Ukuran ialah perkara yang paling kerap tersilap, jadi panduan kami mengukur tali pinggang dari lipatan hingga lubang tengah, bukan menyamakannya dengan saiz seluar. Jika ragu-ragu, pilih panjang yang lebih besar dan tebuk lubang tambahan daripada memakai yang terlalu pendek.",
      ],
      zh: [
        "皮带整天承重，却几乎不被人注意，这正是它应有的本分。这里的每条皮带都以真皮裁制，产品页会注明皮带宽度、扣头工艺和可选长度范围，让你在下单前就能判断是否合适。",
        "上班穿着适合较窄、低调的款式；周末配牛仔裤则更适合宽一点、扣头做哑光处理的皮带。正因为系列涵盖两者，皮带的支撑性比外型更关键——皮料厚度与边油收边，才是决定一年后带尾会不会翘起的原因。",
        "尺码是最常出错的一环，所以我们的指南以「从折返处量到中间孔」为准，而不是直接套用裤子的尺码。若不确定，宁可选择较长的尺寸再加打一个孔，也别勉强系一条过短的皮带。",
      ],
    },
    guidance: {
      en: [
        "Match the belt to the shoe leather first, then to the outfit. Brown with brown, black with black, unless the rest of the look is deliberately relaxed.",
        "A stitched edge holds its shape in humidity better than a raw edge. Both exist in the range; check the product specification if this matters to you.",
        "Measure a belt you already wear from the buckle fold to the hole you use most. That number, not your waist size, is the length to order.",
        "Store belts rolled loosely rather than hung by the buckle, which stretches the leather over time.",
      ],
      ms: [
        "Padankan tali pinggang dengan kulit kasut dahulu, kemudian dengan pakaian. Coklat dengan coklat, hitam dengan hitam, kecuali seluruh penampilan memang dibuat secara kasual.",
        "Tepi berjahit lebih kekal bentuknya dalam cuaca lembap berbanding tepi mentah. Kedua-duanya ada dalam koleksi; semak spesifikasi produk jika ini penting bagi anda.",
        "Ukur tali pinggang yang sedang anda pakai dari lipatan buckle hingga lubang yang paling kerap digunakan. Angka itu, bukan saiz pinggang, ialah panjang yang perlu dipesan.",
        "Simpan tali pinggang dalam keadaan digulung longgar, bukan digantung pada buckle, kerana kaedah itu meregangkan kulit lama-kelamaan.",
      ],
      zh: [
        "先让皮带的皮色与鞋子呼应，再考虑整体搭配。棕色配棕色、黑色配黑色，除非整体造型本来就走轻松路线。",
        "在潮湿气候里，车线收边比毛边更能保持形状。两种做法系列里都有，若你在意这一点，可查看产品规格。",
        "量一条你常戴的皮带，从扣头折返处量到你最常用的那个孔。这个数字——而不是腰围——才是你应该订购的长度。",
        "收纳时把皮带松松卷起，不要挂在扣头上，长期悬挂会把皮料拉长。",
      ],
    },
    faqs: {
      en: [
        {
          q: "How do I know which belt length to order?",
          a: "Measure an existing belt from the buckle fold to the hole you use most, then order the closest length. If you are between sizes, take the longer one so the belt can be adjusted.",
        },
        {
          q: "Is the buckle included and does it match the leather?",
          a: "Yes, each belt is sold complete with its buckle. The buckle finish is listed in the product specification, and the colour combination shown is the combination supplied.",
        },
        {
          q: "Can I order a belt as a gift without knowing the size?",
          a: "A length around the middle of the range is usually safe for most men. If it is wrong, contact us before wearing it and we will advise on an exchange under our returns policy.",
        },
      ],
      ms: [
        {
          q: "Bagaimana saya tahu panjang tali pinggang yang patut dipesan?",
          a: "Ukur tali pinggang sedia ada dari lipatan buckle hingga lubang yang paling kerap anda gunakan, kemudian pesan panjang yang paling hampir. Jika ukuran anda di antara dua saiz, ambil yang lebih panjang supaya boleh dilaraskan.",
        },
        {
          q: "Adakah buckle disertakan dan sepadan dengan kulitnya?",
          a: "Ya, setiap tali pinggang dijual lengkap dengan buckle. Kemasan buckle disenaraikan dalam spesifikasi produk, dan gabungan warna yang dipaparkan ialah gabungan yang akan dihantar.",
        },
        {
          q: "Bolehkah saya memesan tali pinggang sebagai hadiah tanpa tahu saiznya?",
          a: "Panjang di pertengahan julat biasanya selamat untuk kebanyakan lelaki. Jika tidak padan, hubungi kami sebelum ia dipakai dan kami akan menasihati tentang pertukaran mengikut polisi pemulangan kami.",
        },
      ],
      zh: [
        {
          q: "我该怎么确定皮带长度？",
          a: "量一条现有皮带，从扣头折返处量到你最常使用的孔，再选择最接近的长度。若介于两个尺码之间，请选较长的一条，方便日后调整。",
        },
        {
          q: "扣头包含在内吗？与皮料是否相配？",
          a: "包含，每条皮带都连同扣头整条出售。扣头工艺列在产品规格中，页面所示的配色即为实际发货的配色。",
        },
        {
          q: "想送人但不知道尺码，可以买皮带吗？",
          a: "长度落在系列中段的款式，对多数男性通常都合适。若真的不合，请在佩戴前联系我们，我们会依退换政策说明换货方式。",
        },
      ],
    },
    image: "/images/categories/mens-belts.jpg",
    imageAlt: {
      en: "Coiled genuine leather men's belt with brushed buckle, placeholder product illustration",
      ms: "Tali pinggang lelaki kulit asli yang digulung dengan buckle berus, ilustrasi produk sementara",
      zh: "卷起的真皮男士皮带，配拉丝扣头，临时产品示意图",
    },
  },
  {
    id: "ladies-handbags",
    collection: "women",
    order: 3,
    slug: {
      en: "ladies-handbags",
      ms: "beg-tangan-wanita",
      zh: "nv-shi-shou-ti-bao",
    },
    name: {
      en: "Ladies' Handbags",
      ms: "Beg Tangan Wanita",
      zh: "女士手提包",
    },
    tagline: {
      en: "Structured leather bags made to be carried daily, not saved for occasions.",
      ms: "Beg kulit berstruktur untuk dibawa setiap hari, bukan disimpan hanya untuk majlis.",
      zh: "有型的真皮包袋，为日常而设，而非只留给特别场合。",
    },
    metaTitle: {
      en: "Genuine Leather Ladies' Handbags Online in Malaysia",
      ms: "Beg Tangan Wanita Kulit Asli Online di Malaysia",
      zh: "马来西亚真皮女士手提包网上选购",
    },
    metaDescription: {
      en: "Structured genuine leather handbags for women in full grain and top grain leather. Check dimensions, strap options and interior layout before ordering in Malaysia.",
      ms: "Beg tangan kulit asli berstruktur untuk wanita dalam gred full grain dan top grain. Semak dimensi, pilihan tali dan susun atur dalam sebelum membuat pesanan di Malaysia.",
      zh: "全粒面与头层真皮女士手提包，包型挺括。下单前先查看尺寸、背带选项与内里布局，马来西亚配送。",
    },
    intro: {
      en: [
        "A handbag has to survive the school run, the office lift and a table at dinner without asking for special treatment. That is the brief behind this collection: genuine leather, reinforced base panels, and linings that can be wiped clean rather than treated like glass.",
        "The range is organised by what a bag has to hold. Compact top-handle shapes suit a phone, cardholder and keys. Roomier totes take a tablet, a water bottle and the folder you did not plan to carry home. Each listing gives the internal and external dimensions so you can compare against what you actually carry.",
        "Leather colour can differ slightly between hides, which is normal for a natural material and is why we describe colour as a range rather than a single swatch. If an exact shade matters, message us before ordering and we will tell you what is currently in stock.",
      ],
      ms: [
        "Beg tangan perlu bertahan melalui urusan menghantar anak ke sekolah, lif pejabat dan meja makan malam tanpa memerlukan layanan khas. Itulah garis panduan koleksi ini: kulit asli, panel bawah diperkuat, dan lapisan dalam yang boleh dilap bersih dan bukannya perlu dijaga seperti kaca.",
        "Koleksi ini disusun mengikut apa yang perlu dibawa. Bentuk top-handle padat sesuai untuk telefon, bekas kad dan kunci. Tote yang lebih lapang memuatkan tablet, botol air dan fail yang tidak dirancang untuk dibawa pulang. Setiap senarai menyatakan dimensi dalam dan luar supaya anda boleh membandingkannya dengan barang yang benar-benar anda bawa.",
        "Warna kulit boleh berbeza sedikit antara kepingan, dan itu normal bagi bahan semula jadi. Sebab itu kami menerangkan warna sebagai satu julat dan bukan satu swatch tunggal. Jika warna yang tepat penting, hubungi kami sebelum memesan dan kami akan maklumkan apa yang ada dalam stok.",
      ],
      zh: [
        "手提包要能经得起接送孩子的路程、办公室电梯和晚餐桌面，而不能要求被特别呵护。这正是这个系列的出发点：真皮、底部加固、内衬可以擦拭清洁，不必像玻璃一样小心伺候。",
        "系列按「需要装什么」来划分。小巧的提把款式放得下手机、卡包和钥匙；容量更大的托特包能装下平板、水瓶，以及你没打算带回家却还是带回的文件夹。每款都会列出内外尺寸，方便你对照自己真正携带的东西。",
        "天然皮料之间颜色可能略有差异，这对真皮而言很正常，因此我们把颜色描述为一个色域，而不是单一色卡。若你非常在意确切色调，下单前先联系我们，我们会告知当前在库的情况。",
      ],
    },
    guidance: {
      en: [
        "Measure the widest thing you carry, usually a tablet or laptop sleeve, then add two centimetres. That is the minimum interior width you need.",
        "Check whether the strap is detachable. A detachable strap lets one bag work for both a formal lunch and a weekend market run.",
        "Full grain develops a patina and holds up to daily friction. Top grain keeps a more even surface if you prefer the bag to look the same in year three as in month one.",
        "For Malaysian humidity, keep the bag out of direct sun when storing and let it air after a rainy commute rather than sealing it damp.",
      ],
      ms: [
        "Ukur barang paling lebar yang anda bawa, biasanya tablet atau sarung laptop, kemudian tambah dua sentimeter. Itulah lebar dalam minimum yang anda perlukan.",
        "Semak sama ada talinya boleh ditanggalkan. Tali yang boleh ditanggalkan membolehkan satu beg digunakan untuk majlis makan tengah hari formal dan juga ke pasar hujung minggu.",
        "Kulit full grain membentuk patina dan tahan geseran harian. Kulit top grain mengekalkan permukaan yang lebih sekata jika anda mahu beg kelihatan sama pada tahun ketiga seperti bulan pertama.",
        "Untuk cuaca lembap Malaysia, jauhkan beg dari cahaya matahari langsung semasa menyimpan dan biarkan ia berangin selepas perjalanan dalam hujan dan bukannya terus ditutup dalam keadaan lembap.",
      ],
      zh: [
        "量一量你携带的最宽物件，通常是平板或笔电内袋，再加两公分，那就是你需要的最小内部宽度。",
        "留意背带是否可拆卸。可拆背带让同一个包既能应付正式午餐，也能应付周末逛市集。",
        "全粒面会随使用形成光泽，也更能承受日常摩擦；若你希望第三年的包看起来仍像第一个月，头层的表面会更均匀稳定。",
        "马来西亚气候潮湿，收纳时避免阳光直射；雨天通勤回家后先让它通风晾干，不要带着湿气直接密封收起。",
      ],
    },
    faqs: {
      en: [
        {
          q: "Will my laptop or tablet fit?",
          a: "Each product page lists interior dimensions. Compare them with the height, width and thickness of your device, and allow a little room for a sleeve. If you are unsure, send us the device model and we will check.",
        },
        {
          q: "Is the bag lining leather or fabric?",
          a: "The lining material is stated in the specification for each bag. Some are fully lined in textile for lighter weight, others use leather trim. We do not describe a bag as fully leather-lined unless it is.",
        },
        {
          q: "Do the bags come with a dust bag?",
          a: "Where a dust bag is included, it is listed in the product specification. We would rather state it per product than promise it across the board.",
        },
      ],
      ms: [
        {
          q: "Adakah laptop atau tablet saya akan muat?",
          a: "Setiap halaman produk menyenaraikan dimensi dalam. Bandingkannya dengan tinggi, lebar dan ketebalan peranti anda, dan tinggalkan sedikit ruang untuk sarung. Jika tidak pasti, hantarkan model peranti anda dan kami akan menyemaknya.",
        },
        {
          q: "Adakah lapisan dalam beg diperbuat daripada kulit atau fabrik?",
          a: "Bahan lapisan dinyatakan dalam spesifikasi setiap beg. Sesetengahnya dilapisi tekstil sepenuhnya untuk lebih ringan, yang lain menggunakan kemasan kulit. Kami tidak menyatakan beg dilapisi kulit sepenuhnya melainkan memang begitu.",
        },
        {
          q: "Adakah beg disertakan dengan beg habuk?",
          a: "Jika beg habuk disertakan, ia disenaraikan dalam spesifikasi produk. Kami lebih suka menyatakannya bagi setiap produk daripada menjanjikannya secara menyeluruh.",
        },
      ],
      zh: [
        {
          q: "我的笔电或平板放得进去吗？",
          a: "每个产品页都会列出内部尺寸。请与你设备的高、宽、厚对照，并预留内袋的空间。若不确定，把设备型号发给我们，我们帮你确认。",
        },
        {
          q: "内衬是皮还是布？",
          a: "每款包的内衬材质都写在规格里。有些为了减轻重量采用全布衬里，有些使用皮革饰边。不是全皮内衬的包，我们不会这样标示。",
        },
        {
          q: "包会附防尘袋吗？",
          a: "附防尘袋的款式会在产品规格中标明。我们宁愿逐款说明，也不愿一概承诺。",
        },
      ],
    },
    image: "/images/categories/ladies-handbags.jpg",
    imageAlt: {
      en: "Structured tan genuine leather ladies' handbag with top handle, placeholder product illustration",
      ms: "Beg tangan wanita kulit asli berwarna tan berstruktur dengan pemegang atas, ilustrasi produk sementara",
      zh: "棕褐色挺括真皮女士手提包，配顶部提把，临时产品示意图",
    },
  },
  {
    id: "ladies-belts",
    collection: "women",
    order: 4,
    slug: {
      en: "ladies-belts",
      ms: "tali-pinggang-wanita",
      zh: "nv-shi-pi-dai",
    },
    name: {
      en: "Ladies' Belts",
      ms: "Tali Pinggang Wanita",
      zh: "女士皮带",
    },
    tagline: {
      en: "Narrow straps and considered hardware for dresses, denim and tailoring.",
      ms: "Tali nipis dan perkakasan kemas untuk gaun, denim dan pakaian berpotongan.",
      zh: "窄身皮带与细致五金，配裙装、牛仔与剪裁西服。",
    },
    metaTitle: {
      en: "Genuine Leather Ladies' Belts in Malaysia",
      ms: "Tali Pinggang Wanita Kulit Asli di Malaysia",
      zh: "马来西亚真皮女士皮带",
    },
    metaDescription: {
      en: "Genuine leather belts for women, from narrow dress belts to everyday styles. Compare widths, hardware finishes and lengths, with delivery across Malaysia.",
      ms: "Tali pinggang kulit asli untuk wanita, daripada tali nipis untuk gaun hingga gaya harian. Bandingkan lebar, kemasan perkakasan dan panjang, dengan penghantaran ke seluruh Malaysia.",
      zh: "真皮女士皮带，从细身裙装配带到日常款式。可比较宽度、五金工艺与长度，全马配送。",
    },
    intro: {
      en: [
        "A women's belt often does more styling work than a men's belt does, and it is worn closer to the waist, where the fit has to be right. This collection keeps that in view: narrower straps, lighter hardware, and lengths that work over a dress as well as through denim loops.",
        "Full grain and top grain both appear here. Full grain suits belts you intend to wear hard and often, because it takes marks and settles into them. Top grain keeps a cleaner line, which many people prefer for a belt worn over a dress or a blazer.",
        "Because belts sit at different points on different bodies, we publish the strap width and the full length range for every style. If your usual size is at the edge of that range, tell us at checkout or on WhatsApp and we will confirm before dispatch.",
      ],
      ms: [
        "Tali pinggang wanita selalunya memainkan peranan gaya yang lebih besar berbanding tali pinggang lelaki, dan ia dipakai lebih dekat dengan pinggang, di tempat yang padanannya mesti tepat. Koleksi ini mengekalkan pertimbangan itu: tali lebih nipis, perkakasan lebih ringan, dan panjang yang sesuai dipakai di atas gaun mahupun melalui lubang seluar denim.",
        "Kulit full grain dan top grain kedua-duanya ada di sini. Full grain sesuai untuk tali yang akan dipakai kerap dan lasak, kerana ia menerima kesan dan terbentuk mengikutnya. Top grain mengekalkan garisan yang lebih bersih, yang lebih disukai ramai untuk tali yang dipakai di atas gaun atau blazer.",
        "Kerana tali pinggang duduk pada kedudukan berbeza pada tubuh yang berbeza, kami menerbitkan lebar tali dan julat panjang penuh bagi setiap gaya. Jika saiz biasa anda berada di hujung julat itu, beritahu kami semasa pembayaran atau melalui WhatsApp dan kami akan mengesahkannya sebelum penghantaran.",
      ],
      zh: [
        "女士皮带往往承担比男士皮带更多的造型作用，而且系在更贴近腰部的位置，合身与否格外明显。这个系列因此把重点放在这几件事上：更窄的带身、更轻巧的五金，以及既能配裙装、也能穿过牛仔裤的合适长度。",
        "全粒面与头层在这里都有。全粒面适合经常佩戴、不怕磕碰的皮带，它会留下痕迹，也会顺著痕迹变得好看；头层则保持更干净的线条，很多人在配裙装或西装外套时更偏好这种。",
        "因为每个人系皮带的位置不同，我们把每一款的带宽和完整长度范围都写清楚。若你的常用尺码正好落在范围的边缘，结账时或通过 WhatsApp 告知我们，我们会在发货前与你确认。",
      ],
    },
    guidance: {
      en: [
        "Width changes the look more than colour does. Two centimetres reads delicate; three and a half reads tailored and structured.",
        "A belt worn over a dress sits higher than one worn through trouser loops, so measure at the point you will actually wear it.",
        "Gold and silver tones photograph differently under Malaysian daylight. Check the hardware finish in the specification rather than relying on the screen.",
        "Rotate between two belts rather than wearing one daily; leather recovers its shape between wears.",
      ],
      ms: [
        "Lebar mengubah penampilan lebih banyak daripada warna. Dua sentimeter memberi kesan halus; tiga setengah sentimeter memberi kesan berpotongan dan berstruktur.",
        "Tali pinggang yang dipakai di atas gaun duduk lebih tinggi berbanding yang dipakai melalui lubang seluar, jadi ukur pada kedudukan anda akan benar-benar memakainya.",
        "Ton warna emas dan perak kelihatan berbeza di bawah cahaya siang Malaysia. Semak kemasan perkakasan dalam spesifikasi dan bukan hanya bergantung pada skrin.",
        "Selang-selikan antara dua tali pinggang daripada memakai satu setiap hari; kulit dapat memulihkan bentuknya antara pemakaian.",
      ],
      zh: [
        "宽度的变化比颜色更影响整体观感。两公分显得细致，三点五公分则显得利落有型。",
        "系在裙装外的皮带位置比穿过裤头的更高，所以要在你实际会系的高度上量。",
        "金色与银色在马来西亚的日光下拍摄效果差异很大。请以规格中的五金工艺为准，别只凭屏幕判断。",
        "两条皮带交替使用，比天天系同一条更好；皮革在两次佩戴之间能恢复形状。",
      ],
    },
    faqs: {
      en: [
        {
          q: "Can these belts be worn over a dress?",
          a: "Yes. Narrow widths are designed for that, and the length range is chosen so the belt can close comfortably over fabric rather than only through trouser loops.",
        },
        {
          q: "How do I choose between full grain and top grain?",
          a: "Full grain is the more forgiving choice for daily wear because marks blend into the natural grain over time. Top grain keeps a smoother, more uniform surface. Both are genuine leather; the difference is how the hide is prepared.",
        },
        {
          q: "What if the belt is too long?",
          a: "Most leather belts can have additional holes added by a leatherworker or cobbler. Tell us the length you need before dispatch and we will advise on the best option.",
        },
      ],
      ms: [
        {
          q: "Bolehkah tali pinggang ini dipakai di atas gaun?",
          a: "Boleh. Lebar yang nipis memang direka untuk itu, dan julat panjang dipilih supaya tali pinggang boleh dikancing dengan selesa di atas fabrik, bukan hanya melalui lubang seluar.",
        },
        {
          q: "Bagaimana saya memilih antara full grain dan top grain?",
          a: "Full grain lebih mudah dibawa untuk pemakaian harian kerana kesan membaur ke dalam ira semula jadi lama-kelamaan. Top grain mengekalkan permukaan yang lebih licin dan seragam. Kedua-duanya kulit asli; bezanya terletak pada cara kulit diproses.",
        },
        {
          q: "Bagaimana jika tali pinggang terlalu panjang?",
          a: "Kebanyakan tali pinggang kulit boleh ditambah lubang oleh tukang kulit atau tukang kasut. Beritahu kami panjang yang anda perlukan sebelum penghantaran dan kami akan menasihati pilihan terbaik.",
        },
      ],
      zh: [
        {
          q: "这些皮带可以系在裙装外吗？",
          a: "可以。细身款正是为此设计，长度范围也考虑到要能隔着布料舒适扣合，而不只是穿过裤头。",
        },
        {
          q: "全粒面和头层该怎么选？",
          a: "日常佩戴选全粒面更从容，因为痕迹会随时间融入天然纹理；头层则保持更平滑均匀的表面。两者都是真皮，差别在于皮料的处理方式。",
        },
        {
          q: "皮带太长怎么办？",
          a: "大多数真皮皮带都可以请皮具师傅或鞋匠加打孔。发货前告知我们你需要的长度，我们会给你建议。",
        },
      ],
    },
    image: "/images/categories/ladies-belts.jpg",
    imageAlt: {
      en: "Narrow tan genuine leather ladies' belt with slim gold buckle, placeholder product illustration",
      ms: "Tali pinggang wanita kulit asli berwarna tan yang nipis dengan buckle emas halus, ilustrasi produk sementara",
      zh: "细身棕褐真皮女士皮带，配纤细金色扣头，临时产品示意图",
    },
  },
  {
    id: "dog-collars",
    collection: "pets",
    order: 5,
    slug: {
      en: "dog-collars",
      ms: "kolar-anjing",
      zh: "gou-bo-quan",
    },
    name: {
      en: "Dog Collars",
      ms: "Kolar Anjing",
      zh: "狗项圈",
    },
    tagline: {
      en: "Leather collars that sit soft on the neck and clean up easily.",
      ms: "Kolar kulit yang lembut pada leher dan mudah dibersihkan.",
      zh: "贴合颈部、打理方便的真皮项圈。",
    },
    metaTitle: {
      en: "Genuine Leather Dog Collars in Malaysia",
      ms: "Kolar Anjing Kulit Asli di Malaysia",
      zh: "马来西亚真皮狗项圈",
    },
    metaDescription: {
      en: "Genuine leather dog collars sized for small to large breeds, with measured neck ranges and sturdy hardware. Order online in Malaysia with nationwide delivery.",
      ms: "Kolar anjing kulit asli untuk baka kecil hingga besar, dengan julat leher yang diukur dan perkakasan kukuh. Pesan online di Malaysia, penghantaran seluruh negara.",
      zh: "真皮狗项圈，从小型到大型犬都有合适尺码，附实测颈围范围与坚固五金。马来西亚网上订购，全国配送。",
    },
    intro: {
      en: [
        "A collar is worn all day, so comfort is not a luxury — it decides whether your dog tolerates it at all. These collars use genuine leather with softened edges and rounded hardware, because a sharp buckle corner is the usual reason a dog starts scratching at its neck.",
        "Sizing is given as a neck range, not just a single number, because it is measured to the dog rather than guessed from breed. Measure snugly around the base of the neck where the collar naturally sits, then check that range against the sizes listed.",
        "For Malaysian weather, leather dries far better than webbing after a wet walk, and it does not hold odour the same way. A quick wipe and air dry is usually all that is needed.",
      ],
      ms: [
        "Kolar dipakai sepanjang hari, jadi keselesaan bukan kemewahan — ia menentukan sama ada anjing anda menerimanya atau tidak. Kolar ini menggunakan kulit asli dengan tepi yang dilembutkan dan perkakasan bersudut bulat, kerana sudut buckle yang tajam ialah punca biasa anjing mula menggaru lehernya.",
        "Saiz diberikan sebagai julat leher, bukan hanya satu angka, kerana ia diukur pada anjing dan bukan diagak daripada baka. Ukur dengan kemas di pangkal leher tempat kolar biasanya duduk, kemudian semak julat itu dengan saiz yang disenaraikan.",
        "Untuk cuaca Malaysia, kulit jauh lebih baik kering berbanding tali webbing selepas berjalan dalam keadaan basah, dan ia tidak menyimpan bau dengan cara yang sama. Lap pantas dan biarkan kering biasanya sudah memadai.",
      ],
      zh: [
        "项圈是全天佩戴的，所以舒适不是奢侈——它决定狗狗愿不愿意戴。这里的项圈采用真皮，边缘经过软化处理，五金为圆角设计，因为尖锐的扣头边角，往往是狗狗开始抓脖子的原因。",
        "尺码以颈围范围标示，而不是单一数字，因为它是按狗实际量出来的，而不是按品种猜的。请贴着项圈自然佩戴的颈部位置量一圈，再对照所列的尺码范围。",
        "在马来西亚的气候里，淋雨后真皮的干燥表现远胜尼龙织带，也不容易像织带那样吸附气味。简单擦拭、通风晾干通常就够了。",
      ],
    },
    guidance: {
      en: [
        "Measure the neck, not the old collar. Lay the collar flat and measure its inner length, then add the buckle allowance — or simply measure the dog twice.",
        "Leave room for two fingers under a closed collar on an adult dog. Puppies need closer attention because their necks change quickly.",
        "Check the D-ring attachment point on the product page. A ring stitched through leather suits walking; a ring on a thin slide buckle suits tags only.",
        "Wipe after beach or muddy walks and dry away from direct sun, which can stiffen leather.",
      ],
      ms: [
        "Ukur leher, bukan kolar lama. Letakkan kolar lama secara rata dan ukur panjang dalamnya, kemudian tambah elaun buckle — atau lebih mudah, ukur anjing anda dua kali.",
        "Tinggalkan ruang untuk dua jari di bawah kolar yang dikancing pada anjing dewasa. Anak anjing memerlukan perhatian lebih kerana lehernya berubah dengan cepat.",
        "Semak titik sambungan cincin D pada halaman produk. Cincin yang dijahit melalui kulit sesuai untuk berjalan; cincin pada buckle gelongsor nipis hanya sesuai untuk tag.",
        "Lap selepas berjalan di pantai atau di kawasan berlumpur dan keringkan jauh dari cahaya matahari langsung, yang boleh mengeraskan kulit.",
      ],
      zh: [
        "量脖子，不要量旧项圈。把旧项圈摊平量内长，再加上扣头预留空间；或者更简单——直接量狗狗两次。",
        "成犬扣好项圈后，要能塞进两根手指。幼犬成长快，需要更频繁地重新确认松紧。",
        "留意产品页上的 D 环连接方式。以皮料缝合固定的环适合牵绳散步；薄插扣上的环只适合挂名牌。",
        "去海边或泥地散步后记得擦拭，并放在避免阳光直射的地方晾干，因为曝晒会让皮革变硬。",
      ],
    },
    faqs: {
      en: [
        {
          q: "How do I measure my dog's neck correctly?",
          a: "Use a soft tape around the base of the neck, where the collar sits, keeping it snug but not tight. If you only have a string, mark it and lay it against a ruler. Measure twice, because a collar that is too loose can slip off.",
        },
        {
          q: "Is leather suitable in Malaysia's heat and rain?",
          a: "Yes, with basic care. Genuine leather softens with use and dries well after a wipe. Avoid prolonged soaking, and let it air dry naturally rather than over a direct heat source.",
        },
        {
          q: "Can I use this collar with a leash?",
          a: "Most collars in this category are built for walking and list a D-ring in the specification. Always check the specification for the individual collar, and never attach a leash to a ring designed only for identification tags.",
        },
      ],
      ms: [
        {
          q: "Bagaimana cara mengukur leher anjing saya dengan betul?",
          a: "Gunakan pita lembut di sekeliling pangkal leher, di tempat kolar duduk, dengan kemas tetapi tidak ketat. Jika hanya ada tali, tandakan dan letakkan pada pembaris. Ukur dua kali, kerana kolar yang terlalu longgar boleh tertanggal.",
        },
        {
          q: "Adakah kulit sesuai untuk cuaca panas dan hujan Malaysia?",
          a: "Sesuai, dengan penjagaan asas. Kulit asli menjadi lembut dengan penggunaan dan kering dengan baik selepas dilap. Elakkan direndam lama, dan biarkan ia kering secara semula jadi dan bukan di atas sumber haba langsung.",
        },
        {
          q: "Bolehkah kolar ini digunakan dengan tali cawak?",
          a: "Kebanyakan kolar dalam kategori ini dibina untuk berjalan dan menyenaraikan cincin D dalam spesifikasi. Sentiasa semak spesifikasi kolar berkenaan, dan jangan sekali-kali menyambungkan tali cawak pada cincin yang direka hanya untuk tag pengenalan.",
        },
      ],
      zh: [
        {
          q: "怎样正确量狗狗的颈围？",
          a: "用软尺绕在项圈自然佩戴的颈部位置，贴合但不勒紧。若只有绳子，做好记号再放上尺子量。建议量两次，因为过松的项圈可能会被挣脱。",
        },
        {
          q: "在马来西亚的炎热多雨气候里，皮革合适吗？",
          a: "合适，只要基本保养到位。真皮会越用越柔软，擦拭后也容易干燥。避免长时间浸泡，并让它自然阴干，不要直接靠近热源。",
        },
        {
          q: "这款项圈可以接牵绳吗？",
          a: "本类别多数项圈为散步使用而设计，规格中会列出 D 环。请务必查看该款项圈的规格，切勿把牵绳扣在仅供挂名牌的环上。",
        },
      ],
    },
    image: "/images/categories/dog-collars.jpg",
    imageAlt: {
      en: "Genuine leather dog collar in dark brown with rounded buckle, placeholder product illustration",
      ms: "Kolar anjing kulit asli berwarna coklat gelap dengan buckle bersudut bulat, ilustrasi produk sementara",
      zh: "深棕真皮狗项圈，配圆角扣头，临时产品示意图",
    },
  },
  {
    id: "dog-leashes",
    collection: "pets",
    order: 6,
    slug: {
      en: "dog-leashes",
      ms: "tali-cawak-anjing",
      zh: "gou-qian-sheng",
    },
    name: {
      en: "Dog Leashes",
      ms: "Tali Cawak Anjing",
      zh: "狗牵引绳",
    },
    tagline: {
      en: "A grip that holds in the rain, and a length that suits the street.",
      ms: "Pegangan yang kukuh walaupun dalam hujan, dengan panjang yang sesuai untuk jalanan.",
      zh: "雨天也不打滑的握感，适合街道行走的长度。",
    },
    metaTitle: {
      en: "Genuine Leather Dog Leashes in Malaysia",
      ms: "Tali Cawak Anjing Kulit Asli di Malaysia",
      zh: "马来西亚真皮狗牵引绳",
    },
    metaDescription: {
      en: "Genuine leather dog leashes with measured lengths and secure clips. Choose a width that matches your dog's size, with delivery across Malaysia.",
      ms: "Tali cawak anjing kulit asli dengan panjang yang diukur dan penyambung yang kukuh. Pilih lebar yang sesuai dengan saiz anjing anda, dihantar ke seluruh Malaysia.",
      zh: "真皮狗牵引绳，长度明确、扣具稳固。可按犬只体型选择宽度，马来西亚全国配送。",
    },
    intro: {
      en: [
        "A leash is judged in the two seconds when your dog pulls unexpectedly. Width, clip quality and the way the handle is finished all matter more than the look of the strap in a photograph, so this collection is described by those details first.",
        "Leashes here are sold in fixed lengths rather than retractable reels. A fixed leather leash gives you a consistent distance to work with, which is easier on the shoulder in a busy area and far less prone to jamming.",
        "Width should follow the dog, not the owner's preference alone. A slim strap suits a small breed on a pavement walk; a wider strap is steadier in the hand with a strong puller. Each listing states both width and length before you choose.",
      ],
      ms: [
        "Tali cawak dinilai dalam dua saat apabila anjing anda menarik secara tiba-tiba. Lebar, kualiti penyambung dan cara pemegang dikemaskan semuanya lebih penting daripada rupa tali dalam gambar, jadi koleksi ini diterangkan berdasarkan butiran tersebut terlebih dahulu.",
        "Tali cawak di sini dijual dalam panjang tetap dan bukan gegelung boleh laras. Tali kulit dengan panjang tetap memberi jarak yang konsisten, lebih mudah pada bahu di kawasan sibuk dan jauh lebih sukar tersangkut.",
        "Lebar harus mengikut anjing, bukan hanya pilihan pemilik. Tali nipis sesuai untuk baka kecil semasa berjalan di kaki lima; tali lebih lebar lebih stabil dalam pegangan bagi anjing yang kuat menarik. Setiap senarai menyatakan lebar dan panjang sebelum anda memilih.",
      ],
      zh: [
        "牵引绳的好坏，往往在你家狗突然爆冲的那两秒里才见分晓。宽度、扣具品质，以及提把的收边方式，都比照片里的外观更重要，所以这个系列先谈这些细节。",
        "这里的牵引绳是固定长度，而不是可伸缩卷绳。固定长度的真皮牵引绳能给你稳定的距离，在人多的地方对肩膀更省力，也几乎不会卡带。",
        "宽度应该跟着狗走，而不只是跟着主人的偏好。细身绳适合小型犬在人行道散步；宽一点的绳在手上更稳，适合力气大的狗。每款在下单前都会注明宽度与长度。",
      ],
    },
    guidance: {
      en: [
        "Match the leash width to body weight, then to temperament. A calm large dog can use a narrower strap than a strong puller of the same size.",
        "Fixed length is easier to control near traffic and in crowded markets. Retractable leads are not offered here because they are not suited to the same handling.",
        "Check the clip type in the specification and confirm it fits your collar's D-ring. A clip that is too large can rub against the neck.",
        "Dry the leash fully before storing, and check the stitching near the clip every few months if your dog pulls.",
      ],
      ms: [
        "Padankan lebar tali dengan berat badan, kemudian dengan perangai. Anjing besar yang tenang boleh menggunakan tali lebih nipis berbanding anjing sebesar itu yang kuat menarik.",
        "Panjang tetap lebih mudah dikawal berhampiran jalan raya dan di pasar yang sesak. Tali boleh laras tidak ditawarkan di sini kerana ia tidak sesuai untuk kawalan yang sama.",
        "Semak jenis penyambung dalam spesifikasi dan pastikan ia padan dengan cincin D kolar anda. Penyambung yang terlalu besar boleh menggesel leher.",
        "Keringkan tali sepenuhnya sebelum disimpan, dan periksa jahitan berhampiran penyambung setiap beberapa bulan jika anjing anda suka menarik.",
      ],
      zh: [
        "先按体重选宽度，再按性情调整。安静的大型犬可以用比同体型但爱爆冲的狗更细的绳子。",
        "固定长度在靠近马路和拥挤市集时更好控制。这里不提供可伸缩卷绳，因为它的操控方式与固定绳差别太大。",
        "查看规格中的扣具类型，确认能扣上你家项圈的 D 环。扣具过大容易摩擦脖子。",
        "收纳前彻底晾干；若狗狗爱拉绳，每隔几个月检查一次扣具附近的缝线。",
      ],
    },
    faqs: {
      en: [
        {
          q: "What length should I choose?",
          a: "Around 120 centimetres is practical for everyday street walking and gives you control near traffic. Shorter lengths suit training and crowded areas; the longer options are better for parks and open ground.",
        },
        {
          q: "Is a leather leash suitable for a strong dog?",
          a: "A leather leash is judged by its width and clip, not its material alone. Choose a wider strap with a substantial clip for a strong puller, and check the specification before ordering.",
        },
        {
          q: "Will the clip fit my existing collar?",
          a: "The clip type is stated for each leash, and most standard D-rings on collars of matching weight will accept it. If your collar has an unusually thick ring, message us and we will check.",
        },
      ],
      ms: [
        {
          q: "Panjang mana yang patut saya pilih?",
          a: "Sekitar 120 sentimeter praktikal untuk berjalan harian di jalanan dan memberi anda kawalan berhampiran lalu lintas. Panjang lebih pendek sesuai untuk latihan dan kawasan sesak; pilihan lebih panjang lebih baik untuk taman dan kawasan lapang.",
        },
        {
          q: "Adakah tali kulit sesuai untuk anjing yang kuat?",
          a: "Tali kulit dinilai berdasarkan lebar dan penyambungnya, bukan bahan semata-mata. Pilih tali yang lebih lebar dengan penyambung yang kukuh untuk anjing yang kuat menarik, dan semak spesifikasi sebelum memesan.",
        },
        {
          q: "Adakah penyambungnya padan dengan kolar sedia ada saya?",
          a: "Jenis penyambung dinyatakan bagi setiap tali, dan kebanyakan cincin D standard pada kolar dengan berat sepadan akan menerimanya. Jika cincin kolar anda luar biasa tebal, hubungi kami dan kami akan menyemaknya.",
        },
      ],
      zh: [
        {
          q: "该选多长的牵引绳？",
          a: "约 120 公分最适合日常街道散步，在靠近马路时也便于控制。较短的长度适合训练和拥挤区域，较长的选项更适合公园与开阔场地。",
        },
        {
          q: "真皮牵引绳适合力气大的狗吗？",
          a: "牵引绳要看宽度与扣具，而不只是材质。狗狗爱拉绳的话，选更宽的绳身配扎实的扣具，下单前先看规格。",
        },
        {
          q: "扣具能扣上我现有的项圈吗？",
          a: "每条牵引绳都会注明扣具类型，大多数与绳索承重相匹配的项圈 D 环都可以扣合。若你的项圈环特别粗厚，联系我们帮你确认。",
        },
      ],
    },
    image: "/images/categories/dog-leashes.jpg",
    imageAlt: {
      en: "Genuine leather dog leash with brass clip alongside a wooden handle, placeholder product illustration",
      ms: "Tali cawak anjing kulit asli dengan penyambung loyang dan pemegang kayu, ilustrasi produk sementara",
      zh: "真皮狗牵引绳，配黄铜扣具与木质提把，临时产品示意图",
    },
  },
  {
    id: "dog-collar-leash-sets",
    collection: "pets",
    order: 7,
    slug: {
      en: "dog-collar-leash-sets",
      ms: "set-kolar-tali-cawak-anjing",
      zh: "gou-bo-quan-qian-sheng-tao-zhuang",
    },
    name: {
      en: "Dog Collar & Leash Sets",
      ms: "Set Kolar & Tali Cawak Anjing",
      zh: "狗项圈与牵引绳套装",
    },
    tagline: {
      en: "Matched leather, matched hardware, one decision instead of two.",
      ms: "Kulit sepadan, perkakasan sepadan, satu keputusan dan bukan dua.",
      zh: "皮料相配、五金相配，一次决定，省去两次挑选。",
    },
    metaTitle: {
      en: "Genuine Leather Dog Collar and Leash Sets in Malaysia",
      ms: "Set Kolar dan Tali Cawak Anjing Kulit Asli di Malaysia",
      zh: "马来西亚真皮狗项圈与牵引绳套装",
    },
    metaDescription: {
      en: "Matched genuine leather dog collar and leash sets in full grain and top grain leather. One size per set, clearly listed, with delivery across Malaysia.",
      ms: "Set kolar dan tali cawak anjing kulit asli yang sepadan dalam gred full grain dan top grain. Satu saiz bagi setiap set, dinyatakan dengan jelas, dihantar ke seluruh Malaysia.",
      zh: "全粒面与头层真皮狗项圈配牵绳套装，皮料与五金成套相配。每套尺码清楚标明，全马配送。",
    },
    intro: {
      en: [
        "Buying a collar and leash separately usually means two slightly different browns and two different metal tones. A set avoids that, and it is also the sensible way to buy when a dog is growing or when the set is a gift for someone else's dog.",
        "Each set pairs a collar with a leash from the same hide and hardware batch, so the colour and finish genuinely match rather than being coordinated by eye. The set listing states the collar size range and the leash length together, and the two are not sold separately within the same product.",
        "If you are buying for a puppy, choose a size from the middle of your expected adult range rather than the smallest option. Leather softens and takes new holes well, but it will not stretch to fit a full-grown dog.",
      ],
      ms: [
        "Membeli kolar dan tali cawak secara berasingan selalunya bermakna dua warna coklat yang sedikit berbeza dan dua ton logam yang berbeza. Set mengelakkan perkara itu, dan ia juga cara yang wajar apabila anjing sedang membesar atau apabila set itu hadiah untuk anjing orang lain.",
        "Setiap set memadankan kolar dengan tali cawak daripada kepingan kulit dan kelompok perkakasan yang sama, jadi warna dan kemasannya benar-benar sepadan dan bukan hanya dipadankan dengan mata. Senarai set menyatakan julat saiz kolar dan panjang tali cawak sekali gus, dan kedua-duanya tidak dijual berasingan dalam produk yang sama.",
        "Jika membeli untuk anak anjing, pilih saiz dari pertengahan julat jangkaan dewasa dan bukan pilihan terkecil. Kulit melembut dan mudah ditambah lubang, tetapi ia tidak akan meregang sehingga padan dengan anjing dewasa.",
      ],
      zh: [
        "分开买项圈和牵引绳，往往会得到两个略有色差的棕色和两种不同色调的金属。买套装就能避免这个问题，对正在长大的狗、或要送给别人的狗作为礼物，也更省心。",
        "每套的项圈与牵引绳取自同一批皮料与五金，所以颜色和工艺是真正成套，而不是凭眼睛凑出来的。套装页会同时注明项圈的尺寸范围与牵绳长度，两者在同一产品内不单独出售。",
        "若是买给幼犬，请从预期成犬尺寸范围的中间段挑选，而不是最小号。真皮会变软、也方便加打孔，但它不会长到刚好适合一只成犬。",
      ],
    },
    guidance: {
      en: [
        "Confirm the collar size range and the leash length on the same listing, because sets are paired by the maker and cannot be split.",
        "A matching set is the practical gift choice: it needs one size decision rather than two, and the presentation is consistent.",
        "Check that the leash clip and the collar D-ring are described as compatible in the specification.",
        "Two sets of hardware on one dog is fine, but keep one as the everyday set and one for outings so each has time to dry.",
      ],
      ms: [
        "Sahkan julat saiz kolar dan panjang tali cawak pada senarai yang sama, kerana set dipadankan oleh pembuat dan tidak boleh dipecahkan.",
        "Set yang sepadan ialah pilihan hadiah yang praktikal: ia memerlukan satu keputusan saiz dan bukan dua, dan persembahannya konsisten.",
        "Pastikan penyambung tali cawak dan cincin D kolar dinyatakan sebagai serasi dalam spesifikasi.",
        "Dua set perkakasan untuk seekor anjing tidak mengapa, tetapi jadikan satu set untuk harian dan satu lagi untuk aktiviti luar supaya setiap satu ada masa untuk kering.",
      ],
      zh: [
        "在同一张产品页上确认项圈尺寸范围与牵引绳长度，因为套装由制作者配好，不能拆开单买。",
        "成套的组合是很实用的礼物：只需决定一个尺码而不是两个，整体呈现也一致。",
        "确认规格中说明牵绳扣具与项圈 D 环互相兼容。",
        "一只狗有两套五金没问题，但可以一套日常用、一套外出用，让每套都有时间晾干。",
      ],
    },
    faqs: {
      en: [
        {
          q: "Can I buy the collar and leash separately after ordering a set?",
          a: "The set is sold as a matched pair. If you need a single collar or leash, order from the dog collars or dog leashes category instead so the size and length are chosen independently.",
        },
        {
          q: "Are both items in the set the same leather grade?",
          a: "Yes, a set is made from the same leather grade and hardware batch. The grade is stated on the set's product page.",
        },
        {
          q: "Which size should I choose for a puppy?",
          a: "Choose from the middle of the range you expect the dog to reach as an adult, then check the fit monthly while it grows. Avoid the smallest size unless you have a genuinely small adult breed.",
        },
      ],
      ms: [
        {
          q: "Bolehkah saya membeli kolar dan tali cawak secara berasingan selepas memesan set?",
          a: "Set dijual sebagai pasangan yang sepadan. Jika anda memerlukan kolar atau tali cawak tunggal, pesan daripada kategori kolar anjing atau tali cawak anjing supaya saiz dan panjang dipilih secara berasingan.",
        },
        {
          q: "Adakah kedua-dua barang dalam set menggunakan gred kulit yang sama?",
          a: "Ya, set dihasilkan daripada gred kulit dan kelompok perkakasan yang sama. Gred tersebut dinyatakan pada halaman produk set itu.",
        },
        {
          q: "Saiz mana yang patut saya pilih untuk anak anjing?",
          a: "Pilih dari pertengahan julat yang anda jangka akan dicapai anjing itu apabila dewasa, kemudian semak kesesuaiannya setiap bulan semasa ia membesar. Elakkan saiz terkecil melainkan baka dewasa anda memang kecil.",
        },
      ],
      zh: [
        {
          q: "买了套装之后可以单独加购项圈或牵绳吗？",
          a: "套装是配套出售的。若只需要单件项圈或牵绳，请到「狗项圈」或「狗牵引绳」类别下单，这样尺码与长度可以独立选择。",
        },
        {
          q: "套装里两件单品的皮革等级相同吗？",
          a: "是的，同一套使用相同的皮革等级与五金批次。等级会注明在该套装的产品页上。",
        },
        {
          q: "幼犬应该选哪个尺码？",
          a: "从你预期它成犬后尺寸范围的中间段挑选，成长期每月检查一次松紧。除非你的成犬本来就体型很小，否则不要选最小号。",
        },
      ],
    },
    image: "/images/categories/dog-collar-leash-sets.jpg",
    imageAlt: {
      en: "Matched genuine leather dog collar and leash set in tan, placeholder product illustration",
      ms: "Set kolar dan tali cawak anjing kulit asli berwarna tan yang sepadan, ilustrasi produk sementara",
      zh: "成套的棕褐真皮狗项圈与牵引绳，临时产品示意图",
    },
  },
];

export const categoryById = Object.fromEntries(
  categories.map((category) => [category.id, category]),
) as Record<string, Category>;

export const categoryBySlug = (locale: keyof Category["slug"], slug: string) =>
  categories.find((category) => category.slug[locale] === slug);
