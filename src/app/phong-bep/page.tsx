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

interface DiningProduct {
  id: string;
  sku: string;
  title: string;
  category: string;
  price: number;
  originalPrice?: number;
  material: string;
  specs: string;
  desc: string;
  tag: string;
  image: string;
  slug?: string;
}

const initialDiningProducts: DiningProduct[] = [
  {
    id: "dining-1",
    sku: "KL-TAB-18",
    title: "Bàn Ăn Mở Rộng Mori Oak (1.8m - 2.4m)",
    category: "table",
    price: 24500000,
    originalPrice: 26800000,
    material: "Gỗ Sồi Trắng Bắc Mỹ • Mộng Âm Dương",
    specs: "Kích thước linh hoạt từ 1.8m mở rộng 2.4m, sức chứa 6 - 10 người",
    desc: "Cơ cấu ray trượt gỗ sồi chịu tải không phụ thuộc kim loại cơ học, chống kẹt ray và hạn chế rung lắc tuyệt đối.",
    tag: "GỖ SỒI BẮC MỸ",
    image: "/images/dining-2.jpg",
    slug: "mori-oak-table",
  },
  {
    id: "dining-2",
    sku: "KL-CHA-KAN",
    title: "Bộ 4 Ghế Ăn Tối Giản Kanso",
    category: "chair",
    price: 16800000,
    originalPrice: 18500000,
    material: "Gỗ Sồi FAS • Đệm Da Bò Sáp Ý",
    specs: "Bộ gồm 4 ghế đồng bộ, tựa lưng vát cong công thái học",
    desc: "Đường cong tựa lưng tạo điểm tì êm ái cho bữa ăn gia đình kéo dài, bọc da sáp chống bám dầu mỡ tự nhiên.",
    tag: "BÁN CHẠY NHẤT",
    image: "/images/dining-3.jpg",
    slug: "ghe-an-kanso",
  },
  {
    id: "dining-3",
    sku: "KL-TAB-ENS",
    title: "Bàn Ăn Tròn Tĩnh Tọa Enso (ĐK 1.4m)",
    category: "table",
    price: 29000000,
    originalPrice: 32000000,
    material: "Gỗ Óc Chó Walnut Bắc Mỹ Nguyên Tấm",
    specs: "Đường kính 1400 x C750 mm, sức chứa 6 người",
    desc: "Dáng tròn tượng trưng cho sự trọn vẹn và sum họp, bề mặt ghép cánh quạt khoe trọn hoa văn vân mộc đối xứng.",
    tag: "GỖ ÓC CHÓ NGUYÊN TẤM",
    image: "/images/dining-4.jpg",
    slug: "ban-an-tron-enso",
  },
  {
    id: "dining-4",
    sku: "KL-BEN-SOL",
    title: "Ghế Băng Dài Gỗ Sồi Mộc Bản",
    category: "chair",
    price: 8900000,
    originalPrice: 9800000,
    material: "Gỗ Sồi Tự Nhiên • Dài 1.6m",
    specs: "D1600 x R350 x C450 mm, sức chứa 3 người lớn",
    desc: "Giải pháp tối ưu diện tích cho gian bếp mở, có thể ẩn hoàn toàn dưới gầm bàn khi không sử dụng.",
    tag: "THỦ CÔNG",
    image: "/images/dining-5.jpg",
    slug: "ghe-bang-go-soi",
  },
  {
    id: "dining-5",
    sku: "KL-CAB-MIZ",
    title: "Tủ Chén Bát & Đồ Khô Mizu Sideboard",
    category: "cabinet",
    price: 31500000,
    originalPrice: 34000000,
    material: "Gỗ Sồi & Kính Gân Sọc Mờ",
    specs: "D1800 x R450 x C850 mm, ngăn kéo chia đũa thìa thông minh",
    desc: "Cửa kính lùa gân sọc che khuất đồ dùng bên trong nhẹ nhàng, chân đế cao thuận tiện cho robot hút bụi lau sàn.",
    tag: "KÍNH NẰM MỘNG",
    image: "/images/dining-6.jpg",
    slug: "tu-chen-mizu",
  },
  {
    id: "dining-6",
    sku: "KL-CRT-TEA",
    title: "Xe Đẩy Phục Vụ & Pha Chế Teak Bar Cart",
    category: "cabinet",
    price: 7200000,
    originalPrice: 8000000,
    material: "Gỗ Teak Myanmar Kháng Nước Tuyệt Đối",
    specs: "D800 x R450 x C820 mm, bánh xe cao su êm ái",
    desc: "Lý tưởng cho tiệc trà hay quầy rượu mini di động giữa bếp và bàn ăn ngoài ban công.",
    tag: "GỖ TEAK KHÁNG NƯỚC",
    image: "/images/dining-7.jpg",
    slug: "xe-day-bar-cart",
  },
];

