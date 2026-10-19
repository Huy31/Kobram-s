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
import { getUserOrders } from "@/services/productService";
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
  const { addToCart, showToast, wishlist, removeFromWishlist } = useCart();
  const [activeTab, setActiveTab] = useState<TabId>("tab-1");
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState<boolean>(true);
  const [profileAvatar, setProfileAvatar] = useState<string>("/images/stitch1-img-1.jpg");

  // Profile data state (Mặc định cho khách hàng thực tế)
  const [profileName, setProfileName] = useState("Khách hàng");
  const [profileRole, setProfileRole] = useState("Khách hàng");
  const [profileEmail, setProfileEmail] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileCompany, setProfileCompany] = useState("");
  const [profileDob, setProfileDob] = useState("");
  const [profileGender, setProfileGender] = useState("Nam");
  const [profileTax, setProfileTax] = useState("");
  const [favStyles, setFavStyles] = useState<string[]>([
    "Wabi-Sabi tối giản",
    "Japandi đương đại",
    "Nội thất mộng ghép Kigumi",
  ]);
  const [preferredWood, setPreferredWood] = useState("Gỗ Sồi Trắng Bắc Mỹ (White Oak)");
  const [careFreq, setCareFreq] = useState("Mỗi 6 tháng (Komorebi Khuyến nghị)");

  // Supabase Auth Sync
  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(async ({ data }) => {
      const currentUser = data?.user;
      const savedRole =
        typeof window !== "undefined"
          ? localStorage.getItem("komorebi_current_role") ||
            localStorage.getItem("komorebi_login_role")
          : null;

      if (currentUser) {
        setUser(currentUser);
        if (currentUser.email) setProfileEmail(currentUser.email);
        const metaName =
          currentUser.user_metadata?.full_name ||
          currentUser.user_metadata?.name ||
          (currentUser.email ? currentUser.email.split("@")[0] : null);
        if (metaName) {
          setProfileName(metaName);
          setAddresses((prev) =>
            prev.map((addr) =>
              addr.id === "addr-1" && addr.recipient === "Khách hàng"
                ? { ...addr, recipient: metaName }
                : addr
            )
          );
        }

        const rawPic = currentUser.user_metadata?.picture;
        const avatar =
          currentUser.user_metadata?.avatar_url ||
          (typeof rawPic === "string" ? rawPic : rawPic?.data?.url);
        if (avatar) setProfileAvatar(avatar);

        // Mặc định phân định chức danh: nếu là tài khoản kiến trúc sư thì chức danh thay đổi, ngược lại mặc định là Khách hàng
        const metaRole = currentUser.user_metadata?.role;
        const isArchitect =
          metaRole === "architect" || savedRole === "architect";
        setProfileRole(isArchitect ? "Kiến trúc sư" : "Khách hàng");

        // Fetch DB profile and orders if present
        try {
          const { data: dbProfile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", currentUser.id)
            .maybeSingle();

          if (dbProfile) {
            if (dbProfile.full_name) {
              setProfileName(dbProfile.full_name);
              setAddresses((prev) =>
                prev.map((addr) =>
                  addr.id === "addr-1"
                    ? { ...addr, recipient: dbProfile.full_name }
                    : addr
                )
              );
            }
            if (dbProfile.role) {
              const assignedRole =
                dbProfile.role === "architect"
                  ? "Kiến trúc sư"
                  : dbProfile.role === "admin"
                  ? "Quản trị viên"
                  : savedRole === "architect"
                  ? "Kiến trúc sư"
                  : "Khách hàng";
              setProfileRole(assignedRole);
              if (savedRole === "architect" && dbProfile.role !== "architect") {
                await supabase
                  .from("profiles")
                  .update({ role: "architect", updated_at: new Date().toISOString() })
                  .eq("id", currentUser.id);
              }
            } else if (isArchitect) {
              setProfileRole("Kiến trúc sư");
              await supabase
                .from("profiles")
                .upsert({ id: currentUser.id, role: "architect", updated_at: new Date().toISOString() });
            }
            if (dbProfile.phone) {
              setProfilePhone(dbProfile.phone);
              setAddresses((prev) =>
                prev.map((addr) =>
                  addr.id === "addr-1"
                    ? { ...addr, phone: dbProfile.phone }
                    : addr
                )
              );
            }
            if (dbProfile.studio_name || dbProfile.company) {
              setProfileCompany(dbProfile.studio_name || dbProfile.company);
            }
            if (dbProfile.avatar_url) setProfileAvatar(dbProfile.avatar_url);
            if (dbProfile.dob) setProfileDob(dbProfile.dob);
            if (dbProfile.gender) setProfileGender(dbProfile.gender);
            if (dbProfile.tax_id) setProfileTax(dbProfile.tax_id);
            if (dbProfile.preferred_wood) setPreferredWood(dbProfile.preferred_wood);
            if (dbProfile.care_frequency) setCareFreq(dbProfile.care_frequency);
          } else if (isArchitect) {
            await supabase.from("profiles").upsert({
              id: currentUser.id,
              email: currentUser.email,
              full_name: metaName,
              role: "architect",
              updated_at: new Date().toISOString(),
            });
          }
        } catch (e) {
          // Ignore if table not yet migrated
        }

        // Fetch user orders from DB
        getUserOrders(currentUser.id).then((ordList) => {
          if (ordList) setOrders(ordList);
          setIsLoadingOrders(false);
        });
      } else {
        // Tài khoản vãng lai hoặc demo
        setProfileRole(savedRole === "architect" ? "Kiến trúc sư" : "Khách hàng");
        // Fetch guest or public orders
        getUserOrders().then((ordList) => {
          if (ordList) setOrders(ordList);
          setIsLoadingOrders(false);
        });
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
          const rawPic = currentUser.user_metadata?.picture;
          const avatar =
            currentUser.user_metadata?.avatar_url ||
            (typeof rawPic === "string" ? rawPic : rawPic?.data?.url);
          if (avatar) setProfileAvatar(avatar);

          const savedRole =
            typeof window !== "undefined"
              ? localStorage.getItem("komorebi_current_role") ||
                localStorage.getItem("komorebi_login_role")
              : null;
          const isArch =
            currentUser.user_metadata?.role === "architect" ||
            savedRole === "architect";
          setProfileRole(isArch ? "Kiến trúc sư" : "Khách hàng");
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
      name: "Villa Thảo Điền (Tư gia chính)",
      isDefault: true,
      recipient: profileName || "Khách hàng",
      phone: profilePhone || "",
      address: "18 Đường số 42, Phường Thảo Điền, TP. Thủ Đức, TP. Hồ Chí Minh",
      notes: "Thang máy tải hàng rộng 2.4m, sẵn mặt bằng lắp mộng không đinh.",
    },
    {
      id: "addr-2",
      name: "Văn phòng thiết kế K-Studio",
      isDefault: false,
      recipient: "Bộ phận Tiếp Nhận Dự Án",
      phone: "",
      address: "102 Lê Thánh Tôn, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
      notes: "Tiếp nhận phôi gỗ mẫu Teak & catalog vật liệu hoàn thiện.",
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
  const [newAddrRecipient, setNewAddrRecipient] = useState("");
  const [newAddrPhone, setNewAddrPhone] = useState("");
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
      if (typeof window !== "undefined") {
        localStorage.removeItem("komorebi_current_role");
        localStorage.removeItem("komorebi_login_role");
      }
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
          studio_name: profileCompany,
          role:
            profileRole === "Kiến trúc sư" || profileRole.includes("Kiến trúc")
              ? "architect"
              : profileRole === "Quản trị viên"
              ? "admin"
              : "client",
          dob: profileDob || null,
          gender: profileGender || null,
          tax_id: profileTax || null,
          preferred_wood: preferredWood,
          care_frequency: careFreq,
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

  const toggleFavStyle = (style: string) => {
    setFavStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    showToast("Đã xóa địa chỉ thành công.");
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
                      {user.app_metadata?.provider === "facebook" ? (
                        <>
                          <svg className="w-3.5 h-3.5 fill-[#1877F2]" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                          Facebook Verified
                        </>
                      ) : (
                        <>
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
                        </>
                      )}
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 border border-primary text-primary text-[11px] font-bold uppercase tracking-wider rounded-md bg-surface-container-low">
                      Komorebi Circle Elite #KM-8821
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider ${
                      profileRole.includes("Kiến trúc")
                        ? "bg-amber-100/90 text-amber-900 border border-amber-300"
                        : "bg-stone-100 text-stone-800 border border-stone-300"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px]">
                      {profileRole.includes("Kiến trúc") ? "architecture" : "person"}
                    </span>
                    {profileRole}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 text-outline text-xs tracking-wider uppercase font-medium">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
                    {user?.created_at
                      ? `Thành viên từ ${new Date(user.created_at).toLocaleDateString("vi-VN", { month: "2-digit", year: "numeric" })}`
                      : "Thành viên Komorebi"}
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
                  Hạng Thành Viên
                </span>
                <span className="text-lg sm:text-xl text-primary font-bold tracking-tight">
                  {profileRole.includes("Kiến trúc")
                    ? "ĐỐI TÁC KIẾN TRÚC SƯ"
                    : user
                    ? "HỘI VIÊN TIÊU CHUẨN"
                    : "KHÁCH HÀNG"}
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
                  <span className="text-xs uppercase tracking-wider font-semibold">Đơn Hàng Ghi Nhận</span>
                  <span className="material-symbols-outlined text-[20px] text-primary">inventory_2</span>
                </div>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-bold text-primary font-headline-md">{orders.length}</span>
                  <span className="text-xs text-secondary font-bold">dự án</span>
                </div>
              </div>
              <p className="text-xs text-on-surface-variant mt-3 pt-3 border-t border-outline-variant/30 leading-relaxed">
                Tổng giá trị: <strong className="text-primary font-bold">{orders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0).toLocaleString("vi-VN")}đ</strong>.
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

            {/* Privilege 4: Tư vấn KTS riêng hoặc Đặc quyền KTS */}
            <div className="p-4 bg-surface-container-low/70 border border-outline-variant/50 flex flex-col justify-between rounded-xl">
              <div>
                <div className="flex justify-between items-start text-secondary">
                  <span className="text-xs uppercase tracking-wider font-semibold">
                    {profileRole.includes("Kiến trúc") ? "Chính Sách Đối Tác" : "KTS Cố Vấn Riêng"}
                  </span>
                  <span className="material-symbols-outlined text-[20px] text-primary">
                    {profileRole.includes("Kiến trúc") ? "handyman" : "architecture"}
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-base font-bold text-primary block truncate">
                    {profileRole.includes("Kiến trúc") ? "Chiết Khấu Dự Án 15%" : "KTS. Kenzo Murata"}
                  </span>
                  <span className="text-xs text-outline">
                    {profileRole.includes("Kiến trúc") ? "Đặc quyền KTS chủ trì" : "Komorebi Saigon Studio"}
                  </span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-outline-variant/30 flex items-center justify-between">
                <span className="text-[11px] text-emerald-700 font-semibold uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
                  {profileRole.includes("Kiến trúc") ? "Đang áp dụng" : "Trực tuyến"}
                </span>
                <button
                  type="button"
                  onClick={() => setIsConsultMurataOpen(true)}
                  className="text-xs uppercase tracking-wider underline hover:text-primary font-bold"
                >
                  {profileRole.includes("Kiến trúc") ? "Xem catalog" : "Đặt lịch hẹn"}
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
                {wishlist.length}
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

              {orders.length === 0 ? (
                <div className="border border-outline-variant/60 bg-surface-container-lowest p-8 text-center rounded-2xl sm:rounded-3xl shadow-sm">
                  <span className="material-symbols-outlined text-4xl text-outline mb-2">inventory_2</span>
                  <h3 className="text-base font-bold text-primary">Chưa có đơn hàng nào</h3>
                  <p className="text-xs text-on-surface-variant mt-1 max-w-md mx-auto">
                    Khi quý khách tiến hành đặt mua sản phẩm trên website, thông tin và lộ trình chế tác thực tế sẽ được cập nhật tại đây.
                  </p>
                  <Link
                    href="/#phong-khach"
                    className="inline-block mt-4 px-6 py-2.5 bg-primary text-white text-xs uppercase tracking-wider font-bold rounded-xl hover:bg-[#27272a] transition-all"
                  >
                    Khám phá sản phẩm
                  </Link>
                </div>
              ) : (
                orders.map((ord: any) => {
                  const firstItem = ord.order_items?.[0];
                  const statusText =
                    ord.order_status === "completed"
                      ? "Đã Bàn Giao & Nghiệm Thu"
                      : ord.order_status === "shipping"
                      ? "Đang Vận Chuyển & Lắp Đặt"
                      : ord.order_status === "manufacturing"
                      ? "Đang Gia Công Tại Xưởng"
                      : "Đã Tiếp Nhận & Lên Bản Vẽ";

                  return (
                    <article key={ord.id} className="border border-primary bg-surface-container-lowest p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm relative">
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-outline-variant/30">
                        <div>
                          <span className="text-xs text-outline uppercase tracking-wider block">Mã đơn kiến trúc</span>
                          <h3 className="text-lg sm:text-xl font-bold text-primary tracking-tight">#{ord.order_code}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
                          <span className="px-3 py-1 bg-primary text-surface-container-lowest text-xs uppercase tracking-wider font-bold rounded-md">
                            {statusText}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 my-5 items-center">
                        <div className="sm:col-span-4 aspect-[4/3] bg-surface-container border border-outline-variant/40 overflow-hidden rounded-xl relative">
                          <Image
                            src={firstItem?.product_image || "/images/living-1.jpg"}
                            alt={firstItem?.product_title || "Sản phẩm Komorebi"}
                            fill
                            sizes="300px"
                            className="object-cover rounded-xl"
                          />
                        </div>
                        <div className="sm:col-span-8 space-y-2">
                          <h4 className="text-base sm:text-lg text-primary font-bold">
                            {firstItem?.product_title || "Đơn hàng nội thất Komorebi"}
                            {ord.order_items?.length > 1 ? ` (+ ${ord.order_items.length - 1} tác phẩm khác)` : ""}
                          </h4>
                          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                            {firstItem?.selected_wood ? `Vật liệu: ${firstItem.selected_wood}. ` : ""}
                            {firstItem?.selected_upholstery ? `Hoàn thiện: ${firstItem.selected_upholstery}. ` : ""}
                            {ord.order_note || "Chế tác thủ công theo tiêu chuẩn mộng mộc Kigumi."}
                          </p>
                          <div className="text-xs text-on-surface-variant pt-1 font-medium">
                            Địa điểm giao nhận: <span className="font-bold text-primary">{ord.shipping_address}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-3 pt-4 border-t border-outline-variant/30 justify-between items-center">
                        <div className="text-primary text-xs sm:text-sm">
                          Tổng giá trị: <span className="text-lg sm:text-xl font-bold">{Number(ord.total_amount).toLocaleString("vi-VN")} đ</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => setIsTrackingOpen(true)}
                            className="px-4 py-2.5 border border-primary text-primary text-xs uppercase tracking-wider hover:bg-primary hover:text-white transition-all flex items-center gap-1.5 active:scale-95 rounded-xl font-bold"
                          >
                            <span className="material-symbols-outlined text-[16px]">location_on</span>
                            Theo dõi tiến độ
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
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

        {/* ==================== TAB CONTENT 2: THÔNG TIN CÁ NHÂN & ĐỊA CHỈ GIAO NHẬN ==================== */}
        {activeTab === "tab-2" && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in">
            {/* Header Title */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-outline-variant/40 gap-2">
              <div>
                <span className="text-xs uppercase tracking-wider text-outline block font-semibold">
                  Komorebi Circle • Atelier Member Profile
                </span>
                <h2 className="text-xl sm:text-2xl font-headline font-bold text-primary tracking-tight flex items-center gap-2 mt-0.5">
                  <span className="material-symbols-outlined text-[24px]">badge</span>
                  Hồ Sơ Cá Nhân &amp; Quản Lý Thông Tin Hội Viên
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-surface-container-high text-primary font-mono text-[11px] font-bold border border-outline-variant rounded-md">
                  {user ? `MÃ HỘI VIÊN #${user.id.slice(0, 8).toUpperCase()}` : "KOMOREBI CIRCLE ELITE #KM-8821"}
                </span>
              </div>
            </div>

            <form className="space-y-6 sm:space-y-8" onSubmit={handleSaveProfile}>
              {/* Section Avatar */}
              <section className="bg-surface-container-lowest border border-primary p-4 sm:p-6 rounded-2xl shadow-sm">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
                    <div className="relative flex-shrink-0">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 p-1 border-2 border-primary bg-surface overflow-hidden rounded-2xl shadow-sm relative">
                        <Image
                          src={profileAvatar}
                          alt={profileName}
                          fill
                          sizes="100px"
                          className="object-cover rounded-xl"
                        />
                      </div>
                      <span className="absolute -bottom-1 -right-1 bg-primary text-white text-[9px] font-mono font-bold px-1.5 py-0.5 uppercase rounded">
                        {user ? "AUTH" : "ELITE"}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                        <h3 className="text-lg sm:text-xl font-headline font-bold text-primary">
                          {profileName}
                        </h3>
                        <span className="px-2 py-0.5 bg-primary text-surface-container-lowest text-[10px] uppercase tracking-wider font-semibold rounded">
                          {user ? "Hội viên tiêu chuẩn" : "VIP Platinum"}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-secondary mt-0.5 font-medium">
                        {profileRole}
                      </p>
                      <p className="text-[11px] text-outline mt-1">
                        Định dạng hợp lệ: JPG, PNG, WEBP (Tối đa 5.0 MB, chuẩn tỉ lệ 1:1 vuông hoặc 4:5).
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <label className="px-3.5 py-2 border border-primary text-primary text-xs uppercase tracking-wider hover:bg-primary hover:text-white transition-colors flex items-center gap-1.5 active:scale-95 cursor-pointer font-bold rounded-xl shadow-sm">
                      <span className="material-symbols-outlined text-[16px]">upload</span>
                      Tải ảnh mới
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = URL.createObjectURL(file);
                            setProfileAvatar(url);
                            showToast("Đã tải ảnh đại diện mới xem trước!");
                          }
                        }}
                      />
                    </label>
                    <button
                      className="px-3.5 py-2 border border-outline-variant text-secondary text-xs uppercase tracking-wider hover:border-primary hover:text-primary transition-colors flex items-center gap-1.5 active:scale-95 font-semibold rounded-xl"
                      type="button"
                      onClick={() => {
                        setProfileAvatar("/images/stitch1-img-1.jpg");
                        showToast("Đã đặt lại ảnh đại diện mặc định.");
                      }}
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                      Xóa ảnh
                    </button>
                  </div>
                </div>
              </section>

              {/* 2 Columns Grid: 1. Thông Tin Định Danh Cơ Bản & 2. Thông Tin Liên Hệ & Xác Thực */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Col 1: 1. Thông Tin Định Danh Cơ Bản */}
                <div className="lg:col-span-6 bg-surface-container-lowest border border-outline-variant/60 p-5 sm:p-6 space-y-4 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px] text-primary">person</span>
                      <h3 className="text-base sm:text-lg font-headline font-bold text-primary tracking-tight">
                        1. Thông Tin Định Danh Cơ Bản
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-outline uppercase tracking-wider font-semibold">
                      BẮT BUỘC
                    </span>
                  </div>
                  <div className="space-y-4 pt-1">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-secondary mb-1 font-semibold">
                        Họ và tên đầy đủ *
                      </label>
                      <input
                        className="w-full border border-outline-variant bg-surface px-3 py-2.5 text-primary text-sm focus:border-primary focus:outline-none rounded-xl"
                        id="input-fullname"
                        required
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        placeholder="Vd: Nguyễn Văn A"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-secondary mb-1 font-semibold">
                        Danh xưng / Chức vụ chuyên môn *
                      </label>
                      <div className="relative">
                        <select
                          className="w-full border border-outline-variant bg-surface px-3 py-2.5 text-primary text-sm focus:border-primary focus:outline-none rounded-xl"
                          id="input-role"
                          required
                          value={profileRole}
                          onChange={(e) => {
                            const val = e.target.value;
                            setProfileRole(val);
                            if (typeof window !== "undefined") {
                              localStorage.setItem(
                                "komorebi_current_role",
                                val.includes("Kiến trúc") ? "architect" : "client"
                              );
                            }
                          }}
                        >
                          <option value="Khách hàng">Khách hàng (Cá nhân / Gia đình)</option>
                          <option value="Khách hàng thân thiết">Khách hàng thân thiết</option>
                          <option value="Kiến trúc sư">Kiến trúc sư / Thiết kế nội thất</option>
                          <option value="Chủ đầu tư">Chủ đầu tư / Đối tác dự án</option>
                          {profileRole === "Quản trị viên" && (
                            <option value="Quản trị viên">Quản trị viên hệ thống</option>
                          )}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-secondary mb-1 font-semibold">
                        Mã định danh hội viên độc quyền
                      </label>
                      <div className="flex items-center">
                        <input
                          className="w-full border border-outline-variant/60 bg-surface-container-high px-3 py-2.5 font-mono text-primary text-sm font-bold focus:outline-none cursor-not-allowed rounded-l-xl"
                          readOnly
                          type="text"
                          value={user ? `KOMOREBI-ID #${user.id.slice(0, 8).toUpperCase()}` : "KOMOREBI CIRCLE ELITE #KM-8821"}
                        />
                        <span className="-ml-px px-3 py-2.5 bg-primary text-surface-container-lowest text-xs uppercase tracking-widest flex items-center gap-1 flex-shrink-0 font-bold rounded-r-xl">
                          <span className="material-symbols-outlined text-[14px]">lock</span>
                          Khoá
                        </span>
                      </div>
                      <p className="text-[11px] text-outline mt-1">
                        Mã định danh độc bản gắn liền chuỗi bảo dưỡng và chứng thư bảo hành mộng gỗ.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-secondary mb-1 font-semibold">
                          Ngày sinh
                        </label>
                        <input
                          className="w-full border border-outline-variant bg-surface px-3 py-2.5 text-primary text-sm focus:border-primary focus:outline-none rounded-xl"
                          id="input-dob"
                          type="date"
                          value={profileDob}
                          onChange={(e) => setProfileDob(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-secondary mb-1 font-semibold">
                          Giới tính
                        </label>
                        <select
                          className="w-full border border-outline-variant bg-surface px-3 py-2.5 text-primary text-sm focus:border-primary focus:outline-none rounded-xl"
                          value={profileGender}
                          onChange={(e) => setProfileGender(e.target.value)}
                        >
                          <option value="Nam">Nam</option>
                          <option value="Nữ">Nữ</option>
                          <option value="Khác">Khác / Không tiết lộ</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Col 2: 2. Thông Tin Liên Hệ & Xác Thực */}
                <div className="lg:col-span-6 bg-surface-container-lowest border border-outline-variant/60 p-5 sm:p-6 space-y-4 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px] text-primary">contact_mail</span>
                      <h3 className="text-base sm:text-lg font-headline font-bold text-primary tracking-tight">
                        2. Thông Tin Liên Hệ &amp; Xác Thực
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-outline uppercase tracking-wider font-semibold">
                      BẢO MẬT 256-BIT
                    </span>
                  </div>
                  <div className="space-y-4 pt-1">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs uppercase tracking-wider text-secondary font-semibold">
                          Địa chỉ Email *
                        </label>
                        <span className="inline-flex items-center gap-1 text-[10px] uppercase text-emerald-800 font-bold px-2 py-0.5 bg-emerald-50 border border-emerald-200 rounded">
                          <span className="material-symbols-outlined text-[12px]">verified</span>
                          {user ? "Đã xác thực / Verified" : "Chờ xác thực"}
                        </span>
                      </div>
                      <input
                        className="w-full border border-outline-variant bg-surface px-3 py-2.5 text-primary text-sm focus:border-primary focus:outline-none font-mono rounded-xl"
                        id="input-email"
                        required
                        type="email"
                        value={profileEmail}
                        onChange={(e) => setProfileEmail(e.target.value)}
                        placeholder="email@example.com"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs uppercase tracking-wider text-secondary font-semibold">
                          Số điện thoại cá nhân
                        </label>
                        <span className="inline-flex items-center gap-1 text-[10px] uppercase text-primary font-bold px-2 py-0.5 bg-neutral-100 border border-outline-variant rounded">
                          <span className="material-symbols-outlined text-[12px]">link</span>
                          Liên kết Zalo &amp; SMS
                        </span>
                      </div>
                      <input
                        className="w-full border border-outline-variant bg-surface px-3 py-2.5 text-primary text-sm focus:border-primary focus:outline-none font-mono rounded-xl"
                        id="input-phone"
                        type="tel"
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        placeholder="Vd: 0908 123 456"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-secondary mb-1 font-semibold">
                        Căn cước công dân / Mã số thuế cá nhân
                      </label>
                      <input
                        className="w-full border border-outline-variant bg-surface px-3 py-2.5 text-primary text-sm focus:border-primary focus:outline-none font-mono rounded-xl"
                        id="input-tax"
                        type="text"
                        value={profileTax}
                        onChange={(e) => setProfileTax(e.target.value)}
                        placeholder="Tùy chọn: Nhập CCCD hoặc MST cá nhân"
                      />
                      <p className="text-[11px] text-outline mt-1">
                        Dùng cho mục đích xuất hóa đơn điện tử VAT dự án may đo nội thất và bảo hiểm hợp đồng.
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-secondary mb-1 font-semibold">
                        Văn phòng kiến trúc / Pháp nhân đại diện
                      </label>
                      <input
                        className="w-full border border-outline-variant bg-surface px-3 py-2.5 text-primary text-sm focus:border-primary focus:outline-none rounded-xl"
                        id="input-company"
                        type="text"
                        value={profileCompany}
                        onChange={(e) => setProfileCompany(e.target.value)}
                        placeholder="Tùy chọn cho đối tác / KTS / Doanh nghiệp"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: 3. Sở Thích & Không Gian Sống Quan Tâm (Komorebi Preference) */}
              <section className="bg-surface-container-lowest border border-outline-variant/60 p-5 sm:p-6 space-y-4 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-primary">style</span>
                    <h3 className="text-base sm:text-lg font-headline font-bold text-primary tracking-tight">
                      3. Sở Thích &amp; Không Gian Sống Quan Tâm (Komorebi Preference)
                    </h3>
                  </div>
                  <span className="text-xs uppercase text-outline font-semibold">
                    Tuỳ biến gợi ý vật liệu
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-1">
                  {/* Col 1: Phong cách thiết kế yêu thích */}
                  <div className="space-y-2">
                    <span className="text-xs uppercase tracking-wider text-secondary block font-bold">
                      Phong cách thiết kế yêu thích
                    </span>
                    <div className="space-y-1.5">
                      {[
                        "Wabi-Sabi tối giản",
                        "Japandi đương đại",
                        "Gỗ nguyên khối Rustic",
                        "Nội thất mộng ghép Kigumi",
                      ].map((style) => (
                        <label
                          key={style}
                          className="flex items-center gap-2 text-sm text-primary cursor-pointer p-1.5 hover:bg-surface rounded-lg transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={favStyles.includes(style)}
                            onChange={() => toggleFavStyle(style)}
                            className="text-primary focus:ring-0 rounded"
                          />
                          <span className="font-medium">{style}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Col 2: Dòng gỗ chủ đạo ưu tiên */}
                  <div className="space-y-2">
                    <span className="text-xs uppercase tracking-wider text-secondary block font-bold">
                      Dòng gỗ chủ đạo ưu tiên
                    </span>
                    <div className="space-y-1.5">
                      {[
                        "Gỗ Sồi Trắng Bắc Mỹ (White Oak)",
                        "Gỗ Teak già Lào tự nhiên",
                        "Gỗ Óc Chó Đen (Walnut Bắc Mỹ)",
                      ].map((wood) => (
                        <label
                          key={wood}
                          className="flex items-center gap-2 text-sm text-primary cursor-pointer p-1.5 hover:bg-surface rounded-lg transition-colors"
                        >
                          <input
                            type="radio"
                            name="preferred_wood"
                            checked={preferredWood === wood}
                            onChange={() => setPreferredWood(wood)}
                            className="text-primary focus:ring-0"
                          />
                          <span className="font-medium">{wood}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Col 3: Tần suất bảo dưỡng sáp mong muốn */}
                  <div className="space-y-2">
                    <span className="text-xs uppercase tracking-wider text-secondary block font-bold">
                      Tần suất bảo dưỡng sáp mong muốn
                    </span>
                    <div className="space-y-1.5">
                      {[
                        "Mỗi 6 tháng (Komorebi Khuyến nghị)",
                        "Mỗi 12 tháng (Hàng năm)",
                      ].map((freq) => (
                        <label
                          key={freq}
                          className="flex items-center gap-2 text-sm text-primary cursor-pointer p-1.5 hover:bg-surface rounded-lg transition-colors"
                        >
                          <input
                            type="radio"
                            name="care_freq"
                            checked={careFreq === freq}
                            onChange={() => setCareFreq(freq)}
                            className="text-primary focus:ring-0"
                          />
                          <span className="font-medium">{freq}</span>
                        </label>
                      ))}
                    </div>
                    <div className="p-3 bg-surface border border-outline-variant/40 text-[11px] text-secondary mt-2 rounded-xl">
                      Chế độ bảo dưỡng sáp định kỳ giúp cân bằng độ ẩm 10-12% và kéo dài tuổi thọ mộng gỗ trên 20 năm.
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 4: 4. Sổ Địa Chỉ Giao Nhận Công Trình & Tư Gia */}
              <section className="bg-surface-container-lowest border border-outline-variant/60 p-5 sm:p-6 space-y-4 rounded-2xl shadow-sm">
                <div className="flex flex-wrap items-center justify-between pb-3 border-b border-outline-variant/30 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-primary">pin_drop</span>
                    <div>
                      <h3 className="text-base sm:text-lg font-headline font-bold text-primary tracking-tight">
                        4. Sổ Địa Chỉ Giao Nhận Công Trình &amp; Tư Gia
                      </h3>
                      <p className="text-xs text-secondary mt-0.5">
                        Quản lý vị trí bàn giao cấu kiện gỗ, lối thang tải và ghi chú mặt bằng lắp đặt.
                      </p>
                    </div>
                  </div>
                  <button
                    className="px-3.5 py-1.5 border border-primary text-primary text-xs uppercase tracking-wider hover:bg-primary hover:text-white transition-colors flex items-center gap-1 active:scale-95 font-bold rounded-xl shadow-sm"
                    type="button"
                    onClick={() => setIsAddAddressOpen(true)}
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    Thêm địa chỉ công trình mới
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`border-2 p-4 sm:p-5 relative flex flex-col justify-between rounded-2xl shadow-sm ${
                        addr.isDefault
                          ? "border-primary bg-surface-container-lowest"
                          : "border-outline-variant/60 bg-surface-container-lowest"
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs uppercase tracking-wider font-bold text-primary">
                              {addr.name}
                            </h4>
                            {addr.isDefault && (
                              <span className="bg-primary text-surface-container-lowest text-[9px] uppercase px-2 py-0.5 tracking-wider font-bold rounded">
                                Mặc định
                              </span>
                            )}
                          </div>
                          <span className="material-symbols-outlined text-primary text-[20px]">
                            {addr.isDefault ? "home_pin" : "apartment"}
                          </span>
                        </div>
                        <p className="text-xs text-primary font-bold">
                          {addr.recipient} {addr.phone ? `(${addr.phone})` : ""}
                        </p>
                        <p className="text-xs text-secondary leading-relaxed">
                          {addr.address}
                        </p>
                        <div className="p-2.5 bg-surface border border-outline-variant/30 text-[11px] text-on-surface-variant rounded-xl">
                          Lưu ý kỹ thuật: {addr.notes}
                        </div>
                      </div>
                      <div className="mt-3 pt-2.5 border-t border-outline-variant/30 flex justify-between items-center text-[11px] uppercase tracking-wider font-semibold">
                        {addr.isDefault ? (
                          <span className="text-primary font-bold">Địa chỉ nhận gỗ chính</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetDefaultAddress(addr.id)}
                            className="text-secondary hover:text-primary hover:underline"
                          >
                            Đặt làm mặc định
                          </button>
                        )}
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => showToast(`Địa chỉ "${addr.name}" đã được lưu trữ trong danh bạ.`)}
                            className="text-primary hover:underline"
                          >
                            Chi tiết
                          </button>
                          {!addr.isDefault && (
                            <>
                              <span className="text-outline-variant">•</span>
                              <button
                                type="button"
                                onClick={() => handleDeleteAddress(addr.id)}
                                className="text-secondary hover:text-red-600"
                              >
                                Xóa
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Bottom Action Plaque */}
              <div className="bg-surface-container-low border border-outline-variant/50 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[24px] text-primary">sync_saved_locally</span>
                  <div className="text-left">
                    <p className="text-xs sm:text-sm text-primary font-bold">
                      Tự động đồng bộ thẻ hội viên Apple Wallet &amp; Google Wallet
                    </p>
                    <p className="text-[11px] text-secondary">
                      Thông tin cá nhân được mã hóa và bảo vệ nghiêm ngặt theo tiêu chuẩn bảo mật dữ liệu GDPR &amp; Komorebi Atelier Charter.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <button
                    className="px-5 py-2.5 border border-outline text-secondary text-xs uppercase tracking-wider hover:border-primary hover:text-primary transition-colors active:scale-95 font-semibold rounded-xl"
                    type="button"
                    onClick={() => showToast("Đã hoàn tác các thay đổi trên form hồ sơ.")}
                  >
                    Hủy thay đổi
                  </button>
                  <button
                    className="px-6 py-2.5 bg-primary text-surface-container-lowest text-xs uppercase tracking-wider font-bold hover:bg-[#27272a] transition-all active:scale-95 flex items-center gap-2 shadow-md rounded-xl"
                    type="submit"
                  >
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    Lưu cập nhật hồ sơ
                  </button>
                </div>
              </div>
            </form>
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
                Đang lưu {wishlist.length} tác phẩm
              </span>
            </div>

            {wishlist.length === 0 ? (
              <div className="py-16 text-center space-y-3 bg-surface-container-lowest border border-outline-variant/60 rounded-2xl">
                <span className="material-symbols-outlined text-4xl text-outline">favorite_border</span>
                <p className="text-sm text-on-surface-variant">Danh sách yêu thích của bạn đang trống.</p>
                <Link
                  href="/"
                  className="inline-block px-6 py-2.5 bg-primary text-white text-xs uppercase tracking-wider font-bold rounded-xl hover:bg-[#27272a] transition-all"
                >
                  Khám phá bộ sưu tập mộc bản
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {wishlist.map((item) => (
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
                          className="object-cover hover:scale-105 transition-transform duration-300 rounded-xl"
                        />
                        <button
                          type="button"
                          onClick={() => removeFromWishlist(item.id)}
                          className="absolute top-2 right-2 w-8 h-8 bg-surface-container-lowest/90 border border-outline-variant/40 flex items-center justify-center text-primary hover:text-red-600 transition-colors rounded-lg shadow-sm"
                          title="Xóa khỏi yêu thích"
                        >
                          <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                      </div>
                      <span className="text-[11px] text-outline uppercase tracking-wider">{item.category || "Mộc bản"}</span>
                      <h4 className="text-base font-bold text-primary mt-1">{item.title}</h4>
                      <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{item.material || item.subtitle || ""}</p>
                      <div className="mt-3 text-lg font-bold text-primary font-headline-md">
                        {item.price.toLocaleString("vi-VN")} đ
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-outline-variant/30 flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          addToCart({
                            id: item.id,
                            sku: item.sku,
                            title: item.title,
                            subtitle: item.subtitle,
                            price: item.price,
                            image: item.image,
                            quantity: 1,
                          });
                          showToast("Đã thêm tác phẩm vào giỏ hàng!");
                        }}
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
