"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ConsultationModal from "@/components/ConsultationModal";
import ShowroomModal from "@/components/ShowroomModal";
import { useCart } from "@/context/CartContext";

const galleryImages = [
  {
    id: "front",
    label: "Chính diện",
    src: "/images/kura-front.jpg",
    desc: "Góc nhìn chính diện phô diễn tỷ lệ hình học cân bằng và lưng tựa mộng sồi.",
  },
  {
    id: "joinery",
    label: "Mộng gỗ",
    src: "/images/kura-joinery.jpg",
    desc: "Cận cảnh kỹ thuật mộng âm dương Kigumi không dùng đinh kim loại.",
  },
  {
    id: "angle",
    label: "Góc nghiêng",
    src: "/images/kura-angle.jpg",
    desc: "Độ nghiêng công thái học 105 độ nâng đỡ cột sống hoàn hảo.",
  },
  {
    id: "room",
    label: "Phối cảnh mẫu",
    src: "/images/kura-room.jpg",
    desc: "Ghế Kura trong không gian ánh sáng tự nhiên Komorebi Living.",
  },
];

const woodOptions = [
  { id: "oak", name: "Gỗ Sồi tự nhiên (Natural Oak)", priceExtra: 0, tag: "Tiêu chuẩn" },
  { id: "walnut", name: "Gỗ Óc Chó (American Walnut)", priceExtra: 1200000, tag: "+ 1.200.000đ" },
  { id: "ash", name: "Tần Bì hun khói (Smoked Ash)", priceExtra: 600000, tag: "+ 600.000đ" },
];

const upholsteryOptions = [
  { id: "leather", name: "Da bò sáp Ý", color: "Nâu Cognac", sampleColor: "#844b25" },
  { id: "boucle", name: "Vải Bouclé", color: "Trắng kem ngà", sampleColor: "#f3efe6" },
  { id: "linen", name: "Vải Linen Bỉ", color: "Xám tro mộc", sampleColor: "#9e9a93" },
];

const sizeOptions = [
  {
    id: "standard",
    title: "Tiêu chuẩn Nhật Bản",
    desc: "D840 x R760 x C780 mm",
    sub: "Phù hợp mọi căn hộ tiêu chuẩn",
  },
  {
    id: "custom",
    title: "Đặt may đo riêng",
    desc: "Tùy biến theo phòng khách",
    sub: "+ Khảo sát tận nơi miễn phí",
  },
];

