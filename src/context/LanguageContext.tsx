"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Lang = "VN" | "EN";

export interface Translations {
  nav: {
    livingRoom: string;
    livingRoomDesc: string;
    kitchenDining: string;
    kitchenDiningDesc: string;
    bedroom: string;
    bedroomDesc: string;
    collection: string;
    collectionDesc: string;
    architectureProjects: string;
    architectureProjectsDesc: string;
    consultationBtn: string;
    searchPlaceholder: string;
    menuLabel: string;
    spaceCategories: string;
    curatedServices: string;
    kuraHighlight: string;
    wishlistPieces: string;
    accountLabel: string;
    shoppingBag: string;
    bookArchitectConsult: string;
    hotlineLabel: string;
    showroomLabel: string;
    closeMenu: string;
    openMenu: string;
    itemsCount: (n: number) => string;
    userWelcome: (name: string) => string;
    loggedInBadge: string;
  };
  footer: {
    showroomHcm: string;
    showroomHcmAddr: string;
    showroomHcmHours: string;
    showroomHn: string;
    showroomHnAddr: string;
    showroomHnHours: string;
    workshopTitle: string;
    workshopDesc: string;
    workshopStandard: string;
    copyright: string;
    aboutUs: string;
    craftWorkshop: string;
    warrantyPolicy: string;
    deliveryService: string;
    showroomSystem: string;
  };
  wishlist: {
    title: string;
    subtitle: string;
    clearAll: string;
    emptyTitle: string;
    emptyDesc: string;
    exploreBtn: string;
    addAllToCart: (n: number) => string;
    checkoutBtn: string;
    continueShopping: string;
    itemCount: (n: number) => string;
    inStock: string;
    addToCartBtn: string;
    removeBtn: string;
  };
  consultation: {
    badge: string;
    title: string;
    desc: string;
    fullNameLabel: string;
    fullNamePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    spaceTypeLabel: string;
    notesLabel: string;
    notesPlaceholder: string;
    submitBtn: string;
    submittingBtn: string;
    successTitle: string;
    successDesc: string;
    closeBtn: string;
    spaces: {
      apartment: string;
      villa: string;
      commercial: string;
      penthouse: string;
    };
    phoneRequiredError: string;
    submitSuccessToast: string;
    freeNotice: string;
  };
  showroomModal: {
    badge: string;
    title: string;
    productLabel: string;
    chooseShowroom: string;
    dateLabel: string;
    timeLabel: string;
    nameLabel: string;
    namePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    submitBtn: string;
    successTitle: string;
    successDesc: (showroom: string, product: string, time: string, date: string) => string;
    closeBtn: string;
    phoneRequiredError: string;
    bookedToast: (product: string) => string;
  };
  home: {
    heroTag: string;
    heroHeadline: string;
    heroHeadlineAccent: string;
    heroSubheadline: string;
    heroExploreBtn: string;
    heroConsultBtn: string;
    metric1Value: string;
    metric1Label: string;
    metric2Value: string;
    metric2Label: string;
    metric3Value: string;
    metric3Label: string;
    featuredSpecTag: string;
    featuredCraftOrigin: string;
    featuredReady: string;
    spacesSubtitle: string;
    spacesHeading: string;
    spaceLivingRoom: string;
    spaceDiningRoom: string;
    spaceBedroom: string;
    spaceWorkRoom: string;
    filterLabel: string;
    filterShowroom: string;
    priceAll: string;
    priceUnder10m: string;
    price10to25m: string;
    priceAbove25m: string;
    viewMore: string;
    viewLess: string;
    philosophyTag: string;
    philosophyHeading: string;
    philosophyDesc: string;
    val1Title: string;
    val1Desc: string;
    val1Sub: string;
    val2Title: string;
    val2Desc: string;
    val2Sub: string;
    val3Title: string;
    val3Desc: string;
    val3Sub: string;
    workshopTag: string;
    workshopHeading: string;
    workshopDesc: string;
    workshopLink: string;
    ctaTag: string;
    ctaHeading: string;
    ctaDesc: string;
    ctaInputPlaceholder: string;
    ctaSubmitBtn: string;
    ctaNotice: string;
    ctaToast: (phone: string) => string;
    phoneRequiredError: string;
    addToCart: string;
    inCartToast: string;
  };
  cart: {
    title: string;
    subtitle: string;
    emptyTitle: string;
    emptyDesc: string;
    continueShopping: string;
    breadcrumbHome: string;
    breadcrumbCart: string;
    breadcrumbCheckout: string;
    step1: string;
    step2: string;
    step3: string;
    productCol: string;
    priceCol: string;
    quantityCol: string;
    totalCol: string;
    discountCodePlaceholder: string;
    applyDiscountBtn: string;
    subtotal: string;
    shippingFee: string;
    discount: string;
    totalAmount: string;
    checkoutBtn: string;
    shippingFree: string;
    depositLabel: string;
    deliveryTitle: string;
    fullNameLabel: string;
    phoneLabel: string;
    emailLabel: string;
    cityLabel: string;
    districtLabel: string;
    addressLabel: string;
    vatLabel: string;
    companyNameLabel: string;
    taxIdLabel: string;
    installationNotice: string;
    ecoPackagingNotice: string;
    deliveryDateLabel: string;
    elevatorLabel: string;
    paymentTitle: string;
    vietQrMethod: string;
    vietQrDesc: string;
    cardMethod: string;
    cardDesc: string;
    depositMethod: string;
    depositDesc: string;
    emptyCartNotice: string;
    fillRequiredNotice: string;
    connectingGateway: string;
  };
  account: {
    profileTitle: string;
    standardMember: string;
    architectPartner: string;
    clientRole: string;
    architectRole: string;
    adminRole: string;
    overviewTab: string;
    profileAddressTab: string;
    wishlistTab: string;
    maintenanceTab: string;
    signOutBtn: string;
    saveProfileBtn: string;
    charterBtn: string;
    fullNameLabel: string;
    emailLabel: string;
    phoneLabel: string;
    companyLabel: string;
    roleLabel: string;
    recentOrdersTitle: string;
    noOrders: string;
    orderDate: string;
    orderStatus: string;
    saveSuccessToast: string;
  };
  chatbot: {
    title: string;
    subtitle: string;
    emptyTitle: string;
    emptyDesc: string;
    suggestedLabel: string;
    suggestions: string[];
    placeholder: string;
    sendTooltip: string;
    minimizeTooltip: string;
    openTooltip: string;
    aiReplyIntro: string;
  };
  common: {
    currency: string;
    close: string;
    loading: string;
    hot: string;
    save: string;
    cancel: string;
    delete: string;
  };
}

