"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { createClient } from "@/utils/supabase/client";

type AuthMode = "signin" | "register";
type Role = "client" | "architect";

const translations = {
  VN: {
    backToStore: "Quay lại cửa hàng",
    memberHelp: "Trợ giúp thành viên",
    e2eEncrypt: "Mã hóa E2E 256-bit",
    circleTag: "Komorebi Circle • Japanese Woodworking",
    archivalSeries: "Archival Series 2025",
    heroPhilosophy: "Triết lý Mộc bản & Tối giản",
    heroTitle: "Chạm vào tĩnh tại.\nĐịnh hình không gian sống.",
    heroDesc:
      "Cổng đặc quyền dành riêng cho khách hàng sở hữu nội thất thủ công nguyên khối và các kiến trúc sư thực hành phong cách tĩnh mịch Wabi-Sabi.",
    bentoCraftPts: "Tích điểm chế tác",
    bentoCraftPtsDesc: "Nhận ưu đãi gỗ tuyển",
    bentoWarranty: "Bảo hành trọn đời",
    bentoWarrantyDesc: "Mộng gỗ & kết cấu",
    bentoArchive: "Kyoto Archive",
    bentoArchiveDesc: "Bản giới hạn số lượng",
    bentoConsult: "Tư vấn KTS trưởng",
    bentoConsultDesc: "File 3D & phối cảnh",
    artisanQuote:
      "Mỗi ngôi nhà là một tác phẩm điêu khắc sống động, nơi bóng đổ và thớ gỗ đối thoại cùng tâm hồn người cư ngụ.",
    artisanAuthor: "— Kenzo Murata, Master Artisan Komorebi Studio",
    clientTab: "Khách cá nhân",
    architectTab: "Kiến trúc sư",
    signInTab: "Đăng Nhập",
    registerTab: "Gia Nhập Circle",
    clientPerk: "Quyền lợi thành viên: Tích luỹ & bảo dưỡng mộc định kỳ",
    architectPerk:
      "Quyền lợi Đối tác KTS: Kho file 3D, báo giá dự án, chiết khấu xưởng",
    fastSsoTitle: "Đăng nhập nhanh 1 chạm",
    googleTitle: "Đăng nhập bảo mật với tài khoản Google",
    facebookTitle: "Đăng nhập bảo mật với tài khoản Facebook",
    archIdTitle: "Tạm khóa: Cổng ArchID dành cho đối tác đang bảo trì tích hợp",
    ssoHint: "Hỗ trợ đăng nhập nhanh qua Google, Facebook hoặc Email.",
    orContinueWithEmail: "Hoặc tiếp tục với email",
    fullNameLabel: "Họ và Tên chủ sở hữu không gian *",
    fullNamePlaceholder: "Vd: Nguyễn Hoàng Long",
    emailPhoneLabel: "Email hoặc Số điện thoại thành viên *",
    emailPhoneFormat: "Định dạng chuẩn",
    emailPhonePlaceholder: "arch.member@komorebi.vn hoặc 090...",
    studioLabel: "Tên Văn phòng Kiến trúc / Tổ chức thiết kế",
    studioPlaceholder: "Vd: Studio Atelier Wabi / KTS Tự do",
    passwordLabel: "Mật mã tài khoản *",
    forgotPassword: "Quên mật khẩu?",
    passwordRequirement:
      "Tối thiểu 8 ký tự gồm chữ hoa, chữ số & 1 ký tự đặc biệt để bảo vệ tài sản kiến trúc.",
    rememberMe: "Duy trì đăng nhập an toàn 30 ngày",
    agreePre: "Đồng ý với ",
    agreeLink: "Quy chế Thành viên Komorebi Circle",
    agreePost: " và tiêu chuẩn bảo tồn gỗ bền vững FSC Quốc tế.",
    submittingBtn: "ĐANG XÁC THỰC MÃ HÓA...",
    signInBtn: "ĐĂNG NHẬP VÀO TÀI KHOẢN",
    registerBtn: "TRỞ THÀNH THÀNH VIÊN KOMOREBI",
    fscBadge: "Gỗ Nhật 100% FSC",
    archSecureBadge: "Bảo mật danh tính KTS",
    copyright: "© 2025 Komorebi Living. Bản quyền mộc bản & kiến trúc tối giản.",
    privacyPolicy: "Điều khoản bảo mật",
    craftStandards: "Quy chuẩn thủ công",
    // Toasts & Alerts
    requiredFields: "Vui lòng điền đầy đủ thông tin đăng nhập.",
    requiredName: "Vui lòng nhập họ và tên của bạn.",
    regSuccessArch: (name: string) =>
      `Chúc mừng KTS ${name} đã gia nhập Mạng lưới Đối tác Komorebi!`,
    regSuccessClient: (name: string) =>
      `Chúc mừng quý khách ${name} đã trở thành thành viên Komorebi Circle!`,
    loginSuccess: (role: string, id: string) =>
      `Đăng nhập thành công! Chào mừng ${
        role === "architect" ? "Kiến trúc sư" : "hội viên"
      }: ${id}`,
    connectingSso: (p: string) => `Đang kết nối xác thực 1 chạm với ${p}...`,
    ssoSuccess: (p: string) =>
      `Đăng nhập thành công với ${p}! Đang chuyển hướng...`,
    partnerMaintenance:
      "Cổng xác thực qua ArchID tạm thời đang bảo trì nâng cấp. Quý khách vui lòng đăng nhập qua Google, Facebook hoặc Email.",
    googleConnecting: "Đang kết nối tới máy chủ Google OAuth...",
    facebookConnecting: "Đang kết nối tới máy chủ Facebook OAuth...",
    connectingMemberSupport:
      "Đang kết nối trung tâm hỗ trợ thành viên Komorebi Atelier...",
    passwordResetSent:
      "Hệ thống đã gửi link khôi phục mật mã về email của bạn.",
    privacyToast: "Điều khoản bảo mật Komorebi Atelier.",
    craftToast: "Quy chuẩn chế tác thủ công mộng gỗ Kigumi.",
    charterToast: "Đang mở Quy chế Hội viên Komorebi Circle...",
  },
  EN: {
    backToStore: "Back to Store",
    memberHelp: "Member Support",
    e2eEncrypt: "256-bit E2E Encrypted",
    circleTag: "Komorebi Circle • Japanese Woodworking",
    archivalSeries: "Archival Series 2025",
    heroPhilosophy: "Woodwork & Minimalist Philosophy",
    heroTitle: "Touch stillness.\nShape your living space.",
    heroDesc:
      "An exclusive portal dedicated to patrons of solid handcrafted furniture and architects practicing the serene Wabi-Sabi aesthetic.",
    bentoCraftPts: "Crafting Points",
    bentoCraftPtsDesc: "Selected wood perks",
    bentoWarranty: "Lifetime Warranty",
    bentoWarrantyDesc: "Joinery & structure",
    bentoArchive: "Kyoto Archive",
    bentoArchiveDesc: "Limited numbered series",
    bentoConsult: "Principal Architect",
    bentoConsultDesc: "3D CAD & renderings",
    artisanQuote:
      "Every home is a living sculpture, where shadows and wood grains converse with the soul of the dweller.",
    artisanAuthor: "— Kenzo Murata, Master Artisan Komorebi Studio",
    clientTab: "Private Client",
    architectTab: "Architect",
    signInTab: "Sign In",
    registerTab: "Join Circle",
    clientPerk:
      "Member Privilege: Woodwork points & periodic joinery maintenance",
    architectPerk:
      "Architect Partner: 3D CAD/BIM library, trade pricing, 15% discount",
    fastSsoTitle: "1-Tap Fast Sign In",
    googleTitle: "Secure sign-in with Google",
    facebookTitle: "Secure sign-in with Facebook",
    archIdTitle:
      "Temporarily Locked: ArchID partner portal undergoing scheduled upgrade",
    ssoHint: "Supports fast sign in with Google, Facebook or Email.",
    orContinueWithEmail: "Or continue with email",
    fullNameLabel: "Full Name of Space Owner *",
    fullNamePlaceholder: "E.g. Michael Chen",
    emailPhoneLabel: "Member Email or Phone Number *",
    emailPhoneFormat: "Standard Format",
    emailPhonePlaceholder: "arch.member@komorebi.vn or +84...",
    studioLabel: "Architecture Studio / Design Office Name",
    studioPlaceholder: "E.g. Atelier Wabi Studio / Independent Architect",
    passwordLabel: "Account Password *",
    forgotPassword: "Forgot password?",
    passwordRequirement:
      "At least 8 characters including uppercase, numbers & special character to protect architectural assets.",
    rememberMe: "Keep me securely signed in for 30 days",
    agreePre: "I agree to ",
    agreeLink: "Komorebi Circle Member Charter",
    agreePost:
      " and international FSC sustainable timber conservation standards.",
    submittingBtn: "AUTHENTICATING ENCRYPTION...",
    signInBtn: "SIGN IN TO ACCOUNT",
    registerBtn: "BECOME A KOMOREBI MEMBER",
    fscBadge: "100% FSC Certified Wood",
    archSecureBadge: "Architect Identity Protected",
    copyright:
      "© 2025 Komorebi Living. Minimalist Japanese woodworking copyright.",
    privacyPolicy: "Privacy Policy",
    craftStandards: "Craftsmanship Standards",
    // Toasts & Alerts
    requiredFields: "Please fill in all required credentials.",
    requiredName: "Please enter your full name.",
    regSuccessArch: (name: string) =>
      `Congratulations Architect ${name}! Welcome to the Komorebi Partner Network.`,
    regSuccessClient: (name: string) =>
      `Welcome ${name} to the Komorebi Circle Member community!`,
    loginSuccess: (role: string, id: string) =>
      `Sign in successful! Welcome ${
        role === "architect" ? "Architect" : "member"
      }: ${id}`,
    connectingSso: (p: string) => `Connecting 1-tap authentication with ${p}...`,
    ssoSuccess: (p: string) =>
      `Successfully signed in with ${p}! Redirecting...`,
    partnerMaintenance:
      "ArchID partner portal is currently undergoing scheduled upgrade. Please sign in via Google, Facebook or Email.",
    googleConnecting: "Connecting to Google OAuth server...",
    facebookConnecting: "Connecting to Facebook OAuth server...",
    connectingMemberSupport:
      "Connecting to Komorebi Atelier Member Support Center...",
    passwordResetSent: "A password recovery link has been sent to your email.",
    privacyToast: "Komorebi Atelier Privacy Policy.",
    craftToast: "Kigumi interlocking wooden craftsmanship guidelines.",
    charterToast: "Opening Komorebi Circle Member Charter...",
  },
};

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useCart();
  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  const [role, setRole] = useState<Role>("client");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isFacebookLoading, setIsFacebookLoading] = useState(false);
  const { lang, setLang } = useLanguage();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("error") === "auth_failed") {
        showToast(
          lang === "EN"
            ? "Authentication failed or was cancelled."
            : "Xác thực không thành công hoặc đã bị hủy."
        );
      }
    }
  }, [lang, showToast]);

  const changeLang = (newLang: "VN" | "EN") => {
    setLang(newLang);
  };

  const curr = translations[lang];

  // Form states
  const [fullName, setFullName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [studioName, setStudioName] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [agreedFSC, setAgreedFSC] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      showToast(curr.requiredFields);
      return;
    }
    if (authMode === "register" && !fullName) {
      showToast(curr.requiredName);
      return;
    }

    setIsSubmitting(true);

    // Lưu role hiện tại (client hoặc architect) vào bộ nhớ cục bộ
    if (typeof window !== "undefined") {
      localStorage.setItem("komorebi_current_role", role);
      localStorage.setItem("komorebi_login_role", role);
    }

    try {
      const supabase = createClient();
      if (authMode === "register") {
        const { data, error } = await supabase.auth.signUp({
          email: identifier,
          password: password,
          options: {
            data: {
              full_name: fullName,
              role: role,
              studio_name: role === "architect" ? studioName : "",
            },
          },
        });

        if (error) {
          showToast(`Error: ${error.message}`);
          setIsSubmitting(false);
          return;
        }

        if (data.user) {
          try {
            await supabase.from("profiles").upsert({
              id: data.user.id,
              email: identifier,
              full_name: fullName,
              role: role,
              studio_name: role === "architect" ? studioName : "",
              company: role === "architect" ? studioName : "",
              updated_at: new Date().toISOString(),
            });
          } catch (dbErr) {
            console.error("DB Profile sync error:", dbErr);
          }
        }

        showToast(
          role === "architect"
            ? curr.regSuccessArch(fullName)
            : curr.regSuccessClient(fullName)
        );
        router.push("/tai-khoan");
      } else {
        // Đăng nhập email / password
        const { data, error } = await supabase.auth.signInWithPassword({
          email: identifier,
          password: password,
        });

        if (error) {
          showToast(`Error: ${error.message}`);
          setIsSubmitting(false);
          return;
        }

        if (data.user && role === "architect") {
          try {
            await supabase
              .from("profiles")
              .update({ role: "architect", updated_at: new Date().toISOString() })
              .eq("id", data.user.id);
          } catch (dbErr) {
            console.error("DB Role sync error:", dbErr);
          }
        }

        showToast(curr.loginSuccess(role, identifier));
        router.push("/tai-khoan");
      }
    } catch (err: any) {
      showToast(`Error: ${err?.message || "Lỗi không xác định"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSSO = async (provider: string, isLocked?: boolean) => {
    if (isLocked || provider === "ArchID") {
      showToast(curr.partnerMaintenance);
      return;
    }

    // Ghi nhớ role được chọn trước khi chuyển hướng OAuth (an toàn tuyệt đối cho Safari Private Browsing)
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("komorebi_current_role", role);
        localStorage.setItem("komorebi_login_role", role);
      }
    } catch (storageErr) {
      console.warn("Storage restricted or private mode:", storageErr);
    }

    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const redirectUrl = `${origin}/auth/callback?next=/tai-khoan`;
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      "https://royxrfnawhapkhttbyca.supabase.co";

    // Direct OAuth URL fallback nếu thư viện JS hoặc trình duyệt mobile chặn popup/async navigation
    const directFallbackUrl = `${supabaseUrl}/auth/v1/authorize?provider=${provider.toLowerCase()}&redirect_to=${encodeURIComponent(
      redirectUrl
    )}`;

    if (provider === "Google") {
      try {
        setIsGoogleLoading(true);
        showToast(curr.googleConnecting);
        const supabase = createClient();
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: redirectUrl,
            queryParams: {
              access_type: "offline",
              prompt: "consent",
            },
          },
        });

        if (error) {
          console.warn("Google signInWithOAuth error, using direct URL:", error.message);
          window.location.href = directFallbackUrl;
          return;
        }

        if (data?.url) {
          window.location.href = data.url;
          return;
        }

        window.location.href = directFallbackUrl;
      } catch (err: any) {
        console.warn("Google OAuth catch error, redirecting directly:", err);
        window.location.href = directFallbackUrl;
      } finally {
        setTimeout(() => {
          setIsGoogleLoading(false);
        }, 5000);
      }
      return;
    }

    if (provider === "Facebook") {
      try {
        setIsFacebookLoading(true);
        showToast(curr.facebookConnecting);
        const supabase = createClient();
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "facebook",
          options: {
            redirectTo: redirectUrl,
          },
        });

        if (error) {
          console.warn("Facebook signInWithOAuth error, using direct URL:", error.message);
          window.location.href = directFallbackUrl;
          return;
        }

        if (data?.url) {
          window.location.href = data.url;
          return;
        }

        window.location.href = directFallbackUrl;
      } catch (err: any) {
        console.warn("Facebook OAuth catch error, redirecting directly:", err);
        window.location.href = directFallbackUrl;
      } finally {
        setTimeout(() => {
          setIsFacebookLoading(false);
        }, 5000);
      }
      return;
    }

    showToast(`${curr.connectingSso(provider)}`);
    setTimeout(() => {
      showToast(`${curr.ssoSuccess(provider)}`);
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
              <span>{curr.backToStore}</span>
            </Link>
          </div>

          {/* Right: Controls (Language & Member Support) */}
          <div className="flex items-center gap-4">
            {/* Lang Switcher */}
            <div className="flex items-center border border-[#E4E4E7] p-0.5 bg-[#F4F4F5] text-xs font-semibold rounded-lg">
              <button
                type="button"
                onClick={() => changeLang("VN")}
                className={`px-2 py-0.5 transition-colors rounded-md ${
                  lang === "VN"
                    ? "bg-white text-black shadow-xs font-bold"
                    : "text-[#71717A] hover:text-black"
                }`}
              >
                VN
              </button>
              <button
                type="button"
                onClick={() => changeLang("EN")}
                className={`px-2 py-0.5 transition-colors rounded-md ${
                  lang === "EN"
                    ? "bg-white text-black shadow-xs font-bold"
                    : "text-[#71717A] hover:text-black"
                }`}
              >
                EN
              </button>
            </div>

            <div className="h-4 w-px bg-[#E4E4E7]" />

            {/* Member Assistance */}
            <button
              type="button"
              onClick={() => showToast(curr.connectingMemberSupport)}
              className="flex items-center gap-1.5 text-xs text-[#71717A] hover:text-black transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">support_agent</span>
              <span className="hidden sm:inline">{curr.memberHelp}</span>
            </button>

            {/* Security Pill */}
            <div className="hidden lg:flex items-center gap-1 px-2.5 py-1 bg-[#F4F4F5] border border-[#E4E4E7] text-[#71717A] text-[10px] uppercase tracking-wider font-mono rounded-full">
              <span className="material-symbols-outlined text-[14px] text-black">lock</span>
              <span>{curr.e2eEncrypt}</span>
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
                {curr.circleTag}
              </span>
            </div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-white/70">
              {curr.archivalSeries}
            </span>
          </div>

          {/* Middle Section: Hero Editorial Statement */}
          <div className="relative z-10 my-4 sm:my-8 lg:my-14 max-w-xl text-white">
            <p className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.2em] text-white/80 mb-2 sm:mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[15px] sm:text-[16px]">nature</span>
              <span>{curr.heroPhilosophy}</span>
            </p>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15] mb-2 sm:mb-4 whitespace-pre-line">
              {curr.heroTitle}
            </h1>
            <p className="text-white/85 max-w-lg font-light leading-relaxed text-xs sm:text-sm lg:text-base">
              {curr.heroDesc}
            </p>
          </div>

          {/* Bottom Section: Circle Privileges Bento & Artisan Quote */}
          <div className="relative z-10 space-y-4">
            {/* Bento Privileges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/20 border border-white/20 backdrop-blur-sm rounded-xl overflow-hidden">
              <div className="bg-black/50 p-2.5 sm:p-3 hover:bg-black/70 transition-colors">
                <span className="material-symbols-outlined text-white text-[18px] sm:text-[20px] mb-1">carpenter</span>
                <p className="text-[11px] sm:text-xs uppercase tracking-wider font-semibold text-white">
                  {curr.bentoCraftPts}
                </p>
                <p className="text-white/70 text-[10px] sm:text-[11px] leading-tight mt-0.5">
                  {curr.bentoCraftPtsDesc}
                </p>
              </div>

              <div className="bg-black/50 p-2.5 sm:p-3 hover:bg-black/70 transition-colors">
                <span className="material-symbols-outlined text-white text-[18px] sm:text-[20px] mb-1">verified</span>
                <p className="text-[11px] sm:text-xs uppercase tracking-wider font-semibold text-white">
                  {curr.bentoWarranty}
                </p>
                <p className="text-white/70 text-[10px] sm:text-[11px] leading-tight mt-0.5">
                  {curr.bentoWarrantyDesc}
                </p>
              </div>

              <div className="bg-black/50 p-2.5 sm:p-3 hover:bg-black/70 transition-colors">
                <span className="material-symbols-outlined text-white text-[18px] sm:text-[20px] mb-1">auto_stories</span>
                <p className="text-[11px] sm:text-xs uppercase tracking-wider font-semibold text-white">
                  {curr.bentoArchive}
                </p>
                <p className="text-white/70 text-[10px] sm:text-[11px] leading-tight mt-0.5">
                  {curr.bentoArchiveDesc}
                </p>
              </div>

              <div className="bg-black/50 p-2.5 sm:p-3 hover:bg-black/70 transition-colors">
                <span className="material-symbols-outlined text-white text-[18px] sm:text-[20px] mb-1">architecture</span>
                <p className="text-[11px] sm:text-xs uppercase tracking-wider font-semibold text-white">
                  {curr.bentoConsult}
                </p>
                <p className="text-white/70 text-[10px] sm:text-[11px] leading-tight mt-0.5">
                  {curr.bentoConsultDesc}
                </p>
              </div>
            </div>

            {/* Master Artisan Quote Plaque */}
            <div className="pt-3 border-t border-white/20 flex items-start gap-3 text-white/80">
              <span className="text-2xl sm:text-3xl font-serif text-white/40 leading-none">“</span>
              <div>
                <p className="text-xs sm:text-sm italic text-white/90 leading-relaxed">
                  {curr.artisanQuote}
                </p>
                <p className="text-[10px] font-mono uppercase tracking-widest text-white/60 mt-1">
                  {curr.artisanAuthor}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT PANEL: High-End Interactive Authentication Card (5 Cols Desktop) */}
        <section className="lg:col-span-5 bg-white flex flex-col justify-between p-4 sm:p-8 lg:p-12 overflow-y-visible lg:overflow-y-auto relative z-10">
          <div className="w-full max-w-md mx-auto my-0 lg:my-auto space-y-4 sm:space-y-5">
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
                <span className="flex items-center justify-center gap-1 sm:gap-1.5 pointer-events-none">
                  <span className="material-symbols-outlined text-[15px]">person</span>
                  <span>{curr.clientTab}</span>
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
                <span className="flex items-center justify-center gap-1 sm:gap-1.5 pointer-events-none">
                  <span className="material-symbols-outlined text-[15px]">handyman</span>
                  <span>{curr.architectTab}</span>
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
                    authMode === "signin"
                      ? "text-black font-bold"
                      : "text-[#71717A] hover:text-black font-medium"
                  }`}
                >
                  {curr.signInTab}
                  {authMode === "signin" && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-black" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setAuthMode("register")}
                  className={`relative flex-1 pb-3 text-center text-sm uppercase tracking-wider transition-colors ${
                    authMode === "register"
                      ? "text-black font-bold"
                      : "text-[#71717A] hover:text-black font-medium"
                  }`}
                >
                  {curr.registerTab}
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
                  {role === "client" ? curr.clientPerk : curr.architectPerk}
                </span>
              </div>
              <span className="text-[10px] font-mono text-black uppercase font-bold tracking-widest">
                Komorebi ID
              </span>
            </div>

            {/* Social SSO Fast Authentication Grid */}
            <div className="space-y-2">
              <p className="text-[11px] font-mono uppercase tracking-wider text-[#71717A] text-center">
                {curr.fastSsoTitle}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {/* Google */}
                <button
                  type="button"
                  id="btn-sso-google"
                  disabled={isGoogleLoading}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSSO("Google");
                  }}
                  className={`flex items-center justify-center gap-1.5 min-h-[46px] py-2.5 px-1.5 sm:px-3 border border-[#E4E4E7] hover:border-[#4285F4] bg-white hover:bg-[#F4F4F5] transition-all group rounded-xl cursor-pointer select-none active:scale-95 ${
                    isGoogleLoading ? "opacity-70 cursor-wait" : ""
                  }`}
                  title={curr.googleTitle}
                  aria-label="Đăng nhập bằng Google"
                >
                  {isGoogleLoading ? (
                    <span className="w-4 h-4 border-2 border-[#4285F4] border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <svg
                      className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.94 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      />
                    </svg>
                  )}
                  <span className="text-[11px] sm:text-xs uppercase font-semibold text-[#4285F4]">
                    {isGoogleLoading
                      ? lang === "VN"
                        ? "Đang kết nối..."
                        : "Connecting..."
                      : "Google"}
                  </span>
                </button>

                {/* Facebook */}
                <button
                  type="button"
                  id="btn-sso-facebook"
                  disabled={isFacebookLoading}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSSO("Facebook");
                  }}
                  className={`flex items-center justify-center gap-1.5 min-h-[46px] py-2.5 px-1.5 sm:px-3 border border-[#E4E4E7] hover:border-[#1877F2] bg-white hover:bg-[#F4F4F5] transition-all group rounded-xl cursor-pointer select-none active:scale-95 ${
                    isFacebookLoading ? "opacity-70 cursor-wait" : ""
                  }`}
                  title={curr.facebookTitle}
                  aria-label="Đăng nhập bằng Facebook"
                >
                  {isFacebookLoading ? (
                    <span className="w-4 h-4 border-2 border-[#1877F2] border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <svg
                      className="w-4 h-4 fill-[#1877F2] group-hover:scale-110 transition-transform flex-shrink-0"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  )}
                  <span className="text-[11px] sm:text-xs uppercase font-semibold text-[#1877F2]">
                    {isFacebookLoading
                      ? lang === "VN"
                        ? "Đang kết nối..."
                        : "Connecting..."
                      : "Facebook"}
                  </span>
                </button>

                {/* ArchID (Tạm khóa) */}
                <button
                  type="button"
                  id="btn-sso-archid"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSSO("ArchID", true);
                  }}
                  className="flex items-center justify-center gap-1 min-h-[46px] py-2.5 px-1 sm:px-2.5 border border-dashed border-[#D4D4D8] bg-[#F4F4F5]/90 opacity-60 cursor-not-allowed hover:bg-[#EAEAEA] transition-all rounded-xl relative select-none"
                  title={curr.archIdTitle}
                  aria-label="Cổng ArchID (Đang bảo trì)"
                >
                  <span className="material-symbols-outlined text-[15px] sm:text-[17px] text-[#71717A]">
                    architecture
                  </span>
                  <span className="text-[11px] sm:text-xs uppercase font-semibold text-[#71717A]">
                    ArchID
                  </span>
                  <span className="material-symbols-outlined text-[12px] text-[#A1A1AA] ml-0.5">
                    lock
                  </span>
                </button>
              </div>
              <p className="text-[10.5px] text-[#A1A1AA] text-center flex items-center justify-center gap-1 pt-0.5">
                <span className="material-symbols-outlined text-[12px]">info</span>
                <span>{curr.ssoHint}</span>
              </p>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center py-1">
              <div className="w-full border-t border-[#E4E4E7]" />
              <span className="absolute bg-white px-3 text-[11px] font-mono text-[#71717A] uppercase tracking-widest">
                {curr.orContinueWithEmail}
              </span>
            </div>

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Full Name (Register mode only) */}
              {authMode === "register" && (
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#71717A] mb-1 font-medium">
                    {curr.fullNameLabel}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={curr.fullNamePlaceholder}
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
                    {curr.emailPhoneLabel}
                  </label>
                  <span className="text-[10px] text-outline font-mono">
                    {curr.emailPhoneFormat}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={curr.emailPhonePlaceholder}
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
                    {curr.studioLabel}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={studioName}
                      onChange={(e) => setStudioName(e.target.value)}
                      placeholder={curr.studioPlaceholder}
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
                    {curr.passwordLabel}
                  </label>
                  {authMode === "signin" && (
                    <button
                      type="button"
                      onClick={() => showToast(curr.passwordResetSent)}
                      className="text-xs text-black hover:underline"
                    >
                      {curr.forgotPassword}
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
                    {curr.passwordRequirement}
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
                    {curr.rememberMe}
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
                    {curr.agreePre}
                    <button
                      type="button"
                      onClick={() => showToast(curr.charterToast)}
                      className="text-black underline"
                    >
                      {curr.agreeLink}
                    </button>
                    {curr.agreePost}
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
                      ? curr.submittingBtn
                      : authMode === "signin"
                      ? curr.signInBtn
                      : curr.registerBtn}
                  </span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </form>

            {/* Guarantee & Security Footnote */}
            <div className="pt-2 flex items-center justify-center gap-4 text-outline text-[11px] font-mono uppercase">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">eco</span>
                <span>{curr.fscBadge}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">lock</span>
                <span>{curr.archSecureBadge}</span>
              </div>
            </div>
          </div>

          {/* Card Mini Footer */}
          <div className="mt-8 pt-4 border-t border-[#E4E4E7] flex flex-col sm:flex-row items-center justify-between text-outline text-[11px] gap-2">
            <p>{curr.copyright}</p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => showToast(curr.privacyToast)}
                className="hover:text-black transition-colors"
              >
                {curr.privacyPolicy}
              </button>
              <span>/</span>
              <button
                type="button"
                onClick={() => showToast(curr.craftToast)}
                className="hover:text-black transition-colors"
              >
                {curr.craftStandards}
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
