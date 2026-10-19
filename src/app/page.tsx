"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ConsultationModal from "@/components/ConsultationModal";
import { useCart } from "@/context/CartContext";

interface Product {
  id: string;
  sku: string;
  title: string;
  subtitle: string;
  price: number;
  originalPrice: number;
  tag: string;
  ratingCount: number;
  image: string;
  space: string;
  material: string;
  inStockShowroom: boolean;
  slug: string;
}

const productsData: Product[] = [
  {
    id: "p1",
    sku: "KL-LOU-01",
    title: "Ghế Thư Giãn Kura",
    subtitle: "Kura Lounge Chair • Sồi Tự Nhiên",
    price: 14800000,
    originalPrice: 17500000,
    tag: "Gỗ Sồi Bắc Âu / -15% Mùa Cưới",
    ratingCount: 42,
    image: "/images/product-kura-chair.jpg",
    space: "Phòng Khách",
    material: "Gỗ Sồi",
    inStockShowroom: true,
    slug: "kura-lounge-chair",
  },
  {
    id: "p2",
    sku: "KL-SOF-02",
    title: "Sofa Nỉ Nordic Cloud",
    subtitle: "Khung Gỗ Thông • Đệm Lông Vũ",
    price: 32600000,
    originalPrice: 36000000,
    tag: "Vải Linen Tự Nhiên",
    ratingCount: 58,
    image: "/images/product-nordic-sofa.jpg",
    space: "Phòng Khách",
    material: "Linen tự nhiên",
    inStockShowroom: true,
    slug: "nordic-cloud-sofa",
  },
  {
    id: "p3",
    sku: "KL-TAB-18",
    title: "Bàn Ăn Mori Oak Table",
    subtitle: "Mặt Mở Rộng 1.8m - 2.4m",
    price: 24500000,
    originalPrice: 26800000,
    tag: "Gỗ Sồi Trắng FSC",
    ratingCount: 27,
    image: "/images/product-mori-table.jpg",
    space: "Phòng Ăn",
    material: "Gỗ Sồi",
    inStockShowroom: true,
    slug: "mori-oak-table",
  },
  {
    id: "p4",
    sku: "KL-LGT-09",
    title: "Đèn Thả Wabi Paper",
    subtitle: "Khung Tre Tự Nhiên • LED 2700K",
    price: 4200000,
    originalPrice: 4900000,
    tag: "Giấy Washi Thủ Công",
    ratingCount: 31,
    image: "/images/product-wabi-lamp.jpg",
    space: "Phòng Ăn",
    material: "Gỗ Teak",
    inStockShowroom: true,
    slug: "wabi-paper-lamp",
  },
  {
    id: "p5",
    sku: "KL-COF-05",
    title: "Bàn Trà Kanso Coffee Table",
    subtitle: "Gỗ Walnut Bắc Mỹ Khối Liền",
    price: 16200000,
    originalPrice: 18500000,
    tag: "Gỗ Walnut Bắc Mỹ",
    ratingCount: 19,
    image: "/images/kura-room.jpg",
    space: "Phòng Khách",
    material: "Gỗ Walnut",
    inStockShowroom: true,
    slug: "kanso-coffee-table",
  },
  {
    id: "p6",
    sku: "KL-BED-08",
    title: "Giường Ngủ Zen Platform Bed",
    subtitle: "Khung Sồi Tự Nhiên • Mộng Kigumi",
    price: 28900000,
    originalPrice: 32000000,
    tag: "Da bò Ý & Gỗ Sồi",
    ratingCount: 36,
    image: "/images/kura-front.jpg",
    space: "Phòng Ngủ",
    material: "Da bò Ý",
    inStockShowroom: false,
    slug: "zen-platform-bed",
  },
];

