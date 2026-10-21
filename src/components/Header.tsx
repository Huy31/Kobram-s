"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { createClient } from "@/utils/supabase/client";
import { ExpandingSearchDock } from "@/components/ui/expanding-search-dock-shadcnui";
import ThemeToggle from "@/components/ThemeToggle";
import NotificationDropdown from "@/components/NotificationDropdown";

interface HeaderProps {
  onOpenConsultation?: () => void;
}

export default function Header({ onOpenConsultation }: HeaderProps) {
  const pathname = usePathname();
  const { itemCount, wishlistCount, openWishlist } = useCart();
  const { lang, setLang } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
            className="p-2 sm:px-3 sm:py-2 flex items-center gap-1.5 text-primary bg-surface-container-low hover:bg-primary hover:text-white rounded-xl transition-all active:scale-95 font-medium dark:bg-[#18181c] dark:text-zinc-200 dark:hover:bg-white/10 dark:hover:text-white dark:border dark:border-white/10"
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

          {/* Nút tìm kiếm nằm ngay bên phải Komorebi Living */}
          <div className="flex items-center ml-1 sm:ml-2">
            <ExpandingSearchDock
              align="left"
              placeholder={lang === "VN" ? "Tìm kiếm sản phẩm, chất liệu gỗ..." : "Search products, timber..."}
            />
          </div>
        </div>

        {/* Right: Actions Cluster */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Day / Night Sky Theme Switch */}
          <ThemeToggle className="scale-85 sm:scale-95" />

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
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 btn-consult-header text-label-md font-label-md uppercase tracking-wider rounded-xl active:scale-95 transition-all shadow-sm text-xs sm:text-sm font-bold"
          >
            <span>{lang === "VN" ? "Tư vấn thiết kế" : "Architect Consult"}</span>
          </button>

          {/* Icon buttons */}
          <div className="flex items-center gap-1 sm:gap-1.5 border-l border-outline-variant/60 pl-2 sm:pl-3">
            {/* Notifications */}
            <NotificationDropdown />

            {/* Wishlist */}
            <button
              type="button"
              id="btn-header-wishlist"
              onClick={(e) => {
                e.preventDefault();
                openWishlist();
              }}
              aria-label={lang === "VN" ? "Danh sách yêu thích" : "Wishlist"}
              className="min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center p-2 text-on-surface hover:text-primary transition-all relative active:scale-95 group rounded-full hover:bg-surface-container-low dark:text-zinc-200 dark:hover:text-white dark:hover:bg-white/10 cursor-pointer"
              title={lang === "VN" ? "Danh sách tác phẩm yêu thích" : "Curated wishlist"}
            >
              <span className="material-symbols-outlined text-[20px] sm:text-[22px] group-hover:scale-110 transition-transform pointer-events-none">
                favorite
              </span>
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-4 h-4 header-badge text-[10px] font-extrabold rounded-full flex items-center justify-center pointer-events-none shadow-sm leading-none">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart link */}
            <Link
              href="/gio-hang"
              id="btn-header-cart"
              aria-label={lang === "VN" ? "Giỏ hàng" : "Shopping cart"}
              className={`min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center p-2 transition-all relative active:scale-95 group rounded-full hover:bg-surface-container-low dark:text-zinc-200 dark:hover:text-white dark:hover:bg-white/10 cursor-pointer ${
                pathname === "/gio-hang"
                  ? "text-primary font-bold bg-surface-container-low dark:bg-white/15 dark:text-white"
                  : "text-on-surface hover:text-primary"
              }`}
              title={lang === "VN" ? `Giỏ hàng (${itemCount})` : `Shopping cart (${itemCount})`}
            >
              <span className="material-symbols-outlined text-[20px] sm:text-[22px] group-hover:scale-110 transition-transform pointer-events-none">
                shopping_bag
              </span>
              {itemCount > 0 && (
                <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-4 h-4 header-badge text-[10px] font-extrabold rounded-full flex items-center justify-center pointer-events-none shadow-sm leading-none">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Account Link */}
            <Link
              href={user ? "/tai-khoan" : "/dang-nhap"}
              aria-label={user ? `Hội viên: ${user.user_metadata?.full_name || user.email}` : (lang === "VN" ? "Đăng nhập" : "Sign In")}
              className={`p-1.5 sm:px-2.5 sm:py-1.5 text-on-surface hover:text-primary transition-all active:scale-95 rounded-full sm:rounded-xl hover:bg-surface-container-low dark:text-zinc-200 dark:hover:text-white dark:hover:bg-white/10 inline-flex items-center gap-1.5 group ${
                pathname === "/tai-khoan" || pathname === "/dang-nhap"
                  ? "text-primary font-bold bg-surface-container-low dark:bg-white/15 dark:text-white"
                  : ""
              }`}
              title={user ? `Hội viên: ${user.user_metadata?.full_name || user.email}` : (lang === "VN" ? "Komorebi Circle • Đăng nhập" : "Komorebi Circle • Sign In")}
            >
              {user?.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="Avatar"
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover border border-outline-variant dark:border-white/20"
                />
              ) : (
                <span className="material-symbols-outlined text-[20px] sm:text-[22px] group-hover:scale-110 transition-transform">
                  {user ? "account_circle" : "person"}
                </span>
              )}
              {user && (
                <span className="hidden md:inline text-xs font-semibold max-w-[110px] truncate dark:text-zinc-200">
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

                <div className="flex items-center gap-2 sm:gap-2.5">
                  {/* Theme Switch in Sidebar Header */}
                  <ThemeToggle className="scale-85" />

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
              <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 flex flex-col">
                {/* Core Navigation Items */}
                <div className="flex-1 flex flex-col">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-outline block mb-2 sm:mb-3 font-semibold">
                    {lang === "VN" ? "Danh Mục Không Gian" : "Space Categories"}
                  </span>
                  <nav className="flex-1 flex flex-col justify-between gap-2 sm:gap-3 py-1">
                    {navLinks.map((link) => {
                      const isActive = pathname === link.href;
                      return (
                        <Link
                          key={link.label}
                          href={link.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`group px-4 py-3.5 sm:py-4.5 rounded-2xl flex items-center justify-between transition-all flex-1 min-h-[58px] sm:min-h-[66px] border ${
                            isActive
                              ? "bg-primary text-on-primary border-primary shadow-sm"
                              : "border-transparent bg-surface-container-low/60 hover:bg-surface-container-low text-on-surface hover:text-primary hover:border-outline-variant/60"
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            <span
                              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-colors ${
                                isActive
                                  ? "bg-white/15 text-on-primary"
                                  : "bg-surface-container text-outline group-hover:text-primary group-hover:bg-white shadow-2xs"
                              }`}
                            >
                              <span className="material-symbols-outlined text-[22px] sm:text-[24px]">
                                {link.icon}
                              </span>
                            </span>
                            <div>
                              <span className="font-headline-sm font-bold text-sm sm:text-base block">
                                {link.label}
                              </span>
                              <span
                                className={`text-[11px] sm:text-xs block mt-0.5 line-clamp-1 ${
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
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                              isActive
                                ? "bg-white/20 text-on-primary"
                                : "text-outline group-hover:text-primary group-hover:translate-x-1"
                            }`}
                          >
                            <span className="material-symbols-outlined text-sm">
                              arrow_forward
                            </span>
                          </span>
                        </Link>
                      );
                    })}
                  </nav>
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
