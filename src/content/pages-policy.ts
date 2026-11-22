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
  title: {
    en: "Returns and refunds",
    ms: "Pemulangan dan bayaran balik",
    zh: "退货与退款",
  },
  metaTitle: {
    en: "Returns and Refunds — 30 Days for Incorrect, Damaged or Defective Items",
    ms: "Pemulangan dan Bayaran Balik — 30 Hari untuk Barang Salah, Rosak atau Cacat",
    zh: "退货与退款——寄错、损坏或有瑕疵的商品 30 天内处理",
  },
  metaDescription: {
    en: "How to return an incorrect, damaged, defective or misdescribed leather item within 30 days of delivery: what to send us, how approval works, and how refunds and replacements are handled.",
    ms: "Cara memulangkan barang kulit yang salah, rosak, cacat atau tidak seperti yang diterangkan dalam tempoh 30 hari selepas diterima: apa yang perlu dihantar, cara kelulusan berfungsi, dan cara bayaran balik serta penggantian diuruskan.",
    zh: "如何在收货后 30 天内退回寄错、损坏、有瑕疵或与描述不符的真皮商品：需要提供哪些资料、审核流程，以及退款与更换如何处理。",
  },
  blocks: {
    en: [
      {
        type: "p",
        text: "If your order is not what it should have been, tell us within 30 days of receiving it. This policy covers an item that arrived damaged, is defective or faulty, is not the product you ordered, or does not match what was described on this website. Your statutory rights under Malaysian consumer law apply in full and are set out separately below.",
      },
      {
        type: "callout",
        text: "This is not a change-of-mind policy. We do not offer returns simply because a customer has changed their mind, or because a belt length or collar size was ordered incorrectly. Please measure before ordering — our sizing guides exist for that reason.",
      },
      { type: "h", text: "What can be returned within 30 days" },
      {
        type: "list",
        items: [
          "You received a different product from the one you ordered — a different model, colour, size or quantity.",
          "The product arrived damaged in transit.",
          "The product is defective or faulty: stitching that has failed, hardware that does not function, or a fault in the material.",
          "The product is not as described — the item does not match the specification, materials or dimensions stated on its product page.",
        ],
      },
      { type: "h", text: "Time limit" },
      {
        type: "p",
        text: "You have 30 calendar days from the date you receive the order to raise the issue with us. The 30 days start on delivery, not on the date the order was placed. Please raise it as soon as you notice something wrong — the sooner we see it, the more we can do about it.",
      },
      { type: "h", text: "What to include in your return request" },
      {
        type: "list",
        items: [
          "Your order number, and which item or items the request relates to.",
          "A clear explanation of the reason for the return, naming what is wrong with the product.",
          "Photographs or a short video showing the issue, clearly enough for us to verify it.",
          "Relevant product details — the size, colour and variant shown on your order.",
        ],
      },
      {
        type: "p",
        text: "A request that does not identify the item or the fault cannot be assessed, so we may have to ask you for it before we can proceed. Please include it in your first message where possible.",
      },
      { type: "h", text: "How a return is approved" },
      {
        type: "p",
        text: "We review your request, the photographs or video, and the order details, and reply to tell you whether the return is approved. If we need more information, or the photographs do not show the issue clearly, we will ask for it. Once approved, we issue a return reference and the return address. Please do not send anything before you have that confirmation — a parcel that arrives without a reference is difficult to match to an order, and may be refused.",
      },
      { type: "h", text: "Inspection on arrival" },
      {
        type: "p",
        text: "When the item reaches us we inspect it against the reason given. We check the fault or the mismatch you described, and confirm the item is the one from your order. We aim to complete the inspection and tell you the outcome promptly, and we will contact you if anything about the inspection is unclear.",
      },
      { type: "h", text: "Refunds" },
      {
        type: "p",
        text: "Once the item has been inspected and the return approved, the refund is issued to the original payment method used for the order, for the price you paid for the item. Where the return is our fault — damaged, defective, incorrect or misdescribed — your original delivery charge is refunded as well. Your bank or payment provider may take additional working days to post the amount to your account.",
      },
      { type: "h", text: "Replacements and exchanges" },
      {
        type: "p",
        text: "Where the item is available, you may choose a replacement of the same product, or an exchange for the correct item where the wrong one was sent. If the replacement is out of stock, we will tell you and offer either a refund or an exchange for another item of the same value. Where a replacement or exchange costs more than the original item, we will tell you the difference before proceeding; where it costs less, the difference is refunded.",
      },
      { type: "h", text: "Who pays return delivery" },
      {
        type: "p",
        text: "Where the return is because of an incorrect, damaged, defective or misdescribed product, we cover the return delivery. We will tell you how to send it back once the return is approved. Do not use an expensive service or arrange your own courier before we have confirmed the method, because we may not be able to reimburse a cost we did not agree to.",
      },
      { type: "h", text: "Natural characteristics that are not faults" },
      {
        type: "p",
        text: "Leather is a natural material. Variation in grain, tone, marking and colour between pieces, and the patina that develops with use, are characteristics of genuine leather rather than defects. Scratches and softening that come from normal wear are also not faults. If you are unsure whether something is a fault, send us a photograph and we will tell you honestly what we think it is.",
      },
      { type: "h", text: "Your statutory rights" },
      {
        type: "p",
        text: "Nothing in this policy removes, reduces or limits any right you have under Malaysian consumer protection law, including the Consumer Protection Act 1999 and the Consumer Protection (Electronic Trade Transactions) Regulations 2012. Goods supplied must be of acceptable quality, fit for their purpose, and match their description. Where a product is defective, damaged, incorrect or misdescribed, your statutory remedies are available to you regardless of anything written on this page, and this 30-day policy does not replace or shorten them.",
      },
      { type: "h", text: "How this relates to the warranty" },
      {
        type: "p",
        text: "This policy covers the first 30 days after delivery. Our 12-month warranty covers defects in workmanship and hardware that appear after that, and is handled separately.",
      },
    ],
    ms: [
      {
        type: "p",
        text: "Jika pesanan anda tidak seperti sepatutnya, beritahu kami dalam tempoh 30 hari selepas menerimanya. Polisi ini meliputi barang yang tiba dalam keadaan rosak, cacat atau tidak berfungsi, bukan produk yang anda pesan, atau tidak sepadan dengan apa yang diterangkan di laman web ini. Hak berkanun anda di bawah undang-undang pengguna Malaysia terpakai sepenuhnya dan dinyatakan secara berasingan di bawah.",
      },
      {
        type: "callout",
        text: "Ini bukan polisi pemulangan atas sebab bertukar fikiran. Kami tidak menawarkan pemulangan semata-mata kerana pelanggan bertukar fikiran, atau kerana panjang tali pinggang atau saiz kolar dipesan dengan salah. Sila ukur sebelum memesan — panduan saiz kami wujud untuk tujuan itu.",
      },
      { type: "h", text: "Apa yang boleh dipulangkan dalam tempoh 30 hari" },
      {
        type: "list",
        items: [
          "Anda menerima produk yang berbeza daripada yang anda pesan — model, warna, saiz atau kuantiti yang berbeza.",
          "Produk tiba dalam keadaan rosak semasa penghantaran.",
          "Produk cacat atau tidak berfungsi: jahitan yang telah gagal, perkakasan yang tidak berfungsi, atau kecacatan pada bahan.",
          "Produk tidak seperti yang diterangkan — barang tidak sepadan dengan spesifikasi, bahan atau dimensi yang dinyatakan pada halaman produknya.",
        ],
      },
      { type: "h", text: "Had masa" },
      {
        type: "p",
        text: "Anda mempunyai 30 hari kalendar dari tarikh anda menerima pesanan untuk mengemukakan isu ini kepada kami. Tempoh 30 hari bermula pada tarikh penghantaran diterima, bukan pada tarikh pesanan dibuat. Sila kemukakan sebaik sahaja anda perasan sesuatu yang tidak kena — lebih awal kami melihatnya, lebih banyak yang boleh kami lakukan.",
      },
      { type: "h", text: "Apa yang perlu disertakan dalam permohonan pemulangan" },
      {
        type: "list",
        items: [
          "Nombor pesanan anda, dan barang mana yang berkaitan dengan permohonan itu.",
          "Penjelasan yang jelas tentang sebab pemulangan, dengan menyatakan apa yang tidak kena pada produk.",
          "Gambar atau video pendek yang menunjukkan isu itu, cukup jelas untuk kami mengesahkannya.",
          "Butiran produk yang berkaitan — saiz, warna dan varian seperti yang tertera pada pesanan anda.",
        ],
      },
      {
        type: "p",
        text: "Permohonan yang tidak mengenal pasti barang atau kecacatan tidak dapat dinilai, jadi kami mungkin perlu memintanya sebelum meneruskan. Sila sertakan dalam mesej pertama anda jika boleh.",
      },
      { type: "h", text: "Cara pemulangan diluluskan" },
      {
        type: "p",
        text: "Kami menyemak permohonan anda, gambar atau video, dan butiran pesanan, kemudian membalas untuk memberitahu sama ada pemulangan diluluskan. Jika kami memerlukan maklumat tambahan, atau gambar tidak menunjukkan isu dengan jelas, kami akan memintanya. Setelah diluluskan, kami mengeluarkan rujukan pemulangan dan alamat pemulangan. Sila jangan menghantar apa-apa sebelum mendapat pengesahan itu — bungkusan yang tiba tanpa rujukan sukar dipadankan dengan pesanan, dan boleh ditolak.",
      },
      { type: "h", text: "Pemeriksaan semasa tiba" },
      {
        type: "p",
        text: "Apabila barang sampai kepada kami, kami memeriksanya berdasarkan sebab yang dinyatakan. Kami menyemak kecacatan atau ketidakpadanan yang anda terangkan, dan mengesahkan barang itu ialah barang daripada pesanan anda. Kami berusaha menyelesaikan pemeriksaan dan memberitahu keputusannya dengan segera, dan akan menghubungi anda jika ada perkara yang tidak jelas tentang pemeriksaan itu.",
      },
      { type: "h", text: "Bayaran balik" },
      {
        type: "p",
        text: "Setelah barang diperiksa dan pemulangan diluluskan, bayaran balik dibuat ke kaedah pembayaran asal yang digunakan untuk pesanan itu, bagi harga yang anda bayar untuk barang tersebut. Jika pemulangan itu berpunca daripada pihak kami — rosak, cacat, salah atau tidak seperti diterangkan — caj penghantaran asal anda juga dikembalikan. Bank atau penyedia pembayaran anda mungkin mengambil beberapa hari bekerja tambahan untuk memaparkan jumlah itu dalam akaun anda.",
      },
      { type: "h", text: "Penggantian dan pertukaran" },
      {
        type: "p",
        text: "Jika barang tersedia, anda boleh memilih penggantian produk yang sama, atau pertukaran dengan barang yang betul jika yang salah dihantar. Jika penggantian kehabisan stok, kami akan memberitahu anda dan menawarkan sama ada bayaran balik atau pertukaran dengan barang lain yang sama nilai. Jika penggantian atau pertukaran berharga lebih daripada barang asal, kami akan memberitahu anda perbezaannya sebelum meneruskan; jika kurang, perbezaannya dikembalikan.",
      },
      { type: "h", text: "Siapa menanggung kos penghantaran pemulangan" },
      {
        type: "p",
        text: "Jika pemulangan itu disebabkan produk yang salah, rosak, cacat atau tidak seperti yang diterangkan, kami menanggung kos penghantaran pemulangan. Kami akan memberitahu cara menghantarnya setelah pemulangan diluluskan. Jangan gunakan perkhidmatan yang mahal atau atur kurier sendiri sebelum kami mengesahkan kaedahnya, kerana kami mungkin tidak dapat membayar balik kos yang tidak kami persetujui.",
      },
      { type: "h", text: "Ciri semula jadi yang bukan kecacatan" },
      {
        type: "p",
        text: "Kulit ialah bahan semula jadi. Perbezaan pada ira, ton, tanda dan warna antara kepingan, serta patina yang terbentuk dengan penggunaan, ialah ciri kulit asli dan bukan kecacatan. Calar dan pelembutan akibat haus biasa juga bukan kecacatan. Jika anda tidak pasti sama ada sesuatu itu kecacatan, hantarkan gambar kepada kami dan kami akan memberitahu dengan jujur apa pendapat kami.",
      },
      { type: "h", text: "Hak berkanun anda" },
      {
        type: "p",
        text: "Tiada apa-apa dalam polisi ini menghapuskan, mengurangkan atau mengehadkan apa-apa hak anda di bawah undang-undang perlindungan pengguna Malaysia, termasuk Akta Perlindungan Pengguna 1999 dan Peraturan-Peraturan Perlindungan Pengguna (Urus Niaga Perdagangan Elektronik) 2012. Barang yang dibekalkan mesti berkualiti yang boleh diterima, sesuai untuk tujuannya, dan sepadan dengan keterangannya. Jika sesuatu produk cacat, rosak, salah atau tidak seperti diterangkan, remedi berkanun anda tersedia tanpa mengira apa-apa yang tertulis di halaman ini, dan polisi 30 hari ini tidak menggantikan atau memendekkannya.",
      },
      { type: "h", text: "Hubungannya dengan jaminan" },
      {
        type: "p",
        text: "Polisi ini meliputi 30 hari pertama selepas penghantaran. Jaminan 12 bulan kami meliputi kecacatan kerja tangan dan perkakasan yang muncul selepas itu, dan diuruskan secara berasingan.",
      },
    ],
    zh: [
      {
        type: "p",
        text: "如果订单不是你应有的样子，请在收到货品后 30 天内告诉我们。本政策涵盖：到货时已损坏、有瑕疵或无法正常使用、不是你订购的款式，或与本网站描述不符的商品。你在马来西亚消费者法律下的法定权利完全适用，并在下文另行说明。",
      },
      {
        type: "callout",
        text: "这不是「改变主意」的退货政策。我们并不因为顾客改变主意、或因为皮带长度、项圈尺码订错而提供退货。请在订购前量好尺寸——我们提供尺码指南正是为此。",
      },
      { type: "h", text: "30 天内可以退货的情况" },
      {
        type: "list",
        items: [
          "你收到的商品与订购的不同——型号、颜色、尺码或数量不符。",
          "商品在运输途中损坏。",
          "商品有瑕疵或无法正常使用：缝线失效、五金无法运作，或材质存在缺陷。",
          "商品与描述不符——实物与其产品页面所述的规格、材质或尺寸不一致。",
        ],
      },
      { type: "h", text: "期限" },
      {
        type: "p",
        text: "你有自收货当日起 30 个日历日的时间向我们提出。30 天从收货日起算，而不是下单日。请在发现问题时尽快提出——我们越早看到，能做的就越多。",
      },
      { type: "h", text: "退货申请需要包含什么" },
      {
        type: "list",
        items: [
          "你的订单编号，以及申请涉及哪一件或哪几件商品。",
          "清楚说明退货原因，并指出商品具体哪里有问题。",
          "能显示问题的照片或短视频，清晰程度足以让我们核实。",
          "相关商品资料——你订单上显示的尺码、颜色与款式。",
        ],
      },
      {
        type: "p",
        text: "若申请未能指明商品或瑕疵，我们无法评估，因此可能需要先请你补充资料。请尽量在第一条信息里就一并附上。",
      },
      { type: "h", text: "退货如何审核批准" },
      {
        type: "p",
        text: "我们会查看你的申请、照片或视频以及订单资料，然后回复告知是否批准退货。若需要更多资料，或照片未能清楚显示问题，我们会向你索取。批准后，我们会发出退货编号与退货地址。在收到确认之前请勿寄出任何物品——没有编号的包裹很难与订单对应，且可能被拒收。",
      },
      { type: "h", text: "到货检查" },
      {
        type: "p",
        text: "商品送达我们后，我们会依你所述的原因检查，核对瑕疵或不相符之处，并确认该商品确属你的订单。我们会尽快完成检查并告知结果；若检查中有任何不清楚之处，会主动联系你。",
      },
      { type: "h", text: "退款" },
      {
        type: "p",
        text: "商品经检查、退货获批准后，退款会退回该订单原本使用的付款方式，金额为该商品的实付价格。若退货原因是我们的责任——损坏、有瑕疵、寄错或与描述不符——你原先支付的运费也会一并退回。你的银行或支付服务商可能需要额外工作日才在账户中显示该款项。",
      },
      { type: "h", text: "更换与换货" },
      {
        type: "p",
        text: "若有现货，你可选择更换同款商品；若寄错，则可换为正确的商品。若更换商品缺货，我们会告知你，并提供退款或换成同价值的其他商品两种选择。若更换或换货的商品价格高于原商品，我们会在处理前告知差额；若较低，差额会退回。",
      },
      { type: "h", text: "退货运费由谁承担" },
      {
        type: "p",
        text: "若退货原因是商品寄错、损坏、有瑕疵或与描述不符，退货运费由我们承担。退货获批后，我们会告知你寄回的方式。在我们确认方式之前，请勿使用昂贵快递或自行安排物流，因为未获我们同意的费用可能无法报销。",
      },
      { type: "h", text: "不属于瑕疵的自然特性" },
      {
        type: "p",
        text: "皮革是天然材质。每件之间在纹理、色调、印记与颜色上的差异，以及随使用形成的包浆，都是真皮的特征而非瑕疵。日常使用造成的划痕与变软也不属瑕疵。若你不确定某处是否算瑕疵，请拍照发给我们，我们会如实告诉你我们的判断。",
      },
      { type: "h", text: "你的法定权利" },
      {
        type: "p",
        text: "本政策任何内容均不删除、削减或限制你在马来西亚消费者保护法律下的任何权利，包括《1999 年消费者保护法》及《2012 年消费者保护（电子交易）条例》。所供商品必须具有可接受的质量、适合其用途，并与描述相符。若商品有瑕疵、损坏、寄错或与描述不符，无论本页写了什么，你的法定救济均可主张；本 30 天政策不会取代或缩短这些权利。",
      },
      { type: "h", text: "与质保的关系" },
      {
        type: "p",
        text: "本政策涵盖收货后的前 30 天。我们的 12 个月质保涵盖此后出现的手工与五金瑕疵，另行处理。",
      },
    ],
  },
  faqs: {
    en: [
      {
        q: "I ordered a belt in the wrong length. Can I return it?",
        a: "Not under this policy. An incorrectly ordered length is not a fault with the product, so it falls outside the 30-day window for incorrect, damaged, defective or misdescribed items. Please measure before ordering — if you are unsure, message us and we will check the length with you first.",
      },
      {
        q: "The collar is the right size but my dog has outgrown it.",
        a: "That is not a fault, so it is not covered by this policy. Collars have to be measured for the dog in front of you; our sizing guide explains how, and a growing puppy will need a new collar regardless.",
      },
      {
        q: "The wallet arrived with a scratch on the leather.",
        a: "Send us your order number and a photograph of the scratch. If it is damage that was there before delivery, it is covered and we will arrange a replacement or refund.",
      },
      {
        q: "How long do I have after delivery?",
        a: "30 calendar days from the date you receive the order. Please raise the issue as soon as you notice it rather than waiting for the last day, because it is easier for both of us to resolve quickly.",
      },
      {
        q: "Who pays to send the item back?",
        a: "We do, where the return is because of an incorrect, damaged, defective or misdescribed product. We will tell you the method once the return is approved — please do not arrange your own courier before that.",
      },
      {
        q: "What if the replacement is out of stock?",
        a: "We will tell you, and you can choose a refund or an exchange for another item of the same value.",
      },
      {
        q: "Does this policy affect my rights under Malaysian consumer law?",
        a: "No. Nothing here removes, reduces or limits your statutory rights. This policy sits alongside them, and where the law gives you a stronger remedy than this page describes, the law applies.",
      },
    ],
    ms: [
      {
        q: "Saya pesan tali pinggang dengan panjang yang salah. Boleh dipulangkan?",
        a: "Tidak di bawah polisi ini. Panjang yang dipesan dengan salah bukan kecacatan produk, jadi ia di luar tempoh 30 hari untuk barang salah, rosak, cacat atau tidak seperti diterangkan. Sila ukur sebelum memesan — jika tidak pasti, hubungi kami dan kami akan semak panjangnya bersama anda dahulu.",
      },
      {
        q: "Kolar itu saiz yang betul tetapi anjing saya sudah membesar.",
        a: "Itu bukan kecacatan, jadi ia tidak dilindungi polisi ini. Kolar perlu diukur untuk anjing yang ada di hadapan anda; panduan saiz kami menerangkannya, dan anak anjing yang sedang membesar tetap memerlukan kolar baharu.",
      },
      {
        q: "Dompet tiba dengan calar pada kulitnya.",
        a: "Hantarkan nombor pesanan dan gambar calar itu. Jika ia kerosakan yang sudah ada sebelum penghantaran, ia dilindungi dan kami akan mengatur penggantian atau bayaran balik.",
      },
      {
        q: "Berapa lama saya ada selepas penghantaran?",
        a: "30 hari kalendar dari tarikh anda menerima pesanan. Sila kemukakan isu sebaik sahaja anda perasannya dan bukan menunggu hari terakhir, kerana lebih mudah untuk kita berdua menyelesaikannya dengan segera.",
      },
      {
        q: "Siapa menanggung kos menghantar barang kembali?",
        a: "Kami, jika pemulangan itu disebabkan produk yang salah, rosak, cacat atau tidak seperti diterangkan. Kami akan memberitahu kaedahnya setelah pemulangan diluluskan — sila jangan atur kurier sendiri sebelum itu.",
      },
      {
        q: "Bagaimana jika penggantian kehabisan stok?",
        a: "Kami akan memberitahu anda, dan anda boleh memilih bayaran balik atau pertukaran dengan barang lain yang sama nilai.",
      },
      {
        q: "Adakah polisi ini menjejaskan hak saya di bawah undang-undang pengguna Malaysia?",
        a: "Tidak. Tiada apa-apa di sini menghapuskan, mengurangkan atau mengehadkan hak berkanun anda. Polisi ini wujud di sampingnya, dan jika undang-undang memberikan remedi yang lebih kuat daripada yang diterangkan di halaman ini, undang-undang terpakai.",
      },
    ],
    zh: [
      {
        q: "我订的皮带长度不对，可以退货吗？",
        a: "依本政策不可以。订错长度并非商品本身的瑕疵，因此不属于针对寄错、损坏、有瑕疵或与描述不符商品的 30 天范围。请在订购前量好尺寸——若不确定，请联系我们，我们先与你核对长度。",
      },
      {
        q: "项圈尺码是对的，但我的狗长大了。",
        a: "这不属于瑕疵，因此不在本政策范围内。项圈必须按眼前的狗来量；我们的尺码指南说明了方法，而正在成长的幼犬本来就需要换新的项圈。",
      },
      {
        q: "钱包到货时皮革上有划痕。",
        a: "请把订单编号和划痕照片发给我们。若属发货前已存在的损坏，即在保障范围内，我们会安排更换或退款。",
      },
      {
        q: "收货后我有多少时间？",
        a: "自收货当日起 30 个日历日。请在发现问题时立即提出，不要等到最后一天，因为越快处理对双方都更方便。",
      },
      {
        q: "寄回商品的费用由谁承担？",
        a: "若退货原因是商品寄错、损坏、有瑕疵或与描述不符，由我们承担。退货获批后我们会告知寄回方式——在此之前请勿自行安排物流。",
      },
      {
        q: "如果更换的商品缺货怎么办？",
        a: "我们会告知你，你可以选择退款，或换成同价值的其他商品。",
      },
      {
        q: "本政策会影响我在马来西亚消费者法律下的权利吗？",
        a: "不会。本页任何内容都不删除、削减或限制你的法定权利。本政策与法定权利并存；若法律赋予你的救济强于本页所述，则以法律为准。",
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
