"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ConsultationModal from "@/components/ConsultationModal";
import HeartButton from "@/components/HeartButton";
import ValueCard from "@/components/ValueCard";
import NeumorphicCard from "@/components/NeumorphicCard";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { getFeaturedProducts, submitConsultationToDb } from "@/services/productService";

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

const initialProductsData: Product[] = [
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

const productsEnTranslation: Record<
  string,
  { title: string; subtitle: string; tag: string; space: string }
> = {
  p1: {
    title: "Kura Lounge Chair",
    subtitle: "Solid Oak • Handcrafted in Kyoto",
    tag: "Nordic Oak / -15% Special",
    space: "Living Room",
  },
  p2: {
    title: "Nordic Cloud Sofa",
    subtitle: "Pine Frame • Goose Down Cushion",
    tag: "Natural Linen Fabric",
    space: "Living Room",
  },
  p3: {
    title: "Mori Oak Dining Table",
    subtitle: "Extendable 1.8m - 2.4m",
    tag: "FSC White Oak",
    space: "Dining Room",
  },
  p4: {
    title: "Wabi Paper Pendant Lamp",
    subtitle: "Bamboo Frame • LED 2700K Warm",
    tag: "Handmade Washi Paper",
    space: "Dining Room",
  },
  p5: {
    title: "Kanso Coffee Table",
    subtitle: "Solid American Walnut Monolith",
    tag: "American Walnut",
    space: "Living Room",
  },
  p6: {
    title: "Zen Platform Bed",
    subtitle: "Solid Oak Frame • Kigumi Interlocking",
    tag: "Italian Leather & Oak",
    space: "Bedroom",
  },
};

export default function HomePage() {
  const { addToCart, toggleWishlist, isWishlisted, showToast } = useCart();
  const { lang, t } = useLanguage();
  const [productsList, setProductsList] = useState<Product[]>(initialProductsData);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [selectedSpaceIndex, setSelectedSpaceIndex] = useState(0);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [priceFilter, setPriceFilter] = useState("all");
  const [showroomOnly, setShowroomOnly] = useState(false);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [bannerPhone, setBannerPhone] = useState("");

  useEffect(() => {
    getFeaturedProducts<Product>(initialProductsData, (item) => ({
      id: item.id,
      sku: item.sku,
      title: item.title,
      subtitle: item.description || item.title,
      price: item.price,
      originalPrice: item.original_price || Math.round(item.price * 1.15),
      tag: item.tag || "Mộc bản FAS",
      ratingCount: 36,
      image: item.image,
      space:
        item.category_id === "cat-living"
          ? "Phòng Khách"
          : item.category_id === "cat-bedroom"
          ? "Phòng Ngủ"
          : "Phòng Ăn",
      material: item.material,
      inStockShowroom: true,
      slug: item.slug,
    })).then((res) => {
      if (res && res.length > 0) setProductsList(res);
    });
  }, []);

  const spaceTabs = [
    { key: "Phòng Khách", label: t.home.spaceLivingRoom },
    { key: "Phòng Ăn", label: t.home.spaceDiningRoom },
    { key: "Phòng Ngủ", label: t.home.spaceBedroom },
    { key: "Góc Làm Việc Yên Tĩnh", label: t.home.spaceWorkRoom },
  ];

  const materialChips = [
    { key: "Gỗ Teak", label: lang === "VN" ? "Gỗ Teak" : "Teak Wood" },
    { key: "Gỗ Walnut", label: lang === "VN" ? "Gỗ Walnut" : "Walnut Wood" },
    { key: "Da bò Ý", label: lang === "VN" ? "Da bò Ý" : "Italian Leather" },
    { key: "Linen tự nhiên", label: lang === "VN" ? "Linen tự nhiên" : "Natural Linen" },
  ];

  // Filter products
  const filteredProducts = productsList.filter((item) => {
    if (selectedMaterial && item.material !== selectedMaterial) {
      return false;
    }
    if (showroomOnly && !item.inStockShowroom) {
      return false;
    }
    if (priceFilter === "under-10m" && item.price >= 10000000) return false;
    if (priceFilter === "10-25m" && (item.price < 10000000 || item.price > 25000000)) return false;
    if (priceFilter === "above-25m" && item.price <= 25000000) return false;

    return true;
  });

  const displayedProducts = showAllProducts ? filteredProducts : filteredProducts.slice(0, 4);

  const handleBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerPhone) {
      showToast(t.home.phoneRequiredError);
      return;
    }
    await submitConsultationToDb({
      phone: bannerPhone,
      spaceType: "Tư vấn khảo sát từ Banner Trang Chủ",
    });
    showToast(t.home.ctaToast(bannerPhone));
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
                  {t.home.heroTag}
                </span>
              </div>

              <h1 className="font-headline-lg lg:font-display-lg text-3xl sm:text-4xl md:text-5xl xl:text-6xl text-on-background leading-[1.15] tracking-tight">
                {t.home.heroHeadline} <br className="hidden sm:inline" />
                <span className="italic font-normal text-primary">
                  {t.home.heroHeadlineAccent}
                </span>
              </h1>

              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl leading-relaxed text-sm sm:text-base lg:text-lg">
                {t.home.heroSubheadline}
              </p>

              <div className="pt-1 sm:pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <a
                  href="#bo-suu-tap"
                  className="inline-flex items-center justify-center px-6 py-3.5 bg-primary text-on-primary text-label-md font-label-md tracking-wider uppercase rounded-xl hover:bg-[#27272a] dark:bg-white dark:text-[#09090b] dark:hover:bg-[#e4e4e7] transition-all shadow-sm active:scale-95 group text-xs sm:text-sm font-bold"
                >
                  <span className="dark:text-[#09090b]">{t.home.heroExploreBtn}</span>
                  <span className="material-symbols-outlined ml-2 text-base transition-transform group-hover:translate-x-1 dark:text-[#09090b]">
                    arrow_forward
                  </span>
                </a>
                <button
                  type="button"
                  onClick={() => setIsConsultationOpen(true)}
                  className="inline-flex items-center justify-center px-6 py-3.5 border border-[#18181B] text-on-surface text-label-md font-label-md tracking-wider uppercase rounded-xl hover:bg-surface-container transition-all active:scale-95 text-xs sm:text-sm"
                >
                  <span>{t.home.heroConsultBtn}</span>
                </button>
              </div>

              {/* Editorial Micro-metrics */}
              <div className="pt-6 sm:pt-8 border-t border-outline-variant grid grid-cols-3 gap-2 sm:gap-6">
                <div>
                  <p className="font-headline-md text-xl sm:text-2xl lg:text-3xl text-primary font-bold">
                    {t.home.metric1Value}
                  </p>
                  <p className="font-label-sm text-[10px] sm:text-[11px] text-on-surface-variant uppercase tracking-wider mt-0.5 sm:mt-1">
                    {t.home.metric1Label}
                  </p>
                </div>
                <div>
                  <p className="font-headline-md text-xl sm:text-2xl lg:text-3xl text-primary font-bold">
                    {t.home.metric2Value}
                  </p>
                  <p className="font-label-sm text-[10px] sm:text-[11px] text-on-surface-variant uppercase tracking-wider mt-0.5 sm:mt-1">
                    {t.home.metric2Label}
                  </p>
                </div>
                <div>
                  <p className="font-headline-md text-xl sm:text-2xl lg:text-3xl text-primary font-bold">
                    {t.home.metric3Value}
                  </p>
                  <p className="font-label-sm text-[10px] sm:text-[11px] text-on-surface-variant uppercase tracking-wider mt-0.5 sm:mt-1">
                    {t.home.metric3Label}
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
                      {t.home.featuredSpecTag}
                    </span>
                    <Link
                      href="/san-pham/kura-lounge-chair"
                      className="font-headline-sm text-sm sm:text-base lg:text-lg text-primary hover:underline font-bold block"
                    >
                      {lang === "VN" ? "Kura Lounge Chair • Sồi Tự Nhiên" : "Kura Lounge Chair • Solid Oak"}
                    </Link>
                    <p className="text-body-sm text-outline text-[11px] sm:text-xs mt-0.5">
                      {t.home.featuredCraftOrigin}
                    </p>
                  </div>
                  <div className="text-left xs:text-right pt-1 xs:pt-0 border-t xs:border-t-0 border-outline-variant/30">
                    <span className="font-label-lg text-primary font-bold block text-sm sm:text-base">
                      14.800.000 {t.common.currency}
                    </span>
                    <span className="text-label-sm text-on-surface-variant flex items-center xs:justify-end gap-1 mt-0.5 text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      {t.home.featuredReady}
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
                {t.home.spacesSubtitle}
              </span>
              <h2 className="text-headline-lg font-headline-lg text-2xl sm:text-3xl lg:text-4xl text-primary font-medium tracking-tight">
                {t.home.spacesHeading}
              </h2>
            </div>

            {/* Room Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap no-scrollbar">
              {spaceTabs.map((tab, idx) => {
                const isActive = selectedSpaceIndex === idx;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => {
                      setSelectedSpaceIndex(idx);
                      setShowAllProducts(false);
                    }}
                    className={`px-3.5 sm:px-4 py-2 text-label-md font-label-md tracking-wider uppercase rounded-xl transition-colors whitespace-nowrap text-xs sm:text-sm flex-shrink-0 ${
                      isActive
                        ? "bg-primary text-on-primary font-bold shadow-xs dark:bg-white dark:text-[#09090b] dark:hover:bg-[#e4e4e7]"
                        : "bg-surface-container-low text-on-surface hover:bg-surface-container border border-outline-variant/40"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Filters Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 bg-surface-container-low border border-outline-variant/60 rounded-2xl mb-6 sm:mb-8">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 sm:flex-wrap w-full sm:w-auto no-scrollbar">
              <span className="text-label-sm font-label-sm text-outline uppercase mr-1 flex items-center gap-1 text-xs whitespace-nowrap flex-shrink-0">
                <span className="material-symbols-outlined text-sm">tune</span> {t.home.filterLabel}
              </span>
              {materialChips.map((chip) => {
                const isSelected = selectedMaterial === chip.key;
                return (
                  <button
                    key={chip.key}
                    type="button"
                    onClick={() => setSelectedMaterial(isSelected ? null : chip.key)}
                    className={`px-2.5 sm:px-3 py-1.5 text-label-sm font-label-sm uppercase rounded-lg transition-colors border text-xs whitespace-nowrap flex-shrink-0 ${
                      isSelected
                        ? "bg-primary text-on-primary border-primary font-bold dark:bg-white dark:text-[#09090b] dark:border-white"
                        : "bg-surface-container-lowest text-on-surface border-outline-variant hover:border-primary"
                    }`}
                  >
                    {chip.label}
                  </button>
                );
              })}

              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="px-2.5 sm:px-3 py-1.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-label-sm font-label-sm text-on-surface focus:outline-none text-xs flex-shrink-0"
              >
                <option value="all">{t.home.priceAll}</option>
                <option value="under-10m">{t.home.priceUnder10m}</option>
                <option value="10-25m">{t.home.price10to25m}</option>
                <option value="above-25m">{t.home.priceAbove25m}</option>
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
                {t.home.filterShowroom}
              </span>
            </label>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
            {displayedProducts.map((product) => {
              const wishlisted = isWishlisted(product.id);
              const enData = productsEnTranslation[product.id];
              const displayTitle = lang === "EN" && enData ? enData.title : product.title;
              const displaySubtitle = lang === "EN" && enData ? enData.subtitle : product.subtitle;
              const displayTag = lang === "EN" && enData ? enData.tag : product.tag;

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
                        alt={displayTitle}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>

                    {/* Tag */}
                    <span className="absolute top-3 left-3 bg-white/95 dark:bg-[#18181b]/90 backdrop-blur-sm text-primary dark:text-white text-label-sm font-label-sm px-2.5 py-1 rounded-md border border-outline-variant/60 dark:border-white/20 shadow-sm text-xs font-semibold">
                      {displayTag}
                    </span>

                    {/* Heart button */}
                    <HeartButton
                      isLiked={wishlisted}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(product.id);
                      }}
                      className="absolute top-3 right-3 z-20"
                      size="sm"
                      ariaLabel={`Yêu thích ${displayTitle}`}
                    />
                  </div>

                  {/* Content Info */}
                  <div className="p-4 flex flex-col flex-1 justify-between">
                    <div>
                      {/* Rating stars */}
                      <div className="flex items-center gap-1 text-[13px] text-amber-500 mb-1">
                        {"★★★★★"}
                        <span className="text-zinc-500 dark:text-zinc-300 text-xs ml-1 font-mono">({product.ratingCount})</span>
                      </div>

                      <Link
                        href={`/san-pham/${product.slug}`}
                        className="font-headline-sm text-base text-primary font-bold hover:underline block"
                      >
                        {displayTitle}
                      </Link>
                      <p className="text-body-sm text-zinc-600 dark:text-zinc-200 text-xs mt-0.5">{displaySubtitle}</p>
                    </div>

                    {/* Price and Cart button */}
                    <div className="flex items-center justify-between pt-4 mt-3 border-t border-outline-variant/30">
                      <div>
                        <span className="font-headline-sm text-base text-primary font-bold block">
                          {product.price.toLocaleString(lang === "VN" ? "vi-VN" : "en-US")} {t.common.currency}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-zinc-400 dark:text-zinc-400 line-through">
                            {product.originalPrice.toLocaleString(lang === "VN" ? "vi-VN" : "en-US")} {t.common.currency}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          addToCart({
                            id: product.id,
                            sku: product.sku,
                            title: displayTitle,
                            subtitle: displaySubtitle,
                            price: product.price,
                            originalPrice: product.originalPrice,
                            image: product.image,
                            quantity: 1,
                          });
                          showToast(t.home.inCartToast);
                        }}
                        className="p-2.5 border border-outline-variant rounded-xl transition-all text-on-surface hover:bg-primary hover:border-primary hover:text-on-primary dark:border-white/20 dark:text-white dark:hover:bg-white dark:hover:border-white dark:hover:text-[#09090b] group/cartbtn cursor-pointer"
                        title={t.home.addToCart}
                        aria-label={t.home.addToCart}
                      >
                        <span className="material-symbols-outlined text-[18px] block group-hover/cartbtn:text-[#09090b]">
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
              className="px-8 py-3.5 bg-primary text-on-primary text-label-md font-label-md uppercase tracking-wider rounded-xl hover:bg-[#27272a] dark:bg-white dark:text-[#09090b] dark:hover:bg-[#e4e4e7] transition-all inline-flex items-center gap-2 font-bold shadow-sm"
            >
              <span className="dark:text-[#09090b]">{showAllProducts ? t.home.viewLess : t.home.viewMore}</span>
              <span className={`material-symbols-outlined text-sm transition-transform dark:text-[#09090b] ${showAllProducts ? "rotate-180" : ""}`}>
                expand_more
              </span>
            </button>
          </div>
        </section>

        {/* PHILOSOPHY SECTION */}
        <section id="triet-ly" className="py-space-xl px-space-md lg:px-margin max-w-7xl mx-auto border-t border-outline-variant/40">
          <div className="max-w-2xl mb-12">
            <span className="text-label-sm font-label-sm text-outline uppercase tracking-widest block mb-1">
              {t.home.philosophyTag}
            </span>
            <h2 className="text-headline-lg font-headline-lg text-3xl sm:text-4xl text-primary font-medium tracking-tight">
              {t.home.philosophyHeading}
            </h2>
            <p className="text-body-md font-body-md text-on-surface-variant mt-3 leading-relaxed">
              {t.home.philosophyDesc}
            </p>
          </div>

          {/* 3 Value Cards (Tunnel Depth Effect) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ValueCard
              index={0}
              icon="forest"
              title={t.home.val1Title}
              description={t.home.val1Desc}
              subText={t.home.val1Sub}
              subIcon="verified"
            />
            <ValueCard
              index={1}
              icon="hardware"
              title={t.home.val2Title}
              description={t.home.val2Desc}
              subText={t.home.val2Sub}
              subIcon="handyman"
            />
            <ValueCard
              index={2}
              icon="workspace_premium"
              title={t.home.val3Title}
              description={t.home.val3Desc}
              subText={t.home.val3Sub}
              subIcon="shield"
            />
          </div>
        </section>

        {/* WORKSHOP BANNER SECTION */}
        <section id="xuong-moc" className="py-space-md px-space-md lg:px-margin max-w-7xl mx-auto">
          <NeumorphicCard className="grid grid-cols-1 lg:grid-cols-12 items-stretch overflow-hidden">
            <div className="lg:col-span-7 p-8 sm:p-12 lg:py-16 lg:pl-16 lg:pr-10 flex flex-col justify-center space-y-4">
              <span className="text-label-sm font-label-sm text-[#71717a] uppercase tracking-widest block font-medium">
                {t.home.workshopTag}
              </span>
              <h3 className="text-headline-md font-headline-md text-2xl sm:text-3xl lg:text-4xl text-primary font-bold tracking-tight">
                {t.home.workshopHeading}
              </h3>
              <p className="text-body-md text-[#52525b] max-w-xl leading-relaxed">
                {t.home.workshopDesc}
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsConsultationOpen(true)}
                  className="inline-flex items-center gap-2 text-label-md font-label-md text-primary font-bold hover:underline"
                >
                  <span>{t.home.workshopLink}</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 relative w-full aspect-[16/10] lg:aspect-auto min-h-[280px] sm:min-h-[340px] lg:min-h-full overflow-hidden">
              <Image
                src="/images/artisan-woodworker.jpg"
                alt="Thợ mộc Komorebi bào gỗ tại xưởng chế tác thủ công"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </NeumorphicCard>
        </section>

        {/* CONSULTATION CTA BANNER */}
        <section id="tu-van" className="py-space-xl px-space-md lg:px-margin max-w-7xl mx-auto">
          <div className="bg-[#09090B] text-white p-space-lg sm:p-space-xl lg:p-14 border border-outline-variant rounded-2xl sm:rounded-3xl relative overflow-hidden shadow-2xl">
            <div className="max-w-2xl space-y-4 relative z-10">
              <span className="text-label-sm font-label-sm text-[#A1A1AA] uppercase tracking-widest block font-mono">
                {t.home.ctaTag}
              </span>
              <h2 className="text-headline-md font-headline-md text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                {t.home.ctaHeading}
              </h2>
              <p className="text-body-sm text-[#D4D4D8] leading-relaxed">
                {t.home.ctaDesc}
              </p>

              <form onSubmit={handleBannerSubmit} className="pt-4 flex flex-col sm:flex-row gap-3">
                <input
                  type="tel"
                  placeholder={t.home.ctaInputPlaceholder}
                  value={bannerPhone}
                  onChange={(e) => setBannerPhone(e.target.value)}
                  className="flex-1 h-12 px-4 bg-white/10 border border-[#3F3F46] rounded-xl text-white placeholder:text-[#71717A] text-body-sm focus:border-white focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  className="h-12 px-7 bg-white text-[#09090B] text-label-md font-label-md uppercase tracking-wider font-bold rounded-xl hover:bg-[#E4E4E7] active:scale-98 transition-all whitespace-nowrap shadow-sm"
                >
                  {t.home.ctaSubmitBtn}
                </button>
              </form>

              <p className="text-xs text-[#71717A] pt-1 font-mono">
                {t.home.ctaNotice}
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