export default function HomePage() {
  const { addToCart, toggleWishlist, isWishlisted, showToast } = useCart();
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState("Phòng Khách");
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [priceFilter, setPriceFilter] = useState("all");
  const [showroomOnly, setShowroomOnly] = useState(false);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [bannerPhone, setBannerPhone] = useState("");

  const spaceTabs = ["Phòng Khách", "Phòng Ăn", "Phòng Ngủ", "Góc Làm Việc Yên Tĩnh"];
  const materialChips = ["Gỗ Teak", "Gỗ Walnut", "Da bò Ý", "Linen tự nhiên"];

  // Filter products
  const filteredProducts = productsData.filter((item) => {
    // Space filter (if space matches or 'all')
    if (selectedSpace !== "Tất cả" && item.space !== selectedSpace && !showAllProducts) {
      // allow flexible viewing when space tab matches
    }
    // Material filter
    if (selectedMaterial && item.material !== selectedMaterial) {
      return false;
    }
    // Showroom filter
    if (showroomOnly && !item.inStockShowroom) {
      return false;
    }
    // Price filter
    if (priceFilter === "under-10m" && item.price >= 10000000) return false;
    if (priceFilter === "10-25m" && (item.price < 10000000 || item.price > 25000000)) return false;
    if (priceFilter === "above-25m" && item.price <= 25000000) return false;

    return true;
  });

  const displayedProducts = showAllProducts ? filteredProducts : filteredProducts.slice(0, 4);

  const handleBannerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerPhone) {
      showToast("Vui lòng nhập số điện thoại để nhận tư vấn.");
      return;
    }
    showToast(`Cảm ơn bạn! KTS Komorebi sẽ gọi đến ${bannerPhone} trong vòng 30 phút.`);
    setBannerPhone("");
  };

  return (
    <>
      <Header onOpenConsultation={() => setIsConsultationOpen(true)} />

      <main className="flex-1 w-full">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-4 sm:pt-6 pb-12 sm:pb-16 lg:pt-10 lg:pb-24 px-4 sm:px-6 lg:px-margin max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 xl:gap-16 items-center">
            {/* Left Text Column */}
            <div className="lg:col-span-6 xl:col-span-6 space-y-5 sm:space-y-6 xl:space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container rounded-full text-on-surface text-xs sm:text-sm">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                <span className="text-label-md font-label-md uppercase tracking-wider text-on-surface">
                  Bộ Sưu Tập Thu Đông 2025
                </span>
              </div>

              <h1 className="font-headline-lg lg:font-display-lg text-3xl sm:text-4xl md:text-5xl xl:text-6xl text-on-background leading-[1.15] tracking-tight">
                Nghệ Thuật Cân Bằng <br className="hidden sm:inline" />
                <span className="italic font-normal text-primary">Không Gian Sống</span>
              </h1>

              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl leading-relaxed text-sm sm:text-base lg:text-lg">
                Hòa quyện giữa triết lý Wabi-Sabi tôn vinh nét đẹp thô mộc tự nhiên và tính thực dụng chuẩn mực Scandinavian. Mỗi thiết kế là một tác phẩm mộc bản thủ công bền bỉ qua thời gian.
              </p>

              <div className="pt-1 sm:pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <a
                  href="#bo-suu-tap"
                  className="inline-flex items-center justify-center px-6 py-3.5 bg-primary text-on-primary text-label-md font-label-md tracking-wider uppercase rounded-xl hover:bg-[#27272a] transition-all shadow-sm active:scale-95 group text-xs sm:text-sm"
                >
                  <span>Khám phá Bộ sưu tập Thu Đông</span>
                  <span className="material-symbols-outlined ml-2 text-base transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </a>
                <button
                  type="button"
                  onClick={() => setIsConsultationOpen(true)}
                  className="inline-flex items-center justify-center px-6 py-3.5 border border-[#18181B] text-on-surface text-label-md font-label-md tracking-wider uppercase rounded-xl hover:bg-surface-container transition-all active:scale-95 text-xs sm:text-sm"
                >
                  <span>Đặt lịch tư vấn kiến trúc sư</span>
                </button>
              </div>

              {/* Editorial Micro-metrics */}
              <div className="pt-6 sm:pt-8 border-t border-outline-variant grid grid-cols-3 gap-2 sm:gap-6">
                <div>
                  <p className="font-headline-md text-xl sm:text-2xl lg:text-3xl text-primary font-bold">100%</p>
                  <p className="font-label-sm text-[10px] sm:text-[11px] text-on-surface-variant uppercase tracking-wider mt-0.5 sm:mt-1">
                    Gỗ Sồi &amp; Walnut FSC
                  </p>
                </div>
                <div>
                  <p className="font-headline-md text-xl sm:text-2xl lg:text-3xl text-primary font-bold">0%</p>
                  <p className="font-label-sm text-[10px] sm:text-[11px] text-on-surface-variant uppercase tracking-wider mt-0.5 sm:mt-1">
                    Kim Loại Nối Ghép
                  </p>
                </div>
                <div>
                  <p className="font-headline-md text-xl sm:text-2xl lg:text-3xl text-primary font-bold">10 Năm</p>
                  <p className="font-label-sm text-[10px] sm:text-[11px] text-on-surface-variant uppercase tracking-wider mt-0.5 sm:mt-1">
                    Cam Kết Bảo Hành
                  </p>
                </div>
              </div>
            </div>

            {/* Right Visual Hero Column */}
            <div className="lg:col-span-6 relative mt-4 lg:mt-0">
              <div className="relative z-10 overflow-hidden aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5] shadow-xl border border-outline-variant rounded-2xl lg:rounded-3xl group">
                <Image
                  src="/images/hero-living-room.jpg"
                  alt="Không gian phòng khách phong cách Japandi với ghế Kura Lounge Chair"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover group-hover:scale-102 transition-transform duration-700"
                  priority
                />

                {/* Floating Spec Tag Card */}
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-5 p-3.5 sm:p-5 bg-white/95 backdrop-blur-md border border-outline-variant rounded-2xl shadow-md flex flex-col xs:flex-row xs:items-center justify-between gap-2">
                  <div>
                    <span className="text-label-sm font-label-sm text-outline uppercase tracking-wider block text-[10px] sm:text-xs">
                      Thiết kế tiêu biểu
                    </span>
                    <Link
                      href="/san-pham/kura-lounge-chair"
                      className="font-headline-sm text-sm sm:text-base lg:text-lg text-primary hover:underline font-bold block"
                    >
                      Kura Lounge Chair • Sồi Tự Nhiên
                    </Link>
                    <p className="text-body-sm text-outline text-[11px] sm:text-xs mt-0.5">
                      Chế tác thủ công tại Xưởng Komorebi Kyoto
                    </p>
                  </div>
                  <div className="text-left xs:text-right pt-1 xs:pt-0 border-t xs:border-t-0 border-outline-variant/30">
                    <span className="font-label-lg text-primary font-bold block text-sm sm:text-base">
                      14.800.000 đ
                    </span>
                    <span className="text-label-sm text-on-surface-variant flex items-center xs:justify-end gap-1 mt-0.5 text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      Sẵn sàng trải nghiệm
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* EXPLORE BY SPACE SECTION */}
        <section id="bo-suu-tap" className="py-10 sm:py-space-xl px-4 sm:px-space-md lg:px-margin max-w-7xl mx-auto border-t border-outline-variant/40">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-6 sm:mb-8 gap-4">
            <div>
              <span className="text-label-sm font-label-sm text-outline uppercase tracking-widest block mb-1 text-xs">
                KHÁM PHÁ THEO KHÔNG GIAN
              </span>
              <h2 className="text-headline-lg font-headline-lg text-2xl sm:text-3xl lg:text-4xl text-primary font-medium tracking-tight">
                Cảm Hứng Thiết Kế Bản Địa &amp; Hiện Đại
              </h2>
            </div>

            {/* Room Tabs (Swipeable on Mobile) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap no-scrollbar">
              {spaceTabs.map((tab) => {
                const isActive = selectedSpace === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      setSelectedSpace(tab);
                      setShowAllProducts(false);
                    }}
                    className={`px-3.5 sm:px-4 py-2 text-label-md font-label-md tracking-wider uppercase rounded-xl transition-colors whitespace-nowrap text-xs sm:text-sm flex-shrink-0 ${
                      isActive
                        ? "bg-primary text-on-primary font-bold shadow-xs"
                        : "bg-surface-container-low text-on-surface hover:bg-surface-container border border-outline-variant/40"
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Filters Row (Swipeable chips on mobile) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 bg-surface-container-low border border-outline-variant/60 rounded-2xl mb-6 sm:mb-8">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 sm:flex-wrap w-full sm:w-auto no-scrollbar">
              <span className="text-label-sm font-label-sm text-outline uppercase mr-1 flex items-center gap-1 text-xs whitespace-nowrap flex-shrink-0">
                <span className="material-symbols-outlined text-sm">tune</span> Bộ lọc:
              </span>
              {materialChips.map((chip) => {
                const isSelected = selectedMaterial === chip;
                return (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setSelectedMaterial(isSelected ? null : chip)}
                    className={`px-2.5 sm:px-3 py-1.5 text-label-sm font-label-sm uppercase rounded-lg transition-colors border text-xs whitespace-nowrap flex-shrink-0 ${
                      isSelected
                        ? "bg-primary text-on-primary border-primary font-bold"
                        : "bg-surface-container-lowest text-on-surface border-outline-variant hover:border-primary"
                    }`}
                  >
                    {chip}
                  </button>
                );
              })}

              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="px-2.5 sm:px-3 py-1.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-label-sm font-label-sm text-on-surface focus:outline-none text-xs flex-shrink-0"
              >
                <option value="all">Mức giá: Mọi khoảng</option>
                <option value="under-10m">Dưới 10 triệu</option>
                <option value="10-25m">10 - 25 triệu</option>
                <option value="above-25m">Trên 25 triệu</option>
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-label-sm font-label-sm text-on-surface text-xs pt-1 sm:pt-0 border-t sm:border-t-0 border-outline-variant/30">
              <input
                type="checkbox"
                checked={showroomOnly}
                onChange={(e) => setShowroomOnly(e.target.checked)}
                className="w-4 h-4 rounded border border-primary text-primary focus:ring-0"
              />
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-primary">verified</span>
                Có sẵn tại Showroom
              </span>
            </label>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
            {displayedProducts.map((product) => {
              const wishlisted = isWishlisted(product.id);
              return (
                <div
                  key={product.id}
                  className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden group flex flex-col justify-between transition-all duration-300 hover:border-primary hover:shadow-xl hover:-translate-y-1"
                >
                  {/* Image Ratio 4:5 with Tag & Heart */}
                  <div className="relative aspect-[4/5] bg-surface-container overflow-hidden">
                    <Link href={`/san-pham/${product.slug}`} className="relative block w-full h-full">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>

                    {/* Tag */}
                    <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-primary text-label-sm font-label-sm px-2.5 py-1 rounded-md border border-outline-variant/60 shadow-sm text-xs font-medium">
                      {product.tag}
                    </span>

                    {/* Heart button */}
                    <button
                      type="button"
                      onClick={() => toggleWishlist(product.id)}
                      className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center border border-outline-variant/60 transition-colors ${
                        wishlisted ? "text-error" : "text-on-surface-variant hover:text-primary"
                      }`}
                      aria-label="Yêu thích"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {wishlisted ? "favorite" : "favorite_border"}
                      </span>
                    </button>
                  </div>

                  {/* Content Info */}
                  <div className="p-4 flex flex-col flex-1 justify-between">
                    <div>
                      {/* Rating stars */}
                      <div className="flex items-center gap-1 text-[13px] text-primary mb-1">
                        {"★★★★★"}
                        <span className="text-outline text-xs ml-1">({product.ratingCount})</span>
                      </div>

                      <Link
                        href={`/san-pham/${product.slug}`}
                        className="font-headline-sm text-base text-primary font-bold hover:underline block"
                      >
                        {product.title}
                      </Link>
                      <p className="text-body-sm text-outline text-xs mt-0.5">{product.subtitle}</p>
                    </div>

                    {/* Price and Cart button */}
                    <div className="flex items-center justify-between pt-4 mt-3 border-t border-outline-variant/30">
                      <div>
                        <span className="font-headline-sm text-base text-primary font-bold block">
                          {product.price.toLocaleString("vi-VN")} đ
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-outline line-through">
                            {product.originalPrice.toLocaleString("vi-VN")} đ
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          addToCart({
                            id: product.id,
                            sku: product.sku,
                            title: product.title,
                            subtitle: product.subtitle,
                            price: product.price,
                            originalPrice: product.originalPrice,
                            image: product.image,
                            quantity: 1,
                          })
                        }
                        className="p-2.5 border border-outline-variant rounded-xl hover:border-primary hover:bg-primary hover:text-on-primary transition-colors text-primary"
                        title="Thêm vào giỏ hàng"
                        aria-label="Thêm vào giỏ"
                      >
                        <span className="material-symbols-outlined text-[18px] block">
                          shopping_bag
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Expand Button */}
          <div className="text-center mt-10">
            <button
              type="button"
              onClick={() => setShowAllProducts(!showAllProducts)}
              className="px-8 py-3.5 bg-primary text-on-primary text-label-md font-label-md uppercase tracking-wider rounded-xl hover:bg-[#27272a] transition-all inline-flex items-center gap-2"
            >
              <span>{showAllProducts ? "Thu gọn bớt tác phẩm" : "Xem Toàn Bộ 120+ Tác Phẩm Nội Thất"}</span>
              <span className={`material-symbols-outlined text-sm transition-transform ${showAllProducts ? "rotate-180" : ""}`}>
                expand_more
              </span>
            </button>
          </div>
        </section>

        {/* PHILOSOPHY SECTION */}
        <section id="triet-ly" className="py-space-xl px-space-md lg:px-margin max-w-7xl mx-auto border-t border-outline-variant/40">
          <div className="max-w-2xl mb-12">
            <span className="text-label-sm font-label-sm text-outline uppercase tracking-widest block mb-1">
              TÔN TRỌNG TỰ NHIÊN &amp; CON NGƯỜI
            </span>
            <h2 className="text-headline-lg font-headline-lg text-3xl sm:text-4xl text-primary font-medium tracking-tight">
              Triết Lý Nghề Mộc &amp; Độ Bền Vượt Thế Hệ
            </h2>
            <p className="text-body-md font-body-md text-on-surface-variant mt-3 leading-relaxed">
              Chúng tôi tin rằng món đồ nội thất quý giá nhất là món đồ sống cùng gia đình qua nhiều thập kỷ, mang theo kỷ niệm và càng nhuốm màu thời gian thì chất gỗ càng trở nên đằm thắm.
            </p>
          </div>

          {/* 3 Value Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="p-space-lg bg-surface-container-lowest border border-outline-variant rounded-2xl flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div>
                <div className="w-12 h-12 bg-surface-container-low border border-outline-variant rounded-xl flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-2xl text-primary">forest</span>
                </div>
                <h3 className="font-headline-sm text-xl text-primary font-bold mb-2">
                  Chứng Nhận Gỗ FSC Quốc Tế
                </h3>
                <p className="text-body-sm text-on-surface-variant leading-relaxed">
                  100% gỗ Sồi, Óc Chó (Walnut) và Teak được khai thác từ những cánh rừng tái sinh có trách nhiệm tại Bắc Âu và Bắc Mỹ, tuân thủ nghiêm ngặt tiêu chuẩn bảo tồn đa dạng sinh học.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-outline-variant/30 flex items-center justify-between text-label-sm font-label-sm text-outline uppercase">
                <span>Chuẩn bền vững FSC® C104928</span>
                <span className="material-symbols-outlined text-sm text-primary">verified</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-space-lg bg-surface-container-lowest border border-outline-variant rounded-2xl flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div>
                <div className="w-12 h-12 bg-surface-container-low border border-outline-variant rounded-xl flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-2xl text-primary">hardware</span>
                </div>
                <h3 className="font-headline-sm text-xl text-primary font-bold mb-2">
                  Kỹ Thuật Mộng Gỗ Không Đinh
                </h3>
                <p className="text-body-sm text-on-surface-variant leading-relaxed">
                  Kế thừa kỹ nghệ mộng gỗ Nhật Bản (Kigumi) và ngàm then Bắc Âu. Các chi tiết liên kết chặt chẽ qua cấu trúc mộng chốt gỗ tự nhiên, loại bỏ hoàn toàn đinh ốc kim loại rỉ sét và nứt vỡ thớ gỗ.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-outline-variant/30 flex items-center justify-between text-label-sm font-label-sm text-outline uppercase">
                <span>Chế tác thủ công 100%</span>
                <span className="material-symbols-outlined text-sm text-primary">handyman</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-space-lg bg-surface-container-lowest border border-outline-variant rounded-2xl flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div>
                <div className="w-12 h-12 bg-surface-container-low border border-outline-variant rounded-xl flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-2xl text-primary">workspace_premium</span>
                </div>
                <h3 className="font-headline-sm text-xl text-primary font-bold mb-2">
                  Cam Kết Bảo Hành 10 Năm
                </h3>
                <p className="text-body-sm text-on-surface-variant leading-relaxed">
                  Chính sách bảo hành kết cấu gỗ trọn vẹn 10 năm đi kèm gói bảo dưỡng đánh sáp tự nhiên định kỳ mỗi 12 tháng tại nhà từ các nghệ nhân mộc Komorebi.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-outline-variant/30 flex items-center justify-between text-label-sm font-label-sm text-outline uppercase">
                <span>Hỗ trợ trọn đời sản phẩm</span>
                <span className="material-symbols-outlined text-sm text-primary">shield</span>
              </div>
            </div>
          </div>
        </section>

        {/* WORKSHOP BANNER SECTION */}
        <section id="xuong-moc" className="py-space-md px-space-md lg:px-margin max-w-7xl mx-auto">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl lg:rounded-3xl p-space-lg sm:p-space-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center overflow-hidden">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-label-sm font-label-sm text-outline uppercase tracking-widest block">
                XƯỞNG CHẾ TÁC THỦ CÔNG
              </span>
              <h3 className="text-headline-md font-headline-md text-2xl sm:text-3xl text-primary font-bold tracking-tight">
                Mỗi chi tiết đều mang dấu ấn của đôi bàn tay người thợ
              </h3>
              <p className="text-body-md text-on-surface-variant max-w-xl leading-relaxed">
                Từ công đoạn chọn từng thớ gỗ không tì vết, sấy tự nhiên giảm ứng suất cong vênh đến 7 lớp lau dầu thực vật Osmo (Đức) giữ trọn hơi thở của vân gỗ mộc.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsConsultationOpen(true)}
                  className="inline-flex items-center gap-2 text-label-md font-label-md text-primary font-bold hover:underline"
                >
                  <span>Khám phá hành trình chế tác tại xưởng mộc</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 relative aspect-[16/10] sm:aspect-[16/9] overflow-hidden border border-outline-variant rounded-xl lg:rounded-2xl">
              <Image
                src="/images/artisan-woodworker.jpg"
                alt="Thợ mộc Komorebi bào gỗ tại xưởng chế tác thủ công"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </section>

        {/* CONSULTATION CTA BANNER (DARK THEME - WITH ROUNDED CORNERS) */}
        <section id="tu-van" className="py-space-xl px-space-md lg:px-margin max-w-7xl mx-auto">
          <div className="bg-[#09090B] text-white p-space-lg sm:p-space-xl lg:p-14 border border-outline-variant rounded-2xl sm:rounded-3xl relative overflow-hidden shadow-2xl">
            <div className="max-w-2xl space-y-4 relative z-10">
              <span className="text-label-sm font-label-sm text-[#A1A1AA] uppercase tracking-widest block font-mono">
                DỊCH VỤ THIẾT KẾ RIÊNG
              </span>
              <h2 className="text-headline-md font-headline-md text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                Kiến Tạo Không Gian Sống Riêng Bản Sắc
              </h2>
              <p className="text-body-sm text-[#D4D4D8] leading-relaxed">
                Đội ngũ kiến trúc sư Komorebi sẵn sàng tư vấn 1–1, khảo sát hiện trạng tận nơi và cung cấp bản vẽ bố trí nội thất 3D chi tiết miễn phí cho ngôi nhà của bạn.
              </p>

              <form onSubmit={handleBannerSubmit} className="pt-4 flex flex-col sm:flex-row gap-3">
                <input
                  type="tel"
                  placeholder="Nhập số điện thoại của bạn..."
                  value={bannerPhone}
                  onChange={(e) => setBannerPhone(e.target.value)}
                  className="flex-1 h-12 px-4 bg-white/10 border border-[#3F3F46] rounded-xl text-white placeholder:text-[#71717A] text-body-sm focus:border-white focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  className="h-12 px-7 bg-white text-[#09090B] text-label-md font-label-md uppercase tracking-wider font-bold rounded-xl hover:bg-[#E4E4E7] active:scale-98 transition-all whitespace-nowrap shadow-sm"
                >
                  Đăng Ký Tư Vấn Ngay
                </button>
              </form>

              <p className="text-xs text-[#71717A] pt-1 font-mono">
                * Kiến trúc sư sẽ liên hệ lại trong vòng 30 phút trong giờ làm việc (8:30 – 20:30).
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Consultation Modal */}
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />
    </>
  );
}
