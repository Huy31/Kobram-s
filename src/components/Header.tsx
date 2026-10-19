"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { createClient } from "@/utils/supabase/client";

interface HeaderProps {
  onOpenConsultation?: () => void;
}

export default function Header({ onOpenConsultation }: HeaderProps) {
  const pathname = usePathname();
  const { itemCount, wishlistCount, openWishlist } = useCart();
  const { lang, setLang } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const changeLang = (newLang: "VN" | "EN") => {
    setLang(newLang);
  };

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const navLinks = [
    {
      label: lang === "VN" ? "Phòng Khách" : "Living Room",
      href: "/phong-khach",
      icon: "chair",
      desc:
        lang === "VN"
          ? "Sofa mộc bản, bàn trà Enso & kệ tivi"
          : "Crafted sofas, Enso tea tables & media consoles",
    },
    {
      label: lang === "VN" ? "Phòng Bếp" : "Kitchen & Dining",
      href: "/phong-bep",
      icon: "table_restaurant",
      desc:
        lang === "VN"
          ? "Bàn ăn Mori, ghế Kanso & hệ tủ mộc"
          : "Mori dining tables, Kanso chairs & cabinetry",
    },
    {
      label: lang === "VN" ? "Phòng Ngủ" : "Bedroom",
      href: "/phong-ngu",
      icon: "bed",
      desc:
        lang === "VN"
          ? "Giường Zen Platform, chiếu Tatami & tủ Shoji"
          : "Zen Platform beds, Tatami mats & Shoji closets",
    },
    {
      label: lang === "VN" ? "Bộ Sưu Tập" : "Kyoto Collection",
      href: "/bo-suu-tap",
      icon: "auto_awesome",
      desc:
        lang === "VN"
          ? "Kyoto Atelier Archive & gốm Wabi-sabi"
          : "Kyoto Atelier Archive & Wabi-Sabi ceramics",
    },
    {
      label: lang === "VN" ? "Dự Án Kiến Trúc" : "Architectural Projects",
      href: "/du-an-kien-truc",
      icon: "architecture",
      desc:
        lang === "VN"
          ? "Villa Thảo Điền, Penthouse & Resort"
          : "Thao Dien Villa, Penthouses & Eco-Resorts",
    },
  ];

  // Close sidebar on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sidebarOpen]);

  // Lock body scroll when sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  // Auto-close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-outline-variant transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-space-lg lg:px-margin w-full h-16 sm:h-20 flex items-center justify-between">
        {/* Left: Menu Button, Brand Logo & Desktop Search */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Sidebar Toggle Button (on the LEFT) */}
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-2 sm:px-3 sm:py-2 flex items-center gap-1.5 text-primary bg-surface-container-low hover:bg-primary hover:text-white rounded-xl transition-all active:scale-95 font-medium"
            aria-label={lang === "VN" ? "Mở danh mục điều hướng" : "Open navigation menu"}
            title={lang === "VN" ? "Mở menu danh mục không gian" : "Open space catalog menu"}
          >
            <span className="material-symbols-outlined text-[22px] sm:text-[24px]">
              menu
            </span>
            <span className="hidden sm:inline text-xs uppercase tracking-wider font-bold">
              Menu
            </span>
          </button>

          <Link
            href="/"
            className="font-headline-md text-lg sm:text-2xl text-primary tracking-tight font-bold flex items-center gap-2 hover:opacity-85 transition-opacity"
          >
            <span>Komorebi Living</span>
          </Link>

          {/* Quick search on desktop */}
          <div className="hidden lg:flex items-center relative">
            <span className="material-symbols-outlined absolute left-3.5 text-outline text-lg pointer-events-none">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === "VN" ? "Tìm sản phẩm, chất liệu..." : "Search products, timber..."}
              className="pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-full text-body-sm font-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary w-44 xl:w-60 transition-all focus:bg-white focus:w-56 xl:focus:w-72"
            />
          </div>
        </div>

        {/* Right: Actions Cluster */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Desktop Lang Switcher */}
          <div className="hidden sm:flex items-center border border-outline-variant p-0.5 bg-surface-container-low text-xs font-semibold rounded-lg">
            <button
              type="button"
              onClick={() => changeLang("VN")}
              className={`px-2 py-0.5 transition-colors rounded-md text-[11px] font-bold ${
                lang === "VN"
                  ? "bg-white text-primary shadow-xs"
                  : "text-outline hover:text-primary"
              }`}
            >
              VN
            </button>
            <button
              type="button"
              onClick={() => changeLang("EN")}
              className={`px-2 py-0.5 transition-colors rounded-md text-[11px] font-bold ${
                lang === "EN"
                  ? "bg-white text-primary shadow-xs"
                  : "text-outline hover:text-primary"
              }`}
            >
              EN
            </button>
          </div>

          {/* Tư vấn thiết kế Button (Desktop/Tablet) */}
          <button
            type="button"
            onClick={onOpenConsultation}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 bg-primary text-on-primary text-label-md font-label-md uppercase tracking-wider rounded-xl hover:bg-[#27272a] active:scale-95 transition-all shadow-sm text-xs sm:text-sm font-bold"
          >
            {lang === "VN" ? "Tư vấn thiết kế" : "Architect Consult"}
          </button>

          {/* Icon buttons */}
          <div className="flex items-center gap-1 sm:gap-1.5 border-l border-outline-variant/60 pl-2 sm:pl-3">
            {/* Wishlist */}
            <button
              type="button"
              onClick={openWishlist}
              aria-label={lang === "VN" ? "Danh sách yêu thích" : "Wishlist"}
              className="p-2 text-on-surface hover:text-primary transition-colors relative active:scale-95 group rounded-full hover:bg-surface-container-low"
              title={lang === "VN" ? "Danh sách tác phẩm yêu thích" : "Curated wishlist"}
            >
              <span className="material-symbols-outlined text-[20px] sm:text-[22px] group-hover:scale-110 transition-transform">
                favorite
              </span>
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-4 h-4 bg-primary text-on-primary text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart link */}
            <Link
              href="/gio-hang"
              aria-label={lang === "VN" ? "Giỏ hàng" : "Shopping cart"}
              className={`p-2 flex items-center gap-1.5 transition-colors relative active:scale-95 rounded-xl ${
                pathname === "/gio-hang"
                  ? "text-primary font-bold bg-surface-container-low"
                  : "text-on-surface hover:text-primary hover:bg-surface-container-low"
              }`}
            >
              <span className="material-symbols-outlined text-[20px] sm:text-[22px]">
                shopping_bag
              </span>
              <span className="text-label-md font-label-md hidden xl:inline font-semibold">
                {lang === "VN" ? "Giỏ hàng" : "Cart"} ({itemCount})
              </span>
              {itemCount > 0 && (
                <span className="xl:hidden absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-4 h-4 bg-primary text-on-primary text-[10px] font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Account Link */}
            <Link
              href={user ? "/tai-khoan" : "/dang-nhap"}
              aria-label={user ? `Hội viên: ${user.user_metadata?.full_name || user.email}` : (lang === "VN" ? "Đăng nhập" : "Sign In")}
              className={`p-1.5 sm:px-2.5 sm:py-1.5 text-on-surface hover:text-primary transition-colors active:scale-95 rounded-full sm:rounded-xl hover:bg-surface-container-low inline-flex items-center gap-1.5 ${
                pathname === "/tai-khoan" || pathname === "/dang-nhap"
                  ? "text-primary font-bold bg-surface-container-low"
                  : ""
              }`}
              title={user ? `Hội viên: ${user.user_metadata?.full_name || user.email}` : (lang === "VN" ? "Komorebi Circle • Đăng nhập" : "Komorebi Circle • Sign In")}
            >
              {user?.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="Avatar"
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover border border-outline-variant"
                />
              ) : (
                <span className="material-symbols-outlined text-[20px] sm:text-[22px]">
                  {user ? "account_circle" : "person"}
                </span>
              )}
              {user && (
                <span className="hidden md:inline text-xs font-semibold max-w-[110px] truncate">
                  {user.user_metadata?.full_name?.split(" ").slice(-1)[0] || (lang === "VN" ? "Hội viên" : "Member")}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Modern Off-canvas Sidebar Drawer (Universal for Mobile & PC) */}
      {mounted &&
        sidebarOpen &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex justify-start animate-fade-in">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer Container (Sliding from LEFT) */}
            <aside
              className="relative z-10 w-full max-w-[360px] sm:max-w-[420px] bg-surface-container-lowest h-screen sm:h-[100dvh] shadow-2xl border-r border-outline-variant flex flex-col justify-between overflow-hidden animate-slide-in-left"
              role="dialog"
              aria-modal="true"
              aria-label={lang === "VN" ? "Menu danh mục" : "Catalog menu"}
            >
              {/* Top Bar of Sidebar */}
              <div className="px-5 sm:px-6 py-4 border-b border-outline-variant/50 flex items-center justify-between bg-white">
                <div>
                  <span className="font-headline-md text-base sm:text-lg text-primary font-bold tracking-tight block">
                    Komorebi Living
                  </span>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-outline block">
                    {lang === "VN"
                      ? "Kiến trúc & Mộc bản thủ công"
                      : "Minimalist Woodworking & Architecture"}
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  {/* Language Switcher in Sidebar Header */}
                  <div className="flex items-center border border-outline-variant p-0.5 bg-surface-container-low text-xs font-semibold rounded-lg">
                    <button
                      type="button"
                      onClick={() => changeLang("VN")}
                      className={`px-2 py-0.5 transition-colors rounded-md text-[11px] font-bold ${
                        lang === "VN"
                          ? "bg-white text-primary shadow-xs"
                          : "text-outline hover:text-primary"
                      }`}
                      title="Chuyển sang Tiếng Việt"
                    >
                      VN
                    </button>
                    <button
                      type="button"
                      onClick={() => changeLang("EN")}
                      className={`px-2 py-0.5 transition-colors rounded-md text-[11px] font-bold ${
                        lang === "EN"
                          ? "bg-white text-primary shadow-xs"
                          : "text-outline hover:text-primary"
                      }`}
                      title="Switch to English"
                    >
                      EN
                    </button>
                  </div>

                  {/* Close button */}
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="w-9 h-9 flex items-center justify-center rounded-full text-primary hover:bg-surface-container-low active:scale-95 transition-all"
                    aria-label={lang === "VN" ? "Đóng menu" : "Close menu"}
                  >
                    <span className="material-symbols-outlined text-2xl">close</span>
                  </button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-6">
                {/* Search Inside Sidebar */}
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-lg pointer-events-none">
                    search
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      lang === "VN"
                        ? "Tìm bàn ghế, sofa, giường ngủ..."
                        : "Search tables, sofas, zen beds..."
                    }
                    className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-body-sm text-primary placeholder:text-outline focus:outline-none focus:border-primary focus:bg-white transition-colors"
                  />
                </div>

                {/* Core Navigation Items */}
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-outline block mb-3 font-semibold">
                    {lang === "VN" ? "Danh Mục Không Gian" : "Space Categories"}
                  </span>
                  <nav className="space-y-1.5">
                    {navLinks.map((link) => {
                      const isActive = pathname === link.href;
                      return (
                        <Link
                          key={link.label}
                          href={link.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`group px-3.5 py-3 rounded-2xl flex items-center justify-between transition-all ${
                            isActive
                              ? "bg-primary text-on-primary shadow-sm"
                              : "hover:bg-surface-container-low text-on-surface hover:text-primary"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`material-symbols-outlined text-[20px] ${
                                isActive
                                  ? "text-on-primary"
                                  : "text-outline group-hover:text-primary"
                              }`}
                            >
                              {link.icon}
                            </span>
                            <div>
                              <span className="font-headline-sm font-bold text-sm sm:text-base block">
                                {link.label}
                              </span>
                              <span
                                className={`text-[11px] block mt-0.5 line-clamp-1 ${
                                  isActive
                                    ? "text-white/80"
                                    : "text-on-surface-variant"
                                }`}
                              >
                                {link.desc}
                              </span>
                            </div>
                          </div>

                          <span
                            className={`material-symbols-outlined text-sm transition-transform duration-200 ${
                              isActive
                                ? "text-on-primary"
                                : "text-outline group-hover:text-primary group-hover:translate-x-1"
                            }`}
                          >
                            arrow_forward
                          </span>
                        </Link>
                      );
                    })}
                  </nav>
                </div>

                {/* Special Features & Services */}
                <div className="pt-3 border-t border-outline-variant/40">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-outline block mb-3 font-semibold">
                    {lang === "VN" ? "Tuyển Chọn & Dịch Vụ" : "Curated & Services"}
                  </span>
                  <div className="space-y-1 text-body-sm">
                    {/* Ghế Kura Featured Link */}
                    <Link
                      href="/san-pham/kura-lounge-chair"
                      onClick={() => setSidebarOpen(false)}
                      className="p-3 rounded-xl flex items-center justify-between hover:bg-surface-container-low text-on-surface hover:text-primary transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-[20px] text-primary">
                          star
                        </span>
                        <span className="text-sm font-semibold">
                          {lang === "VN"
                            ? "Tác Phẩm Tiêu Biểu: Ghế Kura"
                            : "Iconic Piece: Kura Lounge Chair"}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 bg-primary text-on-primary text-[10px] uppercase font-bold rounded-md">
                        Hot
                      </span>
                    </Link>

                    {/* Wishlist Link */}
                    <button
                      type="button"
                      onClick={() => {
                        setSidebarOpen(false);
                        openWishlist();
                      }}
                      className="w-full p-3 rounded-xl flex items-center justify-between hover:bg-surface-container-low text-on-surface hover:text-primary transition-colors text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-[20px] text-outline">
                          favorite
                        </span>
                        <span className="text-sm font-medium">
                          {lang === "VN" ? "Tác Phẩm Yêu Thích" : "Curated Wishlist"}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 bg-surface-container text-xs font-bold font-mono rounded-md">
                        {wishlistCount} {lang === "VN" ? "món" : "items"}
                      </span>
                    </button>

                    {/* Account Link */}
                    <Link
                      href={user ? "/tai-khoan" : "/dang-nhap"}
                      onClick={() => setSidebarOpen(false)}
                      className="p-3 rounded-xl flex items-center justify-between hover:bg-surface-container-low text-on-surface hover:text-primary transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        {user?.user_metadata?.avatar_url ? (
                          <img
                            src={user.user_metadata.avatar_url}
                            alt="Avatar"
                            className="w-5 h-5 rounded-full object-cover border border-outline-variant"
                          />
                        ) : (
                          <span className="material-symbols-outlined text-[20px] text-outline">
                            person
                          </span>
                        )}
                        <span className="text-sm font-medium">
                          {user
                            ? (lang === "VN"
                                ? `Chào, ${user.user_metadata?.full_name || user.email}`
                                : `Hello, ${user.user_metadata?.full_name || user.email}`)
                            : (lang === "VN"
                                ? "Komorebi Circle • Đăng nhập"
                                : "Komorebi Circle • Sign In")}
                        </span>
                      </div>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-outline font-bold">
                        {user
                          ? (lang === "VN" ? "Đã đăng nhập" : "Active")
                          : (lang === "VN" ? "Đăng nhập" : "Sign In")}
                      </span>
                    </Link>

                    {/* Cart Link */}
                    <Link
                      href="/gio-hang"
                      onClick={() => setSidebarOpen(false)}
                      className="p-3 rounded-xl flex items-center justify-between hover:bg-surface-container-low text-primary font-bold transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-[20px] text-primary">
                          shopping_bag
                        </span>
                        <span className="text-sm">
                          {lang === "VN" ? "Giỏ Hàng & Thanh Toán" : "Shopping Bag & Checkout"}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 bg-primary text-on-primary text-xs rounded-md font-mono">
                        {itemCount} {lang === "VN" ? "món" : "items"}
                      </span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Bottom Actions of Sidebar */}
              <div className="p-5 sm:p-6 border-t border-outline-variant/50 bg-surface-container-low/50 space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    setSidebarOpen(false);
                    onOpenConsultation?.();
                  }}
                  className="w-full py-3 bg-primary text-on-primary text-label-md uppercase tracking-wider text-center rounded-xl font-bold shadow-md hover:bg-[#27272a] active:scale-98 transition-all"
                >
                  {lang === "VN"
                    ? "Đặt Lịch Tư Vấn Kiến Trúc Sư"
                    : "Book Architect Consultation"}
                </button>

                <div className="text-center text-xs text-outline space-y-1">
                  <p>
                    {lang === "VN" ? "Hotline Atelier: " : "Atelier Hotline: "}
                    <a href="tel:19006829" className="text-primary font-bold underline">
                      1900 6829
                    </a>{" "}
                    (8:30 - 20:30)
                  </p>
                  <p>
                    {lang === "VN"
                      ? "Showroom: 18 Đường Số 10, P. Thảo Điền, TP. Thủ Đức, TP.HCM"
                      : "Showroom: 18 Street 10, Thao Dien Ward, Thu Duc City, HCMC"}
                  </p>
                </div>
              </div>
            </aside>
          </div>,
          document.body
        )}
    </header>
  );
}
