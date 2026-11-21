import type { Locale } from "@/i18n/config";

export type Block =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "list"; items: string[] }
  | { type: "callout"; text: string };

export interface ContentPage {
  slug: Record<Locale, string>;
  title: Record<Locale, string>;
  metaTitle: Record<Locale, string>;
  metaDescription: Record<Locale, string>;
  blocks: Record<Locale, Block[]>;
  faqs?: Record<Locale, { q: string; a: string }[]>;
  /** Shown above the body when a business detail is still being confirmed. */
  pending?: Record<Locale, string>;
}

export const aboutPage: ContentPage = {
  slug: { en: "about", ms: "tentang-kami", zh: "guan-yu-wo-men" },
  title: { en: "Our story", ms: "Kisah kami", zh: "品牌故事" },
  metaTitle: {
    en: "About Elvora — Genuine Leather Made in Pakistan, Sold in Malaysia",
    ms: "Tentang Elvora — Kulit Asli Buatan Pakistan, Dijual di Malaysia",
    zh: "关于 Elvora——巴基斯坦制造、马来西亚销售的真皮品牌",
  },
  metaDescription: {
    en: "Elvora sells genuine leather wallets, belts, handbags and dog accessories made in our own Pakistani workshop and delivered across Malaysia. Here is how we work.",
    ms: "Elvora menjual dompet, tali pinggang, beg tangan dan aksesori anjing kulit asli yang dihasilkan di bengkel kami sendiri di Pakistan dan dihantar ke seluruh Malaysia. Ini cara kami bekerja.",
    zh: "Elvora 销售真皮钱包、皮带、手提包与狗狗配件，由我们在巴基斯坦的自有工坊生产，配送全马。这里说明我们的经营方式。",
  },
  blocks: {
    en: [
      {
        type: "p",
        text: "Elvora began with a straightforward observation: genuine leather is not hard to find in Malaysia, but clear information about it is. Shopping for a wallet or a belt usually means guessing at the grade, the thickness and the finish, then finding out months later whether the guess was right.",
      },
      {
        type: "p",
        text: "We have a factory in Pakistan. That gives us something most online sellers do not have — direct control over what the leather actually is. It means we can say full grain when it is full grain, and top grain when it is top grain, without relying on a supplier's description.",
      },
      { type: "h", text: "What we make, and what we leave alone" },
      {
        type: "p",
        text: "We build seven lines only: men's wallets, men's belts, ladies' handbags, ladies' belts, dog collars, dog leashes, and dog collar and leash sets. There are no shoes, jackets or phone cases here, not because we dislike them, but because a narrow range is easier to do properly.",
      },
      {
        type: "p",
        text: "Every product page states the leather grade, the dimensions and the finish. Where something is still being confirmed — a stock figure, a colour that varies by batch — we say so instead of rounding it up into a marketing sentence.",
      },
      { type: "h", text: "How our prices work" },
      {
        type: "p",
        text: "Prices are entered by hand, one product at a time, in Ringgit. We do not run automatically generated discounts, and we do not show a crossed-out price to make a number look better. If a product has not been priced yet, it shows as price on request, and you can ask us for a quotation directly.",
      },
      { type: "h", text: "Shipping from Malaysia, not from abroad" },
      {
        type: "p",
        text: "Products are manufactured in Pakistan and sold from Malaysia. Orders are packed and dispatched locally, so you are not waiting on international clearance. Delivery reaches addresses across Peninsular Malaysia, Sabah, Sarawak and Labuan, subject to our courier's coverage for your postcode.",
      },
      {
        type: "callout",
        text: "The brand name, logo and final colour palette you see here are temporary. They are designed to be replaced without rebuilding the website, and original product photography will replace the current illustrations as it becomes available.",
      },
    ],
    ms: [
      {
        type: "p",
        text: "Elvora bermula daripada satu pemerhatian mudah: kulit asli bukan sukar ditemui di Malaysia, tetapi maklumat yang jelas tentangnya memang sukar. Membeli dompet atau tali pinggang selalunya bermakna meneka gred, ketebalan dan kemasannya, kemudian baru tahu beberapa bulan kemudian sama ada tekaan itu betul.",
      },
      {
        type: "p",
        text: "Kami mempunyai kilang di Pakistan. Itu memberi kami sesuatu yang kebanyakan penjual online tidak ada — kawalan langsung ke atas apa sebenarnya kulit itu. Ini bermakna kami boleh menyatakan full grain apabila ia full grain, dan top grain apabila ia top grain, tanpa bergantung pada penerangan pembekal.",
      },
      { type: "h", text: "Apa yang kami buat, dan apa yang kami tinggalkan" },
      {
        type: "p",
        text: "Kami hanya mengeluarkan tujuh baris produk: dompet lelaki, tali pinggang lelaki, beg tangan wanita, tali pinggang wanita, kolar anjing, tali cawak anjing, serta set kolar dan tali cawak anjing. Tiada kasut, jaket atau sarung telefon di sini, bukan kerana kami tidak menyukainya, tetapi kerana julat yang terhad lebih mudah dilakukan dengan betul.",
      },
      {
        type: "p",
        text: "Setiap halaman produk menyatakan gred kulit, dimensi dan kemasan. Jika sesuatu masih dalam pengesahan — angka stok, warna yang berbeza mengikut kelompok — kami nyatakan begitu dan bukannya membundarkannya menjadi ayat pemasaran.",
      },
      { type: "h", text: "Cara harga kami ditetapkan" },
      {
        type: "p",
        text: "Harga dimasukkan secara manual, satu produk pada satu masa, dalam Ringgit. Kami tidak menjalankan diskaun yang dijana secara automatik, dan kami tidak memaparkan harga bergaris untuk menjadikan sesuatu angka kelihatan lebih baik. Jika produk belum berharga, ia dipaparkan sebagai harga atas permintaan, dan anda boleh meminta sebut harga terus daripada kami.",
      },
      { type: "h", text: "Dihantar dari Malaysia, bukan dari luar negara" },
      {
        type: "p",
        text: "Produk dihasilkan di Pakistan dan dijual dari Malaysia. Pesanan dibungkus dan dihantar dari dalam negara, jadi anda tidak perlu menunggu pelepasan kastam antarabangsa. Penghantaran merangkumi alamat di Semenanjung Malaysia, Sabah, Sarawak dan Labuan, bergantung pada liputan kurier untuk poskod anda.",
      },
      {
        type: "callout",
        text: "Nama jenama, logo dan palet warna akhir yang anda lihat di sini adalah sementara. Ia direka untuk diganti tanpa membina semula laman web, dan fotografi produk asal akan menggantikan ilustrasi semasa apabila tersedia.",
      },
    ],
    zh: [
      {
        type: "p",
        text: "Elvora 源自一个很简单的观察：在马来西亚，真皮并不难找，难找的是关于真皮的清楚资讯。买一个钱包或一条皮带，往往要靠猜——猜等级、猜厚度、猜工艺，几个月后才知道猜得对不对。",
      },
      {
        type: "p",
        text: "我们在巴基斯坦拥有自己的工厂。这让我们具备多数网络卖家没有的条件：对「这到底是什么皮」有直接的控制权。也就是说，是全粒面我们就说全粒面，是头层我们就说头层，不必依赖供应商的说法。",
      },
      { type: "h", text: "我们做什么，也刻意不做什么" },
      {
        type: "p",
        text: "我们只做七条产品线：男士钱包、男士皮带、女士手提包、女士皮带、狗项圈、狗牵绳，以及狗项圈与牵绳套装。这里没有鞋子、外套或手机壳，不是因为不喜欢，而是因为范围收窄，才更容易把品质做扎实。",
      },
      {
        type: "p",
        text: "每个产品页都会写明皮革等级、尺寸与工艺。仍在确认中的项目——比如库存数字、不同批次会有差异的颜色——我们如实说明，而不是把它包装成一句漂亮的宣传语。",
      },
      { type: "h", text: "价格是怎么定的" },
      {
        type: "p",
        text: "价格由我们逐件手动输入，以令吉标示。我们不做自动生成的折扣，也不会用划线原价让数字看起来更划算。若某款尚未定价，页面会显示「价格面议」，你可以直接向我们询价。",
      },
      { type: "h", text: "从马来西亚发货，而不是从国外" },
      {
        type: "p",
        text: "产品在巴基斯坦制造，在马来西亚销售。订单在本地包装与寄出，你不需要等待国际清关。配送范围涵盖西马、沙巴、砂拉越与纳闽的地址，实际取决于快递公司对您邮政编码的服务覆盖。",
      },
      {
        type: "callout",
        text: "你在这里看到的品牌名称、标志与最终配色都是临时的，设计上可以在不重建网站的前提下替换；原始产品摄影准备好之后，也会取代目前的示意图。",
      },
    ],
  },
};

