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

interface LivingProduct {
  id: string;
  sku: string;
  title: string;
  category: string;
  price: number;
  originalPrice?: number;
  material: string;
  dimensions: string;
  desc: string;
  tag: string;
  image: string;
  slug?: string;
}

const initialLivingProducts: LivingProduct[] = [
  {
    id: "living-1",
    sku: "KL-SOF-NAM",
    title: "Sofa Ba Chỗ Gỗ Sồi Nami",
    category: "sofa",
    price: 28500000,
    originalPrice: 32000000,
    material: "Gỗ Sồi Trắng Bắc Mỹ • Vải Lanh Mộc",
    dimensions: "D2200 x R880 x C720 mm",
    desc: "Đệm mút đàn hồi cao bọc sợi tự nhiên 100%, khung gỗ sồi gia công liên kết mộng âm dương không đinh ốc.",
    tag: "BÁN CHẠY NHẤT",
    image: "/images/living-1.jpg",
    slug: "sofa-go-soi-nami",
  },
  {
    id: "living-2",
    sku: "KL-TAB-ENS",
    title: "Bàn Trà Tròn Enso",
    category: "table",
    price: 12200000,
    originalPrice: 14000000,
    material: "Gỗ Tần Bì Hun Khói • Dáng Tròn Wabi",
    dimensions: "D900 x C350 mm",
    desc: "Mặt bàn tròn bo viền vát cạnh mềm mại, chân đế ba điểm vững chãi mang đậm dấu ấn thiền định tối giản.",
    tag: "GỖ NGUYÊN KHỐI",
    image: "/images/living-2.jpg",
    slug: "ban-tra-tron-enso",
  },
  {
    id: "living-3",
    sku: "KL-LOU-01",
    title: "Ghế Bành Thư Giãn Kura",
    category: "sofa",
    price: 14800000,
    originalPrice: 16500000,
    material: "Gỗ Óc Chó Walnut • Da Bò Thuộc Thảo Mộc",
    dimensions: "D840 x R760 x C780 mm",
    desc: "Độ nghiêng 105 độ công thái học nâng đỡ đốt sống lưng, khung gỗ óc chó đánh sáp thực vật tự nhiên.",
    tag: "THIẾT KẾ ĐỘC BẢN",
    image: "/images/living-3.jpg",
    slug: "kura-lounge-chair",
  },
  {
    id: "living-4",
    sku: "KL-CAB-KAW",
    title: "Kệ Tivi Treo Tường Kawa",
    category: "storage",
    price: 19400000,
    originalPrice: 22000000,
    material: "Gỗ Sồi Tự Nhiên • Ngăn Kéo Khớp Mộng",
    dimensions: "D2000 x R400 x C320 mm",
    desc: "Hệ ray âm giảm chấn Hafele, mặt cánh lật kết hợp lam gỗ tạo khe thông gió giải nhiệt cho thiết bị âm thanh.",
    tag: "TREO TƯỜNG",
    image: "/images/living-4.jpg",
    slug: "ke-tivi-kawa",
  },
  {
    id: "living-5",
    sku: "KL-POU-TAT",
    title: "Đệm Ngồi Thiền & Đọc Sách Tatami Pouf",
    category: "sofa",
    price: 3600000,
    originalPrice: 4200000,
    material: "Vải Thô Dệt Tay • Ruột Bông Gòn Hữu Cơ",
    dimensions: "D600 x R600 x C250 mm",
    desc: "Tạo góc tĩnh tọa bên cửa sổ hoặc bàn trà thấp, bề mặt dệt thô mộc xơ lanh kháng khuẩn tự nhiên.",
    tag: "THỦ CÔNG",
    image: "/images/living-5.jpg",
    slug: "tatami-reading-pouf",
  },
  {
    id: "living-6",
    sku: "KL-SHE-SOR",
    title: "Tủ Kệ Sách Kiến Trúc Sora",
    category: "storage",
    price: 34000000,
    originalPrice: 38000000,
    material: "Gỗ Sồi Trắng Bắc Mỹ • Khung Rỗng Thoáng",
    dimensions: "D1600 x R380 x C2100 mm",
    desc: "Phân chia không gian ước lệ bằng nhịp điệu hình học không có hậu tủ, cho phép ánh sáng xuyên qua tự nhiên.",
    tag: "KẾT CẤU KIGUMI",
    image: "/images/living-6.jpg",
    slug: "tu-ke-sach-sora",
  },
  {
    id: "living-7",
    sku: "KL-SOF-GOC",
    title: "Sofa Góc Chữ L Nỉ Cao Cấp",
    category: "sofa",
    price: 35800000,
    originalPrice: 39500000,
    material: "Gỗ Sồi Tự Nhiên • Vải Nỉ Cao Cấp",
    dimensions: "D2800 x R1600 x C820 mm",
    desc: "Cấu trúc chữ L ôm trọn không gian phòng khách, đệm mút đàn hồi cao chống xẹp lún kết hợp vải nỉ dệt cao cấp êm ái.",
    tag: "MẪU MỚI",
    image: "/images/bo-sofa-ni-goc-hinh-chu-l-cho-phong-khach-cao-cap.jpg",
    slug: "sofa-goc-ni-chu-l-cao-cap",
  },
];

