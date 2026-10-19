"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VietQRModal from "@/components/VietQRModal";
import ConsultationModal from "@/components/ConsultationModal";
import { useCart } from "@/context/CartContext";

export default function CartAndCheckoutPage() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    itemCount,
    subtotal,
    discountCode,
    discountPercent,
    discountAmount,
    shippingFee,
    total,
    applyDiscount,
    removeDiscount,
    showToast,
  } = useCart();

  const [inputVoucher, setInputVoucher] = useState(discountCode || "KOMO-MONO10");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"vietqr" | "card" | "deposit">("vietqr");
  const [isVietQRModalOpen, setIsVietQRModalOpen] = useState(false);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  // Form states
  const [fullName, setFullName] = useState("Kts. Trần Hoàng Minh");
  const [phone, setPhone] = useState("0988 742 911");
  const [email, setEmail] = useState("hoangminh.architect@komorebi-living.vn");
  const [city, setCity] = useState("TP. Hồ Chí Minh");
  const [district, setDistrict] = useState("Quận 2 (TP. Thủ Đức)");
  const [address, setAddress] = useState("Căn Penthouse P-3204, Tòa Tháp Aqua 1, Khu đô thị Ba Son, P. Bến Nghé");
  const [wantsVAT, setWantsVAT] = useState(true);
  const [companyName, setCompanyName] = useState("Công ty Cổ phần Kiến trúc & Nội thất Studio Atelier Vietnam");
  const [taxId, setTaxId] = useState("0314892015");

  // Delivery options
  const [installationOption, setInstallationOption] = useState(true);
  const [zeroWasteOption, setZeroWasteOption] = useState(true);
  const [deliveryDate, setDeliveryDate] = useState("2025-11-20");
  const [elevatorType, setElevatorType] = useState("Căn hộ chung cư cao cấp (Thang hàng kích thước > 2.2m)");
  const [deliveryNotes, setDeliveryNotes] = useState("");

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVoucher) {
      showToast("Vui lòng nhập mã ưu đãi.");
      return;
    }
    const res = applyDiscount(inputVoucher);
    if (!res.success) {
      showToast(res.message);
    }
  };

  const handleProceedToPayment = () => {
    if (items.length === 0) {
      showToast("Giỏ hàng của bạn đang trống.");
      return;
    }
    if (!fullName || !phone) {
      showToast("Vui lòng điền họ tên và số điện thoại giao nhận.");
      return;
    }

    if (selectedPaymentMethod === "vietqr") {
      setIsVietQRModalOpen(true);
    } else if (selectedPaymentMethod === "card") {
      showToast("Đang kết nối cổng thanh toán thẻ quốc tế Visa/Mastercard 3D Secure...");
      setTimeout(() => {
        setIsVietQRModalOpen(true);
      }, 800);
    } else {
      // Deposit 30%
      setIsVietQRModalOpen(true);
    }
  };

  const depositAmount = Math.round(total * 0.3);

  return (
    <>
      <Header onOpenConsultation={() => setIsConsultationOpen(true)} />

      {/* SUB-HEADER: Breadcrumbs & Checkout Progress Tracker */}
      <section className="bg-surface-container-lowest border-b border-outline-variant/40">
        <div className="max-w-7xl mx-auto px-space-md sm:px-space-lg lg:px-margin py-3 sm:py-space-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-space-md">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-label-md font-label-md text-on-surface-variant overflow-x-auto no-scrollbar whitespace-nowrap py-1">
              <Link href="/" className="hover:text-primary transition-colors flex-shrink-0">
                Trang chủ
              </Link>
              <span className="material-symbols-outlined text-xs sm:text-sm text-outline flex-shrink-0">chevron_right</span>
              <span className="text-primary font-semibold flex-shrink-0">Giỏ hàng &amp; Cấu hình</span>
              <span className="material-symbols-outlined text-xs sm:text-sm text-outline flex-shrink-0">chevron_right</span>
              <span className="text-outline flex-shrink-0">Thanh toán an toàn</span>
            </nav>

            {/* Checkout Steps Indicator */}
            <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar py-1">
              {/* Step 1 (Active) */}
              <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary text-on-primary flex items-center justify-center text-[11px] sm:text-label-sm font-label-sm font-bold">
                  1
                </span>
                <span className="text-xs sm:text-label-md font-label-md text-primary font-bold tracking-tight whitespace-nowrap">
                  Giỏ hàng &amp; Tùy chỉnh
                </span>
              </div>
              <div className="w-4 sm:w-8 h-[1px] bg-primary flex-shrink-0"></div>

              {/* Step 2 */}
              <div className="flex items-center gap-1.5 sm:gap-2 opacity-60 flex-shrink-0">
                <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-outline text-outline flex items-center justify-center text-[11px] sm:text-label-sm font-label-sm font-semibold">
                  2
                </span>
                <span className="text-xs sm:text-label-md font-label-md text-on-surface-variant whitespace-nowrap">
                  Địa chỉ &amp; Lắp đặt
                </span>
              </div>
              <div className="w-4 sm:w-8 h-[1px] bg-outline-variant flex-shrink-0"></div>

              {/* Step 3 */}
              <div className="flex items-center gap-1.5 sm:gap-2 opacity-60 flex-shrink-0">
                <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-outline text-outline flex items-center justify-center text-[11px] sm:text-label-sm font-label-sm font-semibold">
                  3
                </span>
                <span className="text-xs sm:text-label-md font-label-md text-on-surface-variant whitespace-nowrap">
                  Thanh toán
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT GRID */}
      <main className="flex-1 max-w-7xl mx-auto px-space-md sm:px-space-lg lg:px-margin py-space-xl w-full">
        {/* Editorial Title Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-lg pb-space-md border-b border-outline-variant/40 gap-4">
          <div>
            <span className="text-label-sm font-label-sm text-outline tracking-widest block mb-1">
              KOMOREBI LIVING — CẤU HÌNH ĐƠN HÀNG #KL-84920
            </span>
            <h1 className="text-headline-lg font-headline-lg text-2xl sm:text-3xl lg:text-4xl text-primary font-medium tracking-tight">
              Giỏ Hàng &amp; Cấu Hình Kiến Trúc
            </h1>
          </div>
          <div className="text-left md:text-right">
            <p className="text-label-md font-label-md text-on-surface-variant">
              Số lượng:{" "}
              <span className="text-primary font-bold">
                {itemCount.toString().padStart(2, "0")} vật phẩm độc bản
              </span>
            </p>
            <p className="text-body-sm font-body-sm text-outline text-xs">
              Đóng kiện thủ công &amp; Kiểm định vật liệu FSC®
            </p>
          </div>
        </div>

        {/* 2-COLUMN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT COLUMN: Items, White-Glove Service, Customer Form */}
          <div className="lg:col-span-7 space-y-space-xl">
            {/* SECTION 1: Product Items List */}
            <section className="bg-surface-container-lowest border border-outline-variant p-space-md sm:p-space-lg rounded-2xl shadow-sm">
              <div className="flex items-center justify-between pb-space-md border-b border-outline-variant/40 mb-space-md">
                <h2 className="text-headline-sm font-headline-sm text-lg sm:text-xl text-primary tracking-tight font-bold">
                  Danh Sách Tuyển Chọn
                </h2>
                <span className="text-label-sm font-label-sm text-outline uppercase tracking-wider">
                  Tiêu chuẩn mộc thủ công
                </span>
              </div>

              {items.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <span className="material-symbols-outlined text-4xl text-outline">shopping_bag</span>
                  <p className="text-body-md text-on-surface-variant">
                    Hiện chưa có sản phẩm nào trong giỏ hàng.
                  </p>
                  <Link
                    href="/"
                    className="inline-block mt-2 px-6 py-2.5 bg-primary text-on-primary text-label-md uppercase tracking-wider rounded-xl"
                  >
                    Khám phá bộ sưu tập mộc bản
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-outline-variant/30">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="py-space-md first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-space-md group"
                    >
                      {/* Image Ratio 4:5 */}
                      <div className="w-full sm:w-36 h-44 flex-shrink-0 bg-surface-container overflow-hidden border border-outline-variant relative rounded-xl">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="150px"
                          className="object-cover group-hover:scale-105 transition-transform duration-500 rounded-xl"
                        />
                        <span className="absolute top-2 left-2 bg-primary text-on-primary text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                          SẴN KHO
                        </span>
                      </div>

                      {/* Product Details Stack */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-label-sm font-label-sm text-outline block text-xs">
                                MÃ SP: {item.sku}
                              </span>
                              <h3 className="text-headline-sm font-headline-sm text-base sm:text-lg text-primary font-bold">
                                {item.title}
                              </h3>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              className="text-outline hover:text-error transition-colors p-1 rounded-lg"
                              title="Xóa khỏi đơn"
                              aria-label="Xóa sản phẩm"
                            >
                              <span className="material-symbols-outlined text-[18px]">close</span>
                            </button>
                          </div>

                          {/* Architectural Specs Meta Plaque */}
                          <div className="mt-2 text-xs text-on-surface-variant space-y-0.5 bg-surface-container-low p-2 px-3 border-l-2 border-primary rounded-r-lg">
                            {item.options?.wood && (
                              <p>
                                <strong className="font-semibold text-on-surface">Vật liệu:</strong>{" "}
                                {item.options.wood}
                              </p>
                            )}
                            {item.options?.size && (
                              <p>
                                <strong className="font-semibold text-on-surface">Quy cách:</strong>{" "}
                                {item.options.size}
                              </p>
                            )}
                            {item.options?.notes && (
                              <p>
                                <strong className="font-semibold text-on-surface">Cam kết:</strong>{" "}
                                {item.options.notes}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Price & Quantity Stepper */}
                        <div className="flex flex-wrap items-end justify-between mt-3 pt-2 border-t border-outline-variant/20 gap-2">
                          <div className="flex items-center gap-2">
                            {/* Quantity Stepper (Rounded) */}
                            <div className="flex items-center border border-primary rounded-lg overflow-hidden">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, -1)}
                                className="w-8 h-8 flex items-center justify-center text-primary hover:bg-surface-container transition-colors font-bold text-sm"
                                aria-label="Giảm"
                              >
                                -
                              </button>
                              <span className="w-10 h-8 flex items-center justify-center font-label-md text-label-md text-primary bg-surface-container-lowest font-bold text-sm">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, 1)}
                                className="w-8 h-8 flex items-center justify-center text-primary hover:bg-surface-container transition-colors font-bold text-sm"
                                aria-label="Tăng"
                              >
                                +
                              </button>
                            </div>

                            <Link
                              href="/san-pham/kura-lounge-chair"
                              className="text-xs text-outline hover:text-primary underline ml-2 transition-colors hidden sm:inline"
                            >
                              Đổi cấu hình mộc
                            </Link>
                          </div>

                          <div className="text-right">
                            <span className="text-xs text-outline block">
                              {item.price.toLocaleString("vi-VN")} đ / chiếc
                            </span>
                            <span className="text-headline-sm font-headline-sm text-base sm:text-lg text-primary font-bold">
                              {(item.price * item.quantity).toLocaleString("vi-VN")} đ
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Bottom Action within Cart List */}
              <div className="mt-space-md pt-space-sm border-t border-outline-variant/40 flex items-center justify-between text-label-md font-label-md">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-outline hover:text-primary transition-colors text-xs sm:text-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  Tiếp tục khám phá Bộ Sưu Tập
                </Link>
                <button
                  type="button"
                  onClick={() => showToast("Giỏ hàng đã được đồng bộ với hệ thống xưởng.")}
                  className="text-outline hover:text-primary transition-colors uppercase tracking-wider text-xs sm:text-sm"
                >
                  Cập nhật giỏ hàng
                </button>
              </div>
            </section>

            {/* SECTION 2: White-glove Delivery & Technical Assembly */}
            <section className="bg-surface-container-lowest border border-outline-variant p-space-md sm:p-space-lg rounded-2xl shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-space-sm border-b border-outline-variant/40 mb-space-md gap-2">
                <div>
                  <span className="text-label-sm font-label-sm text-outline uppercase tracking-widest block text-xs">
                    KOMOREBI WHITE-GLOVE SERVICE
                  </span>
                  <h2 className="text-headline-sm font-headline-sm text-lg sm:text-xl text-primary font-bold">
                    Dịch Vụ Vận Chuyển &amp; Kê Đặt Kiến Trúc
                  </h2>
                </div>
                <span className="px-2.5 py-1 bg-surface-container-high text-primary text-xs font-semibold border border-outline-variant self-start sm:self-auto rounded-md">
                  {subtotal > 20000000 ? "ĐÃ KÍCH HOẠT (ĐƠN > 20TR)" : "TIÊU CHUẨN XƯỞNG"}
                </span>
              </div>

              <p className="text-body-sm font-body-sm text-on-surface-variant mb-space-md text-xs sm:text-sm leading-relaxed">
                Mỗi kiện hàng Komorebi đều được đóng bọc ba lớp bảo vệ chuyên dụng và vận chuyển bằng đội xe kiểm soát vi khí hậu, đảm bảo độ ẩm mộc chuẩn xác khi bàn giao tại công trình.
              </p>

              {/* Delivery Config Options Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md mb-space-md">
                {/* Option 1 */}
                <label
                  onClick={() => setInstallationOption(!installationOption)}
                  className={`relative flex items-start gap-3 p-space-md border cursor-pointer transition-colors rounded-xl ${
                    installationOption
                      ? "border-primary bg-surface-container-low"
                      : "border-outline-variant bg-surface-container-lowest"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={installationOption}
                    onChange={(e) => setInstallationOption(e.target.checked)}
                    className="mt-1 w-[18px] h-[18px] rounded border border-primary text-primary focus:ring-0"
                  />
                  <div>
                    <span className="text-label-md font-label-md text-primary font-bold block">
                      Kê Đặt Theo Bản Vẽ Mặt Bằng
                    </span>
                    <p className="text-body-sm text-on-surface-variant text-xs mt-1">
                      Đội ngũ thợ mộc xưởng trực tiếp căn chỉnh góc ánh sáng, khớp mộng và kiểm tra độ phẳng mặt bằng sàn.
                    </p>
                    <span className="text-label-sm font-label-sm text-primary font-bold mt-2 block text-xs">
                      MIỄN PHÍ DỊCH VỤ
                    </span>
                  </div>
                </label>

                {/* Option 2 */}
                <label
                  onClick={() => setZeroWasteOption(!zeroWasteOption)}
                  className={`relative flex items-start gap-3 p-space-md border cursor-pointer transition-colors rounded-xl ${
                    zeroWasteOption
                      ? "border-primary bg-surface-container-low"
                      : "border-outline-variant bg-surface-container-lowest"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={zeroWasteOption}
                    onChange={(e) => setZeroWasteOption(e.target.checked)}
                    className="mt-1 w-[18px] h-[18px] rounded border border-primary text-primary focus:ring-0"
                  />
                  <div>
                    <span className="text-label-md font-label-md text-primary font-bold block">
                      Thu Hồi Kiện Gỗ &amp; Bao Bì Tái Chế
                    </span>
                    <p className="text-body-sm text-on-surface-variant text-xs mt-1">
                      Sau khi bàn giao, nhân sự Komorebi tiến hành dọn sạch và chuyển toàn bộ khung kiện gỗ hoàn trả về xưởng sinh thái.
                    </p>
                    <span className="text-label-sm font-label-sm text-outline mt-2 block text-xs">
                      QUY TRÌNH ZERO-WASTE
                    </span>
                  </div>
                </label>
              </div>

              {/* Scheduling and Building Access Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md pt-space-sm border-t border-outline-variant/30">
                <div>
                  <label className="block text-label-sm font-label-sm text-outline uppercase mb-1 text-xs">
                    Lịch Hẹn Bàn Giao Mong Muốn
                  </label>
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full h-[52px] bg-surface-container-lowest border border-outline-variant focus:border-primary text-body-md text-primary px-3 rounded-xl focus:outline-none"
                  />
                  <span className="text-xs text-outline block mt-1">
                    Khung giờ kỹ thuật: 09:00 - 12:00 hoặc 14:00 - 17:00
                  </span>
                </div>

                <div>
                  <label className="block text-label-sm font-label-sm text-outline uppercase mb-1 text-xs">
                    Khảo Sát Lối Vào &amp; Thang Máy Tòa Nhà
                  </label>
                  <select
                    value={elevatorType}
                    onChange={(e) => setElevatorType(e.target.value)}
                    className="w-full h-[52px] bg-surface-container-lowest border border-outline-variant focus:border-primary text-body-md text-primary px-3 rounded-xl focus:outline-none text-xs sm:text-sm"
                  >
                    <option>Căn hộ chung cư cao cấp (Thang hàng kích thước &gt; 2.2m)</option>
                    <option>Biệt thự / Nhà phố (Cầu thang bộ rộng &gt; 1.2m)</option>
                    <option>Nhà phố mặt tiền (Cần thiết bị nâng ròng rọc chuyên dụng)</option>
                    <option>Công trình đang hoàn thiện nội thất thô</option>
                  </select>
                  <span className="text-xs text-outline block mt-1">
                    Chuyên viên vận chuyển sẽ liên hệ xác nhận trước 24h
                  </span>
                </div>
              </div>

              {/* Notes */}
              <div className="mt-space-md">
                <label className="block text-label-sm font-label-sm text-outline uppercase mb-1 text-xs">
                  Ghi Chú Đặc Biệt Cho Kỹ Thuật Viên Lắp Đặt
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Vui lòng mang thảm bảo vệ sàn gỗ tự nhiên; Đăng ký thủ tục BQL tòa nhà Vinhomes..."
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  className="w-full h-[52px] bg-surface-container-lowest border border-outline-variant focus:border-primary text-body-md text-primary px-3 rounded-xl focus:outline-none text-xs sm:text-sm"
                />
              </div>
            </section>

            {/* SECTION 3: Customer Information & Delivery Address Form */}
            <section className="bg-surface-container-lowest border border-outline-variant p-space-md sm:p-space-lg rounded-2xl shadow-sm">
              <div className="pb-space-sm border-b border-outline-variant/40 mb-space-md">
                <span className="text-label-sm font-label-sm text-outline uppercase tracking-widest block text-xs">
                  HỒ SƠ KHÁCH HÀNG
                </span>
                <h2 className="text-headline-sm font-headline-sm text-lg sm:text-xl text-primary font-bold">
                  Thông Tin Người Nhận &amp; Địa Chỉ Bàn Giao
                </h2>
              </div>

              <div className="space-y-4">
                {/* Name & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                  <div>
                    <label className="block text-label-sm font-label-sm text-outline uppercase mb-1 text-xs">
                      Họ và tên quý khách *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full h-[52px] bg-surface-container-lowest border border-outline-variant focus:border-primary text-primary px-3 rounded-xl focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-label-sm font-label-sm text-outline uppercase mb-1 text-xs">
                      Số điện thoại liên hệ *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full h-[52px] bg-surface-container-lowest border border-outline-variant focus:border-primary text-primary px-3 rounded-xl focus:outline-none"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-label-sm font-label-sm text-outline uppercase mb-1 text-xs">
                    Email nhận hồ sơ bảo hành kỹ thuật *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-[52px] bg-surface-container-lowest border border-outline-variant focus:border-primary text-primary px-3 rounded-xl focus:outline-none"
                  />
                </div>

                {/* Province / District */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                  <div>
                    <label className="block text-label-sm font-label-sm text-outline uppercase mb-1 text-xs">
                      Tỉnh / Thành phố *
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full h-[52px] bg-surface-container-lowest border border-outline-variant focus:border-primary text-primary px-3 rounded-xl focus:outline-none"
                    >
                      <option>TP. Hồ Chí Minh</option>
                      <option>Hà Nội</option>
                      <option>Đà Nẵng</option>
                      <option>Bình Dương</option>
                      <option>Bà Rịa - Vũng Tàu</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-label-sm font-label-sm text-outline uppercase mb-1 text-xs">
                      Quận / Huyện *
                    </label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full h-[52px] bg-surface-container-lowest border border-outline-variant focus:border-primary text-primary px-3 rounded-xl focus:outline-none"
                    >
                      <option>Quận 2 (TP. Thủ Đức)</option>
                      <option>Quận 1</option>
                      <option>Quận 3</option>
                      <option>Quận 7 (Phú Mỹ Hưng)</option>
                      <option>Quận Bình Thạnh</option>
                    </select>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-label-sm font-label-sm text-outline uppercase mb-1 text-xs">
                    Địa chỉ chi tiết / Tên Biệt Thự / Mã Căn Hộ *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full h-[52px] bg-surface-container-lowest border border-outline-variant focus:border-primary text-primary px-3 rounded-xl focus:outline-none"
                  />
                </div>

                {/* VAT invoice */}
                <div className="pt-space-sm border-t border-outline-variant/30">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={wantsVAT}
                      onChange={(e) => setWantsVAT(e.target.checked)}
                      className="w-[18px] h-[18px] rounded border border-primary text-primary focus:ring-0"
                    />
                    <span className="text-label-md font-label-md text-primary font-semibold text-xs sm:text-sm">
                      Xuất hóa đơn điện tử VAT cho công ty thiết kế kiến trúc / Doanh nghiệp
                    </span>
                  </label>

                  {wantsVAT && (
                    <div className="mt-space-sm pl-7 grid grid-cols-1 md:grid-cols-2 gap-space-md animate-in fade-in">
                      <input
                        type="text"
                        placeholder="Tên doanh nghiệp"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full h-[44px] bg-surface-container-low border border-outline-variant text-body-sm text-primary px-3 rounded-xl focus:outline-none text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Mã số thuế"
                        value={taxId}
                        onChange={(e) => setTaxId(e.target.value)}
                        className="w-full h-[44px] bg-surface-container-low border border-outline-variant text-body-sm text-primary px-3 rounded-xl focus:outline-none text-xs"
                      />
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: Order Summary, Voucher, Payment Method (Sticky) */}
          <div className="lg:col-span-5 space-y-space-md lg:sticky lg:top-28">
            {/* Order Summary Card */}
            <div className="bg-surface-container-lowest border border-outline-variant p-space-md sm:p-space-lg rounded-2xl shadow-sm">
              <div className="pb-space-sm border-b border-outline-variant mb-space-md flex items-center justify-between">
                <h2 className="text-headline-sm font-headline-sm text-lg sm:text-xl text-primary font-bold tracking-tight">
                  Tóm Tắt Đơn Hàng
                </h2>
                <span className="text-label-sm font-label-sm text-outline uppercase tracking-wider text-xs">
                  VND (VIỆT NAM ĐỒNG)
                </span>
              </div>

              {/* Price Ledger Breakdown */}
              <div className="space-y-3 pb-space-md border-b border-outline-variant/30 text-body-sm">
                <div className="flex items-center justify-between text-on-surface-variant">
                  <span>Tạm tính giá trị sản phẩm ({itemCount} món)</span>
                  <span className="text-on-surface font-semibold">
                    {subtotal.toLocaleString("vi-VN")} đ
                  </span>
                </div>

                {/* Discount */}
                {discountAmount > 0 && (
                  <div className="flex items-center justify-between text-on-surface">
                    <div className="flex items-center gap-1.5">
                      <span>Ưu đãi BST Mùa Thu</span>
                      <span className="px-1.5 py-0.5 bg-surface-container text-[11px] font-mono border border-outline-variant text-primary font-bold rounded-md">
                        {discountCode}
                      </span>
                    </div>
                    <span className="font-bold text-primary">
                      - {discountAmount.toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                )}

                {/* Delivery */}
                <div className="flex items-center justify-between text-on-surface-variant">
                  <div>
                    <span>Vận chuyển &amp; Lắp đặt White-glove</span>
                    <span className="block text-[11px] text-outline">
                      Đội xe chuyên dụng &amp; Thợ mộc xưởng
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="line-through text-outline text-xs block">1.500.000 đ</span>
                    <span className="text-primary font-semibold text-xs">0 đ (Miễn phí)</span>
                  </div>
                </div>

                {/* Insurance */}
                <div className="flex items-center justify-between text-on-surface-variant">
                  <span>Bảo hiểm rủi ro &amp; Đóng kiện gỗ mộc</span>
                  <span className="text-primary font-semibold text-xs">Đã bao gồm</span>
                </div>

                {/* VAT */}
                <div className="flex items-center justify-between text-on-surface-variant">
                  <span>Thuế giá trị gia tăng (VAT 8%)</span>
                  <span className="text-xs text-outline">Đã tính trong giá niêm yết</span>
                </div>
              </div>

              {/* Total */}
              <div className="py-space-md border-b border-outline-variant">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-label-md font-label-md text-outline uppercase tracking-wider block text-xs">
                      Tổng Thanh Toán Trọn Gói
                    </span>
                    <span className="text-xs text-outline">
                      Cam kết không phát sinh phụ phí tại công trình
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-headline-md font-headline-md text-2xl sm:text-3xl text-primary font-bold tracking-tight">
                      {total.toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                </div>
              </div>

              {/* Voucher Application */}
              <div className="py-space-md border-b border-outline-variant/30">
                <label className="block text-label-sm font-label-sm text-outline uppercase mb-2 text-xs">
                  Mã Đặc Quyền Kiến Trúc Sư / Voucher
                </label>
                <form onSubmit={handleApplyVoucher} className="flex items-stretch gap-2">
                  <input
                    type="text"
                    value={inputVoucher}
                    onChange={(e) => setInputVoucher(e.target.value)}
                    placeholder="MÃ VOUCHER..."
                    className="flex-1 min-w-0 h-11 bg-surface-container-low border border-primary text-label-md text-primary px-3 uppercase font-mono rounded-xl focus:outline-none text-xs sm:text-sm"
                  />
                  <button
                    type="submit"
                    className="px-3 sm:px-4 bg-surface-container text-primary text-label-md font-label-md border border-outline-variant hover:bg-primary hover:text-on-primary transition-colors text-xs uppercase rounded-xl flex-shrink-0"
                  >
                    Áp dụng
                  </button>
                  {discountPercent > 0 && (
                    <button
                      type="button"
                      onClick={removeDiscount}
                      className="px-2 text-outline hover:text-error transition-colors text-xs"
                      title="Gỡ mã"
                    >
                      Hủy
                    </button>
                  )}
                </form>

                {discountPercent > 0 && (
                  <p className="text-label-sm font-label-sm text-primary mt-1.5 flex items-center gap-1 text-xs">
                    <span className="material-symbols-outlined text-sm text-emerald-600">check_circle</span>
                    Đã giảm trực tiếp {discountPercent}% cho thành viên Komorebi Atelier
                  </p>
                )}
              </div>

              {/* Payment Methods */}
              <div className="py-space-md space-y-2.5">
                <label className="block text-label-sm font-label-sm text-outline uppercase mb-1 text-xs">
                  Phương Thức Thanh Toán Cao Cấp
                </label>

                {/* Option 1: VietQR */}
                <label
                  onClick={() => setSelectedPaymentMethod("vietqr")}
                  className={`block border p-space-md cursor-pointer transition-colors rounded-xl ${
                    selectedPaymentMethod === "vietqr"
                      ? "border-primary bg-surface-container-low"
                      : "border-outline-variant bg-surface-container-lowest hover:border-primary"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="payment_method"
                        checked={selectedPaymentMethod === "vietqr"}
                        onChange={() => setSelectedPaymentMethod("vietqr")}
                        className="w-[18px] h-[18px] rounded-full border border-primary text-primary focus:ring-0"
                      />
                      <span className="text-label-md font-label-md text-primary font-bold text-xs sm:text-sm">
                        Chuyển Khoản QR Tự Động (VietQR / Napas247)
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-primary text-xl">qr_code_2</span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-2 pl-6">
                    Tạo mã QR định danh theo đơn đặt. Xác nhận hệ thống tức thì trong 30 giây, không cần gửi ủy nhiệm chi.
                  </p>
                </label>

                {/* Option 2: Card */}
                <label
                  onClick={() => setSelectedPaymentMethod("card")}
                  className={`block border p-space-md cursor-pointer transition-colors rounded-xl ${
                    selectedPaymentMethod === "card"
                      ? "border-primary bg-surface-container-low"
                      : "border-outline-variant bg-surface-container-lowest hover:border-primary"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="payment_method"
                        checked={selectedPaymentMethod === "card"}
                        onChange={() => setSelectedPaymentMethod("card")}
                        className="w-[18px] h-[18px] rounded-full border border-primary text-primary focus:ring-0"
                      />
                      <span className="text-label-md font-label-md text-primary font-bold text-xs sm:text-sm">
                        Thẻ Quốc Tế (Visa / Mastercard / Amex)
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-outline text-lg">credit_card</span>
                  </div>
                  <div className="pl-6 mt-1 flex items-center justify-between text-xs text-on-surface-variant">
                    <span>Trả góp 0% lãi suất qua 28 ngân hàng</span>
                    <span className="font-bold text-primary">
                      ~ {Math.round(total / 12).toLocaleString("vi-VN")} đ / tháng (12 kỳ)
                    </span>
                  </div>
                </label>

                {/* Option 3: Deposit 30% */}
                <label
                  onClick={() => setSelectedPaymentMethod("deposit")}
                  className={`block border p-space-md cursor-pointer transition-colors rounded-xl ${
                    selectedPaymentMethod === "deposit"
                      ? "border-primary bg-surface-container-low"
                      : "border-outline-variant bg-surface-container-lowest hover:border-primary"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="payment_method"
                        checked={selectedPaymentMethod === "deposit"}
                        onChange={() => setSelectedPaymentMethod("deposit")}
                        className="w-[18px] h-[18px] rounded-full border border-primary text-primary focus:ring-0"
                      />
                      <span className="text-label-md font-label-md text-primary font-bold text-xs sm:text-sm">
                        Thanh Toán Cọc 30% — Còn Lại Khi Nghiệm Thu
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-outline text-lg">verified</span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-2 pl-6">
                    Đặt cọc {depositAmount.toLocaleString("vi-VN")} đ giữ phôi gỗ tại xưởng. Thanh toán 70% còn lại sau khi gia chủ ký biên bản nghiệm thu mộc.
                  </p>
                </label>
              </div>

              {/* Primary Action Button */}
              <div className="mt-space-md pt-space-xs">
                <button
                  type="button"
                  onClick={handleProceedToPayment}
                  className="w-full bg-primary text-on-primary text-label-md font-label-md tracking-widest uppercase py-4 px-8 rounded-xl hover:bg-[#27272A] active:scale-99 transition-all duration-150 flex items-center justify-center gap-2 group shadow-xl"
                >
                  <span>
                    {selectedPaymentMethod === "deposit"
                      ? `Xác Nhận Đặt Cọc (${depositAmount.toLocaleString("vi-VN")} đ)`
                      : "Xác Nhận Đặt Hàng & Thanh Toán"}
                  </span>
                  <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </button>
                <p className="text-xs text-center text-outline mt-2">
                  Bằng việc xác nhận, quý khách đồng ý với Điều Khoản Dịch Vụ Mộc Bản của Komorebi.
                </p>
              </div>
            </div>

            {/* Trust Assurances Plaque */}
            <div className="bg-surface-container-lowest border border-outline-variant p-space-md rounded-2xl shadow-sm">
              <span className="text-label-sm font-label-sm text-outline uppercase tracking-wider block mb-space-sm border-b border-outline-variant/30 pb-1 text-xs">
                CAM KẾT CHẤT LƯỢNG MỘC BẢN KOMOREBI
              </span>
              <div className="grid grid-cols-1 gap-space-sm text-xs">
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-primary text-lg mt-0.5">verified_user</span>
                  <div>
                    <strong className="text-primary font-bold block">Bảo Hành Kết Cấu 10 Năm</strong>
                    <p className="text-on-surface-variant">Bảo hành mộng gỗ âm dương, độ võng mặt bàn và khung ghế nguyên bản.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-primary text-lg mt-0.5">published_with_changes</span>
                  <div>
                    <strong className="text-primary font-bold block">Đổi Trả 30 Ngày Không Phí</strong>
                    <p className="text-on-surface-variant">Đổi mới nguyên trạng nếu phát hiện bất kỳ lỗi mộc hoặc sai lệch màu gỗ thiết kế.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-primary text-lg mt-0.5">humidity_mid</span>
                  <div>
                    <strong className="text-primary font-bold block">Kiểm Định Độ Ẩm Gỗ Chuẩn Khí Hậu &lt;12%</strong>
                    <p className="text-on-surface-variant">Gỗ sấy nhiệt chân không hạn chế tối đa cong vênh dưới khí hậu nhiệt đới ẩm Việt Nam.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ARCHITECTURAL SPECIFICATION TABLE */}
        <section className="mt-space-2xl pt-space-xl border-t border-outline-variant">
          <div className="mb-space-md">
            <span className="text-label-sm font-label-sm text-outline uppercase tracking-widest block text-xs">
              HỒ SƠ THÔNG SỐ VẬT TƯ &amp; XUẤT XỨ
            </span>
            <h2 className="text-headline-md font-headline-md text-2xl sm:text-3xl text-primary font-bold tracking-tight">
              Bảng Chi Tiết Tiêu Chuẩn Gia Công Của Đơn Hàng
            </h2>
          </div>

          <div className="overflow-x-auto border border-outline-variant bg-surface-container-lowest rounded-2xl shadow-sm">
            <table className="w-full min-w-[640px] text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/60 bg-surface-container-low text-xs sm:text-sm">
                  <th className="py-3 px-4 text-label-md font-label-md text-primary uppercase font-bold">
                    Mục Kiểm Tra
                  </th>
                  <th className="py-3 px-4 text-label-md font-label-md text-primary uppercase font-bold">
                    Tiêu Chuẩn Komorebi Living
                  </th>
                  <th className="py-3 px-4 text-label-md font-label-md text-primary uppercase font-bold">
                    Chứng Nhận Kèm Theo
                  </th>
                  <th className="py-3 px-4 text-label-md font-label-md text-primary uppercase font-bold">
                    Trạng Thái
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30 text-xs sm:text-sm">
                <tr>
                  <td className="py-3 px-4 text-label-md text-outline uppercase font-semibold">
                    Nguồn gốc gỗ Sồi
                  </td>
                  <td className="py-3 px-4 text-on-surface">
                    Rừng trồng bền vững Bắc Mỹ &amp; Hokkaido, sấy lò tự động 45 ngày
                  </td>
                  <td className="py-3 px-4 text-on-surface-variant">
                    FSC® Chain of Custody C149811
                  </td>
                  <td className="py-3 px-4 text-primary font-semibold">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base text-emerald-600">check</span>
                      Đã nghiệm thu
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-label-md text-outline uppercase font-semibold">
                    Chất liệu Da bọc
                  </td>
                  <td className="py-3 px-4 text-on-surface">
                    Da bò lớp một Full-grain Aniline nhập khẩu từ vùng Vicenza (Ý)
                  </td>
                  <td className="py-3 px-4 text-on-surface-variant">
                    Chứng nhận LWG Gold Rated Tannery
                  </td>
                  <td className="py-3 px-4 text-primary font-semibold">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base text-emerald-600">check</span>
                      Đã nghiệm thu
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-label-md text-outline uppercase font-semibold">
                    Dầu bảo vệ bề mặt
                  </td>
                  <td className="py-3 px-4 text-on-surface">
                    Dầu khoáng thảo mộc tự nhiên không chứa VOC / Formaldehyde
                  </td>
                  <td className="py-3 px-4 text-on-surface-variant">
                    Tiêu chuẩn an toàn đồ chơi trẻ em EN 71-3
                  </td>
                  <td className="py-3 px-4 text-primary font-semibold">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base text-emerald-600">check</span>
                      Đã nghiệm thu
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-label-md text-outline uppercase font-semibold">
                    Kỹ thuật liên kết
                  </td>
                  <td className="py-3 px-4 text-on-surface">
                    Khớp mộng âm dương truyền thống Nhật Bản (Kanawa Tsugi / Jigoku-gumi)
                  </td>
                  <td className="py-3 px-4 text-on-surface-variant">
                    Kiểm định tải trọng tĩnh JIS S 1021
                  </td>
                  <td className="py-3 px-4 text-primary font-semibold">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base text-emerald-600">check</span>
                      Đã nghiệm thu
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <Footer />

      {/* VietQR Modal */}
      <VietQRModal
        isOpen={isVietQRModalOpen}
        onClose={() => setIsVietQRModalOpen(false)}
        orderCode="KL84920"
        totalAmount={selectedPaymentMethod === "deposit" ? depositAmount : total}
      />

      {/* Consultation Modal */}
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />
    </>
  );
}