export const leatherGuidePage: ContentPage = {
  slug: { en: "leather-guide", ms: "panduan-kulit", zh: "pi-ge-zhi-nan" },
  title: { en: "Full grain or top grain?", ms: "Full grain atau top grain?", zh: "全粒面还是头层？" },
  metaTitle: {
    en: "Full Grain vs Top Grain Leather: What the Difference Actually Means",
    ms: "Full Grain vs Top Grain: Apa Sebenarnya Bezanya",
    zh: "全粒面与头层皮的区别究竟是什么",
  },
  metaDescription: {
    en: "A plain explanation of full grain and top grain genuine leather: how each is prepared, how they age, how to tell them apart, and which suits wallets, belts, bags and dog gear.",
    ms: "Penjelasan mudah tentang kulit asli full grain dan top grain: cara setiap satu diproses, cara ia menua, cara membezakannya, dan mana yang sesuai untuk dompet, tali pinggang, beg dan aksesori anjing.",
    zh: "用最直接的方式说明全粒面与头层真皮：各自如何处理、如何随时间变化、如何分辨，以及分别适合钱包、皮带、包袋或狗狗用品。",
  },
  blocks: {
    en: [
      {
        type: "p",
        text: "Two terms appear on almost every leather product sold online, and both are used loosely. Here is what they mean in our catalogue, without embellishment.",
      },
      { type: "h", text: "Full grain leather" },
      {
        type: "p",
        text: "Full grain uses the outermost layer of the hide with its natural grain intact. Nothing is sanded away, so what you see is the animal's own surface — including the small irregularities, healed scars and variations in pore size that are the honest signature of real leather.",
      },
      {
        type: "list",
        items: [
          "The grain is natural, so no two pieces are identical.",
          "It starts firmer and softens as oils from your hands work into it.",
          "Marks and creases appear sooner, and settle into the character of the piece.",
          "It is usually the thicker, heavier of the two grades.",
        ],
      },
      { type: "h", text: "Top grain leather" },
      {
        type: "p",
        text: "Top grain is also the outer part of the hide, but the surface is lightly sanded to remove imperfections and create an even finish. Some top grain is lightly embossed to restore a grain pattern. It remains genuine leather — it is simply refined rather than left natural.",
      },
      {
        type: "list",
        items: [
          "The surface is uniform, which suits a cleaner, more formal look.",
          "It shows scuffs less obviously and holds its appearance for longer.",
          "It tends to be slightly lighter and more pliable from new.",
          "Grain patterns may be embossed rather than the animal's own.",
        ],
      },
      { type: "h", text: "How to tell them apart" },
      {
        type: "p",
        text: "Look closely at an unlit area of the surface. Full grain shows an irregular pore pattern that changes across the piece. Top grain looks even, sometimes with a fine repeated texture. On an edge, full grain reveals a dense fibre structure that runs through the thickness; heavily finished leather can look uniform all the way through.",
      },
      {
        type: "p",
        text: "The most reliable guide is the label. On this website, every product page names the grade, and that value is set by our team against the specification we receive from our own workshop. If a product has not been confirmed, we do not publish a grade for it.",
      },
      { type: "h", text: "Which one should you buy?" },
      {
        type: "p",
        text: "If you want a piece that develops a patina and you do not mind it showing its history, choose full grain. It suits a wallet carried every day, a belt worn with jeans, or a leash that goes out in all weather.",
      },
      {
        type: "p",
        text: "If you want the piece to look the same in three years as it did in the first month, or you are buying a gift and cannot know how carefully it will be treated, top grain is the safer choice. It is not lesser leather; it is leather with a different finish.",
      },
      { type: "h", text: "What neither grade is" },
      {
        type: "p",
        text: "Neither term means bonded leather, which is leather fibre glued together and often described vaguely as genuine leather. Both of the grades we sell are cut from the hide itself, and we do not use bonded or reconstituted leather in any of the seven categories.",
      },
      {
        type: "callout",
        text: "Leather is a natural material. Colour can shift slightly between batches, and a photograph cannot capture an exact shade. If a precise colour matters, ask us before ordering and we will tell you what is in stock.",
      },
    ],
    ms: [
      {
        type: "p",
        text: "Dua istilah muncul pada hampir setiap produk kulit yang dijual online, dan kedua-duanya digunakan secara longgar. Inilah maksudnya dalam katalog kami, tanpa dilebih-lebihkan.",
      },
      { type: "h", text: "Kulit full grain" },
      {
        type: "p",
        text: "Full grain menggunakan lapisan paling luar kulit dengan ira aslinya masih utuh. Tiada bahagian yang digilap, jadi apa yang anda lihat ialah permukaan semula jadi haiwan itu sendiri — termasuk ketidaksamaan kecil, parut yang sembuh dan perbezaan saiz liang yang menjadi tanda sebenar kulit asli.",
      },
      {
        type: "list",
        items: [
          "Ira bersifat semula jadi, jadi tiada dua kepingan yang sama.",
          "Ia bermula lebih keras dan melembut apabila minyak daripada tangan meresap masuk.",
          "Kesan dan lipatan muncul lebih awal, kemudian menjadi karakter barang itu.",
          "Biasanya ia lebih tebal dan lebih berat berbanding top grain.",
        ],
      },
      { type: "h", text: "Kulit top grain" },
      {
        type: "p",
        text: "Top grain juga merupakan bahagian luar kulit, tetapi permukaannya digilap sedikit untuk menghilangkan kecacatan dan menghasilkan kemasan yang sekata. Sesetengah top grain diembos sedikit untuk mengembalikan corak ira. Ia tetap kulit asli — cuma diperhalusi dan bukan dibiarkan semula jadi.",
      },
      {
        type: "list",
        items: [
          "Permukaannya sekata, sesuai untuk rupa yang lebih bersih dan formal.",
          "Calar kurang ketara dan rupanya lebih kekal lama.",
          "Ia biasanya lebih ringan dan lebih lembut sejak baru.",
          "Corak ira mungkin diembos dan bukan ira semula jadi haiwan itu.",
        ],
      },
      { type: "h", text: "Cara membezakannya" },
      {
        type: "p",
        text: "Perhatikan dengan teliti bahagian permukaan yang tidak terkena cahaya. Full grain menunjukkan corak liang tidak teratur yang berubah pada setiap bahagian. Top grain kelihatan sekata, kadangkala dengan tekstur halus yang berulang. Pada tepi, full grain menunjukkan struktur gentian padat yang menembusi ketebalannya; kulit yang banyak diproses boleh kelihatan seragam sepanjang ketebalan.",
      },
      {
        type: "p",
        text: "Panduan paling boleh dipercayai ialah label. Di laman ini, setiap halaman produk menyatakan grednya, dan nilai itu ditetapkan oleh pasukan kami berdasarkan spesifikasi yang kami terima daripada bengkel kami sendiri. Jika sesuatu produk belum disahkan, kami tidak menerbitkan gred untuknya.",
      },
      { type: "h", text: "Yang mana patut anda beli?" },
      {
        type: "p",
        text: "Jika anda mahukan barang yang membentuk patina dan tidak kisah ia menunjukkan sejarahnya, pilih full grain. Ia sesuai untuk dompet yang dibawa setiap hari, tali pinggang dengan seluar jean, atau tali cawak yang keluar dalam semua cuaca.",
      },
      {
        type: "p",
        text: "Jika anda mahu barang itu kelihatan sama pada tahun ketiga seperti bulan pertama, atau anda membeli hadiah dan tidak tahu betapa berhati-hatinya ia akan dijaga, top grain ialah pilihan yang lebih selamat. Ia bukan kulit yang lebih rendah; ia kulit dengan kemasan yang berbeza.",
      },
      { type: "h", text: "Apa yang bukan kedua-dua gred ini" },
      {
        type: "p",
        text: "Kedua-dua istilah ini tidak bermaksud kulit bonded, iaitu gentian kulit yang dilekatkan bersama dan sering diterangkan secara kabur sebagai kulit asli. Kedua-dua gred yang kami jual dipotong daripada kulit haiwan itu sendiri, dan kami tidak menggunakan kulit bonded atau kulit binaan semula dalam mana-mana tujuh kategori.",
      },
      {
        type: "callout",
        text: "Kulit ialah bahan semula jadi. Warna boleh berubah sedikit antara kelompok, dan gambar tidak dapat menangkap warna yang tepat. Jika warna yang tepat penting, tanya kami sebelum memesan dan kami akan maklumkan apa yang ada dalam stok.",
      },
    ],
    zh: [
      {
        type: "p",
        text: "网上卖的皮革产品几乎都会印上这两个词，而且两者经常被混着用。以下是我们目录里对它们的定义，不加修饰。",
      },
      { type: "h", text: "全粒面（Full Grain）" },
      {
        type: "p",
        text: "全粒面保留皮料最外层与天然纹理，不做打磨，所以你看到的是这张皮本身的表面——包括细小的不平整、愈合的疤痕，以及毛孔大小不一的变化，这些正是真皮的诚实标记。",
      },
      {
        type: "list",
        items: [
          "纹理天然，因此没有两片皮料完全相同。",
          "初期较挺，随着手上的油脂渗入而逐渐柔软。",
          "痕迹与折痕较早出现，之后成为这件物品的个性。",
          "通常比头层更厚、更重。",
        ],
      },
      { type: "h", text: "头层（Top Grain）" },
      {
        type: "p",
        text: "头层同样取自皮料外层，但表面经过轻度打磨，去除瑕疵以形成均匀的质地。部分头层会再轻微压纹，以恢复纹理外观。它仍然是真皮——只是被精修过，而不是保留原始状态。",
      },
      {
        type: "list",
        items: [
          "表面均匀，适合更干净、正式的外观。",
          "刮痕较不明显，外观能维持更久。",
          "一般较轻盈，从新品开始就更柔软。",
          "纹理可能是压印的，而不是皮料本身的天然纹路。",
        ],
      },
      { type: "h", text: "怎样分辨两者" },
      {
        type: "p",
        text: "在光线较暗的区域近距离观察表面。全粒面的毛孔分布不规则，而且会随部位变化；头层看起来均匀，有时带有细密的重复纹理。看看切口边缘：全粒面会露出贯穿厚度的紧密纤维结构，而处理较重的皮革可能整片看起来都很一致。",
      },
      {
        type: "p",
        text: "最可靠的依据还是标示。在本网站，每个产品页都会写明等级，而该数值由我们团队对照自有工坊提供的规格来设定。若某款产品尚未确认，我们不会替它写出等级。",
      },
      { type: "h", text: "你该买哪一种" },
      {
        type: "p",
        text: "如果你希望物件随使用形成光泽、也不介意它留下岁月痕迹，选全粒面。它适合每天携带的钱包、搭牛仔裤的皮带，或风雨无阻都要出门的牵绳。",
      },
      {
        type: "p",
        text: "如果你希望第三年的样子仍像第一个月，或者是买来送人、无法确定对方会多小心使用，头层是更稳妥的选择。它不是更差的皮革，只是工艺处理不同。",
      },
      { type: "h", text: "两者都不是什么" },
      {
        type: "p",
        text: "这两个词都不等于「再生皮」（bonded leather）——那是把皮革纤维黏合压制而成、常被含糊称作真皮的材料。我们售卖的两个等级都直接取自皮料本体，七个分类里都不使用再生皮或重组皮。",
      },
      {
        type: "callout",
        text: "皮革是天然材料，不同批次之间颜色可能略有差异，照片也无法呈现完全准确的色调。若颜色对你很重要，下单前先问我们，我们会告知当前库存情况。",
      },
    ],
  },
  faqs: {
    en: [
      {
        q: "Is top grain leather still genuine leather?",
        a: "Yes. Top grain is genuine leather taken from the outer layer of the hide and sanded for an even finish. It sits just below full grain in terms of how much natural surface is kept, and well above split or bonded leather.",
      },
      {
        q: "Does full grain leather scratch easily?",
        a: "Full grain shows marks more readily because the natural surface is intact. Most light scuffs can be worked out with warmth from your fingers or a small amount of leather conditioner. Over time the marks blend into the grain.",
      },
      {
        q: "Which grade lasts longer in Malaysian humidity?",
        a: "Both last well if they are allowed to dry naturally. Humidity affects leather mainly when a piece stays damp, so the practical difference is care rather than grade. Top grain needs slightly less attention because its finished surface resists staining.",
      },
      {
        q: "Do you use bonded or PU leather anywhere?",
        a: "No. The seven categories we sell use full grain or top grain genuine leather only, and each product page names which one applies.",
      },
    ],
    ms: [
      {
        q: "Adakah kulit top grain masih kulit asli?",
        a: "Ya. Top grain ialah kulit asli yang diambil daripada lapisan luar dan digilap untuk kemasan sekata. Ia berada sedikit di bawah full grain dari segi berapa banyak permukaan semula jadi yang dikekalkan, dan jauh lebih baik berbanding kulit split atau bonded.",
      },
      {
        q: "Adakah kulit full grain mudah tercalar?",
        a: "Full grain lebih mudah menunjukkan kesan kerana permukaan semula jadinya masih utuh. Kebanyakan calar ringan boleh dipulihkan dengan kehangatan jari atau sedikit bahan pelembut kulit. Lama-kelamaan kesan itu membaur ke dalam ira.",
      },
      {
        q: "Gred mana yang lebih tahan dalam cuaca lembap Malaysia?",
        a: "Kedua-duanya tahan lama jika dibiarkan kering secara semula jadi. Kelembapan menjejaskan kulit terutamanya apabila barang kekal lembap, jadi perbezaan sebenar terletak pada penjagaan dan bukan gred. Top grain memerlukan perhatian sedikit kurang kerana permukaan kemasannya lebih tahan kesan.",
      },
      {
        q: "Adakah anda menggunakan kulit bonded atau PU di mana-mana?",
        a: "Tidak. Tujuh kategori yang kami jual hanya menggunakan kulit asli full grain atau top grain, dan setiap halaman produk menyatakan yang mana satu.",
      },
    ],
    zh: [
      {
        q: "头层皮还是真皮吗？",
        a: "是。头层是取自皮料外层的真皮，经过打磨以获得均匀表面。它的天然表面保留程度略低于全粒面，但远优于二层皮或再生皮。",
      },
      {
        q: "全粒面容易刮花吗？",
        a: "因为天然表面完整，全粒面较容易显现痕迹。多数浅层刮痕可以用手指的温度或少量皮革保养油推淡。使用久了，这些痕迹会融入纹理之中。",
      },
      {
        q: "在马来西亚的潮湿气候里，哪个等级更耐用？",
        a: "只要让它自然阴干，两者都耐用。潮湿主要影响那些长期处于湿润状态的皮革，所以关键在保养而不是等级。头层的表面经过处理，较不易吃色，需要留意的细节略少一些。",
      },
      {
        q: "你们有用再生皮或 PU 皮吗？",
        a: "没有。我们售卖的七个分类只使用全粒面或头层真皮，每个产品页都注明属于哪一种。",
      },
    ],
  },
};