export default function LivingRoomPage() {
  const { lang, t } = useLanguage();
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const [products, setProducts] = useState<LivingProduct[]>(initialLivingProducts);
  const [selectedSubcat, setSelectedSubcat] = useState("all");
  const [selectedMaterial, setSelectedMaterial] = useState("all");
  const [selectedLayout, setSelectedLayout] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  useEffect(() => {
    getProductsByCategory<LivingProduct>("cat-living", initialLivingProducts, (item) => ({
      id: item.id,
      sku: item.sku,
      title: item.title,
      category: item.sku.includes("SOF") || item.sku.includes("LOU") || item.sku.includes("POU") ? "sofa" : item.sku.includes("TAB") ? "table" : "storage",
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

  const filteredProducts = products
    .filter((item) => {
      if (selectedSubcat !== "all" && item.category !== selectedSubcat) return false;
      if (selectedMaterial !== "all") {
        if (!item.material.toLowerCase().includes(selectedMaterial.toLowerCase())) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return 0;
    });

  return (
    <>
      <Header onOpenConsultation={() => setIsConsultationOpen(true)} />

      <main className="flex-grow">
        {/* HERO BANNER SECTION */}
        <section className="border-b border-outline-variant/40 bg-surface-container-lowest">
          <div className="max-w-7xl mx-auto px-space-md sm:px-space-lg lg:px-margin py-space-xl lg:py-space-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-end">
              <div className="lg:col-span-8">
                <div className="flex items-center gap-2 mb-space-sm text-secondary font-label-sm text-label-sm uppercase tracking-widest text-xs">
                  <span>{lang === "VN" ? "Kiến trúc & Tĩnh tại" : "Architecture & Stillness"}</span>
                  <span className="w-8 h-[1px] bg-outline-variant"></span>
                  <span>Japandi Curation 2025</span>
                </div>
                <h1 className="font-display-hero text-2xl sm:text-4xl lg:text-5xl text-primary tracking-tight font-bold mb-space-md uppercase">
                  {lang === "VN"
                    ? "Không Gian Phòng Khách — Nơi Chạm Vào Sự Tĩnh Lặng"
                    : "Living Room Spaces — Where Serenity Resides"}
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl font-light text-sm sm:text-base leading-relaxed">
                  {lang === "VN"
                    ? "Tuyển tập các tác phẩm nội thất mộc bản cho gian khách đương đại. Chế tác độc bản từ gỗ sồi Bắc Mỹ chuẩn FAS và đệm vải lanh linen tự nhiên, đón ánh sáng tĩnh tại của thời gian qua từng chi tiết ghép mộng không đinh."
                    : "Curated solid wood furniture for contemporary living rooms. Handcrafted from FAS North American white oak and natural linen, embracing serene light through nail-free joinery."}
                </p>
              </div>

              <div className="lg:col-span-4 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-outline-variant/40 pt-space-md lg:pt-0 lg:pl-space-lg">
                <div className="space-y-1 mb-space-md text-xs sm:text-sm">
                  <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary block">
                    {lang === "VN" ? "Quy chuẩn xưởng mộc" : "Atelier Standards"}
                  </span>
                  <p className="font-body-sm text-body-sm text-on-surface">
                    {lang === "VN"
                      ? "Khớp mộng Kigumi truyền thống · Sơn gốc nước an toàn EU tiêu chuẩn E0 · Bảo hành mộng gỗ 10 năm."
                      : "Traditional Kigumi joinery · EU standard non-toxic water-based finish · 10-year joint warranty."}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-primary font-label-md text-label-md uppercase tracking-wider text-xs font-bold">
                  <span>
                    {products.length} {lang === "VN" ? "Thiết kế cốt lõi" : "Core Designs"}
                  </span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </div>
              </div>
            </div>

            {/* Subcategory Filter Chips */}
            <div className="mt-space-xl pt-space-lg border-t border-outline-variant/30 flex items-center gap-2 overflow-x-auto pb-2">
              {[
                {
                  id: "all",
                  label:
                    lang === "VN"
                      ? `Tất cả (${products.length < 10 ? `0${products.length}` : products.length})`
                      : `All (${products.length < 10 ? `0${products.length}` : products.length})`,
                },
                {
                  id: "sofa",
                  label: lang === "VN" ? "Sofa & Ghế bành thư giãn" : "Sofas & Lounge Chairs",
                },
                {
                  id: "table",
                  label: lang === "VN" ? "Bàn trà & Bàn góc" : "Coffee & Side Tables",
                },
                {
                  id: "storage",
                  label: lang === "VN" ? "Kệ tivi & Tủ trang trí" : "Media Consoles & Cabinets",
                },
              ].map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => setSelectedSubcat(chip.id)}
                  className={`font-label-sm text-label-sm uppercase px-4 py-2 whitespace-nowrap text-xs transition-colors ${selectedSubcat === chip.id
                    ? "bg-primary text-on-primary font-bold"
                    : "border border-outline-variant/60 bg-surface-container-lowest hover:border-primary text-on-surface"
                    }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* STICKY FILTER & SORT BAR */}
        <section className="border-b border-outline-variant/40 bg-surface sticky top-20 z-30">
          <div className="max-w-7xl mx-auto px-space-md sm:px-space-lg lg:px-margin py-3 flex flex-wrap items-center justify-between gap-space-md text-xs sm:text-sm">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 text-secondary">
                <span className="material-symbols-outlined text-base">tune</span>
                <span className="font-label-sm uppercase tracking-wider font-semibold">
                  {lang === "VN" ? "Bộ lọc:" : "Filters:"}
                </span>
              </div>

              {/* Material filter */}
              <select
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
                className="bg-surface-container-lowest border border-outline-variant/60 text-on-surface text-label-sm uppercase py-1.5 px-3 focus:outline-none focus:border-primary text-xs"
              >
                <option value="all">{lang === "VN" ? "Chất liệu: Tất cả" : "Material: All"}</option>
                <option value="sồi">{lang === "VN" ? "Gỗ Sồi Trắng FAS" : "White Oak FAS"}</option>
                <option value="óc chó">{lang === "VN" ? "Gỗ Óc Chó Walnut" : "American Walnut"}</option>
                <option value="da">{lang === "VN" ? "Da bò sáp thủ công" : "Handcrafted Wax Leather"}</option>
                <option value="lanh">{lang === "VN" ? "Vải dệt Linen tự nhiên" : "Natural Linen Fabric"}</option>
              </select>

              {/* Layout filter */}
              <select
                value={selectedLayout}
                onChange={(e) => setSelectedLayout(e.target.value)}
                className="bg-surface-container-lowest border border-outline-variant/60 text-on-surface text-label-sm uppercase py-1.5 px-3 focus:outline-none focus:border-primary text-xs"
              >
                <option value="all">{lang === "VN" ? "Mặt bằng: Tất cả" : "Floor Layout: All"}</option>
                <option value="small">{lang === "VN" ? "Căn hộ <70m²" : "Apartment <70m²"}</option>
                <option value="townhouse">{lang === "VN" ? "Nhà phố liền kề" : "Townhouse"}</option>
                <option value="villa">{lang === "VN" ? "Biệt thự & Penthouse" : "Villa & Penthouse"}</option>
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-secondary uppercase font-label-sm text-xs">
                {lang === "VN" ? "Sắp xếp:" : "Sort:"}
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-surface-container-lowest border border-outline-variant/60 text-on-surface text-label-sm uppercase py-1.5 px-3 focus:outline-none focus:border-primary text-xs"
              >
                <option value="featured">{lang === "VN" ? "Tiêu biểu xưởng" : "Featured Atelier"}</option>
                <option value="price-asc">{lang === "VN" ? "Giá: Thấp đến cao" : "Price: Low to High"}</option>
                <option value="price-desc">{lang === "VN" ? "Giá: Cao đến thấp" : "Price: High to Low"}</option>
              </select>
            </div>
          </div>
        </section>

        {/* PRODUCTS GRID */}
        <section className="max-w-7xl mx-auto px-space-md sm:px-space-lg lg:px-margin py-space-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredProducts.map((p) => {
              const wishlisted = isWishlisted(p.id);
              return (
                <article
                  key={p.id}
                  className="bg-surface-container-lowest border border-outline-variant flex flex-col justify-between group hover:border-primary transition-all duration-300"
                >
                  <div>
                    {/* Image ratio 4:5 */}
                    <div className="relative aspect-[4/5] bg-surface-container overflow-hidden">
                      <Link href={p.slug ? `/san-pham/${p.slug}` : "/san-pham/kura-lounge-chair"} className="relative block w-full h-full">
                        <SafeImage
                          src={p.image}
                          alt={p.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </Link>

                      <span className="absolute top-3 left-3 bg-primary text-on-primary font-label-sm text-[10px] px-2 py-0.5 uppercase tracking-wider font-bold">
                        {p.tag}
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

                    {/* Content Stack */}
                    <div className="p-space-md space-y-2">
                      <div className="flex items-center justify-between text-outline font-label-sm text-xs uppercase">
                        <span>{p.material}</span>
                      </div>
                      <Link
                        href={p.slug ? `/san-pham/${p.slug}` : "/san-pham/kura-lounge-chair"}
                        className="font-headline-sm text-lg text-primary font-bold hover:underline block"
                      >
                        {p.title}
                      </Link>
                      <p className="text-body-sm text-on-surface-variant text-xs line-clamp-2 leading-relaxed">
                        {p.desc}
                      </p>
                      <span className="text-[11px] text-outline block pt-1">
                        {lang === "VN" ? "Kích thước: " : "Dimensions: "}{p.dimensions}
                      </span>
                    </div>
                  </div>

                  {/* Price & Action Row */}
                  <div className="p-space-md pt-0 border-t border-outline-variant/30 mt-4 flex items-center justify-between">
                    <div>
                      <span className="font-headline-sm text-lg text-primary font-bold block">
                        {p.price.toLocaleString(lang === "VN" ? "vi-VN" : "en-US")} {t.common.currency}
                      </span>
                      {p.originalPrice && (
                        <span className="text-xs text-outline line-through">
                          {p.originalPrice.toLocaleString(lang === "VN" ? "vi-VN" : "en-US")} {t.common.currency}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        addToCart({
                          id: p.id,
                          sku: p.sku,
                          title: p.title,
                          subtitle: p.material,
                          price: p.price,
                          originalPrice: p.originalPrice,
                          image: p.image,
                          quantity: 1,
                          options: {
                            wood: p.material,
                            size: p.dimensions,
                          },
                        })
                      }
                      className="px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-on-primary text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-sm">shopping_bag</span>
                      {lang === "VN" ? "Thêm vào giỏ" : "Add to Bag"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* EDITORIAL ARCHITECTURAL FEATURE BANNER */}
        <section className="border-t border-outline-variant/40 bg-surface-container-lowest py-space-2xl">
          <div className="max-w-7xl mx-auto px-space-md sm:px-space-lg lg:px-margin">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-7 relative aspect-[16/10] overflow-hidden border border-outline-variant">
                <Image
                  src="/images/living-7.jpg"
                  alt="Không gian mở và ánh sáng tự nhiên"
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
              </div>

              <div className="lg:col-span-5 space-y-4">
                <span className="text-label-sm font-label-sm text-outline uppercase tracking-widest block text-xs">
                  NGHỆ THUẬT KHOẢNG TRỐNG (間 - MA)
                </span>
                <h2 className="text-headline-md font-headline-md text-2xl sm:text-3xl text-primary font-bold tracking-tight">
                  Không Gian Mở &amp; Ánh Sáng Tự Nhiên
                </h2>
                <p className="text-body-md text-on-surface-variant text-sm sm:text-base leading-relaxed">
                  Trong quan niệm kiến trúc Komorebi, khoảng trống giữa hai món đồ cũng có giá trị biểu cảm như chính món đồ đó. Mỗi chiếc sofa hay bàn trà phòng khách đều được tính toán để bóng đổ và vệt nắng tự nhiên tự do di chuyển qua gian phòng suốt bốn mùa.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setIsConsultationOpen(true)}
                    className="px-6 py-3 bg-primary text-on-primary text-label-md font-label-md uppercase tracking-wider hover:bg-[#27272a] transition-colors"
                  >
                    Tư vấn mặt bằng phòng khách
                  </button>
                </div>
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
