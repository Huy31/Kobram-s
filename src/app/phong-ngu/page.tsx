"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ConsultationModal from "@/components/ConsultationModal";
import SafeImage from "@/components/SafeImage";
import HeartButton from "@/components/HeartButton";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { getProductsByCategory } from "@/services/productService";

interface BedroomProduct {
  id: string;
  sku: string;
  title: string;
  price: number;
  originalPrice?: number;
  material: string;
  dimensions: string;
  desc: string;
  tag: string;
  image: string;
  slug?: string;
}

const initialBedroomProducts: BedroomProduct[] = [
  {
    id: "bed-1",
    sku: "KL-BED-ZEN",
    title: "Giường Phản Gỗ Sồi Zen Platform Bed",
    price: 24500000,
    originalPrice: 28000000,
    material: "Gỗ Sồi Trắng • Mộng Kigumi",
    dimensions: "1m8 x 2m (Chuẩn King)",
    desc: "Kết cấu ván phản phẳng liền mạch, lắp ráp hoàn toàn không dùng đinh kim loại, tẩm hương tuyết tùng xoa dịu thần kinh.",
    tag: "BẢO HÀNH MỘNG GỖ 10 NĂM",
    image: "/images/bedroom-2.jpg",
    slug: "zen-platform-bed",
  },
  {
    id: "bed-2",
    sku: "KL-TAT-KYO",
    title: "Chiếu Tatami Nhập Khẩu Nhật Bản",
    price: 5200000,
    originalPrice: 6000000,
    material: "Cỏ Igusa Tự Nhiên • Viền Vải Thô",
    dimensions: "90cm x 180cm (Dày 5.5cm)",
    desc: "Hút ẩm tự nhiên, thanh lọc không khí trong phòng ngủ và tạo độ đàn hồi chuẩn mực cho hệ xương khớp khi ngủ.",
    tag: "NHẬP KHẨU KYOTO",
    image: "/images/bedroom-3.jpg",
    slug: "chieu-tatami-kyoto",
  },
  {
    id: "bed-3",
    sku: "KL-WAR-SHO",
    title: "Hệ Tủ Áo Cửa Lùa Shoji Wardrobe",
    price: 42000000,
    originalPrice: 48000000,
    material: "Khung Sồi • Giấy Washi Gia Cường & Kính",
    dimensions: "D2400 x C2600 mm (Kịch trần)",
    desc: "Cửa trượt êm ái phong cách nhà truyền thống Kyoto, hệ chia ngăn tối ưu theo thói quen gấp nếp tối giản.",
    tag: "MAY ĐO TẬN NƠI",
    image: "/images/bedroom-4.jpg",
    slug: "tu-ao-shoji",
  },
  {
    id: "bed-4",
    sku: "KL-FLT-KAW",
    title: "Tủ Đầu Giường Treo Tường Kawa",
    price: 4800000,
    originalPrice: 5500000,
    material: "Gỗ Sồi Bắc Mỹ • Ngăn Kéo Khớp Mộng",
    dimensions: "D450 x R350 x C180 mm",
    desc: "Thiết kế lơ lửng không chân giúp sàn phòng ngủ thoáng đãng, tích hợp rãnh luồn dây sạc điện thoại ẩn giấu.",
    tag: "TREO TƯỜNG",
    image: "/images/bedroom-5.jpg",
    slug: "tu-dau-giuong-kawa",
  },
  {
    id: "bed-5",
    sku: "KL-VAN-KAN",
    title: "Bàn Trang Điểm & Làm Việc Tĩnh Tâm Kanso",
    price: 15600000,
    originalPrice: 17500000,
    material: "Gỗ Sồi Tự Nhiên • Gương Tròn Không Khung",
    dimensions: "D1100 x R500 x C750 mm",
    desc: "Đa công năng cho góc viết nhật ký buổi sáng và chăm sóc bản thân buổi tối dưới ánh sáng đèn bàn ấm dịu.",
    tag: "TỐI GIẢN",
    image: "/images/bedroom-6.jpg",
    slug: "ban-trang-diem-kanso",
  },
  {
    id: "bed-6",
    sku: "KL-BEN-END",
    title: "Ghế Băng Đuôi Giường Khung Gỗ Đen & Đệm Linen",
    price: 7900000,
    originalPrice: 8900000,
    material: "Gỗ Tần Bì Hun Khói • Đệm Vải Lanh Mộc",
    dimensions: "D1400 x R400 x C420 mm",
    desc: "Điểm dừng chân đặt áo choàng và sách đọc trước khi ngủ, tạo chiều sâu thẩm mỹ phân lớp cho phòng ngủ master.",
    tag: "ĐỆM LINEN MỘC",
    image: "/images/bedroom-7.jpg",
    slug: "ghe-bang-duoi-giuong",
  },
];