export default function ProductDetailPage() {
  const { addToCart, showToast, toggleWishlist, isWishlisted } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedWood, setSelectedWood] = useState(woodOptions[0]);
  const [selectedUpholstery, setSelectedUpholstery] = useState(upholsteryOptions[0]);
  const [selectedSize, setSelectedSize] = useState(sizeOptions[0]);
  const [shippingLocation, setShippingLocation] = useState("hcm-hanoi");
  const [accordionOpen, setAccordionOpen] = useState({
    specs: true,
    finish: false,
    warranty: false,
  });

  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [isShowroomOpen, setIsShowroomOpen] = useState(false);
  const [isWoodComparisonOpen, setIsWoodComparisonOpen] = useState(false);
  const [isARModalOpen, setIsARModalOpen] = useState(false);

  // Dynamic price calculation
  const basePrice = 14800000;
  const currentPrice = basePrice + selectedWood.priceExtra;
  const originalPrice = Math.round(currentPrice / 0.9);
  const monthlyInstallment = Math.round(currentPrice / 12);

  const handleAddToCart = () => {
    addToCart({
      id: "product-kura-chair",
      sku: "KL-LOU-01",
      title: "Ghế Thư Giãn Gỗ Sồi Kura Lounge Chair",
      subtitle: `${selectedWood.name} • ${selectedUpholstery.name} (${selectedUpholstery.color})`,
      price: currentPrice,
      originalPrice: originalPrice,
      image: galleryImages[selectedImageIndex].src,
      quantity: 1,
      options: {
        wood: selectedWood.name,
        upholstery: `${selectedUpholstery.name} - ${selectedUpholstery.color}`,
        size: `${selectedSize.title}: ${selectedSize.desc}`,
        notes: "Chế tác độc bản Atelier Kyoto 2025",
      },
    });
  };

  return (
    <>
      <Header onOpenConsultation={() => setIsConsultationOpen(true)} />

      <main className="flex-1 w-full max-w-7xl mx-auto px-space-md sm:px-space-lg lg:px-margin py-6 sm:py-10">
        {/* BREADCRUMBS */}
        <nav className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-label-md font-label-md text-on-surface-variant mb-4 sm:mb-8 overflow-x-auto no-scrollbar whitespace-nowrap py-1">
          <Link href="/" className="hover:text-primary transition-colors flex-shrink-0">
            Trang chủ
          </Link>
          <span className="material-symbols-outlined text-xs sm:text-sm text-outline flex-shrink-0">chevron_right</span>
          <Link href="/#phong-khach" className="hover:text-primary transition-colors flex-shrink-0">
            Phòng khách
          </Link>
          <span className="material-symbols-outlined text-xs sm:text-sm text-outline flex-shrink-0">chevron_right</span>
          <span className="hover:text-primary transition-colors flex-shrink-0">Ghế thư giãn</span>
          <span className="material-symbols-outlined text-xs sm:text-sm text-outline flex-shrink-0">chevron_right</span>
          <span className="text-primary font-bold flex-shrink-0">Kura Lounge Chair</span>
        </nav>

        {/* 2-COLUMN MAIN PRODUCT INTERACTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-start">
          {/* LEFT COLUMN: Gallery & Feature Badges */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            {/* Main Stage Image */}
            <div className="relative aspect-[4/3] sm:aspect-[5/4] bg-surface-container overflow-hidden border border-outline-variant group shadow-sm rounded-2xl lg:rounded-3xl">
              <Image
                src={galleryImages[selectedImageIndex].src}
                alt={galleryImages[selectedImageIndex].label}
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover group-hover:scale-103 transition-transform duration-500 rounded-2xl lg:rounded-3xl"
                priority
              />

              {/* Tag Top Left */}
              <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-primary text-on-primary text-[10px] sm:text-label-sm font-label-sm px-2 sm:px-2.5 py-0.5 sm:py-1 tracking-wider uppercase font-bold shadow-sm rounded-md">
                Chế tác độc bản 2025
              </span>

              {/* Label Bottom Left */}
              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 max-w-[55%] sm:max-w-none truncate bg-white/90 backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 border border-outline-variant/60 text-[10px] sm:text-xs text-primary font-medium rounded-xl">
                <span className="truncate block">{selectedWood.name.split("(")[0]} • {selectedUpholstery.name} {selectedUpholstery.color}</span>
              </div>

              {/* AR & Zoom Buttons */}
              <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 flex items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() => setIsARModalOpen(true)}
                  className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-white/95 backdrop-blur-md border border-outline-variant text-[11px] sm:text-label-sm font-label-sm text-primary hover:bg-primary hover:text-on-primary transition-colors flex items-center gap-1 sm:gap-1.5 shadow-sm rounded-xl"
                >
                  <span className="material-symbols-outlined text-base">view_in_ar</span>
                  <span className="hidden xs:inline sm:inline">Mô phỏng AR</span>
                </button>
                <button
                  type="button"
                  onClick={() => showToast("Mở chế độ phóng to chi tiết vân gỗ.")}
                  className="p-1 sm:p-1.5 bg-white/95 backdrop-blur-md border border-outline-variant text-primary hover:bg-primary hover:text-on-primary transition-colors shadow-sm rounded-xl"
                  title="Phóng to ảnh"
                >
                  <span className="material-symbols-outlined text-base">zoom_in</span>
                </button>
              </div>
            </div>

            {/* 4 Thumbnails */}
            <div className="grid grid-cols-4 gap-3 sm:gap-4">
              {galleryImages.map((img, idx) => {
                const isSelected = selectedImageIndex === idx;
                return (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative block w-full aspect-square border transition-all text-left group overflow-hidden rounded-xl ${
                      isSelected
                        ? "border-primary ring-2 ring-primary ring-offset-2"
                        : "border-outline-variant hover:border-primary opacity-80 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img.src}
                      alt={img.label}
                      fill
                      sizes="15vw"
                      className="object-cover rounded-xl"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1 text-center">
                      <span className="text-[11px] font-medium text-white block truncate">
                        {img.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 3 Badges below Gallery */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-outline-variant/40">
              <div className="p-3 bg-surface-container-low border border-outline-variant/60 flex items-start gap-3 rounded-xl">
                <span className="material-symbols-outlined text-xl text-primary mt-0.5">handyman</span>
                <div>
                  <strong className="text-label-md font-label-md text-primary block">
                    Mộng Gỗ Kỹ Thuật
                  </strong>
                  <span className="text-body-sm text-outline text-xs">
                    Không dùng đinh kim loại
                  </span>
                </div>
              </div>

              <div className="p-3 bg-surface-container-low border border-outline-variant/60 flex items-start gap-3 rounded-xl">
                <span className="material-symbols-outlined text-xl text-primary mt-0.5">forest</span>
                <div>
                  <strong className="text-label-md font-label-md text-primary block">
                    Gỗ Rừng FSC 100%
                  </strong>
                  <span className="text-body-sm text-outline text-xs">
                    Khai thác bền vững Bắc Mỹ
                  </span>
                </div>
              </div>

              <div className="p-3 bg-surface-container-low border border-outline-variant/60 flex items-start gap-3 rounded-xl">
                <span className="material-symbols-outlined text-xl text-primary mt-0.5">verified_user</span>
                <div>
                  <strong className="text-label-md font-label-md text-primary block">
                    Bảo Hành 10 Năm
                  </strong>
                  <span className="text-body-sm text-outline text-xs">
                    Bảo trì khung gỗ trọn đời
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Product Configurator Panel (Sticky on Desktop) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-label-sm font-label-sm text-outline uppercase tracking-widest font-mono">
                  KOMOREBI LIVING • ATELIER 2025
                </span>
                <span className="text-label-sm font-label-sm text-primary flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  Sẵn sàng giao trong 3-5 ngày
                </span>
              </div>

              <h1 className="text-headline-lg font-headline-lg text-2xl sm:text-3xl text-primary font-bold tracking-tight">
                Ghế Thư Giãn Gỗ Sồi Kura Lounge Chair
              </h1>

              <p className="text-body-md font-body-md text-on-surface-variant mt-2 leading-relaxed">
                Thiết kế tối giản lấy cảm hứng từ phong vị trà đạo Kyoto và đường nét uốn lượn Scandinavian. Ghế sở hữu độ ngả 105° chuẩn công thái học nâng đỡ toàn diện cột sống.
              </p>
            </div>

            {/* Price Box */}
            <div className="p-4 bg-surface-container-low border border-outline-variant rounded-2xl shadow-sm">
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                <div>
                  <span className="text-label-sm font-label-sm text-outline uppercase tracking-wider block text-xs">
                    Tổng giá trị sản phẩm
                  </span>
                  <div className="flex items-baseline gap-2 sm:gap-3 mt-1">
                    <span className="text-headline-md font-headline-md text-2xl sm:text-3xl font-bold text-primary">
                      {currentPrice.toLocaleString("vi-VN")} đ
                    </span>
                    <span className="text-body-sm text-outline line-through text-xs sm:text-sm">
                      {originalPrice.toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                </div>

                <span className="px-2.5 py-1 bg-primary text-on-primary text-label-sm font-label-sm font-bold uppercase rounded-md self-start sm:self-auto">
                  Tiết kiệm 10%
                </span>
              </div>

              <div className="pt-2 border-t border-outline-variant/40 flex flex-col xs:flex-row xs:items-center justify-between text-body-sm text-on-surface-variant gap-1">
                <span className="flex items-center gap-1 text-xs">
                  <span className="material-symbols-outlined text-base">credit_card</span>
                  Trả góp 0% lãi suất:
                </span>
                <span className="font-semibold text-primary text-xs sm:text-sm">
                  Từ {monthlyInstallment.toLocaleString("vi-VN")} đ / tháng (12 kỳ)
                </span>
              </div>
            </div>

            {/* Configurator 1: Wood selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-label-md font-label-md text-primary font-bold uppercase">
                  1. Loại gỗ cao cấp:
                </span>
                <button
                  type="button"
                  onClick={() => setIsWoodComparisonOpen(true)}
                  className="text-label-sm font-label-sm text-outline hover:text-primary underline transition-colors"
                >
                  So sánh vân gỗ
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {woodOptions.map((w) => {
                  const isChecked = selectedWood.id === w.id;
                  return (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => setSelectedWood(w)}
                      className={`p-3 border text-left transition-all rounded-xl ${
                        isChecked
                          ? "border-primary bg-primary text-on-primary"
                          : "border-outline-variant bg-surface-container-lowest text-on-surface hover:border-primary"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <strong className="text-label-md block">{w.name.split("(")[0]}</strong>
                        {isChecked && (
                          <span className="material-symbols-outlined text-sm">check</span>
                        )}
                      </div>
                      <span className={`text-xs mt-1 block ${isChecked ? "text-white/80" : "text-outline"}`}>
                        {w.priceExtra === 0 ? "+ 0 đ" : `+ ${w.priceExtra.toLocaleString("vi-VN")} đ`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Configurator 2: Upholstery */}
            <div>
              <span className="text-label-md font-label-md text-primary font-bold uppercase block mb-2">
                2. Đệm &amp; Bọc nệm:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {upholsteryOptions.map((u) => {
                  const isChecked = selectedUpholstery.id === u.id;
                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => setSelectedUpholstery(u)}
                      className={`p-3 border text-left flex items-center gap-3 transition-all rounded-xl ${
                        isChecked
                          ? "border-primary bg-surface-container-low ring-1 ring-primary"
                          : "border-outline-variant bg-surface-container-lowest hover:border-primary"
                      }`}
                    >
                      <span
                        className="w-5 h-5 rounded-full border border-black/20 flex-shrink-0"
                        style={{ backgroundColor: u.sampleColor }}
                      ></span>
                      <div>
                        <strong className="text-label-sm font-label-sm block text-primary">{u.name}</strong>
                        <span className="text-xs text-outline block">{u.color}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Configurator 3: Size */}
            <div>
              <span className="text-label-md font-label-md text-primary font-bold uppercase block mb-2">
                3. Kích thước ghế:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {sizeOptions.map((s) => {
                  const isChecked = selectedSize.id === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`p-3 border text-left transition-all rounded-xl ${
                        isChecked
                          ? "border-primary bg-surface-container-low ring-1 ring-primary"
                          : "border-outline-variant bg-surface-container-lowest hover:border-primary"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <strong className="text-label-md font-bold text-primary">{s.title}</strong>
                        {isChecked && (
                          <span className="material-symbols-outlined text-sm text-primary">check_circle</span>
                        )}
                      </div>
                      <p className="text-xs text-on-surface-variant mt-1">{s.desc}</p>
                      <span className="text-[11px] text-outline block mt-0.5">{s.sub}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Shipping Estimator */}
            <div className="p-4 bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-label-sm font-label-sm text-outline uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">local_shipping</span>
                  Ước tính vận chuyển &amp; Lắp đặt tận nhà
                </span>
                <span className="px-2 py-0.5 bg-primary text-on-primary text-[10px] uppercase font-bold rounded-md">
                  Đội kỹ thuật Komorebi
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 mb-2">
                <select
                  value={shippingLocation}
                  onChange={(e) => setShippingLocation(e.target.value)}
                  className="w-full sm:flex-1 h-11 px-3 bg-surface-container-low border border-outline-variant text-body-sm text-primary focus:border-primary focus:outline-none rounded-xl text-xs sm:text-sm"
                >
                  <option value="hcm-hanoi">Hà Nội / TP.HCM - Nội thành</option>
                  <option value="suburban">Ngoại thành / Tỉnh lân cận</option>
                  <option value="nationwide">Các tỉnh thành khác trên toàn quốc</option>
                </select>
                <button
                  type="button"
                  onClick={() => showToast("Đã tính cước: Đơn hàng đủ điều kiện miễn phí vận chuyển & lắp đặt!")}
                  className="w-full sm:w-auto h-11 px-4 bg-surface-container text-primary text-label-sm font-label-sm border border-outline-variant hover:bg-primary hover:text-on-primary transition-colors rounded-xl text-xs sm:text-sm uppercase font-semibold"
                >
                  Tính cước
                </button>
              </div>

              <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between text-body-sm text-on-surface-variant pt-1.5 border-t border-outline-variant/30 gap-1">
                <span className="text-xs flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-emerald-600">check</span>
                  Miễn phí lắp đặt hoàn thiện &amp; kê dọn bao bì
                </span>
                <strong className="text-primary text-xs font-bold uppercase">
                  {shippingLocation === "hcm-hanoi" ? "Miễn phí giao hàng" : "Hỗ trợ 50% cước đóng kiện"}
                </strong>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-2.5 sm:space-y-3 pt-2">
              <div className="flex gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 sm:py-4 px-3 sm:px-6 bg-primary text-on-primary text-xs sm:text-label-md font-label-md uppercase tracking-wider sm:tracking-widest hover:bg-[#27272A] active:scale-99 transition-all flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg group rounded-xl"
                >
                  <span className="material-symbols-outlined text-lg sm:text-xl">shopping_bag</span>
                  <span>Thêm Vào Giỏ Hàng</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleWishlist("kura-lounge-chair")}
                  className={`w-12 sm:w-14 min-w-[48px] sm:min-w-[56px] border flex items-center justify-center transition-all rounded-xl ${
                    isWishlisted("kura-lounge-chair")
                      ? "border-red-600 bg-red-50 text-red-600"
                      : "border-primary text-primary hover:bg-surface-container"
                  }`}
                  title={
                    isWishlisted("kura-lounge-chair")
                      ? "Bỏ khỏi danh sách yêu thích"
                      : "Lưu vào danh sách yêu thích"
                  }
                  aria-label="Yêu thích"
                >
                  <span className="material-symbols-outlined text-xl sm:text-2xl">
                    {isWishlisted("kura-lounge-chair") ? "favorite" : "favorite_border"}
                  </span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsShowroomOpen(true)}
                className="w-full py-3 sm:py-3.5 px-4 sm:px-8 border border-primary text-primary text-xs sm:text-label-md font-label-md uppercase tracking-wider hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2 rounded-xl"
              >
                <span className="material-symbols-outlined text-base sm:text-lg">storefront</span>
                <span>Đặt Lịch Thử Tại Showroom</span>
              </button>
            </div>

            {/* Trust Assurances */}
            <div className="grid grid-cols-3 gap-1 sm:gap-2 text-center text-[10px] sm:text-xs text-outline py-2.5 border-y border-outline-variant/40 rounded-xl">
              <span className="flex flex-col xs:flex-row items-center justify-center gap-0.5 sm:gap-1">
                <span className="material-symbols-outlined text-sm">shield</span> <span>Bảo hành 10 năm</span>
              </span>
              <span className="flex flex-col xs:flex-row items-center justify-center gap-0.5 sm:gap-1">
                <span className="material-symbols-outlined text-sm">published_with_changes</span> <span>Đổi trả 30 ngày</span>
              </span>
              <span className="flex flex-col xs:flex-row items-center justify-center gap-0.5 sm:gap-1">
                <span className="material-symbols-outlined text-sm">lock</span> <span>Thanh toán an toàn</span>
              </span>
            </div>

            {/* Collapsible Accordions */}
            <div className="space-y-2 pt-2">
              {/* Accordion 1: Specs */}
              <div className="border border-outline-variant rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() =>
                    setAccordionOpen((prev) => ({ ...prev, specs: !prev.specs }))
                  }
                  className="w-full p-3.5 bg-surface-container-low flex items-center justify-between text-label-md font-label-md text-primary font-bold text-left"
                >
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">straighten</span>
                    Thông số kỹ thuật &amp; Cam kết xưởng
                  </span>
                  <span className="material-symbols-outlined text-sm">
                    {accordionOpen.specs ? "expand_less" : "expand_more"}
                  </span>
                </button>

                {accordionOpen.specs && (
                  <div className="p-4 bg-surface-container-lowest text-body-sm space-y-2 border-t border-outline-variant/40">
                    <div className="grid grid-cols-2 gap-2 py-1 border-b border-outline-variant/20">
                      <span className="text-outline">Kích thước tổng thể:</span>
                      <strong className="text-right text-primary">Dài 840 x Rộng 760 x Cao 780 mm</strong>
                    </div>
                    <div className="grid grid-cols-2 gap-2 py-1 border-b border-outline-variant/20">
                      <span className="text-outline">Chiều cao mặt ngồi:</span>
                      <strong className="text-right text-primary">390 mm</strong>
                    </div>
                    <div className="grid grid-cols-2 gap-2 py-1 border-b border-outline-variant/20">
                      <span className="text-outline">Độ sâu lòng đệm:</span>
                      <strong className="text-right text-primary">560 mm</strong>
                    </div>
                    <div className="grid grid-cols-2 gap-2 py-1 border-b border-outline-variant/20">
                      <span className="text-outline">Tải trọng thử nghiệm:</span>
                      <strong className="text-right text-primary">180 kg (Tiêu chuẩn JIS S 1021)</strong>
                    </div>
                    <div className="grid grid-cols-2 gap-2 py-1">
                      <span className="text-outline">Trọng lượng ghế nguyên khối:</span>
                      <strong className="text-right text-primary">19.5 kg</strong>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 2: Finish & Eco standards */}
              <div className="border border-outline-variant rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() =>
                    setAccordionOpen((prev) => ({ ...prev, finish: !prev.finish }))
                  }
                  className="w-full p-3.5 bg-surface-container-low flex items-center justify-between text-label-md font-label-md text-primary font-bold text-left"
                >
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">brush</span>
                    Sơn gốc nước an toàn &amp; Tiêu chuẩn xử lý
                  </span>
                  <span className="material-symbols-outlined text-sm">
                    {accordionOpen.finish ? "expand_less" : "expand_more"}
                  </span>
                </button>

                {accordionOpen.finish && (
                  <div className="p-4 bg-surface-container-lowest text-body-sm text-on-surface-variant space-y-2 border-t border-outline-variant/40">
                    <p>
                      Ghế được phủ 7 lớp dầu thực vật tự nhiên Osmo (Đức) chiết xuất từ hoa hướng dương, đậu nành và hạt gai dầu.
                    </p>
                    <p className="text-xs text-outline">
                      • Hoàn toàn không chứa Formaldehyde, VOC &lt; 5g/L.<br />
                      • Đạt chuẩn an toàn đồ chơi trẻ em EN 71-3 Châu Âu.
                    </p>
                  </div>
                )}
              </div>

              {/* Accordion 3: Warranty */}
              <div className="border border-outline-variant rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() =>
                    setAccordionOpen((prev) => ({ ...prev, warranty: !prev.warranty }))
                  }
                  className="w-full p-3.5 bg-surface-container-low flex items-center justify-between text-label-md font-label-md text-primary font-bold text-left"
                >
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">verified</span>
                    Chính sách đổi trả 30 ngày &amp; Bảo hành
                  </span>
                  <span className="material-symbols-outlined text-sm">
                    {accordionOpen.warranty ? "expand_less" : "expand_more"}
                  </span>
                </button>

                {accordionOpen.warranty && (
                  <div className="p-4 bg-surface-container-lowest text-body-sm text-on-surface-variant space-y-2 border-t border-outline-variant/40">
                    <p>
                      Đổi mới nguyên bản 1-1 trong 30 ngày nếu phát hiện bất kỳ lỗi mộc hoặc cong vênh vật liệu.
                    </p>
                    <p className="text-xs text-outline">
                      • Bảo hành kết cấu mộng âm dương 10 năm.<br />
                      • Miễn phí vệ sinh và đánh sáp dưỡng mộc định kỳ mỗi 12 tháng.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM CRAFTSMANSHIP STORY SECTION */}
        <section className="mt-space-2xl pt-space-xl border-t border-outline-variant">
          <div className="max-w-3xl mb-12">
            <span className="text-label-sm font-label-sm text-outline uppercase tracking-widest block mb-1">
              TRIẾT LÝ CHẾ TÁC
            </span>
            <h2 className="text-headline-lg font-headline-lg text-3xl sm:text-4xl text-primary font-medium tracking-tight">
              Hòa sắc thiên nhiên trong đường nét tối giản
            </h2>
            <p className="text-body-md font-body-md text-on-surface-variant mt-3 leading-relaxed">
              Mỗi chiếc ghế Kura được người thợ mộc gọt giũa thủ công qua hơn 48 giờ làm việc, kết nối mộng gỗ âm dương truyền thống không sử dụng một chiếc đinh kim loại nào.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Story Card 1 */}
            <div className="border border-outline-variant bg-surface-container-lowest overflow-hidden group rounded-2xl shadow-sm">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src="/images/story-wood-grain.jpg"
                  alt="Vân gỗ tuyển chọn cho ghế Kura"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <h3 className="font-headline-sm text-lg text-primary font-bold mb-2">
                  Vân gỗ tuyển chọn
                </h3>
                <p className="text-body-sm text-on-surface-variant leading-relaxed">
                  Chỉ những thân gỗ sồi Bắc Mỹ đạt vân núi đồng đều trên 25 năm tuổi mới được chọn cho dòng ghế Kura.
                </p>
              </div>
            </div>

            {/* Story Card 2 */}
            <div className="border border-outline-variant bg-surface-container-lowest overflow-hidden group rounded-2xl shadow-sm">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src="/images/story-wax-leather.jpg"
                  alt="Da bò sáp thuộc thảo mộc"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <h3 className="font-headline-sm text-lg text-primary font-bold mb-2">
                  Da bò sáp thuộc thảo mộc
                </h3>
                <p className="text-body-sm text-on-surface-variant leading-relaxed">
                  Đệm da bò Ý thuộc bằng vỏ cây sồi tự nhiên, tạo độ mềm êm và hình thành lớp gỉ patina bóng đẹp theo thời gian.
                </p>
              </div>
            </div>

            {/* Story Card 3 */}
            <div className="border border-outline-variant bg-surface-container-lowest overflow-hidden group rounded-2xl shadow-sm">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src="/images/story-ergonomic-shoji.jpg"
                  alt="Độ ngả công thái học 105 độ"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <h3 className="font-headline-sm text-lg text-primary font-bold mb-2">
                  Độ ngả công thái học 105°
                </h3>
                <p className="text-body-sm text-on-surface-variant leading-relaxed">
                  Tính toán phân bổ lực đều giữa thắt lưng và bắp đùi, mang lại cảm giác nâng đỡ tựa như thiền định.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Modals */}
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />

      <ShowroomModal
        isOpen={isShowroomOpen}
        onClose={() => setIsShowroomOpen(false)}
        productName="Ghế Thư Giãn Gỗ Sồi Kura Lounge Chair"
      />

      {/* Wood Comparison Modal */}
      {isWoodComparisonOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in"
          role="dialog"
        >
          <div className="bg-surface-container-lowest border border-outline max-w-xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 text-primary space-y-4 rounded-2xl sm:rounded-3xl shadow-2xl">
            <div className="flex items-center justify-between border-b border-outline-variant pb-3">
              <h3 className="text-base sm:text-headline-sm font-bold">Bảng So Sánh Vân Gỗ Quý Komorebi</h3>
              <button
                type="button"
                onClick={() => setIsWoodComparisonOpen(false)}
                className="p-1 text-outline hover:text-primary rounded-lg"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-3 text-body-sm">
              <div className="p-3 bg-surface-container-low border border-outline-variant rounded-xl">
                <strong className="text-primary block font-headline-sm text-sm sm:text-base">Gỗ Sồi Tự Nhiên (White Oak)</strong>
                <p className="text-on-surface-variant mt-1 text-xs">Tone màu sáng ấm, vân núi đều đặn, độ cứng cao và chống co ngót tốt dưới khí hậu Việt Nam.</p>
              </div>
              <div className="p-3 bg-surface-container-low border border-outline-variant rounded-xl">
                <strong className="text-primary block font-headline-sm text-sm sm:text-base">Gỗ Óc Chó (American Walnut)</strong>
                <p className="text-on-surface-variant mt-1 text-xs">Tone màu nâu socola trầm sang trọng, vân sóng cuộn tự nhiên mềm mại, biểu tượng của sự tĩnh tại quyền quý.</p>
              </div>
              <div className="p-3 bg-surface-container-low border border-outline-variant rounded-xl">
                <strong className="text-primary block font-headline-sm text-sm sm:text-base">Tần Bì Hun Khói (Smoked Ash)</strong>
                <p className="text-on-surface-variant mt-1 text-xs">Được xử lý nhiệt tạo tone màu than xám thâm trầm, phong vị Wabi-sabi Nhật Bản cổ điển.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsWoodComparisonOpen(false)}
              className="w-full py-2.5 sm:py-3 bg-primary text-on-primary text-xs sm:text-label-md uppercase tracking-wider rounded-xl hover:bg-[#27272a] transition-colors"
            >
              Đã hiểu
            </button>
          </div>
        </div>
      )}

      {/* AR Simulation Modal */}
      {isARModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in"
          role="dialog"
        >
          <div className="bg-surface-container-lowest border border-outline max-w-lg w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 text-primary space-y-4 text-center rounded-2xl sm:rounded-3xl shadow-2xl">
            <span className="material-symbols-outlined text-4xl sm:text-5xl text-primary">view_in_ar</span>
            <h3 className="text-base sm:text-headline-sm font-bold">Mô Phỏng 3D / Thực Tế Ảo (AR)</h3>
            <p className="text-xs sm:text-body-sm text-on-surface-variant">
              Quét mã QR dưới đây bằng điện thoại (iOS / Android) để đặt trực tiếp ghế Kura Lounge Chair tỷ lệ 1:1 vào phòng khách của bạn:
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://komorebi-living.vn/ar/kura-lounge-chair"
              alt="Mã QR xem mô hình 3D AR"
              className="w-36 h-36 sm:w-40 sm:h-40 mx-auto border border-outline p-2 bg-white rounded-xl shadow-inner"
            />
            <button
              type="button"
              onClick={() => setIsARModalOpen(false)}
              className="w-full sm:w-auto px-6 py-2.5 sm:py-3 bg-primary text-on-primary text-xs sm:text-label-md uppercase tracking-wider rounded-xl hover:bg-[#27272a] transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </>
  );
}
