"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ConsultationModal from "@/components/ConsultationModal";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { getProductsByCategory } from "@/services/productService";

const collectionTranslations = {
  VN: {
    heroTag: "Komorebi Living • Limited Archive & Seasonal",
    heroTitle: "Bộ Sưu Tập Đặc Biệt & Di Sản Giới Hạn",
    heroDesc:
      "Nơi hội tụ những tạo tác nội thất phiên bản đánh số giới hạn, kết tinh từ phôi gỗ cổ thụ quý hiếm, kỹ thuật mộng mộc truyền đời và những sự kết hợp độc bản cùng nghệ nhân gốm sứ - dệt tay thủ công Nhật Bản.",
    exploreKyotoBtn: "Khám phá BST Kyoto Archive",
    registerSerialBtn: "Đăng ký giữ số serial",
    archiveBadge: "Di Sản Giới Hạn",
    releasedCount: "Đã phát hành 32/50 bộ",
    archiveTitle: "BST Kyoto Atelier Archive (Giới Hạn 50 Bộ Đánh Số)",
    archiveDesc:
      "Kỹ thuật ghép mộng mộc truyền thống không dùng đinh ốc (Kigumi) kết hợp phôi gỗ óc chó 80 năm tuổi tuyển chọn khắt khe.",
    kigumiTech: "Kỹ thuật Kigumi",
    numbered: "Đánh số riêng",
    card1Title: "Bàn Ghép Mộng Tam Diện Kyoto",
    card1Desc:
      "Gỗ óc chó đen Bắc Mỹ 80 năm tuổi, mộng xuyên thấu thủ công không dùng một hạt đinh kim loại.",
    card2Title: "Ghế Bành Tĩnh Tọa Gion #24",
    card2Desc:
      "Đan dây cói Washi thủ công nhuộm than tre hữu cơ, tựa lưng vát 15 độ cân bằng giải phẫu học.",
    inspectBtn: "Đăng ký thẩm định",
    manifestoTag: "Tuyên Ngôn Xưởng Kyoto",
    manifestoTitle: "Chứng Chỉ Mộc Bản Khắc Chìm",
    manifestoQuote:
      "“Mỗi khúc gỗ là một sinh mệnh tròn trăm năm. Chúng tôi không cưỡng ép hình thù mà lắng nghe đường thở của từng thớ vân để định hình nên các khớp nối vĩnh cửu.”",
    manifestoAuthor:
      "— Nghệ nhân Kenzo Murata, Đệ tử đời thứ tư xưởng mộc Arashiyama.",
    verifyLabel: "Chứng thực:",
    verifyVal: "Dấu Triện Đồng Khắc Laze & Số Serial",
    reserveNextBtn: "Đăng ký giữ suất bộ số tiếp theo",
    fscTag: "Tiêu Chuẩn Rừng Bền Vững Toàn Cầu",
    fscTitle: "BST Nội Thất Xanh Chứng Chỉ FSC® 100%",
    fscDesc:
      "Khai thác gỗ có trách nhiệm là cốt lõi trong đạo đức nghề mộc Komorebi. Mỗi sản phẩm trong bộ sưu tập này đều minh bạch chuỗi hành trình gỗ (Chain of Custody) từ những cánh rừng tái sinh được chứng nhận FSC tại Thụy Điển và Bắc Mỹ.",
    fscCertLabel: "Mã chứng chỉ: FSC-C149811 (Chain of Custody Standard)",
    fscKilnLabel: "Tiêu chuẩn sấy: Sấy lò nhiệt chân không đạt độ ẩm lý tưởng 8 - 11%",
    fscItem1Title: "Ghế Ăn Tái Sinh Eco Oak",
    fscItem1Sub: "Sồi tái sinh FSC® 100%",
    fscItem2Title: "Tủ Rương Teak Trồng Rừng",
    fscItem2Sub: "Teak rừng trồng bền vững",
    teaLightTag: "NGHỆ THUẬT BÀN TRÀ & ÁNH SÁNG",
    teaLightTitle: "Phụ Kiện Gốm Shigaraki & Ánh Sáng Thiền Wabi-Sabi",
    teaLightSub: "Chế tác thủ công từ các làng gốm nghìn năm Nhật Bản",
    addToCart: "Thêm vào giỏ",
    currency: "đ",
  },
  EN: {
    heroTag: "Komorebi Living • Limited Archive & Seasonal",
    heroTitle: "Limited Archive & Masterpiece Collections",
    heroDesc:
      "A confluence of numbered limited-edition furniture creations, born from rare heritage timber, timeless Japanese joinery, and artisanal collaborations with master ceramicists and weavers.",
    exploreKyotoBtn: "Explore Kyoto Archive",
    registerSerialBtn: "Reserve Numbered Serial",
    archiveBadge: "Limited Heritage",
    releasedCount: "32/50 Sets Released",
    archiveTitle: "Kyoto Atelier Archive (Numbered Limited to 50 Sets)",
    archiveDesc:
      "Traditional nail-free Japanese interlocking joinery (Kigumi) paired with rigorously curated 80-year-old black walnut.",
    kigumiTech: "Kigumi Technique",
    numbered: "Numbered Edition",
    card1Title: "Kyoto Tri-Facet Interlocking Table",
    card1Desc:
      "80-year-old North American black walnut, through-tenon jointed entirely without a single metal fastener.",
    card2Title: "Gion Meditative Lounge Chair #24",
    card2Desc:
      "Hand-twisted organic bamboo charcoal Washi cord, 15-degree anatomical reclined backrest.",
    inspectBtn: "Request Appraisal",
    manifestoTag: "Kyoto Atelier Manifesto",
    manifestoTitle: "Engraved Woodcraft Certificate",
    manifestoQuote:
      "“Every timber log has lived for a hundred years. We never force shapes upon it, but listen to the breath of its woodgrain to sculpt eternal interlocking joints.”",
    manifestoAuthor:
      "— Master Artisan Kenzo Murata, 4th-generation apprentice of Arashiyama Atelier.",
    verifyLabel: "Authentication:",
    verifyVal: "Laser-Engraved Bronze Seal & Serial No.",
    reserveNextBtn: "Reserve Next Edition Slot",
    fscTag: "Global Sustainable Forestry Standard",
    fscTitle: "FSC® 100% Certified Eco Woodwork",
    fscDesc:
      "Responsible timber harvesting is at the heart of Komorebi's woodcraft ethics. Every piece maintains a transparent Chain of Custody from certified regenerative forests in Sweden and North America.",
    fscCertLabel: "Certificate Code: FSC-C149811 (Chain of Custody Standard)",
    fscKilnLabel: "Kiln Standard: Vacuum thermal drying to optimal 8 - 11% moisture",
    fscItem1Title: "Eco Oak Regenerative Dining Chair",
    fscItem1Sub: "100% FSC® Regenerative Oak",
    fscItem2Title: "Plantation Teak Storage Chest",
    fscItem2Sub: "Sustainable Plantation Teak",
    teaLightTag: "ART OF TEA TABLE & ILLUMINATION",
    teaLightTitle: "Shigaraki Ceramics & Meditative Wabi-Sabi Lighting",
    teaLightSub: "Handcrafted from thousand-year-old Japanese ceramic villages",
    addToCart: "Add to Bag",
    currency: "VND",
  },
};