const enProductOverrides: Record<string, { title: string; material: string; desc: string; tag: string }> = {
  "bed-1": {
    title: "Zen Platform Oak Bed Frame",
    material: "White Oak • Kigumi Interlocking",
    desc: "Seamless flat platform structure assembled completely without metal nails, infused with cedarwood essence.",
    tag: "10-YEAR JOINERY WARRANTY",
  },
  "bed-2": {
    title: "Imported Kyoto Tatami Mat",
    material: "Natural Igusa Grass • Raw Canvas Border",
    desc: "Natural moisture regulation, purifies bedroom air and provides standard ergonomic elasticity for spine support.",
    tag: "IMPORTED FROM KYOTO",
  },
  "bed-3": {
    title: "Shoji Sliding Wardrobe System",
    material: "Oak Frame • Reinforced Washi & Glass",
    desc: "Smooth sliding doors inspired by traditional Kyoto townhouses, optimized partition layout for minimalist living.",
    tag: "BESPOKE ON-SITE",
  },
  "bed-4": {
    title: "Kawa Floating Bedside Nightstand",
    material: "North American Oak • Dovetail Drawers",
    desc: "Floating legless design keeps the bedroom floor spacious, integrated with concealed phone cable pass-through.",
    tag: "FLOATING WALL-MOUNT",
  },
  "bed-5": {
    title: "Kanso Minimalist Dressing & Writing Table",
    material: "Natural Oak • Frameless Round Mirror",
    desc: "Multi-functional nook for morning journaling and evening self-care under gentle warm lighting.",
    tag: "MINIMALIST",
  },
  "bed-6": {
    title: "Blackened Oak End-of-Bed Bench & Linen Cushion",
    material: "Smoked Ash Wood • Raw Linen Cushion",
    desc: "Resting stop for robes and nighttime reading books, creating subtle aesthetic depth for the master bedroom.",
    tag: "RAW LINEN CUSHION",
  },
};

