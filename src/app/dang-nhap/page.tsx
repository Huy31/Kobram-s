"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

type AuthMode = "signin" | "register";
type Role = "client" | "architect";

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useCart();
  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  const [role, setRole] = useState<Role>("client");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lang, setLang] = useState<"VN" | "EN">("VN");

  // Form states
  const [fullName, setFullName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [studioName, setStudioName] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [agreedFSC, setAgreedFSC] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      showToast("Vui lòng điền đầy đủ thông tin đăng nhập.");
      return;
    }
    if (authMode === "register" && !fullName) {
      showToast("Vui lòng nhập họ và tên của bạn.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (authMode === "signin") {
        showToast(`Đăng nhập thành công! Chào mừng hội viên: ${identifier}`);
      } else {
        showToast(
          role === "architect"
            ? `Chúc mừng KTS ${fullName} đã gia nhập Mạng lưới Đối tác Komorebi!`
            : `Chúc mừng quý khách ${fullName} đã trở thành thành viên Komorebi Circle!`
        );
      }
      router.push("/tai-khoan");
    }, 700);
  };

  const handleSSO = (provider: string, isLocked?: boolean) => {
    if (isLocked || provider === "Apple ID" || provider === "ArchID") {
      showToast(
        `Cổng xác thực qua ${provider} tạm thời đang bảo trì nâng cấp. Quý khách vui lòng đăng nhập qua Google hoặc Email.`
      );
      return;
    }
    showToast(`Đang kết nối xác thực 1 chạm với ${provider}...`);
    setTimeout(() => {
      showToast(`Đăng nhập thành công với ${provider}! Đang chuyển hướng...`);
      router.push("/tai-khoan");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-[#1A1C1C] flex flex-col justify-between selection:bg-black selection:text-white font-sans">
      {/* TOP BRAND HEADER (Linear Portal Shell Navigation) */}
      <header className="w-full bg-white border-b border-[#E4E4E7] px-4 sm:px-6 lg:px-12 py-3 z-30 transition-all duration-150">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          {/* Left: Logo & Back Link */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-black font-headline-md text-xl sm:text-2xl font-bold tracking-tight hover:opacity-85 transition-opacity"
            >
              <span>Komorebi Living</span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 border border-black/20 text-[#71717A] ml-2 tracking-widest hidden sm:inline-block">
                Studio
              </span>
            </Link>

            <div className="h-4 w-px bg-[#E4E4E7] hidden md:block" />

            <Link
              href="/"
              className="hidden md:flex items-center gap-1.5 text-[#71717A] hover:text-black transition-colors duration-150 text-xs sm:text-sm group"
            >
              <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform duration-200">
                arrow_back
              </span>
              <span>Quay lại cửa hàng</span>
            </Link>
          </div>

          {/* Right: Controls (Language & Member Support) */}
          <div className="flex items-center gap-4">
            {/* Lang Switcher */}
            <div className="flex items-center border border-[#E4E4E7] p-0.5 bg-[#F4F4F5] text-xs font-semibold rounded-lg">
              <button
                type="button"
                onClick={() => setLang("VN")}
                className={`px-2 py-0.5 transition-colors rounded-md ${
                  lang === "VN" ? "bg-white text-black shadow-xs font-bold" : "text-[#71717A] hover:text-black"
                }`}
              >
                VN
              </button>
              <button
                type="button"
                onClick={() => setLang("EN")}
                className={`px-2 py-0.5 transition-colors rounded-md ${
                  lang === "EN" ? "bg-white text-black shadow-xs font-bold" : "text-[#71717A] hover:text-black"
                }`}
              >
                EN
              </button>
            </div>

            <div className="h-4 w-px bg-[#E4E4E7]" />

            {/* Member Assistance */}
            <button
              type="button"
              onClick={() => showToast("Đang kết nối trung tâm hỗ trợ thành viên Komorebi Atelier...")}
              className="flex items-center gap-1.5 text-xs text-[#71717A] hover:text-black transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">support_agent</span>
              <span className="hidden sm:inline">Trợ giúp thành viên</span>
            </button>

            {/* Security Pill */}
            <div className="hidden lg:flex items-center gap-1 px-2.5 py-1 bg-[#F4F4F5] border border-[#E4E4E7] text-[#71717A] text-[10px] uppercase tracking-wider font-mono rounded-full">
              <span className="material-symbols-outlined text-[14px] text-black">lock</span>
              <span>Mã hóa E2E 256-bit</span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN VIEWPORT CONTAINER: Asymmetric Architectural Editorial Split Screen */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-0">
        {/* LEFT PANEL: Architectural Brand & Art Immersion (7 Cols Desktop) */}
        <section className="lg:col-span-7 relative bg-black flex flex-col justify-between p-5 sm:p-10 lg:p-14 border-b lg:border-b-0 lg:border-r border-[#E4E4E7] overflow-hidden text-white min-h-[280px] sm:min-h-[400px] lg:min-h-auto">
          {/* Architectural Background Visual */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/circle-auth-hero.jpg"
              alt="Architectural black and white photography of a serene Japandi minimalist living room with dappled Komorebi sunlight"
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              priority
              className="object-cover grayscale contrast-125 opacity-70 hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/60" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.15)_0%,transparent_60%),radial-gradient(circle_at_80%_70%,rgba(0,0,0,0.5)_0%,transparent_70%)] pointer-events-none mix-blend-soft-light" />
          </div>

          {/* Top Section: Architectural Heritage Tag */}
          <div className="relative z-10 flex items-center justify-between text-white/90">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full" />
              <span className="text-[11px] font-mono uppercase tracking-widest text-white/90">
                Komorebi Circle • Japanese Woodworking
              </span>
            </div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-white/70">
              Archival Series 2025
            </span>
          </div>

          {/* Middle Section: Hero Editorial Statement */}
          <div className="relative z-10 my-4 sm:my-8 lg:my-14 max-w-xl text-white">
            <p className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.2em] text-white/80 mb-2 sm:mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[15px] sm:text-[16px]">nature</span>
              <span>Triết lý Mộc bản &amp; Tối giản</span>
            </p>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15] mb-2 sm:mb-4">
              Chạm vào tĩnh tại.<br />
              Định hình không gian sống.
            </h1>
            <p className="text-white/85 max-w-lg font-light leading-relaxed text-xs sm:text-sm lg:text-base">
              Cổng đặc quyền dành riêng cho khách hàng sở hữu nội thất thủ công nguyên khối và các kiến trúc sư thực hành phong cách tĩnh mịch Wabi-Sabi.
            </p>
          </div>

          {/* Bottom Section: Circle Privileges Bento & Artisan Quote */}
          <div className="relative z-10 space-y-4">
            {/* Bento Privileges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/20 border border-white/20 backdrop-blur-sm rounded-xl overflow-hidden">
              <div className="bg-black/50 p-2.5 sm:p-3 hover:bg-black/70 transition-colors">
                <span className="material-symbols-outlined text-white text-[18px] sm:text-[20px] mb-1">carpenter</span>
                <p className="text-[11px] sm:text-xs uppercase tracking-wider font-semibold text-white">Tích điểm chế tác</p>
                <p className="text-white/70 text-[10px] sm:text-[11px] leading-tight mt-0.5">Nhận ưu đãi gỗ tuyển</p>
              </div>

              <div className="bg-black/50 p-2.5 sm:p-3 hover:bg-black/70 transition-colors">
                <span className="material-symbols-outlined text-white text-[18px] sm:text-[20px] mb-1">verified</span>
                <p className="text-[11px] sm:text-xs uppercase tracking-wider font-semibold text-white">Bảo hành trọn đời</p>
                <p className="text-white/70 text-[10px] sm:text-[11px] leading-tight mt-0.5">Mộng gỗ &amp; kết cấu</p>
              </div>

              <div className="bg-black/50 p-2.5 sm:p-3 hover:bg-black/70 transition-colors">
                <span className="material-symbols-outlined text-white text-[18px] sm:text-[20px] mb-1">auto_stories</span>
                <p className="text-[11px] sm:text-xs uppercase tracking-wider font-semibold text-white">Kyoto Archive</p>
                <p className="text-white/70 text-[10px] sm:text-[11px] leading-tight mt-0.5">Bản giới hạn số lượng</p>
              </div>

              <div className="bg-black/50 p-2.5 sm:p-3 hover:bg-black/70 transition-colors">
                <span className="material-symbols-outlined text-white text-[18px] sm:text-[20px] mb-1">architecture</span>
                <p className="text-[11px] sm:text-xs uppercase tracking-wider font-semibold text-white">Tư vấn KTS trưởng</p>
                <p className="text-white/70 text-[10px] sm:text-[11px] leading-tight mt-0.5">File 3D &amp; phối cảnh</p>
              </div>
            </div>

            {/* Master Artisan Quote Plaque */}
            <div className="pt-3 border-t border-white/20 flex items-start gap-3 text-white/80">
              <span className="text-2xl sm:text-3xl font-serif text-white/40 leading-none">“</span>
              <div>
                <p className="text-xs sm:text-sm italic text-white/90 leading-relaxed">
                  Mỗi ngôi nhà là một tác phẩm điêu khắc sống động, nơi bóng đổ và thớ gỗ đối thoại cùng tâm hồn người cư ngụ.
                </p>
                <p className="text-[10px] font-mono uppercase tracking-widest text-white/60 mt-1">
                  — Kenzo Murata, Master Artisan Komorebi Studio
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT PANEL: High-End Interactive Authentication Card (5 Cols Desktop) */}
        <section className="lg:col-span-5 bg-white flex flex-col justify-between p-4 sm:p-8 lg:p-12 overflow-y-auto">
          <div className="w-full max-w-md mx-auto my-auto space-y-4 sm:space-y-5">
            {/* Role Persona Selector (Personal vs Architect/Partner) */}
            <div className="w-full border border-[#E4E4E7] p-1 bg-[#F4F4F5] flex items-center gap-1 rounded-xl">
              <button
                type="button"
                onClick={() => setRole("client")}
                className={`flex-1 py-1.5 px-1.5 sm:px-2 text-center text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-all rounded-lg ${
                  role === "client"
                    ? "bg-white text-black shadow-xs font-bold"
                    : "text-[#71717A] hover:text-black"
                }`}
              >
                <span className="flex items-center justify-center gap-1 sm:gap-1.5">
                  <span className="material-symbols-outlined text-[15px]">person</span>
                  <span>Khách cá nhân</span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => setRole("architect")}
                className={`flex-1 py-1.5 px-1.5 sm:px-2 text-center text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-all rounded-lg ${
                  role === "architect"
                    ? "bg-white text-black shadow-xs font-bold"
                    : "text-[#71717A] hover:text-black"
                }`}
              >
                <span className="flex items-center justify-center gap-1 sm:gap-1.5">
                  <span className="material-symbols-outlined text-[15px]">handyman</span>
                  <span>Kiến trúc sư</span>
                </span>
              </button>
            </div>

            {/* Auth Tabs Header with Animated Line */}
            <div className="relative border-b border-[#E4E4E7]">
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => setAuthMode("signin")}
                  className={`relative flex-1 pb-3 text-center text-sm uppercase tracking-wider transition-colors ${
                    authMode === "signin" ? "text-black font-bold" : "text-[#71717A] hover:text-black font-medium"
                  }`}
                >
                  Đăng Nhập
                  {authMode === "signin" && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-black" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setAuthMode("register")}
                  className={`relative flex-1 pb-3 text-center text-sm uppercase tracking-wider transition-colors ${
                    authMode === "register" ? "text-black font-bold" : "text-[#71717A] hover:text-black font-medium"
                  }`}
                >
                  Gia Nhập Circle
                  {authMode === "register" && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-black" />
                  )}
                </button>
              </div>
            </div>

            {/* Dynamic Context Badge */}
            <div className="p-3 bg-[#F4F4F5] border border-[#E4E4E7] flex items-center justify-between text-[#18181B] rounded-xl">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-black">
                  {role === "client" ? "verified_user" : "architecture"}
                </span>
                <span className="text-xs">
                  {role === "client"
                    ? "Quyền lợi thành viên: Tích luỹ & bảo dưỡng mộc định kỳ"
                    : "Quyền lợi Đối tác KTS: Kho file 3D, báo giá dự án, chiết khấu xưởng"}
                </span>
              </div>
              <span className="text-[10px] font-mono text-black uppercase font-bold tracking-widest">
                Komorebi ID
              </span>
            </div>

            {/* Social SSO Fast Authentication Grid */}
            <div className="space-y-2">
              <p className="text-[11px] font-mono uppercase tracking-wider text-[#71717A] text-center">
                Đăng nhập nhanh 1 chạm
              </p>
              <div className="grid grid-cols-3 gap-2">
                {/* Google */}
                <button
                  type="button"
                  onClick={() => handleSSO("Google")}
                  className="flex items-center justify-center gap-1.5 py-2 sm:py-2.5 px-1.5 sm:px-3 border border-[#E4E4E7] hover:border-black bg-white hover:bg-[#F4F4F5] transition-all group rounded-xl"
                >
                  <svg className="w-4 h-4 fill-current text-black group-hover:scale-110 transition-transform flex-shrink-0" viewBox="0 0 24 24">
                    <path d="M12.24 10.285V13.4h6.887C18.2 16.14 15.645 18 12.24 18c-3.315 0-6-2.685-6-6s2.685-6 6-6c1.62 0 3.09.615 4.2 1.635l2.37-2.37C17.37 3.84 14.985 3 12.24 3 7.275 3 3.24 7.035 3.24 12s4.035 9 9 9c5.205 0 8.655-3.66 8.655-8.82 0-.6-.06-1.185-.18-1.895H12.24z" />
                  </svg>
                  <span className="text-[11px] sm:text-xs uppercase font-semibold">Google</span>
                </button>

                {/* Apple ID (Tạm khóa) */}
                <button
                  type="button"
                  onClick={() => handleSSO("Apple ID", true)}
                  className="flex items-center justify-center gap-1 py-2 sm:py-2.5 px-1 sm:px-2.5 border border-dashed border-[#D4D4D8] bg-[#F4F4F5]/90 opacity-60 cursor-not-allowed hover:bg-[#EAEAEA] transition-all rounded-xl relative"
                  title="Tạm khóa: Cổng xác thực Apple ID đang bảo trì nâng cấp"
                >
                  <svg className="w-3.5 h-3.5 fill-current text-[#71717A] flex-shrink-0" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.89c.65-.79 1.1-1.88.98-2.89-.95.04-2.09.63-2.76 1.42-.59.68-1.1 1.79-.96 2.85 1.05.08 2.13-.57 2.74-1.38z" />
                  </svg>
                  <span className="text-[11px] sm:text-xs uppercase font-semibold text-[#71717A]">Apple</span>
                  <span className="material-symbols-outlined text-[12px] text-[#A1A1AA] ml-0.5">lock</span>
                </button>

                {/* ArchID (Tạm khóa) */}
                <button
                  type="button"
                  onClick={() => handleSSO("ArchID", true)}
                  className="flex items-center justify-center gap-1 py-2 sm:py-2.5 px-1 sm:px-2.5 border border-dashed border-[#D4D4D8] bg-[#F4F4F5]/90 opacity-60 cursor-not-allowed hover:bg-[#EAEAEA] transition-all rounded-xl relative"
                  title="Tạm khóa: Cổng ArchID dành cho đối tác đang bảo trì tích hợp"
                >
                  <span className="material-symbols-outlined text-[15px] sm:text-[17px] text-[#71717A]">
                    architecture
                  </span>
                  <span className="text-[11px] sm:text-xs uppercase font-semibold text-[#71717A]">ArchID</span>
                  <span className="material-symbols-outlined text-[12px] text-[#A1A1AA] ml-0.5">lock</span>
                </button>
              </div>
              <p className="text-[10.5px] text-[#A1A1AA] text-center flex items-center justify-center gap-1 pt-0.5">
                <span className="material-symbols-outlined text-[12px]">lock</span>
                <span>Apple ID & ArchID tạm khóa bảo trì. Vui lòng đăng nhập với Google hoặc Email.</span>
              </p>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center py-1">
              <div className="w-full border-t border-[#E4E4E7]" />
              <span className="absolute bg-white px-3 text-[11px] font-mono text-[#71717A] uppercase tracking-widest">
                Hoặc tiếp tục với email
              </span>
            </div>

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Full Name (Register mode only) */}
              {authMode === "register" && (
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#71717A] mb-1 font-medium">
                    Họ và Tên chủ sở hữu không gian *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Vd: Nguyễn Hoàng Long"
                      className="w-full h-12 bg-white border border-[#E4E4E7] px-3.5 text-xs text-black placeholder:text-[#A1A1AA] focus:border-black rounded-xl focus:outline-none"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-[20px] text-outline">
                      badge
                    </span>
                  </div>
                </div>
              )}

              {/* Email or Phone */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs uppercase tracking-wider text-[#71717A] font-medium">
                    Email hoặc Số điện thoại thành viên *
                  </label>
                  <span className="text-[10px] text-outline font-mono">Định dạng chuẩn</span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="arch.member@komorebi.vn hoặc 090..."
                    className="w-full h-12 bg-white border border-[#E4E4E7] px-3.5 text-xs text-black placeholder:text-[#A1A1AA] focus:border-black rounded-xl focus:outline-none"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-[20px] text-outline">
                    alternate_email
                  </span>
                </div>
              </div>

              {/* Studio Name (Register + Architect only) */}
              {authMode === "register" && role === "architect" && (
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#71717A] mb-1 font-medium">
                    Tên Văn phòng Kiến trúc / Tổ chức thiết kế
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={studioName}
                      onChange={(e) => setStudioName(e.target.value)}
                      placeholder="Vd: Studio Atelier Wabi / KTS Tự do"
                      className="w-full h-12 bg-white border border-[#E4E4E7] px-3.5 text-xs text-black placeholder:text-[#A1A1AA] focus:border-black rounded-xl focus:outline-none"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-[20px] text-outline">
                      domain
                    </span>
                  </div>
                </div>
              )}

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs uppercase tracking-wider text-[#71717A] font-medium">
                    Mật mã tài khoản *
                  </label>
                  {authMode === "signin" && (
                    <button
                      type="button"
                      onClick={() => showToast("Hệ thống đã gửi link khôi phục mật mã về email của bạn.")}
                      className="text-xs text-black hover:underline"
                    >
                      Quên mật khẩu?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full h-12 bg-white border border-[#E4E4E7] px-3.5 pr-11 text-xs text-black placeholder:text-[#A1A1AA] focus:border-black rounded-xl focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-black p-1"
                    aria-label="Hiện hoặc ẩn mật mã"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
                {authMode === "register" && (
                  <p className="text-[11px] text-zinc-500 mt-1">
                    Tối thiểu 8 ký tự gồm chữ hoa, chữ số &amp; 1 ký tự đặc biệt để bảo vệ tài sản kiến trúc.
                  </p>
                )}
              </div>

              {/* Checkboxes */}
              <div className="space-y-2 pt-1 text-xs text-[#71717A]">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border border-black text-black focus:ring-0"
                  />
                  <span className="hover:text-black transition-colors">
                    Duy trì đăng nhập an toàn 30 ngày
                  </span>
                </label>

                <label className="flex items-start gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreedFSC}
                    onChange={(e) => setAgreedFSC(e.target.checked)}
                    required
                    className="w-4 h-4 mt-0.5 rounded border border-black text-black focus:ring-0"
                  />
                  <span className="leading-relaxed">
                    Đồng ý với{" "}
                    <button
                      type="button"
                      onClick={() => showToast("Đang mở Quy chế Hội viên Komorebi Circle...")}
                      className="text-black underline"
                    >
                      Quy chế Thành viên Komorebi Circle
                    </button>{" "}
                    và tiêu chuẩn bảo tồn gỗ bền vững FSC Quốc tế.
                  </span>
                </label>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-black text-white text-xs uppercase tracking-[0.15em] font-bold hover:bg-[#27272A] active:scale-99 transition-all flex items-center justify-center gap-2 disabled:opacity-50 rounded-xl"
                >
                  <span>
                    {isSubmitting
                      ? "ĐANG XÁC THỰC MÃ HÓA..."
                      : authMode === "signin"
                      ? "ĐĂNG NHẬP VÀO TÀI KHOẢN"
                      : "TRỞ THÀNH THÀNH VIÊN KOMOREBI"}
                  </span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </form>

            {/* Guarantee & Security Footnote */}
            <div className="pt-2 flex items-center justify-center gap-4 text-outline text-[11px] font-mono uppercase">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">eco</span>
                <span>Gỗ Nhật 100% FSC</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">lock</span>
                <span>Bảo mật danh tính KTS</span>
              </div>
            </div>
          </div>

          {/* Card Mini Footer */}
          <div className="mt-8 pt-4 border-t border-[#E4E4E7] flex flex-col sm:flex-row items-center justify-between text-outline text-[11px] gap-2">
            <p>© 2025 Komorebi Living. Bản quyền mộc bản &amp; kiến trúc tối giản.</p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => showToast("Điều khoản bảo mật Komorebi Atelier.")}
                className="hover:text-black transition-colors"
              >
                Điều khoản bảo mật
              </button>
              <span>/</span>
              <button
                type="button"
                onClick={() => showToast("Quy chuẩn chế tác thủ công mộng gỗ Kigumi.")}
                className="hover:text-black transition-colors"
              >
                Quy chuẩn thủ công
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