export const translationsData: Record<Lang, Translations> = {
  VN: {
    nav: {
      livingRoom: "Phòng Khách",
      livingRoomDesc: "Sofa mộc bản, bàn trà Enso & kệ tivi",
      kitchenDining: "Phòng Bếp",
      kitchenDiningDesc: "Bàn ăn Mori, ghế Kanso & hệ tủ mộc",
      bedroom: "Phòng Ngủ",
      bedroomDesc: "Giường Zen Platform, chiếu Tatami & tủ Shoji",
      collection: "Bộ Sưu Tập",
      collectionDesc: "Kyoto Atelier Archive & gốm Wabi-sabi",
      architectureProjects: "Dự Án Kiến Trúc",
      architectureProjectsDesc: "Villa Thảo Điền, Penthouse & Resort",
      consultationBtn: "Tư vấn thiết kế",
      searchPlaceholder: "Tìm sản phẩm, chất liệu...",
      menuLabel: "Menu",
      spaceCategories: "Danh Mục Không Gian",
      curatedServices: "Tuyển Chọn & Dịch Vụ",
      kuraHighlight: "Tác Phẩm Tiêu Biểu: Ghế Kura",
      wishlistPieces: "Tác Phẩm Yêu Thích",
      accountLabel: "Komorebi Circle • Tài Khoản & KTS",
      shoppingBag: "Giỏ Hàng & Thanh Toán",
      bookArchitectConsult: "Đặt Lịch Tư Vấn Kiến Trúc Sư",
      hotlineLabel: "Hotline Atelier: 1900 6829 (8:30 - 20:30)",
      showroomLabel: "Showroom: 18 Đường Số 10, P. Thảo Điền, TP. Thủ Đức, TP.HCM",
      closeMenu: "Đóng menu",
      openMenu: "Mở menu danh mục không gian",
      itemsCount: (n: number) => `${n} món`,
      userWelcome: (name: string) => `Chào, ${name}`,
      loggedInBadge: "Đã đăng nhập",
    },
    footer: {
      showroomHcm: "Showroom TP. Hồ Chí Minh",
      showroomHcmAddr: "18 Đường Số 10, Thảo Điền, TP. Thủ Đức",
      showroomHcmHours: "Mở cửa: 09:00 - 20:30 (Thứ 2 - Chủ Nhật)",
      showroomHn: "Showroom Hà Nội",
      showroomHnAddr: "45 Quang Trung, Quận Hoàn Kiếm",
      showroomHnHours: "Mở cửa: 09:00 - 20:30 (Thứ 2 - Chủ Nhật)",
      workshopTitle: "Xưởng Chế Tác Mộc Bản",
      workshopDesc: "Kyoto Atelier & Xưởng Sinh Thái Bình Dương",
      workshopStandard: "Tiêu chuẩn mộc thủ công mộng âm dương không đinh",
      copyright: "© 2025 Komorebi Living. Bản quyền thuộc về thương hiệu nội thất gỗ & kiến trúc tối giản.",
      aboutUs: "Về chúng tôi",
      craftWorkshop: "Xưởng chế tác thủ công",
      warrantyPolicy: "Chính sách bảo hành 10 năm",
      deliveryService: "Dịch vụ giao vận & Lắp đặt",
      showroomSystem: "Hệ thống Showroom",
    },
    wishlist: {
      title: "Tác Phẩm Yêu Thích",
      subtitle: "Tuyển chọn độc bản đã lưu của quý khách",
      clearAll: "Xóa tất cả",
      emptyTitle: "Danh sách yêu thích đang trống",
      emptyDesc: "Khám phá các sản phẩm mộc bản thủ công và lưu lại những thiết kế ưng ý cho không gian của bạn.",
      exploreBtn: "Khám phá bộ sưu tập",
      addAllToCart: (n: number) => `Chuyển tất cả (${n}) vào giỏ hàng`,
      checkoutBtn: "Xem giỏ hàng & Đặt hàng",
      continueShopping: "Tiếp tục xem sản phẩm",
      itemCount: (n: number) => `${n} tác phẩm`,
      inStock: "Sẵn hàng tại Showroom",
      addToCartBtn: "Thêm vào giỏ",
      removeBtn: "Bỏ lưu",
    },
    consultation: {
      badge: "ATELIER CONSULTING",
      title: "Tư Vấn Kiến Trúc & Khảo Sát Không Gian",
      desc: "Đội ngũ KTS Komorebi sẽ liên hệ khảo sát thực tế và cung cấp bản vẽ bố trí 3D mộc bản miễn phí trong 24 giờ.",
      fullNameLabel: "Họ và Tên của bạn *",
      fullNamePlaceholder: "Kts. Nguyễn Văn A / Gia chủ...",
      phoneLabel: "Số điện thoại nhận tư vấn 1-1 *",
      phonePlaceholder: "0988 xxx xxx",
      spaceTypeLabel: "Loại hình công trình / Không gian",
      notesLabel: "Yêu cầu mộc bản đặc thù",
      notesPlaceholder: "Ví dụ: Cần may đo bàn ăn dài 2.8m gỗ sồi tự nhiên; khảo sát góc ngả phòng trà thiền...",
      submitBtn: "Xác Nhận Đặt Lịch Tư Vấn Miễn Phí",
      submittingBtn: "ĐANG GỬI THÔNG TIN...",
      successTitle: "Đăng Ký Thành Công",
      successDesc: "KTS chủ trì của Komorebi Living sẽ liên hệ qua số điện thoại để lên lịch hẹn khảo sát thực tế trong vòng 30 phút.",
      closeBtn: "Đóng cửa sổ",
      spaces: {
        apartment: "Căn hộ cao cấp / Penthouse",
        villa: "Biệt thự nghỉ dưỡng / Nhà phố vườn",
        commercial: "Studio thiết kế / Không gian triển lãm",
        penthouse: "Dự án kiến trúc thương mại / Khách sạn boutique",
      },
      phoneRequiredError: "Vui lòng nhập số điện thoại liên hệ.",
      submitSuccessToast: "Đã gửi yêu cầu tư vấn thành công!",
      freeNotice: "* Miễn phí hoàn toàn bản vẽ 3D bố trí và báo giá vật tư chi tiết.",
    },
    showroomModal: {
      badge: "SHOWROOM PRIVÉ",
      title: "Đặt Lịch Thử Sản Phẩm Trực Tiếp",
      productLabel: "Vật Phẩm Trải Nghiệm",
      chooseShowroom: "Chọn không gian trưng bày *",
      dateLabel: "Ngày hẹn *",
      timeLabel: "Khung giờ *",
      nameLabel: "Họ và tên *",
      namePlaceholder: "Quý khách...",
      phoneLabel: "Số điện thoại *",
      phonePlaceholder: "09xx xxx xxx",
      submitBtn: "Xác Nhận Giữ Chỗ Trải Nghiệm",
      successTitle: "Đã Khởi Tạo Lịch Hẹn Trải Nghiệm",
      successDesc: (showroom: string, product: string, time: string, date: string) =>
        `Chuyên viên Atelier tại ${showroom} đã chuẩn bị mẫu mộc ${product} và trà đạo đón tiếp quý khách vào lúc ${time} ngày ${date}.`,
      closeBtn: "Đóng",
      phoneRequiredError: "Vui lòng cung cấp số điện thoại để nhận mã xác nhận.",
      bookedToast: (product: string) => `Đã đặt lịch trải nghiệm ${product} thành công!`,
    },
    home: {
      heroTag: "Bộ Sưu Tập Thu Đông 2025",
      heroHeadline: "Nghệ Thuật Cân Bằng",
      heroHeadlineAccent: "Không Gian Sống",
      heroSubheadline: "Hòa quyện giữa triết lý Wabi-Sabi tôn vinh nét đẹp thô mộc tự nhiên và tính thực dụng chuẩn mực Scandinavian. Mỗi thiết kế là một tác phẩm mộc bản thủ công bền bỉ qua thời gian.",
      heroExploreBtn: "Khám phá Bộ sưu tập Thu Đông",
      heroConsultBtn: "Đặt lịch tư vấn kiến trúc sư",
      metric1Value: "100%",
      metric1Label: "Gỗ Sồi & Walnut FSC",
      metric2Value: "0%",
      metric2Label: "Kim Loại Nối Ghép",
      metric3Value: "10 Năm",
      metric3Label: "Cam Kết Bảo Hành",
      featuredSpecTag: "Thiết kế tiêu biểu",
      featuredCraftOrigin: "Chế tác thủ công tại Xưởng Komorebi Kyoto",
      featuredReady: "Sẵn sàng trải nghiệm",
      spacesSubtitle: "KHÁM PHÁ THEO KHÔNG GIAN",
      spacesHeading: "Cảm Hứng Thiết Kế Bản Địa & Hiện Đại",
      spaceLivingRoom: "Phòng Khách",
      spaceDiningRoom: "Phòng Ăn",
      spaceBedroom: "Phòng Ngủ",
      spaceWorkRoom: "Góc Làm Việc Yên Tĩnh",
      filterLabel: "Bộ lọc:",
      filterShowroom: "Có sẵn tại Showroom",
      priceAll: "Mức giá: Mọi khoảng",
      priceUnder10m: "Dưới 10 triệu",
      price10to25m: "10 - 25 triệu",
      priceAbove25m: "Trên 25 triệu",
      viewMore: "Xem Toàn Bộ 120+ Tác Phẩm Nội Thất",
      viewLess: "Thu gọn bớt tác phẩm",
      philosophyTag: "TÔN TRỌNG TỰ NHIÊN & CON NGƯỜI",
      philosophyHeading: "Triết Lý Nghề Mộc & Độ Bền Vượt Thế Hệ",
      philosophyDesc: "Chúng tôi tin rằng món đồ nội thất quý giá nhất là món đồ sống cùng gia đình qua nhiều thập kỷ, mang theo kỷ niệm và càng nhuốm màu thời gian thì chất gỗ càng trở nên đằm thắm.",
      val1Title: "Chứng Nhận Gỗ FSC Quốc Tế",
      val1Desc: "100% gỗ Sồi, Óc Chó (Walnut) và Teak được khai thác từ những cánh rừng tái sinh có trách nhiệm tại Bắc Âu và Bắc Mỹ, tuân thủ nghiêm ngặt tiêu chuẩn bảo tồn đa dạng sinh học.",
      val1Sub: "Chuẩn bền vững FSC® C104928",
      val2Title: "Kỹ Thuật Mộng Gỗ Không Đinh",
      val2Desc: "Kế thừa kỹ nghệ mộng gỗ Nhật Bản (Kigumi) và ngàm then Bắc Âu. Các chi tiết liên kết chặt chẽ qua cấu trúc mộng chốt gỗ tự nhiên, loại bỏ hoàn toàn đinh ốc kim loại rỉ sét và nứt vỡ thớ gỗ.",
      val2Sub: "Chế tác thủ công 100%",
      val3Title: "Cam Kết Bảo Hành 10 Năm",
      val3Desc: "Chính sách bảo hành kết cấu gỗ trọn vẹn 10 năm đi kèm gói bảo dưỡng đánh sáp tự nhiên định kỳ mỗi 12 tháng tại nhà từ các nghệ nhân mộc Komorebi.",
      val3Sub: "Hỗ trợ trọn đời sản phẩm",
      workshopTag: "XƯỞNG CHẾ TÁC THỦ CÔNG",
      workshopHeading: "Mỗi chi tiết đều mang dấu ấn của đôi bàn tay người thợ",
      workshopDesc: "Từ công đoạn chọn từng thớ gỗ không tì vết, sấy tự nhiên giảm ứng suất cong vênh đến 7 lớp lau dầu thực vật Osmo (Đức) giữ trọn hơi thở của vân gỗ mộc.",
      workshopLink: "Khám phá hành trình chế tác tại xưởng mộc",
      ctaTag: "DỊCH VỤ THIẾT KẾ RIÊNG",
      ctaHeading: "Kiến Tạo Không Gian Sống Riêng Bản Sắc",
      ctaDesc: "Đội ngũ kiến trúc sư Komorebi sẵn sàng tư vấn 1–1, khảo sát hiện trạng tận nơi và cung cấp bản vẽ bố trí nội thất 3D chi tiết miễn phí cho ngôi nhà của bạn.",
      ctaInputPlaceholder: "Nhập số điện thoại của bạn...",
      ctaSubmitBtn: "Đăng Ký Tư Vấn Ngay",
      ctaNotice: "* Kiến trúc sư sẽ liên hệ lại trong vòng 30 phút trong giờ làm việc (8:30 – 20:30).",
      ctaToast: (phone: string) => `Cảm ơn bạn! KTS Komorebi sẽ gọi đến ${phone} trong vòng 30 phút.`,
      phoneRequiredError: "Vui lòng nhập số điện thoại để nhận tư vấn.",
      addToCart: "Thêm vào giỏ",
      inCartToast: "Đã thêm sản phẩm vào giỏ hàng!",
    },
    cart: {
      title: "Giỏ Hàng & Tùy Biến Không Gian",
      subtitle: "Xem lại quy cách gỗ, kích thước và cấu hình giao lắp trước khi hoàn tất đơn hàng",
      emptyTitle: "Giỏ hàng của bạn đang trống",
      emptyDesc: "Hãy khám phá và lựa chọn những tác phẩm nội thất mộc bản cho không gian sống của bạn.",
      continueShopping: "Tiếp tục mua sắm",
      breadcrumbHome: "Trang chủ",
      breadcrumbCart: "Giỏ hàng & Cấu hình",
      breadcrumbCheckout: "Thanh toán an toàn",
      step1: "Giỏ hàng & Tùy chỉnh",
      step2: "Địa chỉ & Lắp đặt",
      step3: "Thanh toán",
      productCol: "Sản phẩm",
      priceCol: "Đơn giá",
      quantityCol: "Số lượng",
      totalCol: "Thành tiền",
      discountCodePlaceholder: "Mã ưu đãi / Voucher KTS",
      applyDiscountBtn: "Áp dụng",
      subtotal: "Tạm tính",
      shippingFee: "Phí vận chuyển & lắp đặt",
      discount: "Giảm giá đặc quyền",
      totalAmount: "Tổng thanh toán",
      checkoutBtn: "Tiến Hành Đặt Hàng & Thanh Toán",
      shippingFree: "Miễn phí lắp đặt nội thành",
      depositLabel: "Đặt cọc 30% xưởng chế tác",
      deliveryTitle: "Địa Chỉ Giao Nhận & Lắp Đặt Mộc Bản",
      fullNameLabel: "Họ và tên người nhận *",
      phoneLabel: "Số điện thoại liên hệ *",
      emailLabel: "Email xác nhận đơn hàng",
      cityLabel: "Tỉnh / Thành phố *",
      districtLabel: "Quận / Huyện *",
      addressLabel: "Địa chỉ chi tiết (Số nhà, tên đường, căn hộ) *",
      vatLabel: "Yêu cầu xuất hóa đơn VAT điện tử doanh nghiệp",
      companyNameLabel: "Tên công ty / Doanh nghiệp",
      taxIdLabel: "Mã số thuế doanh nghiệp",
      installationNotice: "Lắp đặt tại chỗ White-Glove chuyên nghiệp (Miễn phí)",
      ecoPackagingNotice: "Bao bì hữu cơ Zero-Waste tái chế",
      deliveryDateLabel: "Ngày giao hàng mong muốn",
      elevatorLabel: "Đặc điểm vận chuyển / Thang máy",
      paymentTitle: "Phương Thức Thanh Toán Mộc Bản",
      vietQrMethod: "Chuyển khoản VietQR 24/7 (Khuyên dùng)",
      vietQrDesc: "Quét mã QR tự động xác nhận đơn hàng trong 10 giây",
      cardMethod: "Thẻ Quốc Tế Visa / Mastercard / JCB",
      cardDesc: "Bảo mật 3D Secure mã hóa thẻ 256-bit",
      depositMethod: "Đặt cọc 30% xưởng sản xuất",
      depositDesc: "Thanh toán 70% còn lại sau khi nghiệm thu lắp đặt tại tư gia",
      emptyCartNotice: "Giỏ hàng của bạn đang trống.",
      fillRequiredNotice: "Vui lòng điền họ tên và số điện thoại giao nhận.",
      connectingGateway: "Đang kết nối cổng thanh toán thẻ quốc tế Visa/Mastercard 3D Secure...",
    },
    account: {
      profileTitle: "Hồ Sơ Hội Viên & Quản Lý Độc Quyền",
      standardMember: "HỘI VIÊN TIÊU CHUẨN",
      architectPartner: "ĐỐI TÁC KIẾN TRÚC SƯ",
      clientRole: "Khách hàng",
      architectRole: "Kiến trúc sư",
      adminRole: "Quản trị viên",
      overviewTab: "Tổng quan & Đơn hàng",
      profileAddressTab: "Hồ sơ & Sổ địa chỉ",
      wishlistTab: "Bộ sưu tập yêu thích",
      maintenanceTab: "Bảo dưỡng mộng gỗ",
      signOutBtn: "Đăng xuất",
      saveProfileBtn: "Lưu hồ sơ cá nhân",
      charterBtn: "Điều lệ hội viên",
      fullNameLabel: "Họ và tên",
      emailLabel: "Email liên kết",
      phoneLabel: "Số điện thoại",
      companyLabel: "Văn phòng / Công ty thiết kế",
      roleLabel: "Chức danh",
      recentOrdersTitle: "Lịch Sử Đơn Hàng Mộc Bản",
      noOrders: "Chưa có đơn hàng nào được ghi nhận.",
      orderDate: "Ngày đặt",
      orderStatus: "Trạng thái",
      saveSuccessToast: "Cập nhật hồ sơ thành công!",
    },
    chatbot: {
      title: "Komorebi AI Stylist",
      subtitle: "Cố vấn kiến trúc & mộc bản",
      emptyTitle: "Hộp thoại tư vấn đang để trống",
      emptyDesc: "Sẵn sàng hỗ trợ quý khách về phối cảnh 3D, vật liệu mộc bản Wabi-Sabi và kích thước nội thất may đo.",
      suggestedLabel: "Gợi ý câu hỏi",
      suggestions: [
        "Tư vấn bàn ăn Mori gỗ sồi",
        "Ghế bành thư giãn Kura",
        "Phong cách Wabi-Sabi tối giản",
      ],
      placeholder: "Nhập câu hỏi về không gian & nội thất...",
      sendTooltip: "Gửi câu hỏi",
      minimizeTooltip: "Thu nhỏ chatbot",
      openTooltip: "Mở Komorebi AI Stylist",
      aiReplyIntro: "Cảm ơn quý khách đã quan tâm. Komorebi AI Stylist đang kết nối kho tri thức mộc bản và danh mục dự án kiến trúc.",
    },
    common: {
      currency: "đ",
      close: "Đóng",
      loading: "Đang tải...",
      hot: "Nổi bật",
      save: "Lưu thay đổi",
      cancel: "Hủy bỏ",
      delete: "Xóa",
    },
  },
  EN: {
    nav: {
      livingRoom: "Living Room",
      livingRoomDesc: "Crafted sofas, Enso tea tables & media consoles",
      kitchenDining: "Kitchen & Dining",
      kitchenDiningDesc: "Mori dining tables, Kanso chairs & cabinetry",
      bedroom: "Bedroom",
      bedroomDesc: "Zen Platform beds, Tatami mats & Shoji closets",
      collection: "Kyoto Collection",
      collectionDesc: "Kyoto Atelier Archive & Wabi-Sabi ceramics",
      architectureProjects: "Architectural Projects",
      architectureProjectsDesc: "Thao Dien Villa, Penthouses & Eco-Resorts",
      consultationBtn: "Architect Consult",
      searchPlaceholder: "Search products, timber...",
      menuLabel: "Menu",
      spaceCategories: "Space Categories",
      curatedServices: "Curated & Services",
      kuraHighlight: "Iconic Piece: Kura Lounge Chair",
      wishlistPieces: "Curated Wishlist",
      accountLabel: "Komorebi Circle • Account & Trade",
      shoppingBag: "Shopping Bag & Checkout",
      bookArchitectConsult: "Book Architect Consultation",
      hotlineLabel: "Atelier Hotline: 1900 6829 (8:30 AM - 8:30 PM)",
      showroomLabel: "Showroom: 18 Street 10, Thao Dien Ward, Thu Duc City, HCMC",
      closeMenu: "Close menu",
      openMenu: "Open space catalog menu",
      itemsCount: (n: number) => `${n} ${n === 1 ? "item" : "items"}`,
      userWelcome: (name: string) => `Hello, ${name}`,
      loggedInBadge: "Logged In",
    },
    footer: {
      showroomHcm: "Ho Chi Minh City Showroom",
      showroomHcmAddr: "18 Street 10, Thao Dien, Thu Duc City",
      showroomHcmHours: "Hours: 09:00 AM - 08:30 PM (Mon - Sun)",
      showroomHn: "Hanoi Showroom",
      showroomHnAddr: "45 Quang Trung, Hoan Kiem District",
      showroomHnHours: "Hours: 09:00 AM - 08:30 PM (Mon - Sun)",
      workshopTitle: "Master Woodworking Atelier",
      workshopDesc: "Kyoto Atelier & Binh Duong Ecological Mill",
      workshopStandard: "Traditional nail-free Kigumi interlocking joinery standards",
      copyright: "© 2025 Komorebi Living. Minimalist Japanese woodworking & architecture.",
      aboutUs: "About Us",
      craftWorkshop: "Master Workshop",
      warrantyPolicy: "10-Year Joinery Warranty",
      deliveryService: "Delivery & Installation",
      showroomSystem: "Showroom Network",
    },
    wishlist: {
      title: "Curated Wishlist",
      subtitle: "Your saved collection of mastercrafted furniture",
      clearAll: "Clear All",
      emptyTitle: "Your wishlist is empty",
      emptyDesc: "Explore handcrafted solid wood designs and save your favorites for your living space.",
      exploreBtn: "Explore Collection",
      addAllToCart: (n: number) => `Add all (${n}) to Cart`,
      checkoutBtn: "View Bag & Checkout",
      continueShopping: "Continue Browsing",
      itemCount: (n: number) => `${n} ${n === 1 ? "piece" : "pieces"}`,
      inStock: "In Stock at Showroom",
      addToCartBtn: "Add to Bag",
      removeBtn: "Remove",
    },
    consultation: {
      badge: "ATELIER CONSULTING",
      title: "Architectural & Interior Consultation",
      desc: "Our lead architects will schedule an on-site survey and provide 3D spatial layout drawings within 24 hours.",
      fullNameLabel: "Full Name *",
      fullNamePlaceholder: "E.g. Michael Chen / Homeowner...",
      phoneLabel: "1-on-1 Consultation Phone Number *",
      phonePlaceholder: "+84 988 xxx xxx",
      spaceTypeLabel: "Property & Space Type",
      notesLabel: "Bespoke Woodworking Requirements",
      notesPlaceholder: "E.g. Custom 2.8m natural oak dining table, tea room meditation nook survey...",
      submitBtn: "Confirm Free Consultation Schedule",
      submittingBtn: "SUBMITTING REQUEST...",
      successTitle: "Registration Completed",
      successDesc: "Komorebi Living's lead architect will call you within 30 minutes to arrange an on-site survey.",
      closeBtn: "Close Window",
      spaces: {
        apartment: "Luxury Apartment / Penthouse",
        villa: "Townhouse / Private Garden Villa",
        commercial: "Design Studio / Exhibition Space",
        penthouse: "Commercial Project / Boutique Hotel",
      },
      phoneRequiredError: "Please enter your contact phone number.",
      submitSuccessToast: "Consultation request sent successfully!",
      freeNotice: "* Fully complimentary 3D layout rendering and itemized material quote.",
    },
    showroomModal: {
      badge: "SHOWROOM PRIVÉ",
      title: "Book Private Showroom Experience",
      productLabel: "Selected Masterpiece",
      chooseShowroom: "Select Showroom Space *",
      dateLabel: "Appointment Date *",
      timeLabel: "Time Slot *",
      nameLabel: "Full Name *",
      namePlaceholder: "Your full name...",
      phoneLabel: "Phone Number *",
      phonePlaceholder: "+84 9xx xxx xxx",
      submitBtn: "Confirm Private Appointment",
      successTitle: "Appointment Confirmed",
      successDesc: (showroom: string, product: string, time: string, date: string) =>
        `Our Atelier specialist at ${showroom} has prepared the ${product} timber sample and tea ceremony for your visit at ${time} on ${date}.`,
      closeBtn: "Close",
      phoneRequiredError: "Please provide a phone number to receive confirmation code.",
      bookedToast: (product: string) => `Appointment booked for ${product} successfully!`,
    },
    home: {
      heroTag: "Autumn-Winter Collection 2025",
      heroHeadline: "The Art of Balanced",
      heroHeadlineAccent: "Living Spaces",
      heroSubheadline: "Where the serene stillness of Japanese Wabi-Sabi meets the warm simplicity of Scandinavian solid craftsmanship. Each creation is a timeless woodworking piece built for generations.",
      heroExploreBtn: "Explore Autumn-Winter Collection",
      heroConsultBtn: "Book Architect Consultation",
      metric1Value: "100%",
      metric1Label: "FSC Oak & Walnut",
      metric2Value: "0%",
      metric2Label: "Metal Fasteners",
      metric3Value: "10 Years",
      metric3Label: "Structural Warranty",
      featuredSpecTag: "Iconic Design",
      featuredCraftOrigin: "Handcrafted at Komorebi Kyoto Atelier",
      featuredReady: "Ready for Preview",
      spacesSubtitle: "EXPLORE BY LIVING SPACE",
      spacesHeading: "Inspiration in Vernacular & Contemporary Design",
      spaceLivingRoom: "Living Room",
      spaceDiningRoom: "Dining Room",
      spaceBedroom: "Bedroom",
      spaceWorkRoom: "Tranquil Workspace",
      filterLabel: "Filters:",
      filterShowroom: "In Stock at Showroom",
      priceAll: "Price: All ranges",
      priceUnder10m: "Under 10 Million",
      price10to25m: "10 - 25 Million",
      priceAbove25m: "Above 25 Million",
      viewMore: "Explore All 120+ Woodcraft Masterpieces",
      viewLess: "Collapse Collection",
      philosophyTag: "HONORING NATURE & CRAFTSMANSHIP",
      philosophyHeading: "Woodcraft Philosophy & Generational Longevity",
      philosophyDesc: "We believe the most treasured furniture pieces grow with families across decades, carrying memories as aged timber patinas with grace.",
      val1Title: "FSC® International Certified Timber",
      val1Desc: "100% of Oak, American Walnut, and Teak are responsibly harvested from renewable forests in Northern Europe and North America, strictly preserving biodiversity.",
      val1Sub: "FSC® C104928 Sustainability Standard",
      val2Title: "Nail-Free Interlocking Joinery",
      val2Desc: "Inheriting Japanese Kigumi joinery and Scandinavian interlocking dowels, eliminating rust-prone metal screws for pure wooden cohesion.",
      val2Sub: "100% Handcrafted Joinery",
      val3Title: "10-Year Structural Guarantee",
      val3Desc: "Complete 10-year structural warranty accompanied by annual complimentary organic beeswax maintenance by Komorebi artisans.",
      val3Sub: "Lifetime Care Support",
      workshopTag: "MASTER CRAFT WORKSHOP",
      workshopHeading: "Every detail carries the touch of master artisans",
      workshopDesc: "From selecting flawless wood grains, slow natural seasoning to 7 coats of organic Osmo oil (Germany) preserving natural timber breath.",
      workshopLink: "Discover our atelier craftsmanship journey",
      ctaTag: "BESPOKE ARCHITECTURAL SERVICE",
      ctaHeading: "Shaping Spaces of Distinct Identity",
      ctaDesc: "Komorebi lead architects provide 1-on-1 private consultations, on-site surveys, and complimentary 3D layout renderings for your residence.",
      ctaInputPlaceholder: "Enter your phone number...",
      ctaSubmitBtn: "Request Consultation Now",
      ctaNotice: "* Our lead architect will contact you within 30 minutes during working hours (8:30 AM – 8:30 PM).",
      ctaToast: (phone: string) => `Thank you! Komorebi architect will call ${phone} within 30 minutes.`,
      phoneRequiredError: "Please enter your phone number to receive consultation.",
      addToCart: "Add to Bag",
      inCartToast: "Added to shopping bag!",
    },
    cart: {
      title: "Shopping Bag & Interior Customization",
      subtitle: "Review timber specs, bespoke dimensions, and white-glove installation before completing your order",
      emptyTitle: "Your shopping bag is empty",
      emptyDesc: "Explore our collection and choose timeless handcrafted solid wood creations for your home.",
      continueShopping: "Continue Shopping",
      breadcrumbHome: "Home",
      breadcrumbCart: "Bag & Configuration",
      breadcrumbCheckout: "Secure Checkout",
      step1: "Bag & Customization",
      step2: "Address & Assembly",
      step3: "Payment",
      productCol: "Product",
      priceCol: "Unit Price",
      quantityCol: "Quantity",
      totalCol: "Total",
      discountCodePlaceholder: "Trade discount code / Voucher",
      applyDiscountBtn: "Apply",
      subtotal: "Subtotal",
      shippingFee: "White-Glove Delivery & Assembly",
      discount: "Privilege Discount",
      totalAmount: "Total Payable",
      checkoutBtn: "Proceed to Secure Checkout",
      shippingFree: "Complimentary city-center assembly",
      depositLabel: "30% Production Deposit",
      deliveryTitle: "Delivery Address & White-Glove Installation",
      fullNameLabel: "Recipient Full Name *",
      phoneLabel: "Contact Phone Number *",
      emailLabel: "Confirmation Email",
      cityLabel: "Province / City *",
      districtLabel: "District *",
      addressLabel: "Detailed Street Address *",
      vatLabel: "Request Corporate Electronic VAT Invoice",
      companyNameLabel: "Company / Studio Name",
      taxIdLabel: "Corporate Tax ID",
      installationNotice: "Complimentary White-Glove On-site Installation",
      ecoPackagingNotice: "Zero-Waste Recycled Eco-Friendly Packaging",
      deliveryDateLabel: "Preferred Delivery Date",
      elevatorLabel: "Elevator & Access Requirements",
      paymentTitle: "Payment Method",
      vietQrMethod: "VietQR Instant Transfer 24/7 (Recommended)",
      vietQrDesc: "Scan QR code to verify and confirm your order in 10s",
      cardMethod: "International Cards (Visa / Mastercard / JCB)",
      cardDesc: "3D Secure 256-bit encrypted card gateway",
      depositMethod: "30% Production Deposit",
      depositDesc: "Pay remaining 70% upon successful on-site assembly",
      emptyCartNotice: "Your shopping bag is currently empty.",
      fillRequiredNotice: "Please provide recipient name and phone number.",
      connectingGateway: "Connecting to secure 3D Secure card gateway...",
    },
    account: {
      profileTitle: "Member Profile & Exclusive Privileges",
      standardMember: "STANDARD MEMBER",
      architectPartner: "ARCHITECT PARTNER",
      clientRole: "Client",
      architectRole: "Architect",
      adminRole: "Administrator",
      overviewTab: "Overview & Orders",
      profileAddressTab: "Profile & Address Book",
      wishlistTab: "Saved Wishlist",
      maintenanceTab: "Wood Joinery Care",
      signOutBtn: "Sign Out",
      saveProfileBtn: "Save Profile",
      charterBtn: "Member Charter",
      fullNameLabel: "Full Name",
      emailLabel: "Linked Email",
      phoneLabel: "Phone Number",
      companyLabel: "Studio / Architecture Firm",
      roleLabel: "Member Title / Role",
      recentOrdersTitle: "Woodcraft Orders History",
      noOrders: "No recorded orders yet.",
      orderDate: "Date",
      orderStatus: "Status",
      saveSuccessToast: "Profile updated successfully!",
    },
    chatbot: {
      title: "Komorebi AI Stylist",
      subtitle: "Architectural & Woodwork Advisor",
      emptyTitle: "Chat session is empty",
      emptyDesc: "Ready to assist you with 3D layouts, Wabi-Sabi wood materials, and custom furniture dimensions.",
      suggestedLabel: "Suggested questions",
      suggestions: [
        "Mori Oak dining table advice",
        "Kura Lounge Chair specs",
        "Wabi-Sabi minimalist styling",
      ],
      placeholder: "Ask about space, wood, dimensions...",
      sendTooltip: "Send message",
      minimizeTooltip: "Minimize chatbot",
      openTooltip: "Open Komorebi AI Stylist",
      aiReplyIntro: "Thank you for reaching out. Komorebi AI Stylist is connecting to our woodworking archive and architectural projects.",
    },
    common: {
      currency: "VND",
      close: "Close",
      loading: "Loading...",
      hot: "Featured",
      save: "Save Changes",
      cancel: "Cancel",
      delete: "Delete",
    },
  },
};

interface LanguageContextType {
  lang: Lang;
  setLang: (newLang: Lang) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("VN");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("komorebi_lang") as Lang;
      if (savedLang === "VN" || savedLang === "EN") {
        setLangState(savedLang);
        document.documentElement.lang = savedLang === "VN" ? "vi" : "en";
      }

      const handleSync = () => {
        const current = localStorage.getItem("komorebi_lang") as Lang;
        if (current === "VN" || current === "EN") {
          setLangState(current);
          document.documentElement.lang = current === "VN" ? "vi" : "en";
        }
      };

      window.addEventListener("komorebi_lang_change", handleSync);
      window.addEventListener("storage", handleSync);
      return () => {
        window.removeEventListener("komorebi_lang_change", handleSync);
        window.removeEventListener("storage", handleSync);
      };
    }
  }, []);

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem("komorebi_lang", newLang);
      document.documentElement.lang = newLang === "VN" ? "vi" : "en";
      window.dispatchEvent(new Event("komorebi_lang_change"));
    }
  };

  const t = translationsData[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
