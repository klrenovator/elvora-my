import type { Locale } from "@/i18n/config";

/**
 * Interface strings. Product and category copy lives in /src/content;
 * this file holds only chrome: navigation, buttons, form labels and notices.
 *
 * Written natively in each language — not machine translated — and kept
 * deliberately short so buttons do not overflow on small phones.
 */
const en = {
  brandTagline: "Genuine leather, made for Malaysia",

  nav: {
    shop: "Shop",
    men: "Men",
    women: "Women",
    pets: "Pets",
    collections: "Collections",
    guide: "Leather guide",
    care: "Care",
    about: "Our story",
    contact: "Contact",
    faq: "FAQ",
    menu: "Menu",
    close: "Close",
    openMenu: "Open navigation menu",
    closeMenu: "Close navigation menu",
  },

  collections: {
    men: "Men's Collection",
    women: "Women's Collection",
    pets: "Pet Collection",
    menBlurb: "Wallets and belts cut from genuine leather, sized for daily carry.",
    womenBlurb: "Handbags and belts with structure, chosen for real everyday use.",
    petsBlurb: "Collars, leashes and matched sets that sit comfortably and clean easily.",
  },

  common: {
    viewCategory: "View category",
    shopCollection: "Shop the collection",
    readMore: "Read more",
    allCategories: "All categories",
    priceOnRequest: "Price on request",
    notifyMe: "Ask about this",
    language: "Language",
    changeLanguage: "Change language",
    skipToContent: "Skip to content",
    loading: "Loading",
    from: "From",
    includesDelivery: "Delivery calculated at checkout",
  },

  home: {
    heroEyebrow: "Full grain & top grain genuine leather",
    heroTitle: "Leather that earns its place.",
    heroBody:
      "Wallets, belts, handbags and dog accessories in genuine leather — imported from our own workshop in Pakistan, finished for Malaysian weather, and delivered to your door anywhere in the country.",
    heroPrimary: "Browse the collection",
    heroSecondary: "How we choose our leather",
    heroNote: "Prices shown are entered by us, in Ringgit. Nothing is estimated.",

    collectionsEyebrow: "Three collections, seven categories",
    collectionsTitle: "Built around how the leather is actually used",
    collectionsBody:
      "No filler categories and no unrelated accessories. Everything here belongs to one of seven lines, each chosen because people genuinely replace these items and want them to last.",

    leatherEyebrow: "Materials",
    leatherTitle: "Full grain or top grain — stated on every product",
    leatherBody:
      "These are the only two genuine leather grades we sell, and each product page names the one it uses. We never describe a product as full grain unless the specification is confirmed.",

    fullGrainTitle: "Full grain",
    fullGrainBody:
      "The hide is used close to its natural state, so the grain stays visible. It is firmer at first, then softens into the marks it collects. Best for pieces you will use hard and keep for years.",

    topGrainTitle: "Top grain",
    topGrainBody:
      "The surface is lightly sanded for an even finish. It resists visible scuffing and holds a cleaner look, which suits anyone who prefers their leather to stay uniform.",

    leatherLink: "Compare the two grades",

    trustTitle: "What you can hold us to",
    trustItems: [
      {
        title: "Manufactured in Pakistan",
        body: "Our own factory produces every piece, so the leather grade on the page is the grade in the box.",
      },
      {
        title: "Prices set by hand",
        body: "Each price is entered individually by our team. If a product has no price yet, we say so instead of guessing.",
      },
      {
        title: "Delivered nationwide",
        body: "We ship across Malaysia, subject to our courier's actual coverage for your postcode.",
      },
      {
        title: "Enquiries answered in three languages",
        body: "Write to us in English, Bahasa Melayu or Chinese and we will reply in the same language.",
      },
    ],

    sizeEyebrow: "Buying guide",
    sizeTitle: "Three measurements that prevent most returns",
    sizeBody:
      "Almost every size problem comes down to measuring the wrong thing. These short guides take a minute and save a round trip.",

    faqEyebrow: "Questions",
    faqTitle: "Answers before you order",

    ctaTitle: "Not sure which piece suits you?",
    ctaBody:
      "Send us what you carry, what it is for, and how often you will use it. We will point you to two or three options rather than the whole catalogue.",
    ctaButton: "Start an enquiry",
  },

  category: {
    breadcrumbHome: "Home",
    shopBy: "Shop",
    leatherOptions: "Leather options",
    guidanceTitle: "Before you choose",
    faqTitle: "Common questions",
    relatedTitle: "Other categories",
    whatsappCta: "Ask about this category",
    placeholderNote: "Temporary illustration",
    inThisCategory: "What this category covers",
  },

  cart: {
    title: "Your cart",
    empty: "Your cart is empty.",
    emptyBody: "Browse the seven categories and add a piece you would like to order.",
    continueShopping: "Continue shopping",
    item: "Item",
    quantity: "Quantity",
    price: "Price",
    total: "Line total",
    remove: "Remove",
    subtotal: "Subtotal",
    itemCount: "items",
    shippingNote: "Delivery is calculated at checkout from your postcode.",
    priceNote: "Prices are the amounts we entered, in Ringgit.",
    checkout: "Proceed to checkout",
    checkoutBlocked: "Resolve the items marked below before checking out.",
    addToCart: "Add to cart",
    added: "Added to cart",
    viewCart: "View cart",
    confirmNewPrice: "Accept updated price",
    removeUnavailable: "Remove unavailable items",
    issueTitle: "Needs your attention",
    issueUnavailable: "This product is no longer available.",
    issueVariantMissing: "This option is no longer offered.",
    issueOutOfStock: "This option is out of stock.",
    issueNowOnRequest: "This item is no longer priced. Contact us for a quote.",
    issuePriceChanged: "The price has changed since you added this item.",
    issueQuantity: "Only the available quantity will be ordered.",
    stockLimit: "Only {n} available",
  },

  checkout: {
    title: "Checkout",
    guestTitle: "Delivery details",
    guestNote: "You are checking out as a guest. No account is needed.",
    fullName: "Full name",
    phone: "Phone number",
    phoneHint: "Malaysian number, for example 012-345 6789",
    email: "Email",
    emailHint: "For your order confirmation",
    addressLine1: "Street address",
    addressLine1Hint: "Building, unit number and street",
    addressLine2: "Address line 2",
    optional: "optional",
    postcode: "Postcode",
    city: "City or town",
    state: "State or federal territory",
    chooseState: "Choose a state",
    notes: "Delivery notes",
    notesHint: "Landmarks, gate access or preferred time",
    paymentTitle: "Payment",
    paymentMethodLabel: "How would you like to pay?",
    paymentCODNote:
      "You pay the courier in cash when your order arrives. Nothing is charged now.",
    paymentConfirmNote:
      "We confirm stock, the total and the delivery cost with you on WhatsApp before dispatch, so you never pay for anything you have not seen.",
    paymentOnlineSoon:
      "Online payment is not available yet. Cash on delivery is the only option for now.",
    paymentMethod: "Payment method",
    paymentStatusLabel: "Payment status",
    paymentPending: "Payment is due on delivery.",
    paymentPendingBody:
      "Cash on delivery is the only method for now. We will confirm your order on WhatsApp before it is dispatched.",
    summaryTitle: "Order summary",
    placeOrder: "Place order",
    placeOrderDisabled: "Payment not yet available",
    orderEnquiry: "Place order — pay on delivery",
    backToCart: "Back to cart",
    eastMalaysiaNote: "This address is in East Malaysia. Delivery rates are higher and calculated by courier coverage.",
    consent: "By placing an order you accept our terms of sale and privacy policy.",
    required: "Required",
    successTitle: "Order received",
    successBody:
      "We have recorded this order. Nothing has been charged — you pay the courier in cash when it arrives. Reply to our WhatsApp message to confirm stock, the total and the delivery cost before dispatch.",
    successWhatsApp: "Confirm on WhatsApp",
    successWhatsAppHint:
      "Sending your reference on WhatsApp is the fastest way to confirm stock and delivery cost.",
    orderReference: "Your order reference",
    storageNotDurable:
      "Note: this order is held in memory on our server and is not yet stored permanently. Please send the summary below so we have it on record.",
    placingOrder: "Recording order…",
    orderFailed: "The order could not be recorded. Nothing has been charged — please try again.",
    payOnDelivery: "Pay on delivery",
    codShort: "Cash on delivery",
    copySummary: "Copy order summary",
    copied: "Copied",
  },

  product: {
    breadcrumb: "Products",
    leatherType: "Leather",
    fullGrain: "Full grain",
    topGrain: "Top grain",
    colour: "Colour",
    size: "Size",
    chooseColour: "Choose a colour",
    chooseSize: "Choose a size",
    specifications: "Specifications",
    description: "Description",
    faqTitle: "Questions about this piece",
    relatedTitle: "You may also consider",
    inSameCategory: "More in this category",
    priceNote: "Prices are entered by us in Ringgit. Nothing is estimated.",
    priceOnRequestBody:
      "No price has been set for this item yet, so we have not published one. Send us a message and we will quote you directly.",
    requestQuote: "Request a quote",
    addToCart: "Add to cart",
    unavailable: "Not orderable yet",
    stockLeft: "in stock",
    sku: "SKU",
    share: "Share",
    placeholderNotice:
      "The image above is a temporary illustration, not a photograph of the finished product.",
    dimensionPending: "Measuring in progress",
  },

  footer: {
    shopHeading: "Shop",
    helpHeading: "Help",
    aboutHeading: "About",
    languageHeading: "Language",
    contactHeading: "Contact",
    contactPending: "Contact details are being finalised and will appear here shortly.",
    rights: "All rights reserved.",
    madeIn: "Manufactured in Pakistan · Sold and shipped from Malaysia",
    policies: "Policies",
    shipping: "Shipping",
    deliveryAreas: "Delivery areas",
    sizing: "Dog collar sizing",
    warranty: "Warranty",
    returns: "Returns",
    care: "Leather care",
    privacy: "Privacy policy",
    terms: "Terms of sale",
    placeholderDisclosure:
      "Product images on this website are temporary illustrations. They are not photographs of the finished products and will be replaced with original photography.",
  },

  a11y: {
    currentLanguage: "Current language",
    externalLink: "Opens in a new tab",
    placeholderImage: "Illustration placeholder",
  },
};