const bedroomTranslations = {
  VN: {
    heroTag: "Hệ Sinh Thái Giấc Ngủ Thiền Định • Sanctuary Bedroom 2025",
    heroTitle: "Phòng Ngủ — Nơi Trở Về Cùng Năng Lượng Tĩnh Tại Và Giấc Ngủ Sâu",
    heroDesc:
      "Bộ sưu tập giường phản gỗ sồi tự nhiên, chiếu cói Tatami hữu cơ và hệ tủ áo mộng âm. Loại bỏ toàn bộ kim loại và từ trường gây nhiễu loạn sinh học, mang lại sự chữa lành tự nhiên cho giấc ngủ gia chủ.",
    badge1: "0% Đinh ốc kim loại",
    badge2: "Tẩm hương tuyết tùng xoa dịu",
    badge3: "Bảo hành khung giường 10 năm",
    collectionTag: "BỘ SƯU TẬP PHÒNG NGỦ 2025",
    collectionTitle: "Cấu Kiện & Nội Thất Điêu Khắc Tinh Giản",
    showingCount: (n: number) =>
      `Hiển thị ${n} tác phẩm mộc độc bản • Chứng nhận xuất xưởng Komorebi Studio`,
    addToCart: "Thêm vào giỏ",
    currency: "đ",
    philosophyTag: "TRIẾT LÝ GIẤC NGỦ THIÊN NHIÊN",
    philosophyTitle: "Kỹ Thuật Mộng Âm Giảm Nhiễu Từ Trường",
    philosophyDesc:
      "Nhiều nghiên cứu y học giấc ngủ cho thấy các ốc vít kim loại lớn và khung sắt xung quanh giường tạo nên những điểm biến dạng từ trường vi mô, ảnh hưởng tới pha ngủ sâu (Deep Sleep). Khung giường mộc thuần sồi của Komorebi loại bỏ hoàn toàn đinh ốc, đưa không gian nghỉ ngơi về trạng thái tĩnh tại nguyên thủy.",
    consultBtn: "Tư vấn may đo phòng ngủ Master",
  },
  EN: {
    heroTag: "Meditative Sleep Sanctuary • Bedroom Collection 2025",
    heroTitle: "Bedroom — Return to Stillness and Restorative Deep Sleep",
    heroDesc:
      "A collection of natural oak platform beds, organic Tatami mats, and mortise sliding wardrobes. Eliminates all metal fasteners and magnetic interference, promoting holistic healing for the dweller's sleep.",
    badge1: "0% Metal Screws & Nails",
    badge2: "Infused with Soothing Cedar",
    badge3: "10-Year Bed Frame Warranty",
    collectionTag: "BEDROOM COLLECTION 2025",
    collectionTitle: "Sculptural Joinery & Minimalist Furniture",
    showingCount: (n: number) =>
      `Showing ${n} handcrafted pieces • Certified by Komorebi Studio`,
    addToCart: "Add to Bag",
    currency: "VND",
    philosophyTag: "NATURAL SLEEP PHILOSOPHY",
    philosophyTitle: "Non-Metallic Mortise Joinery for Pure Rest",
    philosophyDesc:
      "Sleep medical research indicates that large metal bolts and steel frames warp micro-magnetic fields, disrupting restorative deep sleep cycles. Komorebi's pure oak joinery removes screws entirely, restoring your rest to pristine stillness.",
    consultBtn: "Bespoke Master Bedroom Consultation",
  },
};