export const careGuidePage: ContentPage = {
  slug: { en: "leather-care", ms: "penjagaan-kulit", zh: "pi-ge-bao-yang" },
  title: { en: "Caring for leather in Malaysia", ms: "Menjaga kulit di Malaysia", zh: "在马来西亚保养皮革" },
  metaTitle: {
    en: "How to Care for Leather Wallets, Belts, Bags and Dog Gear in Malaysia",
    ms: "Cara Menjaga Dompet, Tali Pinggang, Beg dan Aksesori Anjing Kulit di Malaysia",
    zh: "在马来西亚如何保养真皮钱包、皮带、包袋与狗狗用品",
  },
  metaDescription: {
    en: "Practical leather care for humid, rainy Malaysian conditions: daily habits, cleaning, drying, storage and what to avoid, by product type.",
    ms: "Penjagaan kulit yang praktikal untuk cuaca Malaysia yang lembap dan hujan: tabiat harian, pembersihan, pengeringan, penyimpanan dan apa yang perlu dielakkan, mengikut jenis produk.",
    zh: "针对马来西亚湿热多雨气候的实用皮革保养指南：日常习惯、清洁、干燥、收纳与需要避免的做法，按产品类别说明。",
  },
  blocks: {
    en: [
      {
        type: "p",
        text: "Leather does not need much attention. It needs the right kind, at the right time. In Malaysia, most damage comes from two things: staying damp, and drying too fast.",
      },
      { type: "h", text: "Three habits that matter more than any product" },
      {
        type: "list",
        items: [
          "Let it dry naturally. Never put leather on a radiator, in front of a fan heater, or in direct midday sun. Rapid drying stiffens the fibres and can crack a finished edge.",
          "Wipe, do not soak. A barely damp cloth removes dust and most marks. Soap and water in quantity will strip the oils that keep leather supple.",
          "Give it a rest. Rotating between two wallets or two belts lets each recover its shape and dry completely between uses.",
        ],
      },
      { type: "h", text: "Wallets" },
      {
        type: "p",
        text: "Empty the wallet once a month. Receipts, old cards and coins add bulk and pressure that stretch the seams. Wipe the outside with a dry cloth, and keep it out of a back pocket where body heat and friction wear the corners fastest.",
      },
      { type: "h", text: "Belts" },
      {
        type: "p",
        text: "Store belts rolled loosely, not hung by the buckle. Hanging puts the entire weight of the strap on one small hole. If the belt has become stiff, a light application of leather conditioner along the strap — not on the buckle — will soften it over a few days.",
      },
      { type: "h", text: "Handbags" },
      {
        type: "p",
        text: "Empty the bag and let it air after a rainy commute before storing it. Stuff it lightly with paper to hold its shape, never plastic, which traps moisture. Keep bags out of direct sunlight when stored, because finished leather can fade unevenly.",
      },
      { type: "h", text: "Dog collars and leashes" },
      {
        type: "p",
        text: "Rinse-free cleaning is best: wipe with a damp cloth after a muddy walk and dry away from heat. Check the stitching near the clip and the D-ring every few months if your dog pulls, and retire the piece if the leather around the hardware has become thin.",
      },
      {
        type: "callout",
        text: "If a piece gets properly soaked, blot it, reshape it by hand, and leave it to dry at room temperature away from sunlight. Do not use a hairdryer, and do not apply conditioner until it is completely dry.",
      },
    ],
    ms: [
      {
        type: "p",
        text: "Kulit tidak memerlukan banyak perhatian. Ia memerlukan jenis perhatian yang betul, pada masa yang betul. Di Malaysia, kebanyakan kerosakan berpunca daripada dua perkara: kekal lembap, dan kering terlalu cepat.",
      },
      { type: "h", text: "Tiga tabiat yang lebih penting daripada apa-apa produk" },
      {
        type: "list",
        items: [
          "Biarkan ia kering secara semula jadi. Jangan letakkan kulit di atas radiator, di hadapan pemanas kipas, atau di bawah cahaya matahari tengah hari. Pengeringan pantas mengeraskan gentian dan boleh meretakkan tepi yang dikemaskan.",
          "Lap, jangan rendam. Kain yang sedikit lembap menghilangkan habuk dan kebanyakan kesan. Sabun dan air dalam kuantiti banyak akan menghilangkan minyak yang mengekalkan kelenturan kulit.",
          "Beri ia berehat. Selang-selikan antara dua dompet atau dua tali pinggang membolehkan setiap satu memulihkan bentuk dan kering sepenuhnya antara penggunaan.",
        ],
      },
      { type: "h", text: "Dompet" },
      {
        type: "p",
        text: "Kosongkan dompet sebulan sekali. Resit, kad lama dan syiling menambah isi padu dan tekanan yang meregangkan jahitan. Lap bahagian luar dengan kain kering, dan jauhkan ia dari poket belakang, tempat haba badan dan geseran paling cepat menghauskan penjurunya.",
      },
      { type: "h", text: "Tali pinggang" },
      {
        type: "p",
        text: "Simpan tali pinggang dalam keadaan digulung longgar, bukan digantung pada buckle. Menggantung meletakkan seluruh berat tali pada satu lubang kecil. Jika tali pinggang menjadi keras, sapuan nipis bahan pelembut kulit di sepanjang tali — bukan pada buckle — akan melembutkannya dalam beberapa hari.",
      },
      { type: "h", text: "Beg tangan" },
      {
        type: "p",
        text: "Kosongkan beg dan biarkan ia berangin selepas perjalanan dalam hujan sebelum disimpan. Sumbat sedikit dengan kertas untuk mengekalkan bentuknya, jangan sekali-kali plastik, kerana ia memerangkap kelembapan. Jauhkan beg dari cahaya matahari langsung semasa disimpan, kerana kulit berkemasan boleh luntur secara tidak sekata.",
      },
      { type: "h", text: "Kolar dan tali cawak anjing" },
      {
        type: "p",
        text: "Pembersihan tanpa rendaman paling baik: lap dengan kain lembap selepas berjalan di kawasan berlumpur dan keringkan jauh dari sumber haba. Periksa jahitan berhampiran penyambung dan cincin D setiap beberapa bulan jika anjing anda suka menarik, dan hentikan penggunaan jika kulit di sekitar perkakasan telah menipis.",
      },
      {
        type: "callout",
        text: "Jika sesuatu barang benar-benar basah, lap sehingga kering, bentuk semula dengan tangan, dan biarkan ia kering pada suhu bilik jauh dari cahaya matahari. Jangan guna pengering rambut, dan jangan sapu bahan pelembut sehingga ia benar-benar kering.",
      },
    ],
    zh: [
      {
        type: "p",
        text: "皮革其实不需要太多照料，只需要在对的时候用对的方式。在马来西亚，损坏多半来自两件事：长期潮湿，以及干得太快。",
      },
      { type: "h", text: "三个习惯，胜过任何保养产品" },
      {
        type: "list",
        items: [
          "让它自然阴干。不要放在暖炉上、暖风机前，或正午的直射阳光下。快速干燥会让纤维变硬，甚至使收边开裂。",
          "擦拭，不要浸泡。微湿的布就能去除灰尘与多数痕迹。大量肥皂和水会洗掉让皮革保持柔软的油脂。",
          "让它休息。两个钱包或两条皮带交替使用，可让每一件在使用之间恢复形状并彻底干燥。",
        ],
      },
      { type: "h", text: "钱包" },
      {
        type: "p",
        text: "每月清空一次钱包。收据、旧卡与零钱会增加厚度与压力，把缝线撑松。外侧用干布擦拭，并避免放在后裤袋——体温与摩擦会让边角最快磨损。",
      },
      { type: "h", text: "皮带" },
      {
        type: "p",
        text: "收纳时把皮带松松卷起，不要挂在扣头上。悬挂会让皮带的全部重量压在一个小孔上。若皮带变硬，沿着整条带身（不要涂在扣头）薄薄上一层皮革保养油，几天后会软化。",
      },
      { type: "h", text: "手提包" },
      {
        type: "p",
        text: "雨天通勤回家后，先清空包并让它通风，再收纳。用纸轻轻填充以维持包型，千万不要用塑料袋，那会闷住湿气。收纳时避免阳光直射，因为经过表面处理的皮革可能出现不均匀的褪色。",
      },
      { type: "h", text: "狗项圈与牵绳" },
      {
        type: "p",
        text: "最好不做浸洗：泥地散步后用湿布擦拭，并远离热源阴干。若狗狗爱拉绳，每隔几个月检查扣具与 D 环附近的缝线；一旦五金周围的皮料变薄，就该停用。",
      },
      {
        type: "callout",
        text: "如果整件被浸湿了，先吸干水分，用手恢复形状，然后在室温、避免阳光直射的地方晾干。不要用吹风机，也务必等完全干燥后再上保养油。",
      },
    ],
  },
};