export default function DiningKitchenPage() {
  const { lang, t } = useLanguage();
  const { addToCart, toggleWishlist, isWishlisted, showToast } = useCart();
  const [products, setProducts] = useState<DiningProduct[]>(initialDiningProducts);
  const [selectedSubcat, setSelectedSubcat] = useState("all");
  const [selectedWood, setSelectedWood] = useState("all");
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  useEffect(() => {
    getProductsByCategory<DiningProduct>("cat-dining", initialDiningProducts, (item) => ({
      id: item.id,
      sku: item.sku,
      title: item.title,
      category: item.sku.includes("TAB") ? "table" : item.sku.includes("CHA") || item.sku.includes("BEN") ? "chair" : "cabinet",
      price: item.price,
      originalPrice: item.original_price,
      material: item.material,
      specs: item.dimensions || item.description || "",
      desc: item.description || "",
      tag: item.tag || "",
      image: item.image,
      slug: item.slug,
    })).then((res) => {
      if (res && res.length > 0) setProducts(res);
    });
  }, []);

  const filteredProducts = products.filter((item) => {
    if (selectedSubcat !== "all" && item.category !== selectedSubcat) return false;
    if (selectedWood !== "all") {
      if (!item.material.toLowerCase().includes(selectedWood.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <>
      <Header onOpenConsultation={() => setIsConsultationOpen(true)} />

      <main className="min-h-screen">
        {/* HERO BANNER SECTION */}
        <section className="border-b border-outline-variant/40 bg-surface-container-lowest">
          <div className="max-w-7xl mx-auto px-space-md sm:px-space-lg lg:px-margin py-8 sm:py-12 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Text Column */}
              <div className="lg:col-span-7 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <span className="inline-block w-8 h-[1px] bg-primary"></span>
                  <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest text-xs font-semibold">
                    Komorebi Living Architecture • {lang === "VN" ? "Bộ Sưu Tập 2025" : "Collection 2025"}
                  </span>
                </div>
                <h1 className="font-headline text-2xl sm:text-4xl lg:text-5xl font-bold text-primary uppercase leading-[1.28] sm:leading-[1.3] lg:leading-[1.32] tracking-normal mb-5 sm:mb-6">
                  {lang === "VN"
                    ? "Phòng Bếp & Không Gian Bàn Ăn — Nghệ Thuật Gắn Kết Ấm Áp"
                    : "Kitchen & Dining Spaces — The Warm Art of Gathering"}
                </h1>
                <p className="font-body text-on-surface-variant max-w-2xl mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base font-light">
                  {lang === "VN"
                    ? "Tôn vinh cấu trúc mộng gỗ Kigumi thủ công chống cong vênh tuyệt đối cùng hệ tủ bếp Teak may đo kháng ẩm. Nơi ánh sáng tự nhiên giao hòa cùng vật liệu nguyên bản, tạo dựng tâm điểm sum vầy thanh tịnh cho ngôi nhà đương đại."
                    : "Honoring handcrafted Kigumi joinery and custom moisture-resistant Teak cabinetry. Where natural light meets authentic timber, creating a tranquil hearth for the contemporary home."}
                </p>

                {/* Subcategory Filter Buttons */}
                <div className="flex flex-wrap gap-2 pt-4 sm:pt-6 border-t border-outline-variant/30 mt-2">
                  {[
                    { id: "all", label: lang === "VN" ? "Tất cả không gian" : "All Spaces" },
                    { id: "table", label: lang === "VN" ? "Bàn Ăn Mở Rộng" : "Dining Tables" },
                    { id: "chair", label: lang === "VN" ? "Ghế Ăn Tinh Gọn" : "Dining Chairs" },
                    { id: "cabinet", label: lang === "VN" ? "Tủ Bếp & Xe Đẩy" : "Kitchen Cabinets" },
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      type="button"
                      onClick={() => setSelectedSubcat(btn.id)}
                      className={`font-label-sm text-label-sm px-4 py-2 uppercase tracking-wider text-xs transition-colors ${
                        selectedSubcat === btn.id
                          ? "bg-primary text-on-primary font-bold"
                          : "bg-surface-container-lowest text-on-surface border border-outline-variant/60 hover:border-primary"
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Visual Image */}
              <div className="lg:col-span-5 relative aspect-[4/3] overflow-hidden border border-outline-variant shadow-md">
                <Image
                  src="/images/dining-1.jpg"
                  alt="Không gian phòng ăn và bếp phong cách Japandi đương đại"
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* PRODUCTS CATALOGUE */}
        <section className="max-w-7xl mx-auto px-space-md sm:px-space-lg lg:px-margin py-space-xl">
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-outline-variant/40">
            <div>
              <span className="text-label-sm font-label-sm text-outline uppercase tracking-widest text-xs block">
                {lang === "VN" ? "DANH MỤC TUYỂN CHỌN" : "CURATED CATALOGUE"}
              </span>
              <h2 className="text-headline-md font-headline-md text-2xl text-primary font-bold">
                {lang === "VN" ? "Bàn Ăn & Hệ Cấu Kiện Bếp" : "Dining Tables & Kitchen Joinery"}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-outline uppercase font-semibold">
                {lang === "VN" ? "Chất gỗ:" : "Timber:"}
              </span>
              <select
                value={selectedWood}
                onChange={(e) => setSelectedWood(e.target.value)}
                className="bg-surface-container-lowest border border-outline-variant text-label-sm uppercase py-1 px-3 text-xs focus:outline-none"
              >
                <option value="all">{lang === "VN" ? "Tất cả gỗ" : "All Timber"}</option>
                <option value="sồi">{lang === "VN" ? "Gỗ Sồi Trắng FAS" : "White Oak FAS"}</option>
                <option value="óc chó">{lang === "VN" ? "Gỗ Óc Chó Walnut" : "American Walnut"}</option>
                <option value="teak">{lang === "VN" ? "Gỗ Teak Kháng Nước" : "Waterproof Teak"}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredProducts.map((p) => {
              const wishlisted = isWishlisted(p.id);
              return (
                <article
                  key={p.id}
                  className="group bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-primary hover:shadow-xl hover:-translate-y-1.5"
                >
                  <div>
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

                      <span className="absolute top-3 left-3 bg-white/95 dark:bg-[#18181b]/90 backdrop-blur-sm text-primary dark:text-white text-[11px] font-semibold px-2.5 py-1 rounded-md border border-outline-variant/60 dark:border-white/20 shadow-xs uppercase tracking-wider">
                        {p.tag}
                      </span>

                      {p.originalPrice && (
                        <span className="absolute bottom-3 left-3 bg-red-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">
                          -{Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}%
                        </span>
                      )}

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

                    <div className="p-4 sm:p-5 space-y-2">
                      <div className="flex items-center gap-1 text-[13px] text-amber-500">
                        {"★★★★★"}
                        <span className="text-zinc-500 dark:text-zinc-300 text-xs ml-1 font-mono">(4.9)</span>
                      </div>

                      <div className="flex items-center justify-between text-outline text-xs uppercase font-medium">
                        <span className="truncate max-w-[65%]">{p.material}</span>
                        <span className="text-[11px] font-mono truncate max-w-[32%]">{p.specs}</span>
                      </div>

                      <Link
                        href={p.slug ? `/san-pham/${p.slug}` : "/san-pham/kura-lounge-chair"}
                        className="font-headline text-base sm:text-lg text-primary font-bold hover:underline block leading-snug"
                      >
                        {p.title}
                      </Link>

                      <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed font-light">
                        {p.desc}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 pt-3.5 border-t border-outline-variant/30 mt-2 flex items-center justify-between">
                    <div>
                      <span className="font-headline text-base sm:text-lg text-primary font-bold block leading-none">
                        {p.price.toLocaleString(lang === "VN" ? "vi-VN" : "en-US")} {t.common.currency}
                      </span>
                      {p.originalPrice && (
                        <span className="text-xs text-zinc-400 dark:text-zinc-400 line-through mt-1 block">
                          {p.originalPrice.toLocaleString(lang === "VN" ? "vi-VN" : "en-US")} {t.common.currency}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
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
                            size: p.specs,
                          },
                        });
                        showToast(lang === "VN" ? `Đã thêm "${p.title}" vào giỏ hàng` : `Added "${p.title}" to cart`);
                      }}
                      className="p-2.5 sm:px-3.5 sm:py-2 border border-outline-variant rounded-xl transition-all text-on-surface hover:bg-primary hover:border-primary hover:text-on-primary dark:border-white/20 dark:text-white dark:hover:bg-white dark:hover:border-white dark:hover:text-[#09090b] group/cartbtn cursor-pointer flex items-center gap-1.5"
                      title={lang === "VN" ? "Thêm vào giỏ" : "Add to Bag"}
                      aria-label={lang === "VN" ? "Thêm vào giỏ" : "Add to Bag"}
                    >
                      <span className="material-symbols-outlined text-[18px] block group-hover/cartbtn:text-white dark:group-hover/cartbtn:text-[#09090b]">
                        shopping_bag
                      </span>
                      <span className="hidden sm:inline text-xs font-semibold uppercase tracking-wider group-hover/cartbtn:text-white dark:group-hover/cartbtn:text-[#09090b]">
                        {lang === "VN" ? "Thêm" : "Add"}
                      </span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* CUSTOM KITCHEN BESPOKE SERVICE SECTION */}
        <section className="bg-surface-container-low border-t border-outline-variant/40 py-space-2xl">
          <div className="max-w-7xl mx-auto px-space-md sm:px-space-lg lg:px-margin text-center max-w-3xl space-y-4">
            <span className="text-label-sm font-label-sm text-outline uppercase tracking-widest text-xs block">
              {lang === "VN" ? "DỊCH VỤ THIẾT KẾ ĐẢO BẾP MAY ĐO" : "BESPOKE KITCHEN ISLAND SERVICE"}
            </span>
            <h2 className="text-headline-md font-headline-md text-2xl sm:text-3xl text-primary font-bold">
              {lang === "VN"
                ? "May Đo Đảo Bếp & Hệ Tủ Theo Hiện Trạng Kiến Trúc"
                : "Custom Kitchen Islands & Architectural Cabinetry"}
            </h2>
            <p className="text-body-md text-on-surface-variant text-sm sm:text-base leading-relaxed">
              {lang === "VN"
                ? "Mỗi gia đình có một thói quen nấu nướng và đón tiếp bạn bè khác nhau. Komorebi cung cấp dịch vụ khảo sát kích thước tận nơi, dựng bản vẽ 3D đảo bếp kết hợp bồn rửa âm đá tự nhiên và phụ kiện đóng mở giảm chấn Blum / Hafele."
                : "Every home has unique culinary traditions and hospitality rituals. Komorebi provides on-site surveys, bespoke 3D kitchen island renderings, natural stone undermount sinks, and Blum / Hafele soft-close hardware."}
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsConsultationOpen(true)}
                className="px-8 py-3.5 bg-primary text-on-primary text-label-md font-label-md uppercase tracking-wider hover:bg-[#27272a] transition-all inline-flex items-center gap-2"
              >
                <span>{lang === "VN" ? "Đăng ký khảo sát gian bếp" : "Book Kitchen Survey"}</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
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
