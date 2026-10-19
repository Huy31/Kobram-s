"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ConsultationModal from "@/components/ConsultationModal";
import { useCart } from "@/context/CartContext";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";

type TabId = "tab-1" | "tab-2" | "tab-3" | "tab-4" | "tab-5";

interface AddressItem {
  id: string;
  name: string;
  isDefault: boolean;
  recipient: string;
  phone: string;
  address: string;
  notes: string;
}

export default function AccountProfilePage() {
  const router = useRouter();
  const { addToCart, showToast } = useCart();
  const [activeTab, setActiveTab] = useState<TabId>("tab-1");
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profileAvatar, setProfileAvatar] = useState<string>("/images/stitch1-img-1.jpg");

  // Profile data state
  const [profileName, setProfileName] = useState("Trần Minh Khang");
  const [profileRole, setProfileRole] = useState("Kiến trúc sư Trưởng / VIP Platinum");
  const [profileEmail, setProfileEmail] = useState("minhkhang.arch@komorebi-atelier.vn");
  const [profilePhone, setProfilePhone] = useState("+84 908 123 456");
  const [profileCompany, setProfileCompany] = useState("Khang Architecture & Partners");
  const [profileDob, setProfileDob] = useState("1988-11-26");

  // Supabase Auth Sync
  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(async ({ data }) => {
      const currentUser = data?.user;
      if (currentUser) {
        setUser(currentUser);
        if (currentUser.email) setProfileEmail(currentUser.email);
        const metaName =
          currentUser.user_metadata?.full_name ||
          currentUser.user_metadata?.name ||
          (currentUser.email ? currentUser.email.split("@")[0] : null);
        if (metaName) setProfileName(metaName);

        const avatar =
          currentUser.user_metadata?.avatar_url || currentUser.user_metadata?.picture;
        if (avatar) setProfileAvatar(avatar);

        // Fetch DB profile if present
        try {
          const { data: dbProfile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", currentUser.id)
            .maybeSingle();

          if (dbProfile) {
            if (dbProfile.full_name) setProfileName(dbProfile.full_name);
            if (dbProfile.role) setProfileRole(dbProfile.role);
            if (dbProfile.phone) setProfilePhone(dbProfile.phone);
            if (dbProfile.company) setProfileCompany(dbProfile.company);
            if (dbProfile.avatar_url) setProfileAvatar(dbProfile.avatar_url);
          }
        } catch (e) {
          // Ignore if table not yet migrated
        }
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          if (currentUser.email) setProfileEmail(currentUser.email);
          const metaName =
            currentUser.user_metadata?.full_name ||
            currentUser.user_metadata?.name;
          if (metaName) setProfileName(metaName);
          const avatar =
            currentUser.user_metadata?.avatar_url || currentUser.user_metadata?.picture;
          if (avatar) setProfileAvatar(avatar);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Notifications & settings
  const [workshopNotification, setWorkshopNotification] = useState(true);

  // Addresses state
  const [addresses, setAddresses] = useState<AddressItem[]>([
    {
      id: "addr-1",
      name: "Villa Thảo Điền",
      isDefault: true,
      recipient: "KTS. Trần Minh Khang",
      phone: "+84 908 123 456",
      address: "Số 28 Đường Giang Văn Minh, Phường Thảo Điền, TP. Thủ Đức, TP. Hồ Chí Minh",
      notes: "Thang máy tải hàng rộng 2.4m, sẵn mặt bằng lắp mộng.",
    },
    {
      id: "addr-2",
      name: "Studio Thiết Kế Komorebi",
      isDefault: false,
      recipient: "Trần Minh Khang - Khang Studio",
      phone: "+84 908 123 456",
      address: "Tầng 4, 158 Pasteur, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
      notes: "Nhận hàng mẫu phôi gỗ Teak & Catalog",
    },
  ]);

  // Wishlist in profile
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: "wish-1",
      title: "Ghế Bành Thư Giãn Kura Lounge Chair",
      category: "Phòng Khách • Ghế Bành",
      desc: "Khung sồi nguyên khối, độ ngả lưng công thái học 105 độ.",
      price: 18500000,
      image: "/images/product-kura-chair.jpg",
      status: "Sẵn hàng tại Showroom",
    },
    {
      id: "wish-2",
      title: "Đèn Thả Trần Giấy Washi Wabi Dome",
      category: "Chiếu Sáng • Nghệ Thuật",
      desc: "Khung nan tre sấy hun khói và giấy dó washi dệt sợi tằm mỏng.",
      price: 8200000,
      image: "/images/product-wabi-lamp.jpg",
      status: "May đo 14 ngày",
    },
    {
      id: "wish-3",
      title: "Tủ Chạn Bát Gỗ Sồi Fluted Glass",
      category: "Phòng Bếp • Tủ Kệ",
      desc: "Kính sóng cao cấp, bản lề đồng thau đúc cổ điển tinh xảo.",
      price: 34800000,
      image: "/images/curated-1.jpg",
      status: "Sẵn hàng tại Showroom",
    },
  ]);

  // Modals state
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isMaintenanceOpen, setIsMaintenanceOpen] = useState(false);
  const [maintenanceProduct, setMaintenanceProduct] = useState("Bàn Ăn Gỗ Sồi Mori Extendable #KM-2025-089");
  const [isCharterOpen, setIsCharterOpen] = useState(false);
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);
  const [isConsultMurataOpen, setIsConsultMurataOpen] = useState(false);
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);

  // New address form state
  const [newAddrName, setNewAddrName] = useState("");
  const [newAddrRecipient, setNewAddrRecipient] = useState("Trần Minh Khang");
  const [newAddrPhone, setNewAddrPhone] = useState("+84 908 123 456");
  const [newAddrDetail, setNewAddrDetail] = useState("");
  const [newAddrNotes, setNewAddrNotes] = useState("");

  const handleOpenMaintenance = (productName?: string) => {
    if (productName) setMaintenanceProduct(productName);
    setIsMaintenanceOpen(true);
  };

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      showToast("Đã đăng xuất thành công khỏi tài khoản.");
      router.push("/dang-nhap");
    } catch (error) {
      console.error("Sign out error:", error);
      showToast("Có lỗi xảy ra khi đăng xuất.");
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (user) {
        const supabase = createClient();
        await supabase.from("profiles").upsert({
          id: user.id,
          full_name: profileName,
          phone: profilePhone,
          company: profileCompany,
          role: profileRole,
          updated_at: new Date().toISOString(),
        });
        await supabase.auth.updateUser({
          data: { full_name: profileName },
        });
      }
      showToast("Hồ sơ định danh cá nhân đã được cập nhật thành công!");
    } catch (err) {
      console.error("Profile save error:", err);
      showToast("Hồ sơ cá nhân đã được lưu!");
    }
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrName || !newAddrDetail) {
      showToast("Vui lòng điền đầy đủ tên gợi nhớ và địa chỉ chi tiết.");
      return;
    }
    const newAddr: AddressItem = {
      id: `addr-${Date.now()}`,
      name: newAddrName,
      isDefault: false,
      recipient: newAddrRecipient,
      phone: newAddrPhone,
      address: newAddrDetail,
      notes: newAddrNotes || "Tiếp nhận bàn giao gỗ tiêu chuẩn.",
    };
    setAddresses((prev) => [...prev, newAddr]);
    setIsAddAddressOpen(false);
    setNewAddrName("");
    setNewAddrDetail("");
    setNewAddrNotes("");
    showToast("Đã lưu địa chỉ công trình mới vào sổ giao nhận thành công!");
  };

  const handleSetDefaultAddress = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
    showToast("Đã thiết lập làm địa chỉ giao nhận chính!");
  };

  const handleRemoveWishlist = (id: string) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
    showToast("Đã bỏ sản phẩm khỏi danh sách yêu thích.");
  };

  const handleAddWishlistToCart = (item: (typeof wishlistItems)[0]) => {
    addToCart({
      id: item.id,
      sku: "KM-ARC-01",
      title: item.title,
      subtitle: item.category,
      price: item.price,
      originalPrice: Math.round(item.price * 1.1),
      image: item.image,
      quantity: 1,
      options: {
        wood: "Gỗ sồi tự nhiên Bắc Mỹ",
        notes: "Chế tác độc bản Komorebi Circle",
      },
    });
  };

  return (
    <>
      <Header onOpenConsultation={() => setIsConsultationOpen(true)} />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-10 pt-6 sm:pt-8 pb-16 sm:pb-24">
        {/* 1. PROFILE HEADER BANNER & OVERVIEW */}
        <section className="border border-outline-variant/60 bg-surface-container-lowest mb-8 sm:mb-12 p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-sm">
          {/* Top Bar: Member Identity */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-outline-variant/40">
            <div className="flex items-start sm:items-center gap-4 sm:gap-6">
              {/* Member Avatar */}
              <div className="relative w-20 h-20 md:w-24 md:h-24 bg-surface-container-high border border-outline flex-shrink-0 overflow-hidden rounded-2xl shadow-sm">
                <Image
                  src={profileAvatar}
                  alt={profileName}
                  fill
                  sizes="100px"
                  className="object-cover"
                  priority
                />
                <span className="absolute bottom-0 right-0 bg-primary text-surface-container-lowest text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-tl-lg uppercase">
                  {user ? "AUTH" : "VIP"}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <h1 className="font-headline-md text-2xl sm:text-3xl text-primary font-bold tracking-tight">
                    {profileName}
                  </h1>
                  {user ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 border border-emerald-600/30 text-emerald-800 text-[11px] font-bold uppercase tracking-wider rounded-md bg-emerald-50">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      Google Verified
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 border border-primary text-primary text-[11px] font-bold uppercase tracking-wider rounded-md bg-surface-container-low">
                      Komorebi Circle Elite #KM-8821
                    </span>
                  )}
                </div>
                <p className="text-body-md text-on-surface-variant mt-1 text-sm sm:text-base font-medium">
                  {profileRole}
                </p>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 text-outline text-xs tracking-wider uppercase font-medium">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
                    Thành viên từ 10/2023
                  </span>
                  <span>•</span>
                  <span className="text-on-surface-variant">Chi nhánh cố vấn: Thảo Điền, TP. Thủ Đức</span>
                </div>
              </div>
            </div>

            {/* Tier Status Badge & Quick CTA */}
            <div className="flex flex-row md:flex-col items-start md:items-end justify-between w-full md:w-auto gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-outline-variant/40">
              <div className="text-left md:text-right">
                <span className="text-xs text-outline uppercase tracking-wider block">
                  Hạng Định Danh Cấp Cao
                </span>
                <span className="text-lg sm:text-xl text-primary font-bold tracking-tight">
                  {user ? "GOOGLE VIP ATELIER" : "PLATINUM ATELIER"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCharterOpen(true)}
                  className="text-primary hover:text-outline text-xs uppercase tracking-wider underline underline-offset-4 transition-colors font-semibold mr-2"
                >
                  Điều lệ hội viên
                </button>
                {user ? (
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="text-xs uppercase tracking-wider text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[16px]">logout</span>
                    Đăng xuất
                  </button>
                ) : (
                  <Link
                    href="/dang-nhap"
                    className="text-xs uppercase tracking-wider text-primary hover:bg-surface-container-high border border-outline px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">login</span>
                    Đăng nhập
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Member Privileges Cards (Grid 4 Columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
            {/* Privilege 1: Điểm chế tác */}
            <div className="p-4 bg-surface-container-low/70 border border-outline-variant/50 flex flex-col justify-between rounded-xl">
              <div>
                <div className="flex justify-between items-start text-secondary">
                  <span className="text-xs uppercase tracking-wider font-semibold">Điểm Chế Tác Tích Luỹ</span>
                  <span className="material-symbols-outlined text-[20px] text-primary">stars</span>
                </div>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-bold text-primary font-headline-md">4,850</span>
                  <span className="text-xs text-secondary font-bold">PTS</span>
                </div>
              </div>
              <p className="text-xs text-on-surface-variant mt-3 pt-3 border-t border-outline-variant/30 leading-relaxed">
                Khả dụng: 1 voucher làm mới mặt bàn gỗ sáp ong tự nhiên nguyên bản.
              </p>
            </div>

            {/* Privilege 2: Đơn hàng đã bàn giao */}
            <div className="p-4 bg-surface-container-low/70 border border-outline-variant/50 flex flex-col justify-between rounded-xl">
              <div>
                <div className="flex justify-between items-start text-secondary">
                  <span className="text-xs uppercase tracking-wider font-semibold">Đơn Hàng Đã Bàn Giao</span>
                  <span className="material-symbols-outlined text-[20px] text-primary">inventory_2</span>
                </div>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-bold text-primary font-headline-md">6</span>
                  <span className="text-xs text-secondary font-bold">dự án</span>
                </div>
              </div>
              <p className="text-xs text-on-surface-variant mt-3 pt-3 border-t border-outline-variant/30 leading-relaxed">
                Tổng giá trị sưu tập: <strong className="text-primary font-bold">186.000.000đ</strong>.
              </p>
            </div>

            {/* Privilege 3: Thời hạn bảo hành mộng gỗ */}
            <div className="p-4 bg-surface-container-low/70 border border-outline-variant/50 flex flex-col justify-between rounded-xl">
              <div>
                <div className="flex justify-between items-start text-secondary">
                  <span className="text-xs uppercase tracking-wider font-semibold">Bảo Hành Mộng Gỗ</span>
                  <span className="material-symbols-outlined text-[20px] text-primary">verified</span>
                </div>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-bold text-primary font-headline-md">9 năm 4 tháng</span>
                </div>
              </div>
              <p className="text-xs text-on-surface-variant mt-3 pt-3 border-t border-outline-variant/30 leading-relaxed">
                Áp dụng cho toàn bộ kết cấu mộc Kigumi truyền thống không kim loại.
              </p>
            </div>

            {/* Privilege 4: Tư vấn KTS riêng */}
            <div className="p-4 bg-surface-container-low/70 border border-outline-variant/50 flex flex-col justify-between rounded-xl">
              <div>
                <div className="flex justify-between items-start text-secondary">
                  <span className="text-xs uppercase tracking-wider font-semibold">KTS Cố Vấn Riêng</span>
                  <span className="material-symbols-outlined text-[20px] text-primary">architecture</span>
                </div>
                <div className="mt-2">
                  <span className="text-base font-bold text-primary block truncate">KTS. Kenzo Murata</span>
                  <span className="text-xs text-outline">Komorebi Saigon Studio</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-outline-variant/30 flex items-center justify-between">
                <span className="text-[11px] text-emerald-700 font-semibold uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
                  Trực tuyến
                </span>
                <button
                  type="button"
                  onClick={() => setIsConsultMurataOpen(true)}
                  className="text-xs uppercase tracking-wider underline hover:text-primary font-bold"
                >
                  Đặt lịch hẹn
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 2. SUB-NAV TABS BAR (Swipeable on mobile) */}
        <section className="border-b border-outline-variant/60 mb-8 sm:mb-12 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-4 sm:gap-8 whitespace-nowrap min-w-max pb-px">
            <button
              type="button"
              onClick={() => setActiveTab("tab-1")}
              className={`py-3 sm:py-4 text-xs sm:text-sm uppercase tracking-wider transition-all border-b-2 font-bold flex items-center gap-2 ${
                activeTab === "tab-1"
                  ? "text-primary border-primary"
                  : "text-on-surface-variant border-transparent hover:text-primary"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${activeTab === "tab-1" ? "bg-primary" : "bg-transparent"}`} />
              <span>Tổng quan &amp; Đơn hàng</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("tab-2")}
              className={`py-3 sm:py-4 text-xs sm:text-sm uppercase tracking-wider transition-all border-b-2 font-bold flex items-center gap-2 ${
                activeTab === "tab-2"
                  ? "text-primary border-primary"
                  : "text-on-surface-variant border-transparent hover:text-primary"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${activeTab === "tab-2" ? "bg-primary" : "bg-transparent"}`} />
              <span>Hồ sơ &amp; Sổ địa chỉ</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("tab-3")}
              className={`py-3 sm:py-4 text-xs sm:text-sm uppercase tracking-wider transition-all border-b-2 font-bold flex items-center gap-2 ${
                activeTab === "tab-3"
                  ? "text-primary border-primary"
                  : "text-on-surface-variant border-transparent hover:text-primary"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${activeTab === "tab-3" ? "bg-primary" : "bg-transparent"}`} />
              <span>Sổ bảo hành &amp; Nhật ký mộc</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("tab-4")}
              className={`py-3 sm:py-4 text-xs sm:text-sm uppercase tracking-wider transition-all border-b-2 font-bold flex items-center gap-2 ${
                activeTab === "tab-4"
                  ? "text-primary border-primary"
                  : "text-on-surface-variant border-transparent hover:text-primary"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${activeTab === "tab-4" ? "bg-primary" : "bg-transparent"}`} />
              <span>Bản vẽ 3D &amp; May đo</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("tab-5")}
              className={`py-3 sm:py-4 text-xs sm:text-sm uppercase tracking-wider transition-all border-b-2 font-bold flex items-center gap-2 ${
                activeTab === "tab-5"
                  ? "text-primary border-primary"
                  : "text-on-surface-variant border-transparent hover:text-primary"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${activeTab === "tab-5" ? "bg-primary" : "bg-transparent"}`} />
              <span>Yêu thích (Wishlist)</span>
              <span className="text-[10px] bg-primary text-on-primary px-1.5 py-0.5 rounded-full font-bold">
                {wishlistItems.length}
              </span>
            </button>
          </div>
        </section>

        {/* ==================== TAB CONTENT 1: TỔNG QUAN & ĐƠN HÀNG ==================== */}
        {activeTab === "tab-1" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in">
            {/* Cột Trái: Danh sách đơn hàng (8 Columns) */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/40">
                <h2 className="text-xl sm:text-2xl text-primary font-bold tracking-tight flex items-center gap-2">
                  <span className="material-symbols-outlined text-[24px]">local_shipping</span>
                  Tiến Độ Chế Tác &amp; Đơn Hàng Gần Đây
                </h2>
                <span className="text-xs text-outline uppercase tracking-wider">Cập nhật 15 phút trước</span>
              </div>

              {/* ĐƠN HÀNG 1: Đang vận chuyển */}
              <article className="border border-primary bg-surface-container-lowest p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm relative">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-outline-variant/30">
                  <div>
                    <span className="text-xs text-outline uppercase tracking-wider block">Mã đơn kiến trúc</span>
                    <h3 className="text-lg sm:text-xl font-bold text-primary tracking-tight">#KM-2025-089</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
                    <span className="px-3 py-1 bg-primary text-surface-container-lowest text-xs uppercase tracking-wider font-bold rounded-md">
                      Đang vận chuyển &amp; lắp đặt
                    </span>
                  </div>
                </div>

                {/* Product Details Row */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 my-5 items-center">
                  <div className="sm:col-span-4 aspect-[4/3] bg-surface-container border border-outline-variant/40 overflow-hidden rounded-xl relative">
                    <Image
                      src="/images/stitch1-img-2.jpg"
                      alt="Bàn Ăn Gỗ Sồi Mori Extendable"
                      fill
                      sizes="300px"
                      className="object-cover grayscale contrast-125 rounded-xl"
                    />
                  </div>
                  <div className="sm:col-span-8 space-y-2">
                    <h4 className="text-base sm:text-lg text-primary font-bold">
                      Bàn Ăn Gỗ Sồi Mori Extendable + 06 Ghế Kigumi Classic
                    </h4>
                    <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                      Vật liệu: Gỗ sồi trắng Bắc Mỹ (FSC Certified), dầu thực vật Rubio Monocoat nguyên bản. Khớp mộng âm dương không đinh kim loại.
                    </p>
                    <div className="text-xs text-on-surface-variant pt-1 font-medium">
                      Địa điểm: <span className="font-bold text-primary">Villa Thảo Điền, P. Thảo Điền, TP. Thủ Đức</span>
                    </div>
                  </div>
                </div>

                {/* Logistics Plaque */}
                <div className="p-4 bg-surface-container-low border border-outline-variant/50 space-y-1.5 rounded-xl">
                  <div className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[20px] text-primary mt-0.5">precision_manufacturing</span>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-primary">
                        Đội ngũ kỹ thuật đang chuyển phách gỗ và phụ kiện đến công trình.
                      </p>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        Dự kiến có mặt tại hiện trường lúc <strong className="text-primary font-bold">14:00 hôm nay</strong> (Trưởng nhóm lắp đặt: Nguyễn Văn Bình - Bậc thợ 4/4).
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTA Actions */}
                <div className="mt-5 flex flex-wrap gap-3 pt-4 border-t border-outline-variant/30 justify-between items-center">
                  <div className="text-primary text-xs sm:text-sm">
                    Tổng giá trị: <span className="text-lg sm:text-xl font-bold">78.500.000đ</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setIsTrackingOpen(true)}
                      className="px-4 py-2.5 border border-primary text-primary text-xs uppercase tracking-wider hover:bg-primary hover:text-white transition-all flex items-center gap-1.5 active:scale-95 rounded-xl font-bold"
                    >
                      <span className="material-symbols-outlined text-[16px]">location_on</span>
                      Theo dõi thợ lắp đặt
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("tab-4")}
                      className="px-4 py-2.5 border border-outline text-on-surface-variant text-xs uppercase tracking-wider hover:border-primary hover:text-primary transition-colors flex items-center gap-1.5 active:scale-95 rounded-xl font-semibold"
                    >
                      <span className="material-symbols-outlined text-[16px]">architecture</span>
                      Xem bản vẽ lắp ghép
                    </button>
                  </div>
                </div>
              </article>

              {/* ĐƠN HÀNG 2: Đã bàn giao */}
              <article className="border border-outline-variant/60 bg-surface-container-lowest p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-outline-variant/30">
                  <div>
                    <span className="text-xs text-outline uppercase tracking-wider block">Mã đơn kiến trúc</span>
                    <h3 className="text-lg sm:text-xl font-bold text-primary tracking-tight">#KM-2024-512</h3>
                  </div>
                  <span className="px-3 py-1 border border-outline text-on-surface-variant text-xs uppercase tracking-wider font-semibold rounded-md">
                    Đã Bàn Giao &amp; Ký Biên Bản Cố Định
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 my-5 items-center">
                  <div className="sm:col-span-4 aspect-[4/3] bg-surface-container border border-outline-variant/40 overflow-hidden rounded-xl relative">
                    <Image
                      src="/images/stitch1-img-3.jpg"
                      alt="Bộ sofa gỗ sồi Mori"
                      fill
                      sizes="300px"
                      className="object-cover grayscale contrast-125 rounded-xl"
                    />
                  </div>
                  <div className="sm:col-span-8 space-y-2">
                    <h4 className="text-base sm:text-lg text-primary font-bold">
                      Sofa Gỗ Sồi Mori 3 Chỗ + Bàn Trà Tròn Low Table
                    </h4>
                    <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                      Bàn giao hoàn tất: 18/11/2024. Đã phủ lớp tinh dầu sáp ong hữu cơ bảo vệ thớ sợi sồi lần 1.
                    </p>
                    {/* Chứng thư FSC */}
                    <div className="flex items-center gap-3 pt-1">
                      <div className="w-10 h-10 border border-primary flex items-center justify-center bg-surface-container-low rounded-lg flex-shrink-0">
                        <span className="material-symbols-outlined text-2xl text-primary">qr_code_2</span>
                      </div>
                      <div>
                        <span className="text-xs uppercase tracking-wider text-primary font-bold block">
                          Chứng thư gỗ bền vững FSC-C10928
                        </span>
                        <span className="text-[11px] text-outline">
                          Quét để truy xuất nguồn gốc rừng tự nhiên trồng tại Oregon.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3 pt-4 border-t border-outline-variant/30 justify-between items-center">
                  <div className="text-xs sm:text-sm text-on-surface-variant">
                    Đã thanh toán: <span className="text-base sm:text-lg font-bold text-primary">107.500.000đ</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenMaintenance("Sofa Gỗ Sồi Mori 3 Chỗ + Bàn Trà Low Table")}
                      className="px-4 py-2.5 border border-primary text-primary text-xs uppercase tracking-wider hover:bg-primary hover:text-white transition-colors flex items-center gap-1.5 active:scale-95 rounded-xl font-bold"
                    >
                      <span className="material-symbols-outlined text-[16px]">spa</span>
                      Yêu cầu dưỡng sáp ong định kỳ
                    </button>
                    <button
                      type="button"
                      onClick={() => showToast("Đã tải hóa đơn điện tử VAT định dạng PDF (#KM-2024-512) thành công!")}
                      className="px-4 py-2.5 border border-outline-variant text-on-surface-variant text-xs uppercase tracking-wider hover:border-primary hover:text-primary transition-colors active:scale-95 rounded-xl font-semibold"
                    >
                      Xem hóa đơn VAT điện tử
                    </button>
                  </div>
                </div>
              </article>
            </div>

            {/* Cột Phải: Sổ Bảo Hành & Quick Settings (4 Columns) */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
              {/* Sổ Bảo Hành Mộng Gỗ (Digital Warranty Card) */}
              <div className="border border-primary bg-primary text-on-primary p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-lg">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-300">
                      Digital Warranty Card
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-[20px] text-white">verified_user</span>
                </div>

                <div className="mt-4 space-y-4">
                  <div>
                    <span className="text-neutral-400 text-xs uppercase tracking-wider block">Chế tác độc bản</span>
                    <h3 className="text-lg font-bold text-white tracking-tight mt-0.5">
                      Sổ Bảo Hành Mộng Gỗ
                    </h3>
                  </div>

                  {/* Spec Table */}
                  <table className="w-full border-collapse border-t border-b border-neutral-800 text-left text-xs text-neutral-300">
                    <tbody className="divide-y divide-neutral-800">
                      <tr>
                        <td className="py-2 text-neutral-400 uppercase">Serial Phôi Gỗ</td>
                        <td className="py-2 text-right font-mono font-bold text-white">KB-OAK-9921-TK</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-neutral-400 uppercase">Loại Gỗ Chính</td>
                        <td className="py-2 text-right font-medium text-white">Sồi Trắng &amp; Teak Lõi</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-neutral-400 uppercase">Độ Ẩm Kiểm Định</td>
                        <td className="py-2 text-right font-mono text-white">10.2% (Sấy chân không)</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-neutral-400 uppercase">Kết Cấu Ghép</td>
                        <td className="py-2 text-right text-white">Mộng Kigumi 100% không đinh</td>
                      </tr>
                    </tbody>
                  </table>

                  <p className="text-neutral-300 text-xs italic leading-relaxed">
                    “Gỗ là một thực thể sống hít thở cùng ngôi nhà bạn. Cam kết bảo hành cong vênh, co ngót kết cấu 10 năm trọn vẹn.”
                  </p>

                  <div className="space-y-2 pt-2">
                    <button
                      type="button"
                      onClick={() => handleOpenMaintenance("Bàn Ăn Gỗ Sồi Mori Extendable #KM-2025-089")}
                      className="w-full py-3 bg-white text-primary text-xs uppercase tracking-wider font-bold transition-all hover:bg-neutral-200 active:scale-98 flex items-center justify-center gap-2 rounded-xl"
                    >
                      <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                      Đặt lịch bảo dưỡng tại nhà
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("tab-4")}
                      className="w-full py-3 border border-neutral-700 text-white text-xs uppercase tracking-wider transition-colors hover:border-white flex items-center justify-center gap-2 active:scale-98 rounded-xl font-semibold"
                    >
                      <span className="material-symbols-outlined text-[18px]">file_download</span>
                      Tải file 3D SketchUp cho căn hộ
                    </button>
                  </div>
                </div>
              </div>

              {/* Khối Cài Đặt & Bảo Mật */}
              <div className="border border-outline-variant/60 bg-surface-container-lowest p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
                  <h3 className="text-base sm:text-lg font-bold text-primary tracking-tight">Cài Đặt &amp; Bảo Mật</h3>
                  <span className="material-symbols-outlined text-[20px] text-outline">shield</span>
                </div>

                <div className="mt-4 space-y-4 divide-y divide-outline-variant/30">
                  <div className="pt-1 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-primary block">Mật khẩu tài khoản</span>
                      <span className="text-[11px] text-outline">Đổi lần cuối: 3 tháng trước</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsSecurityOpen(true)}
                      className="text-xs uppercase tracking-wider text-primary border border-outline px-3 py-1 hover:border-primary active:scale-95 transition-colors rounded-lg font-semibold"
                    >
                      Đổi mã
                    </button>
                  </div>

                  <div className="pt-3 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-primary block">Xác thực 2 yếu tố (2FA)</span>
                      <span className="text-[11px] text-outline">Google Authenticator</span>
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">
                      Đã bật
                    </span>
                  </div>

                  <div className="pt-3 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-primary block">Nhật ký xưởng chế tác</span>
                      <span className="text-[11px] text-outline">Gửi ảnh phôi gỗ qua Email</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={workshopNotification}
                        onChange={(e) => {
                          setWorkshopNotification(e.target.checked);
                          showToast("Đã cập nhật cài đặt thông báo xưởng chế tác!");
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="pt-3 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-primary block">Phiên đăng nhập hiện tại</span>
                      <span className="text-[11px] text-outline">
                        {user?.email ? `${user.email} (Google OAuth)` : "MacBook Pro (Hồ Chí Minh, VN)"}
                      </span>
                    </div>
                    {user ? (
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="text-xs uppercase tracking-wider text-red-600 hover:text-red-800 transition-colors font-semibold flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[16px]">logout</span>
                        Đăng xuất
                      </button>
                    ) : (
                      <Link
                        href="/dang-nhap"
                        className="text-xs uppercase tracking-wider text-outline hover:text-red-600 transition-colors font-semibold"
                      >
                        Đăng xuất
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB CONTENT 2: HỒ SƠ & SỔ ĐỊA CHỈ ==================== */}
        {activeTab === "tab-2" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in">
            {/* Form chỉnh sửa thông tin cá nhân (7 Columns) */}
            <div className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant/60 p-5 sm:p-6 lg:p-8 space-y-6 rounded-2xl sm:rounded-3xl shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-primary tracking-tight">Hồ Sơ Định Danh Khách Hàng</h3>
                  <p className="text-xs text-outline mt-0.5">Dữ liệu được mã hóa chuẩn kiến trúc bảo mật Komorebi Circle.</p>
                </div>
                <span className="material-symbols-outlined text-[24px] text-primary">badge</span>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-outline mb-1 font-semibold">
                      Họ và tên đầy đủ *
                    </label>
                    <input
                      type="text"
                      required
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full border border-outline-variant bg-surface px-3 py-2.5 text-primary text-sm focus:border-primary focus:outline-none rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-outline mb-1 font-semibold">
                      Chức danh / Nghề nghiệp
                    </label>
                    <input
                      type="text"
                      value={profileRole}
                      onChange={(e) => setProfileRole(e.target.value)}
                      className="w-full border border-outline-variant bg-surface px-3 py-2.5 text-primary text-sm focus:border-primary focus:outline-none rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-outline mb-1 font-semibold">
                      Địa chỉ Email liên lạc *
                    </label>
                    <input
                      type="email"
                      required
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      className="w-full border border-outline-variant bg-surface px-3 py-2.5 text-primary text-sm focus:border-primary focus:outline-none rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-outline mb-1 font-semibold">
                      Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      required
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      className="w-full border border-outline-variant bg-surface px-3 py-2.5 text-primary text-sm focus:border-primary focus:outline-none rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-outline mb-1 font-semibold">
                      Công ty / Văn phòng Kiến Trúc
                    </label>
                    <input
                      type="text"
                      value={profileCompany}
                      onChange={(e) => setProfileCompany(e.target.value)}
                      className="w-full border border-outline-variant bg-surface px-3 py-2.5 text-primary text-sm focus:border-primary focus:outline-none rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-outline mb-1 font-semibold">
                      Ngày sinh (Quà tri ân niên khoá)
                    </label>
                    <input
                      type="date"
                      value={profileDob}
                      onChange={(e) => setProfileDob(e.target.value)}
                      className="w-full border border-outline-variant bg-surface px-3 py-2.5 text-primary text-sm focus:border-primary focus:outline-none rounded-xl"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-end gap-3">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-primary text-white text-xs uppercase tracking-wider font-bold hover:bg-[#27272a] transition-all active:scale-95 flex items-center gap-2 rounded-xl shadow-md"
                  >
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    Lưu thông tin hồ sơ
                  </button>
                </div>
              </form>
            </div>

            {/* Quản lý địa chỉ giao nhận (5 Columns) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
                <h3 className="text-lg font-bold text-primary tracking-tight">Sổ Địa Chỉ Giao Nhận</h3>
                <button
                  type="button"
                  onClick={() => setIsAddAddressOpen(true)}
                  className="text-primary text-xs uppercase tracking-wider underline flex items-center gap-1 hover:text-outline font-bold"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span> Thêm địa chỉ mới
                </button>
              </div>

              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`p-5 bg-surface-container-lowest border rounded-2xl relative shadow-sm ${
                    addr.isDefault ? "border-primary" : "border-outline-variant/60"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase tracking-wider font-bold text-primary">{addr.name}</span>
                      {addr.isDefault && (
                        <span className="bg-primary text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-md tracking-wider">
                          Địa chỉ chính
                        </span>
                      )}
                    </div>
                    <span className="material-symbols-outlined text-primary text-[20px]">
                      {addr.isDefault ? "home_pin" : "apartment"}
                    </span>
                  </div>

                  <p className="text-xs text-primary font-bold mt-2">{addr.recipient} ({addr.phone})</p>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{addr.address}</p>

                  <div className="text-[11px] text-outline mt-3 pt-2 border-t border-outline-variant/30 flex justify-between items-center">
                    <span className="truncate max-w-[65%]">{addr.notes}</span>
                    <div className="flex gap-2">
                      {!addr.isDefault && (
                        <button
                          type="button"
                          onClick={() => handleSetDefaultAddress(addr.id)}
                          className="text-primary hover:underline font-bold"
                        >
                          Đặt mặc định
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB CONTENT 3: SỔ BẢO HÀNH SỐ & NHẬT KÝ BẢO DƯỠNG ==================== */}
        {activeTab === "tab-3" && (
          <div className="space-y-8 animate-in fade-in">
            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-outline-variant/30 gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl text-primary font-bold tracking-tight flex items-center gap-2">
                  <span className="material-symbols-outlined text-[24px]">book_online</span>
                  Sổ Bảo Hành Kỹ Thuật Số &amp; Nhật Ký Thớ Gỗ
                </h2>
                <p className="text-xs text-outline mt-0.5">
                  Truy xuất chuỗi nguồn gốc chứng nhận mộng gỗ Kigumi và hồ sơ dưỡng dầu sáp định kỳ.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleOpenMaintenance("Tất cả sản phẩm cần bảo dưỡng")}
                className="px-4 py-2.5 bg-primary text-white text-xs uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#27272a] transition-colors rounded-xl font-bold shadow-md"
              >
                <span className="material-symbols-outlined text-[16px]">calendar_add_on</span>
                Đặt lịch bảo dưỡng tại gia
              </button>
            </div>

            {/* Bảng danh mục sản phẩm */}
            <div className="border border-outline-variant/60 bg-surface-container-lowest overflow-x-auto no-scrollbar rounded-2xl shadow-sm">
              <table className="w-full min-w-[700px] text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-outline-variant/40 bg-surface-container-low text-xs uppercase tracking-wider text-outline font-bold">
                    <th className="py-3.5 px-4">Mã Serial Bản Độc</th>
                    <th className="py-3.5 px-4">Tên Sản Phẩm May Đo</th>
                    <th className="py-3.5 px-4">Phôi Gỗ &amp; Xuất Xứ</th>
                    <th className="py-3.5 px-4">Độ Ẩm Ban Đầu</th>
                    <th className="py-3.5 px-4">Lần Dưỡng Gần Nhất</th>
                    <th className="py-3.5 px-4">Thời Hạn Mộng</th>
                    <th className="py-3.5 px-4 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  <tr className="hover:bg-surface-container-low/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-primary">KB-OAK-9921-TK</td>
                    <td className="py-3.5 px-4 font-medium text-primary">Bàn Ăn Sồi Mori Extendable (2.6m)</td>
                    <td className="py-3.5 px-4 text-on-surface-variant">Sồi Trắng Bắc Mỹ (FSC)</td>
                    <td className="py-3.5 px-4 font-mono">10.2%</td>
                    <td className="py-3.5 px-4">12/01/2025 (Dầu Rubio)</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded">
                        10 Năm (2035)
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenMaintenance("Bàn Ăn Sồi Mori Extendable")}
                        className="text-primary underline uppercase tracking-wider font-bold hover:text-outline text-xs"
                      >
                        Dưỡng sáp
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-low/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-primary">KB-SOF-8812-MG</td>
                    <td className="py-3.5 px-4 font-medium text-primary">Sofa 3 Chỗ Mori Ash + Vải Lanh Nhật</td>
                    <td className="py-3.5 px-4 text-on-surface-variant">Tần Bì Ash Tự Nhiên</td>
                    <td className="py-3.5 px-4 font-mono">9.8%</td>
                    <td className="py-3.5 px-4">18/11/2024 (Lần đầu)</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded">
                        10 Năm (2034)
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenMaintenance("Sofa 3 Chỗ Mori Ash")}
                        className="text-primary underline uppercase tracking-wider font-bold hover:text-outline text-xs"
                      >
                        Dưỡng sáp
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-low/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-primary">KB-TVU-7734-WL</td>
                    <td className="py-3.5 px-4 font-medium text-primary">Kệ Ti-Vi Treo Phù Điêu Wabi Kura</td>
                    <td className="py-3.5 px-4 text-on-surface-variant">Gỗ Óc Chó Walnut Đen</td>
                    <td className="py-3.5 px-4 font-mono">11.0%</td>
                    <td className="py-3.5 px-4">04/08/2024 (Sáp ong)</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded">
                        10 Năm (2034)
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenMaintenance("Kệ Ti-Vi Treo Phù Điêu Wabi")}
                        className="text-primary underline uppercase tracking-wider font-bold hover:text-outline text-xs"
                      >
                        Dưỡng sáp
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Timeline bảo dưỡng */}
            <div className="border border-outline-variant/60 bg-surface-container-lowest p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-sm">
              <h3 className="text-lg font-bold text-primary mb-6 tracking-tight">
                Nhật Ký Bảo Dưỡng Thớ Gỗ Thực Tế Của Nghệ Nhân
              </h3>
              <div className="relative border-l-2 border-primary ml-3 space-y-6 pl-6">
                <div className="relative">
                  <span className="absolute -left-[31px] top-1.5 w-3 h-3 bg-primary rounded-full"></span>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs sm:text-sm text-primary font-bold uppercase tracking-wider">
                      Đợt Kiểm Tra Độ Ẩm &amp; Phủ Tinh Dầu Lần 2
                    </span>
                    <span className="text-xs text-outline">12/01/2025</span>
                  </div>
                  <p className="text-xs sm:text-sm text-on-surface-variant mt-1 leading-relaxed">
                    Thực hiện bởi: Nghệ nhân Trần Văn Hải (Komorebi Care Team). Độ ẩm mặt gỗ kiểm tra tại phòng khách: 10.4%, không cong vênh, khớp mộng ăn khít tuyệt đối. Đã quét bổ sung 1 lớp sáp ong hữu cơ tự nhiên hương hoa hồi.
                  </p>
                </div>

                <div className="relative">
                  <span className="absolute -left-[31px] top-1.5 w-3 h-3 bg-neutral-400 rounded-full"></span>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs sm:text-sm text-primary font-bold uppercase tracking-wider">
                      Bàn Giao &amp; Kích Hoạt Bảo Hành Lần Đầu
                    </span>
                    <span className="text-xs text-outline">18/11/2024</span>
                  </div>
                  <p className="text-xs sm:text-sm text-on-surface-variant mt-1 leading-relaxed">
                    Thực hiện nghiệm thu cùng KTS. Kenzo Murata. Khách hàng ký biên bản bàn giao đạt chuẩn 100% không keo hóa chất độc hại, chứng thư FSC xác thực hợp lệ.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB CONTENT 4: BẢN VẼ 3D & MAY ĐO ==================== */}
        {activeTab === "tab-4" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-outline-variant/30 gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl text-primary font-bold tracking-tight flex items-center gap-2">
                  <span className="material-symbols-outlined text-[24px]">architecture</span>
                  Bản Vẽ Kỹ Thuật 3D &amp; Dự Án May Đo
                </h2>
                <p className="text-xs text-outline mt-0.5">
                  Hồ sơ kiến trúc kỹ thuật chi tiết dành riêng cho công trình Villa Thảo Điền.
                </p>
              </div>
              <button
                type="button"
                onClick={() => showToast("Đang nén gói toàn bộ tệp CAD & SKP (.ZIP - 148MB)... Quá trình tải sẽ tự động bắt đầu.")}
                className="px-4 py-2.5 border border-primary text-primary text-xs uppercase tracking-wider flex items-center gap-1.5 hover:bg-primary hover:text-white transition-colors active:scale-95 rounded-xl font-bold"
              >
                <span className="material-symbols-outlined text-[16px]">folder_zip</span>
                Tải trọn bộ hồ sơ CAD/SKP (.zip)
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="border border-outline-variant/60 bg-surface-container-lowest p-5 flex flex-col justify-between rounded-2xl shadow-sm">
                <div>
                  <div className="aspect-[16/10] bg-surface-container border border-outline-variant/40 relative overflow-hidden mb-3 rounded-xl">
                    <Image
                      src="/images/stitch1-img-2.jpg"
                      alt="Bản vẽ 3D Mori Dining"
                      fill
                      sizes="350px"
                      className="object-cover grayscale"
                    />
                    <span className="absolute top-2 left-2 bg-primary text-white text-[10px] font-mono px-2 py-0.5 rounded">
                      .SKP / .DWG
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-primary">Phối Cảnh Phòng Ăn Mori Dining 3D</h4>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                    Đầy đủ khớp mộng tỷ lệ 1:1, kiểm tra va chạm cấu trúc không gian và đèn rọi trần.
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-outline-variant/30 flex items-center justify-between">
                  <span className="text-[11px] text-outline">Dung lượng: 42.6 MB</span>
                  <button
                    type="button"
                    onClick={() => showToast("Đang tải tệp bản vẽ: Ban-ve-Mori-Dining-Room-3D.skp")}
                    className="text-xs uppercase tracking-wider text-primary font-bold underline hover:text-outline"
                  >
                    Tải .SKP
                  </button>
                </div>
              </div>

              {/* Card 2 */}
              <div className="border border-outline-variant/60 bg-surface-container-lowest p-5 flex flex-col justify-between rounded-2xl shadow-sm">
                <div>
                  <div className="aspect-[16/10] bg-surface-container border border-outline-variant/40 relative overflow-hidden mb-3 rounded-xl">
                    <Image
                      src="/images/stitch1-img-1.jpg"
                      alt="Sơ đồ chi tiết mộng ghép"
                      fill
                      sizes="350px"
                      className="object-cover grayscale"
                    />
                    <span className="absolute top-2 left-2 bg-primary text-white text-[10px] font-mono px-2 py-0.5 rounded">
                      .PDF / .DWG
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-primary">Sơ Đồ Chi Tiết Mộng Ghép Kigumi</h4>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                    Bản vẽ kỹ thuật bóc tách từng chi tiết chân bàn, giằng chéo và khóa nêm gỗ teak.
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-outline-variant/30 flex items-center justify-between">
                  <span className="text-[11px] text-outline">Dung lượng: 12.8 MB</span>
                  <button
                    type="button"
                    onClick={() => showToast("Đang tải tệp bản vẽ: Chi-tiet-mong-kigumi-assembly.pdf")}
                    className="text-xs uppercase tracking-wider text-primary font-bold underline hover:text-outline"
                  >
                    Tải .PDF
                  </button>
                </div>
              </div>

              {/* Card 3 */}
              <div className="border border-outline-variant/60 bg-surface-container-lowest p-5 flex flex-col justify-between rounded-2xl shadow-sm">
                <div>
                  <div className="aspect-[16/10] bg-surface-container border border-outline-variant/40 relative overflow-hidden mb-3 rounded-xl">
                    <Image
                      src="/images/stitch1-img-3.jpg"
                      alt="Mô hình 3D Sofa Mori"
                      fill
                      sizes="350px"
                      className="object-cover grayscale"
                    />
                    <span className="absolute top-2 left-2 bg-primary text-white text-[10px] font-mono px-2 py-0.5 rounded">
                      .SKP / 3D MAX
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-primary">Mô Hình 3D Sofa Mori + Bàn Trà Low</h4>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                    Bao gồm vật liệu map texture PBR độ phân giải 4K thớ sồi và vải lanh thô dệt tay.
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-outline-variant/30 flex items-center justify-between">
                  <span className="text-[11px] text-outline">Dung lượng: 89.1 MB</span>
                  <button
                    type="button"
                    onClick={() => showToast("Đang tải tệp bản vẽ: Living-Room-Sofa-Mori-4k.skp")}
                    className="text-xs uppercase tracking-wider text-primary font-bold underline hover:text-outline"
                  >
                    Tải .SKP
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB CONTENT 5: DANH SÁCH YÊU THÍCH ==================== */}
        {activeTab === "tab-5" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-outline-variant/30 gap-2">
              <div>
                <h2 className="text-xl sm:text-2xl text-primary font-bold tracking-tight flex items-center gap-2">
                  <span className="material-symbols-outlined text-[24px]">favorite</span>
                  Danh Sách Tuyển Chọn Yêu Thích (Wishlist)
                </h2>
                <p className="text-xs text-outline mt-0.5">
                  Những tuyệt tác thủ công lưu trữ dành cho đợt hoàn thiện không gian tiếp theo của bạn.
                </p>
              </div>
              <span className="text-xs text-outline uppercase tracking-wider">
                Đang lưu {wishlistItems.length} tác phẩm
              </span>
            </div>

            {wishlistItems.length === 0 ? (
              <div className="py-16 text-center space-y-3 bg-surface-container-lowest border border-outline-variant/60 rounded-2xl">
                <span className="material-symbols-outlined text-4xl text-outline">favorite_border</span>
                <p className="text-sm text-on-surface-variant">Danh sách yêu thích của bạn đang trống.</p>
                <Link
                  href="/"
                  className="inline-block px-6 py-2.5 bg-primary text-white text-xs uppercase tracking-wider font-bold rounded-xl"
                >
                  Khám phá bộ sưu tập mộc bản
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {wishlistItems.map((item) => (
                  <div
                    key={item.id}
                    className="border border-outline-variant/60 bg-surface-container-lowest p-5 flex flex-col justify-between rounded-2xl shadow-sm"
                  >
                    <div>
                      <div className="aspect-square bg-surface-container border border-outline-variant/40 relative overflow-hidden mb-3 rounded-xl">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="350px"
                          className="object-cover grayscale hover:scale-105 transition-transform duration-300 rounded-xl"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveWishlist(item.id)}
                          className="absolute top-2 right-2 w-8 h-8 bg-surface-container-lowest/90 border border-outline-variant/40 flex items-center justify-center text-primary hover:text-red-600 transition-colors rounded-lg shadow-sm"
                          title="Xóa khỏi yêu thích"
                        >
                          <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                        <span className="absolute bottom-2 left-2 bg-primary text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                          {item.status}
                        </span>
                      </div>
                      <span className="text-[11px] text-outline uppercase tracking-wider">{item.category}</span>
                      <h4 className="text-base font-bold text-primary mt-1">{item.title}</h4>
                      <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{item.desc}</p>
                      <div className="mt-3 text-lg font-bold text-primary font-headline-md">
                        {item.price.toLocaleString("vi-VN")} đ
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-outline-variant/30 flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleAddWishlistToCart(item)}
                        className="flex-1 py-2.5 bg-primary text-white text-xs uppercase tracking-wider font-bold hover:bg-[#27272a] transition-colors rounded-xl shadow-sm"
                      >
                        Thêm giỏ hàng
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsConsultationOpen(true)}
                        className="px-3 py-2.5 border border-outline text-primary text-xs uppercase tracking-wider hover:border-primary transition-colors rounded-xl font-semibold"
                      >
                        Tư vấn KTS
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />

      {/* ==================== POPUP MODALS ==================== */}

      {/* MODAL 1: Theo dõi thợ lắp đặt */}
      {isTrackingOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
          <div className="bg-surface-container-lowest border border-primary w-full max-w-2xl max-h-[92vh] overflow-y-auto p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-2xl relative">
            <div className="flex justify-between items-start pb-4 border-b border-outline-variant/30">
              <div>
                <span className="text-xs uppercase tracking-wider text-outline block">Mã Đơn #KM-2025-089</span>
                <h3 className="text-lg sm:text-xl font-bold text-primary tracking-tight">
                  Hành Trình Giao Vận &amp; Đội Ngũ Kỹ Thuật
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsTrackingOpen(false)}
                className="p-1 text-outline hover:text-primary rounded-lg"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            {/* Lộ trình */}
            <div className="mt-5 p-4 sm:p-5 bg-surface-container-low border border-outline-variant/40 space-y-4 rounded-xl">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-wider">
                <span className="text-primary font-bold flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-primary rounded-full animate-ping"></span>
                  Xe tải chuyên dụng Komorebi #51D-921.84
                </span>
                <span className="text-on-surface-variant font-mono font-bold">Dự kiến: 14:00 (Còn 25 phút)</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-outline-variant/40 h-1.5 relative my-4 rounded-full">
                <div className="bg-primary h-1.5 w-3/4 rounded-full"></div>
                <div className="absolute -top-2 left-0 w-5 h-5 rounded-full bg-primary border-2 border-white flex items-center justify-center text-[10px] text-white">✓</div>
                <div className="absolute -top-2 left-1/3 w-5 h-5 rounded-full bg-primary border-2 border-white flex items-center justify-center text-[10px] text-white">✓</div>
                <div className="absolute -top-2 left-3/4 w-5 h-5 rounded-full bg-primary border-2 border-white animate-pulse"></div>
                <div className="absolute -top-2 right-0 w-5 h-5 rounded-full bg-surface-container-high border-2 border-outline-variant"></div>
              </div>

              <div className="grid grid-cols-4 text-center text-[10px] sm:text-xs text-outline pt-1">
                <span>1. Rời kho Đồng Nai</span>
                <span>2. Kiểm định gỗ</span>
                <span className="text-primary font-bold">3. Vào Thảo Điền</span>
                <span>4. Ráp mộng tại gia</span>
              </div>
            </div>

            {/* Trưởng kíp */}
            <div className="mt-5 border border-outline-variant/40 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-surface-container-low rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary text-white font-bold text-lg flex items-center justify-center rounded-xl flex-shrink-0">
                  NVB
                </div>
                <div>
                  <h4 className="text-base font-bold text-primary">Nguyễn Văn Bình</h4>
                  <p className="text-xs text-outline">Trưởng kíp lắp ráp • Bậc thợ 4/4 nghề mộc Kigumi</p>
                </div>
              </div>
              <a
                href="tel:+84909876543"
                className="px-4 py-2 border border-primary text-primary text-xs uppercase tracking-wider flex items-center gap-1.5 hover:bg-primary hover:text-white transition-colors rounded-xl font-bold"
              >
                <span className="material-symbols-outlined text-[16px]">call</span>
                Gọi: 0909 876 543
              </a>
            </div>

            {/* Checklist */}
            <div className="mt-5 space-y-2">
              <span className="text-xs uppercase tracking-wider text-primary font-bold block">
                Quy chuẩn bàn giao tại gia:
              </span>
              <ul className="text-xs text-on-surface-variant space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">check</span>
                  <span>Kiểm tra mặt phẳng cân bằng lót sàn trước khi ráp chân bàn.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">check</span>
                  <span>Toàn bộ khớp mộng âm dương đóng bằng vồ gỗ bọc da cao cấp (không trầy thớ).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">check</span>
                  <span>Đo lại độ ẩm phôi gỗ tại nhà và quét lớp tinh dầu sáp ong niêm phong.</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-outline-variant/30 flex justify-end">
              <button
                type="button"
                onClick={() => setIsTrackingOpen(false)}
                className="px-6 py-2.5 bg-primary text-white text-xs uppercase tracking-wider hover:bg-[#27272a] transition-colors rounded-xl font-bold"
              >
                Đóng cửa sổ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Đặt lịch nghệ nhân dưỡng gỗ sáp ong */}
      {isMaintenanceOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
          <div className="bg-surface-container-lowest border border-primary w-full max-w-xl max-h-[92vh] overflow-y-auto p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-2xl relative">
            <div className="flex justify-between items-start pb-4 border-b border-outline-variant/30">
              <div>
                <span className="text-xs uppercase tracking-wider text-outline block">Komorebi Woodcraft Care</span>
                <h3 className="text-lg sm:text-xl font-bold text-primary tracking-tight">
                  Đặt Lịch Nghệ Nhân Dưỡng Gỗ Tại Gia
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsMaintenanceOpen(false)}
                className="p-1 text-outline hover:text-primary rounded-lg"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsMaintenanceOpen(false);
                showToast("Đã ghi nhận lịch bảo dưỡng sáp ong. Kỹ thuật viên sẽ liên hệ xác nhận trong 2 giờ!");
              }}
              className="mt-5 space-y-4"
            >
              <div>
                <label className="block text-xs uppercase tracking-wider text-outline mb-1 font-semibold">
                  Sản phẩm cần dưỡng tinh dầu sáp *
                </label>
                <input
                  type="text"
                  required
                  value={maintenanceProduct}
                  onChange={(e) => setMaintenanceProduct(e.target.value)}
                  className="w-full border border-outline-variant bg-surface px-3 py-2.5 text-primary text-sm focus:border-primary focus:outline-none rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-outline mb-1 font-semibold">
                    Ngày hẹn nghệ nhân *
                  </label>
                  <input
                    type="date"
                    required
                    defaultValue="2025-11-20"
                    className="w-full border border-outline-variant bg-surface px-3 py-2.5 text-primary text-sm focus:border-primary focus:outline-none rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-outline mb-1 font-semibold">
                    Khung giờ tiếp nhận *
                  </label>
                  <select
                    required
                    className="w-full border border-outline-variant bg-surface px-3 py-2.5 text-primary text-sm focus:border-primary focus:outline-none rounded-xl"
                  >
                    <option>Sáng (09:00 - 11:30)</option>
                    <option>Chiều (14:00 - 16:30)</option>
                    <option>Cuối tuần (Thỏa thuận riêng)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-outline mb-1 font-semibold">
                  Hiện trạng bề mặt gỗ / Ghi chú đặc thù
                </label>
                <textarea
                  placeholder="Ví dụ: Vết ố trà nhẹ ở góc bàn cần đánh giấy nhám số 600 mịn và dưỡng sáp lại..."
                  rows={3}
                  className="w-full border border-outline-variant bg-surface px-3 py-2.5 text-primary text-sm focus:border-primary focus:outline-none rounded-xl resize-none"
                />
              </div>

              <div className="p-3 bg-surface-container-low border border-outline-variant/50 text-xs text-on-surface-variant rounded-xl leading-relaxed">
                Quyền lợi VIP Platinum: <strong className="text-primary font-bold">Miễn phí 100%</strong> toàn bộ chi phí nhân công và tinh dầu Rubio Monocoat / sáp ong hữu cơ độc quyền.
              </div>

              <div className="pt-3 border-t border-outline-variant/30 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsMaintenanceOpen(false)}
                  className="px-4 py-2.5 border border-outline text-outline text-xs uppercase tracking-wider hover:border-primary rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-primary text-white text-xs uppercase tracking-wider font-bold hover:bg-[#27272a] transition-colors rounded-xl shadow-md"
                >
                  Xác nhận lịch bảo dưỡng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Điều lệ hội viên Platinum Atelier */}
      {isCharterOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
          <div className="bg-surface-container-lowest border border-primary w-full max-w-2xl max-h-[92vh] overflow-y-auto p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-2xl relative">
            <div className="flex justify-between items-start pb-4 border-b border-outline-variant/30">
              <div>
                <span className="text-xs uppercase tracking-wider text-outline block">Komorebi Circle Charter</span>
                <h3 className="text-lg sm:text-xl font-bold text-primary tracking-tight">
                  Đặc Quyền Hội Viên Platinum Atelier
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCharterOpen(false)}
                className="p-1 text-outline hover:text-primary rounded-lg"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            <div className="mt-5 space-y-4 text-xs sm:text-sm text-on-surface-variant">
              <div className="border-b border-outline-variant/30 pb-3">
                <h4 className="text-base font-bold text-primary mb-1">1. Quyền chọn vân phôi gỗ nguyên khối tại kho</h4>
                <p className="leading-relaxed">
                  Hội viên Platinum Atelier được trực tiếp cùng KTS trưởng tham quan kho phôi gỗ Bắc Mỹ tại Đồng Nai &amp; xưởng Kyoto để tuyển lựa các phôi vân mắt (burl wood) và phiến sồi cổ thụ trước khi đưa vào xẻ mộng.
                </p>
              </div>

              <div className="border-b border-outline-variant/30 pb-3">
                <h4 className="text-base font-bold text-primary mb-1">2. Bảo hành kết cấu mộng ghép Kigumi 10 năm</h4>
                <p className="leading-relaxed">
                  Cam kết sửa chữa hoặc đổi mới hoàn toàn nếu xuất hiện biến dạng, co ngót hoặc nứt gãy ở các khớp nối âm dương trong điều kiện vi khí hậu phòng tiêu chuẩn.
                </p>
              </div>

              <div className="border-b border-outline-variant/30 pb-3">
                <h4 className="text-base font-bold text-primary mb-1">3. Tích lũy Điểm Chế Tác (Craftsmanship Points)</h4>
                <p className="leading-relaxed">
                  Mỗi 1.000.000đ giao dịch tích lũy tương đương 25 PTS. Điểm số có thể quy đổi thành các gói bảo dưỡng chuyên sâu, phụ kiện khay trà óc chó hoặc khóa workshop mộng gỗ Nhật Bản cùng nghệ nhân.
                </p>
              </div>

              <div>
                <h4 className="text-base font-bold text-primary mb-1">4. KTS cố vấn riêng thường trực</h4>
                <p className="leading-relaxed">
                  Được hỗ trợ dựng phối cảnh SketchUp 3D miễn phí cho mọi không gian cần bổ sung nội thất trong vòng 48 giờ kể từ khi gửi kích thước mặt bằng.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-outline-variant/30 flex justify-end">
              <button
                type="button"
                onClick={() => setIsCharterOpen(false)}
                className="px-6 py-2.5 bg-primary text-white text-xs uppercase tracking-wider hover:bg-[#27272a] transition-colors rounded-xl font-bold"
              >
                Đã hiểu &amp; Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Đổi mật khẩu */}
      {isSecurityOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
          <div className="bg-surface-container-lowest border border-primary w-full max-w-md max-h-[92vh] overflow-y-auto p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl relative">
            <div className="flex justify-between items-start pb-4 border-b border-outline-variant/30">
              <div>
                <span className="text-xs uppercase tracking-wider text-outline block">Security Protocol</span>
                <h3 className="text-lg font-bold text-primary tracking-tight">Cập Nhật Mật Mã Bảo Vệ</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSecurityOpen(false)}
                className="p-1 text-outline hover:text-primary rounded-lg"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsSecurityOpen(false);
                showToast("Đổi mật mã tài khoản thành công! Các phiên đăng nhập khác vẫn an toàn.");
              }}
              className="mt-5 space-y-4"
            >
              <div>
                <label className="block text-xs uppercase tracking-wider text-outline mb-1 font-semibold">
                  Mật khẩu hiện tại *
                </label>
                <input
                  type="password"
                  required
                  className="w-full border border-outline-variant bg-surface px-3 py-2.5 text-primary text-sm focus:border-primary focus:outline-none rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-outline mb-1 font-semibold">
                  Mật khẩu mới *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Tối thiểu 8 ký tự"
                  className="w-full border border-outline-variant bg-surface px-3 py-2.5 text-primary text-sm focus:border-primary focus:outline-none rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-outline mb-1 font-semibold">
                  Xác nhận mật khẩu mới *
                </label>
                <input
                  type="password"
                  required
                  className="w-full border border-outline-variant bg-surface px-3 py-2.5 text-primary text-sm focus:border-primary focus:outline-none rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-outline-variant/30 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsSecurityOpen(false)}
                  className="px-4 py-2.5 border border-outline text-outline text-xs uppercase tracking-wider hover:border-primary rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-primary text-white text-xs uppercase tracking-wider font-bold hover:bg-[#27272a] transition-colors rounded-xl shadow-md"
                >
                  Lưu mật khẩu mới
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: Tư vấn KTS riêng (Kenzo Murata) */}
      {isConsultMurataOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
          <div className="bg-surface-container-lowest border border-primary w-full max-w-lg max-h-[92vh] overflow-y-auto p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl relative">
            <div className="flex justify-between items-start pb-4 border-b border-outline-variant/30">
              <div>
                <span className="text-xs uppercase tracking-wider text-outline block">Atelier Consultation</span>
                <h3 className="text-lg font-bold text-primary tracking-tight">
                  Đặt Lịch Tư Vấn Với KTS. Kenzo Murata
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsConsultMurataOpen(false)}
                className="p-1 text-outline hover:text-primary rounded-lg"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-3 bg-surface-container-low p-3.5 border border-outline-variant/40 rounded-xl">
                <div className="w-12 h-12 bg-neutral-900 text-white flex items-center justify-center font-bold text-lg rounded-xl flex-shrink-0">
                  KM
                </div>
                <div>
                  <h4 className="text-sm font-bold text-primary">KTS. Kenzo Murata</h4>
                  <p className="text-xs text-outline">Cố vấn trưởng phong cách Wabi-Sabi &amp; Mộng Kigumi</p>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setIsConsultMurataOpen(false);
                  showToast("Đã gửi yêu cầu đến KTS. Kenzo Murata. Studio sẽ liên hệ lại quý khách sớm nhất!");
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs uppercase tracking-wider text-outline mb-1 font-semibold">
                    Không gian cần tư vấn *
                  </label>
                  <select className="w-full border border-outline-variant bg-surface px-3 py-2.5 text-primary text-sm focus:border-primary focus:outline-none rounded-xl">
                    <option>Phòng khách &amp; Khu thưởng trà</option>
                    <option>Khu vực Bếp &amp; Bàn tiệc đại sảnh</option>
                    <option>May đo giường mộc &amp; Tủ phòng ngủ</option>
                    <option>Toàn bộ biệt thự / Penthouse</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-outline mb-1 font-semibold">
                    Hình thức tư vấn
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <label className="flex items-center gap-2 p-3 border border-outline-variant rounded-xl cursor-pointer bg-surface-container-low">
                      <input type="radio" name="consult_type" defaultChecked className="text-primary focus:ring-0" />
                      <span>Trực tiếp tại Showroom Thảo Điền</span>
                    </label>
                    <label className="flex items-center gap-2 p-3 border border-outline-variant rounded-xl cursor-pointer bg-surface-container-low">
                      <input type="radio" name="consult_type" className="text-primary focus:ring-0" />
                      <span>Khảo sát tại công trình</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-outline mb-1 font-semibold">
                    Ghi chú yêu cầu sơ bộ
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Ví dụ: Mong muốn đưa hệ vách nan gỗ sồi tự nhiên che cầu thang..."
                    className="w-full border border-outline-variant bg-surface px-3 py-2.5 text-primary text-sm focus:border-primary focus:outline-none rounded-xl resize-none"
                  />
                </div>

                <div className="pt-3 border-t border-outline-variant/30 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsConsultMurataOpen(false)}
                    className="px-4 py-2.5 border border-outline text-outline text-xs uppercase tracking-wider hover:border-primary rounded-xl"
                  >
                    Đóng
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-primary text-white text-xs uppercase tracking-wider font-bold hover:bg-[#27272a] transition-colors rounded-xl shadow-md"
                  >
                    Gửi lịch hẹn tư vấn
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: Thêm địa chỉ mới */}
      {isAddAddressOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
          <div className="bg-surface-container-lowest border border-primary w-full max-w-lg max-h-[92vh] overflow-y-auto p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl relative">
            <div className="flex justify-between items-start pb-4 border-b border-outline-variant/30">
              <div>
                <span className="text-xs uppercase tracking-wider text-outline block">Shipping Directory</span>
                <h3 className="text-lg font-bold text-primary tracking-tight">Thêm Địa Chỉ Nhận Bàn Giao Gỗ</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddAddressOpen(false)}
                className="p-1 text-outline hover:text-primary rounded-lg"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddAddress} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-outline mb-1 font-semibold">
                  Tên gợi nhớ công trình *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Căn hộ Duplex Landmark 81..."
                  value={newAddrName}
                  onChange={(e) => setNewAddrName(e.target.value)}
                  className="w-full border border-outline-variant bg-surface px-3 py-2.5 text-primary text-sm focus:border-primary focus:outline-none rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-outline mb-1 font-semibold">
                    Người nhận bàn giao *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAddrRecipient}
                    onChange={(e) => setNewAddrRecipient(e.target.value)}
                    className="w-full border border-outline-variant bg-surface px-3 py-2.5 text-primary text-sm focus:border-primary focus:outline-none rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-outline mb-1 font-semibold">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    required
                    value={newAddrPhone}
                    onChange={(e) => setNewAddrPhone(e.target.value)}
                    className="w-full border border-outline-variant bg-surface px-3 py-2.5 text-primary text-sm focus:border-primary focus:outline-none rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-outline mb-1 font-semibold">
                  Địa chỉ chi tiết *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Số nhà, đường, phường, quận..."
                  value={newAddrDetail}
                  onChange={(e) => setNewAddrDetail(e.target.value)}
                  className="w-full border border-outline-variant bg-surface px-3 py-2.5 text-primary text-sm focus:border-primary focus:outline-none rounded-xl resize-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-outline mb-1 font-semibold">
                  Ghi chú tải trọng thang máy / Cầu thang bộ
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Thang máy rộng, phôi gỗ dài tối đa 2.8m đưa vào được..."
                  value={newAddrNotes}
                  onChange={(e) => setNewAddrNotes(e.target.value)}
                  className="w-full border border-outline-variant bg-surface px-3 py-2.5 text-primary text-sm focus:border-primary focus:outline-none rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-outline-variant/30 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddAddressOpen(false)}
                  className="px-4 py-2.5 border border-outline text-outline text-xs uppercase tracking-wider hover:border-primary rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-primary text-white text-xs uppercase tracking-wider font-bold hover:bg-[#27272a] transition-colors rounded-xl shadow-md"
                >
                  Lưu địa chỉ vào sổ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global Consultation Modal */}
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />
    </>
  );
}