export const contactPage: ContentPage = {
  slug: { en: "contact", ms: "hubungi-kami", zh: "lian-xi-wo-men" },
  title: { en: "Contact us", ms: "Hubungi kami", zh: "联系我们" },
  metaTitle: {
    en: "Contact Elvora — Leather Enquiries in English, Malay or Chinese",
    ms: "Hubungi Elvora — Pertanyaan Kulit dalam Bahasa Inggeris, Melayu atau Cina",
    zh: "联系 Elvora——可用英语、马来语或中文查询",
  },
  metaDescription: {
    en: "Ask about a product, a size, a colour or delivery to your area. We reply in English, Bahasa Melayu or Chinese and never guess at specifications.",
    ms: "Tanya tentang produk, saiz, warna atau penghantaran ke kawasan anda. Kami membalas dalam bahasa Inggeris, Bahasa Melayu atau Cina dan tidak meneka spesifikasi.",
    zh: "询问产品、尺寸、颜色或配送范围。我们以英语、马来语或中文回覆，规格不清楚的地方绝不猜测。",
  },
  blocks: {
    en: [
      {
        type: "p",
        text: "The fastest way to get a useful answer is to tell us the product, the size you are considering, and the town or postcode it needs to reach. If you are choosing between two options, say what you usually carry and we will narrow it down.",
      },
      {
        type: "p",
        text: "We answer in the language you write in. If you send a message in Bahasa Melayu, the reply will be in Bahasa Melayu. The same applies to Chinese.",
      },
      { type: "h", text: "What we can help with" },
      {
        type: "list",
        items: [
          "Product specifications, leather grade, dimensions and finish.",
          "Sizing questions for belts, collars and handbags.",
          "Colour availability and current stock.",
          "Delivery coverage for your postcode.",
          "Quotations for products marked price on request.",
          "Wholesale and bulk enquiries for the seven categories we make.",
        ],
      },
    ],
    ms: [
      {
        type: "p",
        text: "Cara terpantas untuk mendapat jawapan yang berguna ialah beritahu kami produk, saiz yang anda pertimbangkan, dan bandar atau poskod yang perlu dihantar. Jika anda memilih antara dua pilihan, nyatakan apa yang biasa anda bawa dan kami akan mengecilkan pilihannya.",
      },
      {
        type: "p",
        text: "Kami membalas dalam bahasa yang anda gunakan. Jika anda menghantar mesej dalam Bahasa Melayu, balasannya dalam Bahasa Melayu. Begitu juga untuk bahasa Cina.",
      },
      { type: "h", text: "Apa yang kami boleh bantu" },
      {
        type: "list",
        items: [
          "Spesifikasi produk, gred kulit, dimensi dan kemasan.",
          "Soalan saiz untuk tali pinggang, kolar dan beg tangan.",
          "Ketersediaan warna dan stok semasa.",
          "Liputan penghantaran untuk poskod anda.",
          "Sebut harga untuk produk yang ditanda harga atas permintaan.",
          "Pertanyaan borong dan pukal bagi tujuh kategori yang kami hasilkan.",
        ],
      },
    ],
    zh: [
      {
        type: "p",
        text: "想得到有用的回覆，最快的做法是告诉我们：哪一款产品、你考虑哪个尺寸，以及要寄到哪个城镇或邮政编码。若你正在两个选项之间犹豫，说说你平时都装些什么，我们帮你缩小范围。",
      },
      {
        type: "p",
        text: "你用哪种语言写信，我们就用哪种语言回覆。用马来语询问，就用马来语回覆；中文也一样。",
      },
      { type: "h", text: "我们可以帮上忙的地方" },
      {
        type: "list",
        items: [
          "产品规格、皮革等级、尺寸与工艺。",
          "皮带、项圈与手提包的尺寸问题。",
          "颜色供应情况与现有库存。",
          "你所在邮编的配送覆盖。",
          "标示「价格面议」产品的报价。",
          "我们所做七个分类的批发与大量采购查询。",
        ],
      },
    ],
  },
  pending: {
    en: "Direct contact channels — WhatsApp, phone and email — are being finalised. Once they are published here, this notice disappears automatically. Until then, please use the enquiry form below.",
    ms: "Saluran hubungan langsung — WhatsApp, telefon dan e-mel — sedang dimuktamadkan. Setelah diterbitkan di sini, notis ini akan hilang secara automatik. Sementara itu, sila gunakan borang pertanyaan di bawah.",
    zh: "WhatsApp、电话与电邮等直接联系渠道正在确认中。正式公布后，这条提示会自动消失。在此之前，请使用下方的查询表格。",
  },
};