export type Dictionary = typeof en;

const ms: Dictionary = {
  brandTagline: "Kulit asli, direka untuk Malaysia",

  nav: {
    shop: "Beli-belah",
    men: "Lelaki",
    women: "Wanita",
    pets: "Haiwan peliharaan",
    collections: "Koleksi",
    guide: "Panduan kulit",
    care: "Penjagaan",
    about: "Kisah kami",
    contact: "Hubungi kami",
    faq: "Soalan lazim",
    menu: "Menu",
    close: "Tutup",
    openMenu: "Buka menu navigasi",
    closeMenu: "Tutup menu navigasi",
  },

  collections: {
    men: "Koleksi Lelaki",
    women: "Koleksi Wanita",
    pets: "Koleksi Haiwan Peliharaan",
    menBlurb: "Dompet dan tali pinggang kulit asli, bersaiz untuk kegunaan harian.",
    womenBlurb: "Beg tangan dan tali pinggang berstruktur, dipilih untuk penggunaan sebenar.",
    petsBlurb: "Kolar, tali cawak dan set sepadan yang selesa dipakai dan mudah dibersihkan.",
  },

  common: {
    viewCategory: "Lihat kategori",
    shopCollection: "Lihat koleksi",
    readMore: "Baca lagi",
    allCategories: "Semua kategori",
    priceOnRequest: "Harga atas permintaan",
    notifyMe: "Tanya tentang produk ini",
    language: "Bahasa",
    changeLanguage: "Tukar bahasa",
    skipToContent: "Langkau ke kandungan",
    loading: "Memuatkan",
    from: "Dari",
    includesDelivery: "Penghantaran dikira semasa pembayaran",
  },

  home: {
    heroEyebrow: "Kulit asli full grain & top grain",
    heroTitle: "Kulit yang berbaloi dipertahankan.",
    heroBody:
      "Dompet, tali pinggang, beg tangan dan aksesori anjing daripada kulit asli — diimport dari bengkel kami sendiri di Pakistan, dikemas untuk cuaca Malaysia, dan dihantar ke pintu rumah anda di seluruh negara.",
    heroPrimary: "Lihat koleksi",
    heroSecondary: "Cara kami memilih kulit",
    heroNote: "Harga yang dipaparkan dimasukkan sendiri oleh kami, dalam Ringgit. Tiada anggaran.",

    collectionsEyebrow: "Tiga koleksi, tujuh kategori",
    collectionsTitle: "Dibina mengikut cara kulit benar-benar digunakan",
    collectionsBody:
      "Tiada kategori pengisi dan tiada aksesori yang tidak berkaitan. Semua di sini tergolong dalam salah satu daripada tujuh baris produk, dipilih kerana orang memang menggantikan barang-barang ini dan mahu ia tahan lama.",

    leatherEyebrow: "Bahan",
    leatherTitle: "Full grain atau top grain — dinyatakan pada setiap produk",
    leatherBody:
      "Ini satu-satunya dua gred kulit asli yang kami jual, dan setiap halaman produk menyatakan gred yang digunakan. Kami tidak pernah menyifatkan produk sebagai full grain melainkan spesifikasinya disahkan.",

    fullGrainTitle: "Full grain",
    fullGrainBody:
      "Kulit digunakan hampir dalam keadaan semula jadi, jadi ira aslinya masih kelihatan. Ia lebih keras pada mulanya, kemudian melembut mengikut kesan yang terkumpul. Paling sesuai untuk barang yang kerap digunakan dan disimpan bertahun-tahun.",

    topGrainTitle: "Top grain",
    topGrainBody:
      "Permukaannya digilap sedikit untuk kemasan yang sekata. Ia lebih tahan calar yang kelihatan dan mengekalkan rupa yang bersih, sesuai untuk anda yang suka kulit kekal seragam.",

    leatherLink: "Bandingkan kedua-dua gred",

    trustTitle: "Apa yang boleh anda pegang",
    trustItems: [
      {
        title: "Dihasilkan di Pakistan",
        body: "Kilang kami sendiri menghasilkan setiap barang, jadi gred kulit pada halaman ialah gred dalam kotak.",
      },
      {
        title: "Harga ditetapkan secara manual",
        body: "Setiap harga dimasukkan satu per satu oleh pasukan kami. Jika produk belum berharga, kami nyatakan begitu dan bukannya meneka.",
      },
      {
        title: "Dihantar ke seluruh negara",
        body: "Kami menghantar ke seluruh Malaysia, bergantung pada liputan sebenar kurier untuk poskod anda.",
      },
      {
        title: "Pertanyaan dijawab dalam tiga bahasa",
        body: "Tulis kepada kami dalam bahasa Inggeris, Bahasa Melayu atau bahasa Cina dan kami akan membalas dalam bahasa yang sama.",
      },
    ],

    sizeEyebrow: "Panduan membeli",
    sizeTitle: "Tiga ukuran yang mengelakkan kebanyakan pemulangan",
    sizeBody:
      "Hampir setiap masalah saiz berpunca daripada mengukur perkara yang salah. Panduan ringkas ini mengambil masa seminit dan menjimatkan satu perjalanan.",

    faqEyebrow: "Soalan",
    faqTitle: "Jawapan sebelum anda memesan",

    ctaTitle: "Belum pasti barang mana yang sesuai?",
    ctaBody:
      "Beritahu kami apa yang anda bawa, untuk apa, dan berapa kerap ia digunakan. Kami akan tunjukkan dua atau tiga pilihan dan bukan seluruh katalog.",
    ctaButton: "Mulakan pertanyaan",
  },

  category: {
    breadcrumbHome: "Utama",
    shopBy: "Beli",
    leatherOptions: "Pilihan kulit",
    guidanceTitle: "Sebelum anda memilih",
    faqTitle: "Soalan lazim",
    relatedTitle: "Kategori lain",
    whatsappCta: "Tanya tentang kategori ini",
    placeholderNote: "Ilustrasi sementara",
    inThisCategory: "Apa yang diliputi kategori ini",
  },

  cart: {
    title: "Troli anda",
    empty: "Troli anda kosong.",
    emptyBody: "Lawati tujuh kategori dan tambah barang yang ingin anda pesan.",
    continueShopping: "Terus membeli-belah",
    item: "Barang",
    quantity: "Kuantiti",
    price: "Harga",
    total: "Jumlah baris",
    remove: "Buang",
    subtotal: "Jumlah kecil",
    itemCount: "barang",
    shippingNote: "Penghantaran dikira semasa pembayaran berdasarkan poskod anda.",
    priceNote: "Harga ialah jumlah yang kami masukkan sendiri, dalam Ringgit.",
    checkout: "Teruskan ke pembayaran",
    checkoutBlocked: "Selesaikan barang yang ditanda di bawah sebelum meneruskan.",
    addToCart: "Tambah ke troli",
    added: "Ditambah ke troli",
    viewCart: "Lihat troli",
    confirmNewPrice: "Terima harga terkini",
    removeUnavailable: "Buang barang yang tidak tersedia",
    issueTitle: "Perlu perhatian anda",
    issueUnavailable: "Produk ini tidak lagi tersedia.",
    issueVariantMissing: "Pilihan ini tidak lagi ditawarkan.",
    issueOutOfStock: "Pilihan ini tiada stok.",
    issueNowOnRequest: "Barang ini tidak lagi berharga. Hubungi kami untuk sebut harga.",
    issuePriceChanged: "Harga telah berubah sejak anda menambah barang ini.",
    issueQuantity: "Hanya kuantiti yang tersedia akan dipesan.",
    stockLimit: "Hanya {n} tersedia",
  },

  checkout: {
    title: "Pembayaran",
    guestTitle: "Butiran penghantaran",
    guestNote: "Anda membayar sebagai tetamu. Tiada akaun diperlukan.",
    fullName: "Nama penuh",
    phone: "Nombor telefon",
    phoneHint: "Nombor Malaysia, contohnya 012-345 6789",
    email: "E-mel",
    emailHint: "Untuk pengesahan pesanan anda",
    addressLine1: "Alamat jalan",
    addressLine1Hint: "Bangunan, nombor unit dan jalan",
    addressLine2: "Alamat baris 2",
    optional: "pilihan",
    postcode: "Poskod",
    city: "Bandar atau pekan",
    state: "Negeri atau wilayah persekutuan",
    chooseState: "Pilih negeri",
    notes: "Nota penghantaran",
    notesHint: "Mercu tanda, akses pagar atau masa pilihan",
    paymentTitle: "Pembayaran",
    paymentMethodLabel: "Bagaimana anda mahu membayar?",
    paymentCODNote:
      "Anda membayar secara tunai kepada kurier apabila pesanan tiba. Tiada caj dikenakan sekarang.",
    paymentConfirmNote:
      "Kami mengesahkan stok, jumlah dan kos penghantaran dengan anda di WhatsApp sebelum dihantar, jadi anda tidak membayar untuk apa-apa yang belum anda lihat.",
    paymentOnlineSoon:
      "Pembayaran dalam talian belum tersedia. Tunai semasa penghantaran ialah satu-satunya pilihan buat masa ini.",
    paymentMethod: "Kaedah pembayaran",
    paymentStatusLabel: "Status pembayaran",
    paymentPending: "Pembayaran dibuat semasa penghantaran.",
    paymentPendingBody:
      "Tunai semasa penghantaran ialah satu-satunya kaedah buat masa ini. Kami akan mengesahkan pesanan anda di WhatsApp sebelum ia dihantar.",
    summaryTitle: "Ringkasan pesanan",
    placeOrder: "Buat pesanan",
    placeOrderDisabled: "Pembayaran belum tersedia",
    orderEnquiry: "Buat pesanan — bayar semasa penghantaran",
    backToCart: "Kembali ke troli",
    eastMalaysiaNote: "Alamat ini berada di Malaysia Timur. Kadar penghantaran lebih tinggi dan dikira mengikut liputan kurier.",
    consent: "Dengan membuat pesanan, anda menerima terma jualan dan dasar privasi kami.",
    required: "Wajib",
    successTitle: "Pesanan diterima",
    successBody:
      "Kami telah merekodkan pesanan ini. Tiada caj dikenakan — anda membayar tunai kepada kurier apabila pesanan tiba. Balas mesej WhatsApp kami untuk mengesahkan stok, jumlah dan kos penghantaran sebelum dihantar.",
    successWhatsApp: "Sahkan di WhatsApp",
    successWhatsAppHint:
      "Menghantar rujukan anda di WhatsApp ialah cara terpantas untuk mengesahkan stok dan kos penghantaran.",
    orderReference: "Rujukan pesanan anda",
    storageNotDurable:
      "Nota: pesanan ini disimpan dalam memori pelayan kami dan belum disimpan secara kekal. Sila hantar ringkasan di bawah supaya kami ada rekodnya.",
    placingOrder: "Merekod pesanan…",
    orderFailed: "Pesanan tidak dapat direkodkan. Tiada caj dikenakan — sila cuba lagi.",
    payOnDelivery: "Bayar semasa penghantaran",
    codShort: "Tunai semasa penghantaran",
    copySummary: "Salin ringkasan pesanan",
    copied: "Disalin",
  },

  product: {
    breadcrumb: "Produk",
    leatherType: "Kulit",
    fullGrain: "Full grain",
    topGrain: "Top grain",
    colour: "Warna",
    size: "Saiz",
    chooseColour: "Pilih warna",
    chooseSize: "Pilih saiz",
    specifications: "Spesifikasi",
    description: "Penerangan",
    faqTitle: "Soalan tentang barang ini",
    relatedTitle: "Anda mungkin juga pertimbangkan",
    inSameCategory: "Lain-lain dalam kategori ini",
    priceNote: "Harga dimasukkan sendiri oleh kami dalam Ringgit. Tiada anggaran.",
    priceOnRequestBody:
      "Harga untuk barang ini belum ditetapkan, jadi kami tidak menerbitkannya. Hantarkan mesej dan kami akan memberi sebut harga terus kepada anda.",
    requestQuote: "Minta sebut harga",
    addToCart: "Tambah ke troli",
    unavailable: "Belum boleh dipesan",
    stockLeft: "dalam stok",
    sku: "SKU",
    share: "Kongsi",
    placeholderNotice:
      "Gambar di atas ialah ilustrasi sementara, bukan gambar produk siap.",
    dimensionPending: "Ukuran sedang diambil",
  },

  footer: {
    shopHeading: "Beli-belah",
    helpHeading: "Bantuan",
    aboutHeading: "Tentang",
    languageHeading: "Bahasa",
    contactHeading: "Hubungi",
    contactPending: "Butiran hubungan sedang dimuktamadkan dan akan dipaparkan di sini tidak lama lagi.",
    rights: "Hak cipta terpelihara.",
    madeIn: "Dihasilkan di Pakistan · Dijual dan dihantar dari Malaysia",
    policies: "Polisi",
    shipping: "Penghantaran",
    deliveryAreas: "Kawasan penghantaran",
    sizing: "Panduan saiz kolar",
    warranty: "Jaminan",
    returns: "Pemulangan",
    care: "Penjagaan kulit",
    privacy: "Dasar privasi",
    terms: "Terma jualan",
    placeholderDisclosure:
      "Imej produk di laman ini ialah ilustrasi sementara. Ia bukan gambar produk siap dan akan digantikan dengan fotografi asal.",
  },

  a11y: {
    currentLanguage: "Bahasa semasa",
    externalLink: "Dibuka dalam tab baharu",
    placeholderImage: "Imej ilustrasi sementara",
  },
};