export default function BedroomPage() {
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const { lang } = useLanguage();
  const t = bedroomTranslations[lang];
  const [products, setProducts] = useState<BedroomProduct[]>(initialBedroomProducts);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  useEffect(() => {
    getProductsByCategory<BedroomProduct>("cat-bedroom", initialBedroomProducts, (item) => ({
      id: item.id,
      sku: item.sku,
      title: item.title,
      price: item.price,
      originalPrice: item.original_price,
      material: item.material,
      dimensions: item.dimensions || "",
      desc: item.description || "",
      tag: item.tag || "",
      image: item.image,
      slug: item.slug,
    })).then((res) => {
      if (res && res.length > 0) setProducts(res);
    });
  }, []);

  return (
    <>
      <Header onOpenConsultation={() => setIsConsultationOpen(true)} />

      <main className="min-h-screen">
        {/* HERO BANNER SECTION */}
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

                <div className="pt-2 flex flex-wrap gap-4 text-xs uppercase font-label-md text-primary font-bold">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base">bed</span>
                    {t.badge1}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base">spa</span>
                    {t.badge2}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base">verified</span>
                    {t.badge3}
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 relative aspect-[4/3] overflow-hidden border border-outline-variant shadow-md">
                <Image
                  src="/images/bedroom-1.jpg"
                  alt="Không gian phòng ngủ phong cách Wabi-sabi thanh tịnh"
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* PRODUCTS GRID */}
        <section className="max-w-7xl mx-auto px-space-md sm:px-space-lg lg:px-margin py-space-xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-lg pb-4 border-b border-outline-variant/40">
            <div>
              <span className="font-label-sm text-label-sm text-outline uppercase tracking-widest text-xs">
                {t.collectionTag}
              </span>
              <h2 className="font-headline-md text-headline-md text-2xl text-primary font-bold mt-1">
                {t.collectionTitle}
              </h2>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant text-xs sm:text-sm mt-2 md:mt-0">
              {t.showingCount(products.length)}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {products.map((p) => {
              const enOverride = lang === "EN" ? enProductOverrides[p.id] : null;
              const displayTitle = enOverride?.title || p.title;
              const displayMaterial = enOverride?.material || p.material;
              const displayDesc = enOverride?.desc || p.desc;
              const displayTag = enOverride?.tag || p.tag;
              const wishlisted = isWishlisted(p.id);

              return (
                <article
                  key={p.id}
                  className="group border border-outline-variant/60 bg-surface-container-lowest flex flex-col justify-between hover:border-primary transition-all duration-200"
                >
                  <div>
                    <div className="relative w-full aspect-[4/5] bg-surface-container overflow-hidden">
                      <Link href={p.slug ? `/san-pham/${p.slug}` : "/san-pham/kura-lounge-chair"} className="relative block w-full h-full">
                        <SafeImage
                          src={p.image}
                          alt={displayTitle}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </Link>

                      <span className="absolute top-3 left-3 bg-primary text-on-primary font-label-sm text-[10px] px-2.5 py-1 tracking-wider uppercase font-bold">
                        {displayTag}
                      </span>

                      <HeartButton
                        isLiked={wishlisted}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleWishlist(p.id);
                        }}
                        className="absolute top-3 right-3 z-20"
                        size="sm"
                        ariaLabel={`Yêu thích ${p.title}`}
                      />
                    </div>

                    <div className="p-space-md space-y-2">
                      <div className="flex items-center justify-between text-outline font-label-sm text-xs uppercase">
                        <span>{displayMaterial}</span>
                        <span>{p.dimensions}</span>
                      </div>
                      <Link
                        href={p.slug ? `/san-pham/${p.slug}` : "/san-pham/kura-lounge-chair"}
                        className="font-headline-sm text-lg text-primary font-bold group-hover:underline block"
                      >
                        {displayTitle}
                      </Link>
                      <p className="text-body-sm text-on-surface-variant text-xs line-clamp-2 leading-relaxed">
                        {displayDesc}
                      </p>
                    </div>
                  </div>

                  <div className="p-space-md pt-0 border-t border-outline-variant/30 mt-4 flex items-center justify-between">
                    <div>
                      <span className="font-headline-sm text-lg text-primary font-bold block">
                        {p.price.toLocaleString(lang === "EN" ? "en-US" : "vi-VN")} {t.currency}
                      </span>
                      {p.originalPrice && (
                        <span className="text-xs text-outline line-through">
                          {p.originalPrice.toLocaleString(lang === "EN" ? "en-US" : "vi-VN")} {t.currency}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        addToCart({
                          id: p.id,
                          sku: p.sku,
                          title: displayTitle,
                          subtitle: displayMaterial,
                          price: p.price,
                          originalPrice: p.originalPrice,
                          image: p.image,
                          quantity: 1,
                          options: {
                            wood: displayMaterial,
                            size: p.dimensions,
                          },
                        })
                      }
                      className="px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-on-primary text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-1.5 dark:border-white/20 dark:text-white dark:hover:bg-white dark:hover:border-white dark:hover:text-[#09090b]"
                    >
                      <span className="material-symbols-outlined text-sm">shopping_bag</span>
                      {t.addToCart}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ARTISANAL SLEEP ENVIRONMENT FEATURE SECTION */}
        <section className="bg-surface-container-low border-t border-outline-variant/40 py-space-2xl">
          <div className="max-w-7xl mx-auto px-space-md sm:px-space-lg lg:px-margin grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 relative aspect-square overflow-hidden border border-outline-variant">
              <Image
                src="/images/bedroom-8.jpg"
                alt="Chi tiết khớp mộng giường ngủ mộc bản không kim loại"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>

            <div className="lg:col-span-7 space-y-4">
              <span className="text-label-sm font-label-sm text-outline uppercase tracking-widest text-xs block">
                {t.philosophyTag}
              </span>
              <h2 className="text-headline-md font-headline-md text-2xl sm:text-3xl text-primary font-bold">
                {t.philosophyTitle}
              </h2>
              <p className="text-body-md text-on-surface-variant text-sm sm:text-base leading-relaxed">
                {t.philosophyDesc}
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsConsultationOpen(true)}
                  className="px-6 py-3 bg-primary text-on-primary text-label-md font-label-md uppercase tracking-wider hover:bg-[#27272a] transition-colors"
                >
                  {t.consultBtn}
                </button>
              </div>
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