const enAccOverrides: Record<string, { title: string; material: string }> = {
  "cur-acc-1": {
    title: "Organic Shigaraki Ceramic Table Lamp",
    material: "7-day wood-fired mountain clay • Handmade Washi paper shade",
  },
  "cur-acc-2": {
    title: "Unglazed Bizen Pottery Vase",
    material: "Natural ash flash glaze from Shigaraki red pine kiln",
  },
  "cur-acc-3": {
    title: "Mino Washi Paper Pendant Light",
    material: "UNESCO heritage mulberry paper • Bamboo framework",
  },
  "cur-acc-4": {
    title: "Smoked Ebony Incense Burner Tray",
    material: "Thermally aged ebony wood • Raw brass inlay tray",
  },
};

export default function CuratedCollectionsPage() {
  const { addToCart } = useCart();
  const { lang } = useLanguage();
  const t = collectionTranslations[lang];
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  const curatedAccessories = [
    {
      id: "cur-acc-1",
      sku: "KL-ACC-SHI",
      title: "Đèn Bàn Gốm Shigaraki Hữu Cơ",
      price: 6200000,
      material: "Đất sét núi nung củi 7 ngày • Chụp giấy dó Washi",
      image: "/images/curated-6.jpg",
    },
    {
      id: "cur-acc-2",
      sku: "KL-ACC-BIZ",
      title: "Bình Hoa Gốm Bizen Không Tráng Men",
      price: 3800000,
      material: "Hỏa biến tự nhiên từ tro gỗ thông đỏ Shigaraki",
      image: "/images/curated-7.jpg",
    },
    {
      id: "cur-acc-3",
      sku: "KL-ACC-MIN",
      title: "Đèn Thả Giấy Dó Mino Washi",
      price: 4500000,
      material: "Giấy dó thủ công di sản UNESCO • Khung nan tre",
      image: "/images/curated-8.jpg",
    },
    {
      id: "cur-acc-4",
      sku: "KL-ACC-INC",
      title: "Khay Đốt Trầm Gỗ Mun Than Khói",
      price: 1800000,
      material: "Gỗ Mun sấy nhiệt • Khay lót đồng thau mộc",
      image: "/images/curated-9.jpg",
    },
  ];

  const [accessories, setAccessories] = useState(curatedAccessories);

  useEffect(() => {
    getProductsByCategory("cat-collection", curatedAccessories, (item) => ({
      id: item.id,
      sku: item.sku,
      title: item.title,
      price: item.price,
      material: item.material,
      image: item.image,
    })).then((res) => {
      if (res && res.length > 0) setAccessories(res);
    });
  }, []);

  return (
    <>
      <Header onOpenConsultation={() => setIsConsultationOpen(true)} />

      <main className="min-h-screen">
        {/* HERO SECTION */}
        <section className="border-b border-outline-variant/40 bg-surface-container-lowest">
          <div className="max-w-7xl mx-auto px-space-md sm:px-space-lg lg:px-margin py-space-xl lg:py-space-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-7 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-block w-8 h-[1px] bg-primary"></span>
                  <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest text-xs">
                    {t.heroTag}
                  </span>
                </div>
                <h1 className="font-headline-lg text-2xl sm:text-4xl lg:text-5xl leading-tight text-primary uppercase font-bold tracking-tight mb-space-md">
                  {t.heroTitle}
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-space-lg leading-relaxed text-sm sm:text-base">
                  {t.heroDesc}
                </p>

                <div className="pt-2 flex flex-wrap gap-3">
                  <a
                    href="#kyoto-archive"
                    className="px-6 py-3 bg-primary text-on-primary text-label-md font-label-md uppercase tracking-wider hover:bg-[#27272a] transition-colors"
                  >
                    {t.exploreKyotoBtn}
                  </a>
                  <button
                    type="button"
                    onClick={() => setIsConsultationOpen(true)}
                    className="px-6 py-3 border border-primary text-primary text-label-md font-label-md uppercase tracking-wider hover:bg-surface-container transition-colors"
                  >
                    {t.registerSerialBtn}
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 relative aspect-[4/3] overflow-hidden border border-outline-variant shadow-md">
                <Image
                  src="/images/curated-1.jpg"
                  alt="Bộ sưu tập độc bản Komorebi Living Atelier"
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: BST KYOTO ATELIER ARCHIVE (BENTO 3 COLUMNS) */}
        <section id="kyoto-archive" className="max-w-7xl mx-auto px-space-md sm:px-space-lg lg:px-margin py-space-xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-lg pb-4 border-b border-outline-variant/40">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-label-sm text-label-sm bg-primary text-on-primary px-2.5 py-1 tracking-widest uppercase text-xs font-bold">
                  {t.archiveBadge}
                </span>
                <span className="font-label-sm text-label-sm text-secondary text-xs">
                  {t.releasedCount}
                </span>
              </div>
              <h2 className="font-headline-md text-headline-md text-2xl sm:text-3xl font-bold text-primary uppercase tracking-tight">
                {t.archiveTitle}
              </h2>
            </div>
            <p className="font-body-md text-body-md text-secondary max-w-md mt-2 md:mt-0 text-xs sm:text-sm">
              {t.archiveDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento Card 1 */}
            <div className="border border-outline-variant bg-surface-container-lowest p-6 flex flex-col justify-between hover:border-primary transition-colors">
              <div>
                <div className="aspect-square bg-surface-container mb-space-md overflow-hidden relative">
                  <Image
                    src="/images/curated-2.jpg"
                    alt="Khớp mộng Kigumi thủ công bàn tam diện Kyoto"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-white/95 border border-primary px-2 py-0.5 text-xs font-bold uppercase">
                    {t.kigumiTech}
                  </span>
                </div>
                <h3 className="font-headline-sm text-lg text-primary font-bold mb-1">
                  {t.card1Title}
                </h3>
                <p className="text-body-sm text-secondary text-xs mb-4 leading-relaxed">
                  {t.card1Desc}
                </p>
              </div>
              <div className="pt-4 border-t border-outline-variant/40 flex items-center justify-between">
                <span className="font-label-md text-primary font-bold text-xs">#09 / 50</span>
                <button
                  type="button"
                  onClick={() => setIsConsultationOpen(true)}
                  className="font-label-sm text-xs uppercase tracking-wider text-primary underline underline-offset-4 hover:text-secondary"
                >
                  {t.inspectBtn}
                </button>
              </div>
            </div>

            {/* Bento Card 2 */}
            <div className="border border-outline-variant bg-surface-container-lowest p-6 flex flex-col justify-between hover:border-primary transition-colors">
              <div>
                <div className="aspect-square bg-surface-container mb-space-md overflow-hidden relative">
                  <Image
                    src="/images/curated-3.jpg"
                    alt="Ghế bành tĩnh tọa Gion đánh số riêng"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-white/95 border border-primary px-2 py-0.5 text-xs font-bold uppercase">
                    {t.numbered}
                  </span>
                </div>
                <h3 className="font-headline-sm text-lg text-primary font-bold mb-1">
                  {t.card2Title}
                </h3>
                <p className="text-body-sm text-secondary text-xs mb-4 leading-relaxed">
                  {t.card2Desc}
                </p>
              </div>
              <div className="pt-4 border-t border-outline-variant/40 flex items-center justify-between">
                <span className="font-label-md text-primary font-bold text-xs">#24 / 50</span>
                <button
                  type="button"
                  onClick={() => setIsConsultationOpen(true)}
                  className="font-label-sm text-xs uppercase tracking-wider text-primary underline underline-offset-4 hover:text-secondary"
                >
                  {t.inspectBtn}
                </button>
              </div>
            </div>

            {/* Bento Card 3: Craftsman Manifesto */}
            <div className="border border-outline-variant bg-surface-container-low p-6 flex flex-col justify-between">
              <div>
                <div className="mb-4 pb-3 border-b border-outline-variant/60">
                  <span className="font-label-sm text-xs uppercase text-secondary tracking-widest block">
                    {t.manifestoTag}
                  </span>
                  <h4 className="font-headline-sm text-lg text-primary font-bold mt-1">
                    {t.manifestoTitle}
                  </h4>
                </div>
                <blockquote className="text-body-md italic text-on-surface-variant mb-4 leading-relaxed text-xs sm:text-sm">
                  {t.manifestoQuote}
                </blockquote>
                <p className="text-xs text-primary font-medium">
                  {t.manifestoAuthor}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-outline-variant/40">
                <div className="bg-surface-container-lowest p-2.5 border border-outline-variant/40 mb-3 flex items-center justify-between text-xs">
                  <span className="uppercase text-secondary">{t.verifyLabel}</span>
                  <span className="font-bold text-primary">{t.verifyVal}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsConsultationOpen(true)}
                  className="w-full bg-primary text-on-primary py-3 font-label-md text-xs uppercase tracking-wider hover:bg-[#27272a] transition-colors"
                >
                  {t.reserveNextBtn}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: BST NỘI THẤT XANH CHỨNG CHỈ FSC 100% */}
        <section className="max-w-7xl mx-auto px-space-md sm:px-space-lg lg:px-margin py-space-xl border-t border-outline-variant/30">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-xl text-primary">forest</span>
                <span className="font-label-sm text-xs uppercase tracking-widest text-primary font-bold">
                  {t.fscTag}
                </span>
              </div>
              <h2 className="font-headline-md text-2xl sm:text-3xl font-bold text-primary uppercase tracking-tight">
                {t.fscTitle}
              </h2>
              <p className="text-body-md text-on-surface-variant text-xs sm:text-sm leading-relaxed">
                {t.fscDesc}
              </p>
              <div className="p-3 bg-surface-container-low border border-outline-variant text-xs space-y-1">
                <p>{t.fscCertLabel}</p>
                <p>{t.fscKilnLabel}</p>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-outline-variant bg-surface-container-lowest overflow-hidden group">
                <div className="relative aspect-[4/3]">
                  <Image
                    src="/images/curated-4.jpg"
                    alt={t.fscItem1Title}
                    fill
                    sizes="(max-width: 768px) 100vw, 30vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-headline-sm text-base font-bold text-primary">{t.fscItem1Title}</h4>
                  <span className="text-xs text-outline block mt-0.5">{t.fscItem1Sub}</span>
                  <span className="text-sm font-bold text-primary block mt-2">
                    {(7500000).toLocaleString(lang === "EN" ? "en-US" : "vi-VN")} {t.currency}
                  </span>
                </div>
              </div>

              <div className="border border-outline-variant bg-surface-container-lowest overflow-hidden group">
                <div className="relative aspect-[4/3]">
                  <Image
                    src="/images/curated-5.jpg"
                    alt={t.fscItem2Title}
                    fill
                    sizes="(max-width: 768px) 100vw, 30vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-headline-sm text-base font-bold text-primary">{t.fscItem2Title}</h4>
                  <span className="text-xs text-outline block mt-0.5">{t.fscItem2Sub}</span>
                  <span className="text-sm font-bold text-primary block mt-2">
                    {(22800000).toLocaleString(lang === "EN" ? "en-US" : "vi-VN")} {t.currency}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: PHỤ KIỆN GỐM & ÁNH SÁNG THIỀN WABI-SABI */}
        <section className="bg-surface-container-lowest border-t border-outline-variant/40 py-space-xl">
          <div className="max-w-7xl mx-auto px-space-md sm:px-space-lg lg:px-margin">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-3 border-b border-outline-variant/40">
              <div>
                <span className="text-label-sm font-label-sm text-outline uppercase tracking-widest text-xs block">
                  {t.teaLightTag}
                </span>
                <h2 className="text-headline-md font-headline-md text-2xl font-bold text-primary">
                  {t.teaLightTitle}
                </h2>
              </div>
              <span className="text-xs text-outline">{t.teaLightSub}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {accessories.map((acc) => {
                const enOverride = lang === "EN" ? enAccOverrides[acc.id] : null;
                const displayTitle = enOverride?.title || acc.title;
                const displayMaterial = enOverride?.material || acc.material;

                return (
                  <div
                    key={acc.id}
                    className="border border-outline-variant bg-surface-container-lowest flex flex-col justify-between group hover:border-primary transition-colors"
                  >
                    <div>
                      <div className="relative aspect-square overflow-hidden bg-surface-container">
                        <Image
                          src={acc.image}
                          alt={displayTitle}
                          fill
                          sizes="(max-width: 640px) 100vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4 space-y-1">
                        <h4 className="font-headline-sm text-base text-primary font-bold">{displayTitle}</h4>
                        <p className="text-xs text-on-surface-variant">{displayMaterial}</p>
                      </div>
                    </div>
                    <div className="p-4 pt-0 border-t border-outline-variant/20 mt-3 flex items-center justify-between">
                      <span className="font-bold text-primary text-sm">
                        {acc.price.toLocaleString(lang === "EN" ? "en-US" : "vi-VN")} {t.currency}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          addToCart({
                            id: acc.id,
                            sku: acc.sku,
                            title: displayTitle,
                            subtitle: displayMaterial,
                            price: acc.price,
                            image: acc.image,
                            quantity: 1,
                          })
                        }
                        className="px-3 py-1.5 border border-primary text-primary hover:bg-primary hover:text-on-primary text-xs uppercase font-semibold transition-colors"
                      >
                        {t.addToCart}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />
    </>
  );
}