const zh: Dictionary = {
  brandTagline: "为马来西亚而做的真皮",

  nav: {
    shop: "商品",
    men: "男士",
    women: "女士",
    pets: "宠物",
    collections: "系列",
    guide: "皮革指南",
    care: "保养",
    about: "品牌故事",
    contact: "联系我们",
    faq: "常见问题",
    menu: "菜单",
    close: "关闭",
    openMenu: "打开导航菜单",
    closeMenu: "关闭导航菜单",
  },

  collections: {
    men: "男士系列",
    women: "女士系列",
    pets: "宠物系列",
    menBlurb: "真皮钱包与皮带，按日常携带习惯定尺寸。",
    womenBlurb: "有型的真皮手提包与皮带，为实际使用而挑选。",
    petsBlurb: "项圈、牵绳与成套组合，佩戴舒适，清洁方便。",
  },

  common: {
    viewCategory: "查看分类",
    shopCollection: "浏览系列",
    readMore: "继续阅读",
    allCategories: "全部分类",
    priceOnRequest: "价格面议",
    notifyMe: "询问这款产品",
    language: "语言",
    changeLanguage: "切换语言",
    skipToContent: "跳到主要内容",
    loading: "载入中",
    from: "由",
    includesDelivery: "运费于结账时计算",
  },

  home: {
    heroEyebrow: "全粒面与头层真皮",
    heroTitle: "经得起时间的皮革。",
    heroBody:
      "钱包、皮带、手提包与狗狗配件，全部采用真皮——由我们在巴基斯坦的自有工坊生产进口，按马来西亚气候处理，并配送至全国各地。",
    heroPrimary: "浏览系列",
    heroSecondary: "我们如何挑选皮革",
    heroNote: "页面上的价格由我们逐一手动输入，以令吉标示，绝无估算。",

    collectionsEyebrow: "三大系列，七个分类",
    collectionsTitle: "依皮革真实使用方式来建构",
    collectionsBody:
      "没有凑数的分类，也没有不相干的配件。这里的一切都属于七个品类之一，每一个都是人们确实会更换、并且希望用得长久的物件。",

    leatherEyebrow: "材质",
    leatherTitle: "全粒面或头层——每件产品都会标明",
    leatherBody:
      "我们只售卖这两种真皮等级，每个产品页都会注明所用等级。除非规格已确认，我们绝不把产品写成全粒面。",

    fullGrainTitle: "全粒面",
    fullGrainBody:
      "皮料以接近天然的状态保留，因此纹路清晰可见。初期较挺，随使用逐渐柔软，并留下属于你的痕迹。适合经常使用、打算用上好几年的物件。",

    topGrainTitle: "头层",
    topGrainBody:
      "表面经过轻度打磨，纹理均匀。它较不易留下明显刮痕，外观更干净利落，适合喜欢皮革始终保持一致的人。",

    leatherLink: "比较两种等级",

    trustTitle: "你可以据以要求我们的事",
    trustItems: [
      {
        title: "巴基斯坦制造",
        body: "每件产品都由我们的自有工厂生产，所以页面上标注的皮革等级，就是盒子里真实的等级。",
      },
      {
        title: "价格逐一手动设定",
        body: "每个价格都由团队单独输入。若某款尚未定价，我们会如实说明，而不是给出猜测。",
      },
      {
        title: "全国配送",
        body: "我们配送至全马各地，实际取决于快递公司对你邮政编码的服务覆盖。",
      },
      {
        title: "三种语言回覆查询",
        body: "你可以用英语、马来语或中文联系我们，我们会以相同语言回覆。",
      },
    ],

    sizeEyebrow: "选购指南",
    sizeTitle: "三个测量，减少大部分退货",
    sizeBody:
      "几乎所有的尺码问题，都源自量错了地方。这几篇短指南只需一分钟，却能省下一趟来回。",

    faqEyebrow: "疑问",
    faqTitle: "下单前先看答案",

    ctaTitle: "还不确定哪一款适合你？",
    ctaBody:
      "告诉我们你平时装什么、用途是什么、多久用一次。我们会给你两三个合适选项，而不是把整个目录丢给你。",
    ctaButton: "开始咨询",
  },

  category: {
    breadcrumbHome: "首页",
    shopBy: "选购",
    leatherOptions: "皮革选项",
    guidanceTitle: "挑选之前",
    faqTitle: "常见问题",
    relatedTitle: "其他分类",
    whatsappCta: "询问这个分类",
    placeholderNote: "临时示意图",
    inThisCategory: "这个分类涵盖什么",
  },

  cart: {
    title: "购物车",
    empty: "购物车是空的。",
    emptyBody: "浏览七个分类，加入你想订购的款式。",
    continueShopping: "继续选购",
    item: "商品",
    quantity: "数量",
    price: "价格",
    total: "小计",
    remove: "移除",
    subtotal: "商品合计",
    itemCount: "件",
    shippingNote: "运费将依据你的邮政编码在结账时计算。",
    priceNote: "价格为我们在系统中手动输入的令吉金额。",
    checkout: "前往结账",
    checkoutBlocked: "请先处理下方标示的项目，再前往结账。",
    addToCart: "加入购物车",
    added: "已加入购物车",
    viewCart: "查看购物车",
    confirmNewPrice: "接受更新后的价格",
    removeUnavailable: "移除无法购买的项目",
    issueTitle: "需要你留意",
    issueUnavailable: "这项产品已下架。",
    issueVariantMissing: "这个选项已不再提供。",
    issueOutOfStock: "这个选项目前缺货。",
    issueNowOnRequest: "这项产品已改为价格面议，请联系我们索取报价。",
    issuePriceChanged: "自你加入购物车后，价格已有变动。",
    issueQuantity: "将只按现有库存数量下单。",
    stockLimit: "仅剩 {n} 件",
  },

  checkout: {
    title: "结账",
    guestTitle: "收货资料",
    guestNote: "你将以访客身分结账，无需注册账号。",
    fullName: "收件人全名",
    phone: "联络电话",
    phoneHint: "马来西亚号码，例如 012-345 6789",
    email: "电邮",
    emailHint: "用于发送订单确认",
    addressLine1: "街道地址",
    addressLine1Hint: "建筑物、单位编号与街道",
    addressLine2: "地址第二行",
    optional: "选填",
    postcode: "邮政编码",
    city: "城市或城镇",
    state: "州属或联邦直辖区",
    chooseState: "请选择州属",
    notes: "送货备注",
    notesHint: "地标、门禁方式或希望送达的时段",
    paymentTitle: "付款",
    paymentMethodLabel: "你想用什么方式付款？",
    paymentCODNote: "收到货时以现金支付给快递员。现在不会收取任何费用。",
    paymentConfirmNote:
      "发货前我们会在 WhatsApp 上与你确认库存、总额与运费，因此你不会为未曾见过的费用付款。",
    paymentOnlineSoon: "线上付款暂未开放。目前仅提供货到付款。",
    paymentMethod: "付款方式",
    paymentStatusLabel: "付款状态",
    paymentPending: "货到付款。",
    paymentPendingBody: "目前仅提供货到付款。发货前我们会在 WhatsApp 上与你确认订单。",
    summaryTitle: "订单摘要",
    placeOrder: "确认下单",
    placeOrderDisabled: "付款暂未开放",
    orderEnquiry: "提交订单——货到付款",
    backToCart: "返回购物车",
    eastMalaysiaNote: "此地址位于东马。运费较高，实际依快递服务覆盖范围计算。",
    consent: "提交订单即表示你接受我们的销售条款与隐私政策。",
    required: "必填",
    successTitle: "订单已收到",
    successBody:
      "我们已记录这笔订单。现在未收取任何费用——收到货时以现金支付给快递员。请回覆我们的 WhatsApp 消息，以确认库存、总额与运费。",
    successWhatsApp: "在 WhatsApp 上确认",
    successWhatsAppHint: "把你的订单编号发到 WhatsApp，是确认库存与运费最快的方式。",
    orderReference: "你的订单编号",
    storageNotDurable:
      "注意：此订单暂存于服务器内存中，尚未永久保存。请把下方摘要发送给我们，以便我们留存记录。",
    placingOrder: "正在记录订单…",
    orderFailed: "订单无法记录。未收取任何费用——请再试一次。",
    payOnDelivery: "货到付款",
    codShort: "货到付款",
    copySummary: "复制订单摘要",
    copied: "已复制",
  },

  product: {
    breadcrumb: "产品",
    leatherType: "皮革",
    fullGrain: "全粒面",
    topGrain: "头层",
    colour: "颜色",
    size: "尺寸",
    chooseColour: "选择颜色",
    chooseSize: "选择尺寸",
    specifications: "产品规格",
    description: "产品说明",
    faqTitle: "关于这件产品的问题",
    relatedTitle: "你或许也会考虑",
    inSameCategory: "同分类其他款式",
    priceNote: "价格由我们以令吉手动输入，绝无估算。",
    priceOnRequestBody:
      "这款产品尚未定价，所以我们没有公布价格。发送讯息给我们，我们会直接为你报价。",
    requestQuote: "索取报价",
    addToCart: "加入购物车",
    unavailable: "暂未开放订购",
    stockLeft: "件现货",
    sku: "货号",
    share: "分享",
    placeholderNotice: "上方图片为临时示意图，并非成品实拍照片。",
    dimensionPending: "尺寸测量中",
  },

  footer: {
    shopHeading: "选购",
    helpHeading: "帮助",
    aboutHeading: "关于",
    languageHeading: "语言",
    contactHeading: "联系",
    contactPending: "联系资料正在确认中，稍后将在此显示。",
    rights: "版权所有。",
    madeIn: "巴基斯坦制造 · 马来西亚销售与发货",
    policies: "政策",
    shipping: "配送说明",
    deliveryAreas: "配送地区",
    sizing: "项圈尺寸指南",
    warranty: "质保",
    returns: "退换货",
    care: "皮革保养",
    privacy: "隐私政策",
    terms: "销售条款",
    placeholderDisclosure:
      "本网站的产品图片为临时示意图，并非成品实拍照片，日后将替换为原创产品摄影。",
  },

  a11y: {
    currentLanguage: "当前语言",
    externalLink: "在新分页开启",
    placeholderImage: "临时示意图",
  },
};

export const dictionaries: Record<Locale, Dictionary> = { en, ms, zh };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
