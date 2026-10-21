"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ConsultationModal from "@/components/ConsultationModal";
import { useLanguage } from "@/context/LanguageContext";

interface Project {
  id: string;
  code: string;
  title: string;
  location: string;
  category: "villa" | "penthouse" | "resort";
  style: string;
  area: string;
  year: string;
  duration: string;
  architect: string;
  materials: string;
  finishing: string;
  desc: string;
  concept: string;
  image: string;
  gallery: string[];
  beforeImage: string;
  afterImage: string;
  tag: string;
  highlight: string;
  spanCol?: string;
  features: string[];
}

const projects: Project[] = [
  {
    id: "proj-1",
    code: "KM-V2408",
    title: "Villa An Nhiên — Thảo Điền",
    location: "TP. Hồ Chí Minh",
    category: "villa",
    style: "Japandi Modern",
    area: "620 m²",
    year: "2024",
    duration: "4.5 Tháng",
    architect: "KTS. Hoàng Minh Đức & Komorebi Atelier",
    materials: "Gỗ Teak Miến Điện & Đá Bazan Núi",
    finishing: "7 lớp dầu hữu cơ Osmo Hardwax (Đức)",
    desc: "Dự án biệt thự ven sông Sài Gòn tối ưu luồng đối lưu khí tự nhiên. Hệ vách lam xoay 360 độ từ xưởng mộc Komorebi kết hợp đảo bếp đá bazan nguyên khối 4 tấn tạo điểm tựa thị giác vững chãi.",
    concept:
      "Tận dụng hướng gió mát ven sông và ánh nắng chiều phương Tây, công trình bố trí hệ nan gỗ thông gió điều tiết nhiệt tự nhiên, giảm 35% công suất điều hòa.",
    image: "/images/portfolio-1.jpg",
    gallery: [
      "/images/portfolio-1.jpg",
      "/images/living-1.jpg",
      "/images/dining-1.jpg",
      "/images/bedroom-1.jpg",
    ],
    beforeImage: "/images/portfolio-1.jpg",
    afterImage: "/images/living-1.jpg",
    tag: "VILLA SINH THÁI BIỂU TƯỢNG",
    highlight: "Vách lam xoay 360° & Đảo bếp bazan 4 tấn",
    spanCol: "lg:col-span-8",
    features: [
      "Hệ nan chớp gỗ Teak xoay góc tự động",
      "Đảo bếp đá bazan nguyên khối khò nhám",
      "Hệ tủ âm tường ngàm finger-joint không ốc vít",
      "Sàn gỗ Teak tự nhiên dài 2.4m bản rộng",
    ],
  },
  {
    id: "proj-2",
    code: "KM-P2411",
    title: "Penthouse The Metropole",
    location: "Thủ Thiêm, TP. HCM",
    category: "penthouse",
    style: "Tối Giản Wabi-Sabi",
    area: "320 m²",
    year: "2024",
    duration: "3.0 Tháng",
    architect: "KTS. Lê Nhật Nam & Komorebi Master Craft",
    materials: "Gỗ Sồi hun khói & Tường vôi Stucco",
    finishing: "Dầu mờ kháng ẩm Woca Đan Mạch",
    desc: "Loại bỏ hoàn toàn tay nắm cơ học với kỹ thuật finger-joint âm gỗ sồi hun khói, hòa nhập tuyệt đối vào vách tường phẳng đón trọn ánh sáng đường chân trời Sài Gòn.",
    concept:
      "Không gian tôn vinh vẻ đẹp tĩnh tại và sự khiêm nhường của vật liệu thô mộc. Mọi đường nét cơ khí đều được giấu kín sau các cánh cửa trượt âm tường phẳng.",
    image: "/images/portfolio-2.jpg",
    gallery: [
      "/images/portfolio-2.jpg",
      "/images/living-2.jpg",
      "/images/curated-2.jpg",
      "/images/bedroom-2.jpg",
    ],
    beforeImage: "/images/portfolio-2.jpg",
    afterImage: "/images/living-2.jpg",
    tag: "PENTHOUSE CAO CẤP",
    highlight: "Cánh tủ mộng âm & Bàn ăn dài 3.2m",
    spanCol: "lg:col-span-4",
    features: [
      "Bàn ăn gỗ sồi hun khói 1 tấm dài 3.2m",
      "Vách ngăn kính khung gỗ sồi mỏng 18mm",
      "Toàn bộ ray trượt âm sàn chống bụi",
      "Hệ thống chiếu sáng gián tiếp 2700K",
    ],
  },
  {
    id: "proj-3",
    code: "KM-R2403",
    title: "Komorebi Retreat — Đồi Thông Đà Lạt",
    location: "Lâm Đồng",
    category: "resort",
    style: "Brutalist Japanese Wood",
    area: "1,200 m²",
    year: "2023 - 2024",
    duration: "6.0 Tháng",
    architect: "Atelier D+A & Komorebi Atelier",
    materials: "Gỗ Thông biến tính nhiệt (Thermo-Pine) & Kính Low-E",
    finishing: "Dầu sáp thông bản địa & Dầu khoáng chống nấm mốc",
    desc: "Tận dụng độ dốc triền đồi thông, đưa toàn bộ hệ cửa lùa kính và lam gỗ mộc bao bọc lấy sương sớm và ánh nắng ban mai cao nguyên.",
    concept:
      "Kết hợp kiến trúc mộc nặng kiểu Brutalist với sự thanh mảnh của nhà truyền thống Nhật Bản (Minka), công trình hòa tan vào cảnh quan rừng nguyên sinh.",
    image: "/images/portfolio-3.jpg",
    gallery: [
      "/images/portfolio-3.jpg",
      "/images/living-3.jpg",
      "/images/dining-3.jpg",
      "/images/bedroom-3.jpg",
    ],
    beforeImage: "/images/portfolio-3.jpg",
    afterImage: "/images/living-3.jpg",
    tag: "RESORT & RETREAT ZEN",
    highlight: "Gỗ thông nhiệt sấy lò & Ghế Kura thủ công",
    spanCol: "lg:col-span-6",
    features: [
      "Cửa trượt Shoji cách âm cách nhiệt 3 lớp",
      "Kèo cột gỗ thông khối ghép mộng Kigumi",
      "Bồn ngâm gỗ Hinoki nhập khẩu Kyoto",
      "Hệ sàn gỗ ngoài trời thoát nước rãnh âm",
    ],
  },
  {
    id: "proj-4",
    code: "KM-D2409",
    title: "Duplex Starlake — Tây Hồ",
    location: "Hà Nội",
    category: "penthouse",
    style: "Contemporary Zen",
    area: "380 m²",
    year: "2024",
    duration: "3.5 Tháng",
    architect: "KTS. Vũ Tuấn Anh & Komorebi Woodwork",
    materials: "Gỗ Óc Chó Bắc Mỹ & Giấy Dó / Washi 4m",
    finishing: "Sơn dầu gốc thực vật không mùi VOC 0%",
    desc: "Khoảng thông tầng 6.5m đón ánh sáng phương Bắc, vách tủ sách kiến trúc Sora cao chạm trần tạo trục đối xứng trang nhã và tôn nghiêm.",
    concept:
      "Điểm nhấn là hệ cầu thang bay cantilevered bằng gỗ óc chó đặc khối, tựa như dải lụa lơ lửng giữa không trung mà không lộ một mối vít cơ khí.",
    image: "/images/portfolio-4.jpg",
    gallery: [
      "/images/portfolio-4.jpg",
      "/images/living-4.jpg",
      "/images/dining-4.jpg",
      "/images/bedroom-4.jpg",
    ],
    beforeImage: "/images/portfolio-4.jpg",
    afterImage: "/images/living-4.jpg",
    tag: "DUPLEX THÔNG TẦNG",
    highlight: "Cầu thang bay & Đèn Washi khổng lồ 4m",
    spanCol: "lg:col-span-6",
    features: [
      "Cầu thang bay giấu ngàm thép bên trong lõi gỗ",
      "Vách sách kiến trúc thông tầng cao 6.5m",
      "Đèn chùm lồng lụa Washi thủ công 4m",
      "Tủ rượu âm tường điều nhiệt bằng gỗ sồi",
    ],
  },
  {
    id: "proj-5",
    code: "KM-V2412",
    title: "Ocean Cliff Villa — Bãi Dài",
    location: "Cam Ranh, Khánh Hòa",
    category: "villa",
    style: "Tropical Minimalist",
    area: "850 m²",
    year: "2024",
    duration: "5.0 Tháng",
    architect: "Studio K & Komorebi Atelier",
    materials: "Gỗ Teak chịu mặn & Đá Granite nhám",
    finishing: "Dầu bảo vệ ngoài trời chuyên dụng muối biển",
    desc: "Biệt thự vách đá ngắm hoàng hôn vịnh biển. Toàn bộ vật liệu gỗ Teak xử lý công nghệ sấy chân không chống co ngót dưới tác động của hơi muối biển miền Trung.",
    concept:
      "Giao thoa giữa vẻ đẹp rắn rỏi của đá núi và nét ấm áp của gỗ Teak, tạo nên tổ hợp kiến trúc nghỉ dưỡng trường tồn với thời gian.",
    image: "/images/curated-1.jpg",
    gallery: [
      "/images/curated-1.jpg",
      "/images/living-5.jpg",
      "/images/dining-5.jpg",
      "/images/bedroom-5.jpg",
    ],
    beforeImage: "/images/curated-1.jpg",
    afterImage: "/images/living-5.jpg",
    tag: "OCEANFRONT VILLA",
    highlight: "Teak kháng muối biển & Hiên gỗ đón gió 120m²",
    spanCol: "lg:col-span-4",
    features: [
      "Hệ lam chắn nắng tự động chịu bão biển",
      "Deck hồ bơi vô cực gỗ Teak không đinh",
      "Sảnh đón mở 3 mặt hướng ra đại dương",
      "Phòng xông hơi khô gỗ Tuyết Tùng",
    ],
  },
  {
    id: "proj-6",
    code: "KM-P2405",
    title: "The Nassim Sky Residence",
    location: "Thảo Điền, TP. HCM",
    category: "penthouse",
    style: "Neo-Japanese Elegance",
    area: "265 m²",
    year: "2024",
    duration: "2.5 Tháng",
    architect: "Komorebi Bespoke Design Team",
    materials: "Gỗ Óc Chó đen & Da sáp Ý",
    finishing: "Phủ dầu bán bóng 30% tôn vân núi gỗ",
    desc: "Căn hộ thượng tầng sở hữu thang máy riêng. Không gian sử dụng các hệ tủ mộc kết hợp chi tiết kim loại đồng thau xước mờ tạo sự sang trọng kín đáo.",
    concept:
      "Không gian sống cân bằng tuyệt đối giữa cuộc sống đô thị phồn hoa và chốn bình yên tĩnh dưỡng sau một ngày làm việc căng thẳng.",
    image: "/images/curated-4.jpg",
    gallery: [
      "/images/curated-4.jpg",
      "/images/living-6.jpg",
      "/images/dining-2.jpg",
      "/images/bedroom-6.jpg",
    ],
    beforeImage: "/images/curated-4.jpg",
    afterImage: "/images/living-6.jpg",
    tag: "SKY RESIDENCE",
    highlight: "Sảnh thang máy riêng & Tủ rượu đồng thau",
    spanCol: "lg:col-span-4",
    features: [
      "Cửa chính hai cánh gỗ óc chó dày 70mm",
      "Tủ walk-in closet kính hun khói đèn cảm ứng",
      "Đảo bếp kết hợp bàn bar mặt đá cẩm thạch",
      "Giường ngủ bệt kiểu Ryokan Nhật Bản",
    ],
  },
  {
    id: "proj-7",
    code: "KM-V2402",
    title: "Biệt Thự Vườn Zen — Ecopark",
    location: "Hưng Yên",
    category: "villa",
    style: "Contemporary Zen",
    area: "520 m²",
    year: "2024",
    duration: "4.0 Tháng",
    architect: "KTS. Đặng Quốc Toàn & Komorebi",
    materials: "Gỗ Bách Hinoki Nhật & Sỏi trắng tự nhiên",
    finishing: "Dầu thực vật hữu cơ giữ mùi hương Hinoki tự nhiên",
    desc: "Căn biệt thự đảo bao quanh bởi mặt nước và vườn sỏi phong cách Ryōan-ji. Mọi phòng ngủ đều có hiên gỗ Engawa nhìn ra rặng trúc xanh mát.",
    concept:
      "Mang cả khu vườn thiền Nhật Bản vào giữa lòng đồng bằng Bắc Bộ, đem lại cảm giác an yên tuyệt đối cho gia chủ đa thế hệ.",
    image: "/images/curated-7.jpg",
    gallery: [
      "/images/curated-7.jpg",
      "/images/living-7.jpg",
      "/images/dining-6.jpg",
      "/images/bedroom-7.jpg",
    ],
    beforeImage: "/images/curated-7.jpg",
    afterImage: "/images/living-7.jpg",
    tag: "BIỆT THỰ VƯỜN THIỀN",
    highlight: "Hiên Engawa & Vườn sỏi cào Ryōan-ji",
    spanCol: "lg:col-span-4",
    features: [
      "Hiên gỗ Engawa chạy quanh chu vi nhà",
      "Hệ cửa trượt lùa ẩn hoàn toàn vào tường",
      "Trần ốp nan gỗ thông thơm tự nhiên",
      "Bàn trà đạo gỗ nguyên tấm rễ cây cổ thụ",
    ],
  },
  {
    id: "proj-8",
    code: "KM-R2401",
    title: "Yên Tử Sanctuary Villa",
    location: "Uông Bí, Quảng Ninh",
    category: "resort",
    style: "Di Sản Việt - Nhật Đương Đại",
    area: "740 m²",
    year: "2023 - 2024",
    duration: "5.5 Tháng",
    architect: "Komorebi Heritage & KTS. Lê Cường",
    materials: "Gỗ Lim xanh phục dựng & Gốm Shigaraki",
    finishing: "Sơn ta truyền thống phối hợp dầu dưỡng mờ",
    desc: "Biệt thự tĩnh tu dưới chân núi Yên Tử linh thiêng. Kết hợp hài hòa giữa cấu kiện rường cột gỗ truyền thống và giải pháp kính hộp cách âm hiện đại.",
    concept:
      "Tái hiện không gian di sản kiến trúc gỗ Á Đông trong một hình thái đương đại tiện nghi, tĩnh lặng và sâu lắng.",
    image: "/images/curated-8.jpg",
    gallery: [
      "/images/curated-8.jpg",
      "/images/hero-living-room.jpg",
      "/images/dining-7.jpg",
      "/images/bedroom-8.jpg",
    ],
    beforeImage: "/images/curated-8.jpg",
    afterImage: "/images/hero-living-room.jpg",
    tag: "HERITAGE SANCTUARY",
    highlight: "Bộ rường cột mộng cổ & Không gian thiền",
    spanCol: "lg:col-span-8",
    features: [
      "Hệ cột gỗ lim tròn mộng then cài thủ công",
      "Sàn gạch gốm nung thủ công làng Chu Đậu",
      "Phòng thiền trà nhìn ra thung lũng mây",
      "Đèn đá sân vườn đục tay từ đá núi tự nhiên",
    ],
  },
];

const portfolioTranslations = {
  VN: {
    breadcrumbHome: "Trang Chủ",
    breadcrumbCurrent: "Dự Án Kiến Trúc",
    heroTag: "Hồ Sơ Công Trình Thực Tế • Komorebi Atelier Portfolio 2024 - 2025",
    heroTitle: "Dự Án Kiến Trúc & Không Gian Mộc Nguyên Bản",
    heroDesc:
      "Nơi những bản vẽ kỹ thuật trở thành thực tại sống động. Chúng tôi kết hợp cùng các kiến trúc sư chủ trì để may đo không gian sống tĩnh tại, tối ưu luồng sáng tự nhiên và kiến tạo những hệ tủ - vách gỗ mộng âm đồng bộ từ sảnh đón đến phòng ngủ master.",
    metric1: "Công trình bàn giao",
    metric2: "Khảo sát 3D laser",
    metric3: "Bảo hành mộc",
    metric3Val: "10 Năm",
    metric4: "Giải thưởng kiến trúc",
    metric4Val: "14+",
    heroCtaConsult: "Đăng Ký Tư Vấn Kiến Trúc",
    heroCtaEstimate: "Dự Toán M² Trực Tuyến",

    spotlightTag: "CÔNG TRÌNH BIỂU TƯỢNG CỦA NĂM 2024",
    spotlightTitle: "Villa An Nhiên — Bán Đảo Thảo Điền",
    spotlightDesc:
      "Dự án biệt thự ven sông Sài Gòn quy mô 620m² sàn với toàn bộ hệ vách lam gỗ Teak xoay 360 độ điều hòa vi khí hậu tự nhiên. Đạt giải vàng Vmark Architecture Excellence 2024.",
    spotlightBtn: "Khám Phá Hồ Sơ Chi Tiết",
    spotlightCode: "MÃ: KM-V2408",

    filterTitle: "Bộ Lọc Hồ Sơ Công Trình",
    tabAll: "Tất Cả Dự Án",
    tabVilla: "Biệt Thự & Villa",
    tabPenthouse: "Penthouse & Duplex",
    tabResort: "Resort & Retreat Zen",

    styleAll: "Tất cả phong cách",
    locationAll: "Tất cả địa điểm",
    searchPlaceholder: "Tìm kiếm dự án, địa chỉ, mã công trình...",

    gridMode: "Lưới ảnh",
    listMode: "Danh sách hồ sơ kỹ thuật",

    areaLabel: "Diện tích",
    styleLabel: "Phong cách",
    materialLabel: "Vật liệu mộc",
    durationLabel: "Thời gian",
    architectLabel: "KTS chủ trì",
    yearLabel: "Năm hoàn thành",
    viewDossierBtn: "Xem hồ sơ công trình",
    requestDwgBtn: "Yêu cầu hồ sơ bản vẽ CAD & PDF",
    photosCount: "Bản vẽ & Hình ảnh",

    modalDossierTitle: "Hồ Sơ Kỹ Thuật Công Trình",
    modalTabGallery: "Bộ ảnh thực tế",
    modalTabBeforeAfter: "So sánh Trước & Sau",
    modalTabSpecs: "Bóc tách kỹ thuật",
    modalConceptTitle: "Ý Tưởng & Giải Pháp Kiến Trúc",
    modalFeaturesTitle: "Điểm Nhấn Kết Cấu & Kỹ Thuật Mộc",
    modalTechTitle: "Bảng Thông Số Kỹ Thuật Mộc",
    modalRequestBtn: "Tải Trọn Bộ Hồ Sơ CAD & Spec Vật Liệu",
    modalLaserSurveyBtn: "Đặt Lịch Khảo Sát Laser 3D Tại Công Trình",
    modalClose: "Đóng",

    sliderTitle: "Biến Đổi Không Gian Thực Tế",
    sliderSub: "So sánh khung thô bê tông hiện trạng và không gian sau khi lắp đặt mộc Komorebi",
    sliderBefore: "Hiện trạng thô trước cải tạo",
    sliderAfter: "Sau khi hoàn thiện mộc Komorebi",
    sliderDragHint: "Kéo thanh trượt để so sánh trực quan",

    estimatorTag: "CÔNG CỤ DỰ TOÁN NHANH DÀNH CHO KTS & GIA CHỦ",
    estimatorTitle: "Dự Toán Sơ Bộ Gói Mộc Kiến Trúc",
    estimatorDesc:
      "Ước tính kinh phí thi công dựa trên diện tích sàn, loại công trình và cấp độ vật liệu gỗ tự nhiên chuẩn Komorebi Atelier.",
    stepTypeLabel: "1. Loại hình công trình",
    stepAreaLabel: "2. Diện tích hoàn thiện mộc (m²)",
    stepMaterialLabel: "3. Cấp độ gỗ & bề mặt",
    stepScopeLabel: "4. Phạm vi triển khai",

    scopeFull: "Trọn gói Kiến trúc & Nội thất Mộc",
    scopeWoodOnly: "Chỉ gói Mộc bản & Vách ốp ngàm",
    scopeRenovate: "Cải tạo mộc nâng cấp biệt thự",

    matOak: "Sồi Châu Âu FSC® (Thanh lịch & Bền bỉ)",
    matWalnut: "Óc Chó Bắc Mỹ (Sang trọng & Vân núi cuốn hút)",
    matTeak: "Gỗ Teak & Hinoki Độc Bản (Di sản, chịu ẩm tuyệt đối)",

    typeVilla: "Villa & Biệt Thự",
    typePenthouse: "Penthouse & Duplex",
    typeTownhouse: "Nhà Phố Liền Kề",
    typeResort: "Resort & Homestay",

    estResultTitle: "Dự Toán Dự Kiến (VND)",
    estFabTime: "Thời gian chế tác tại xưởng:",
    estInstallTime: "Thời gian lắp đặt tại công trình:",
    estIncluded: "Bao gồm: Khảo sát laser 3D, bóc tách hồ sơ mộng mộc, dầu Osmo 7 lớp, nghiệm thu kiểm thử mộng khô.",
    estCta: "Gửi Yêu Cầu Nhận Bảng Bóc Tách BoQ Chi Tiết",

    workflowTag: "QUY TRÌNH HỢP TÁC B2B & KHÁCH HÀNG CAO CẤP",
    workflowTitle: "5 Bước Triển Khai Mộc Bản Chuẩn Quốc Tế",
    step1Title: "Tiếp Nhận Bản Vẽ & CAD/3D",
    step1Desc: "Phân tích vi khí hậu hướng gió, nắng và chỉ định phôi gỗ phù hợp chống co ngót.",
    step2Title: "Quét Laser 3D Hiện Trạng",
    step2Desc: "Đo laser độ nghiêng tường, vi khí hậu độ ẩm sàn với sai số dưới 1mm trước khi xuất phôi.",
    step3Title: "Gia Công Mộng Kigumi Tại Xưởng",
    step3Desc: "Chế tác thủ công ghép mộng mộc âm dương truyền thống không dùng đinh kim loại.",
    step4Title: "Kiểm Thử Mộng Khô & Phủ Dầu",
    step4Desc: "Lắp ráp thử nghiệm 100% tại xưởng và hoàn thiện 7 lớp dầu dưỡng Osmo nhập khẩu Đức.",
    step5Title: "Vận Chuyển & Lắp Đặt White-Glove",
    step5Desc: "Thợ cả trực tiếp kê đặt căn chỉnh tại công trình, nghiệm thu laser và dọn sạch zero-waste.",

    testimonialsTag: "TIẾNG NÓI TỪ CÁC KTS CHỦ TRÌ",
    testimonialsTitle: "Đồng Hành Cùng Các Văn Phòng Kiến Trúc Hàng Đầu",

    ctaBannerTitle: "Bạn Đang Lên Kế Hoạch Cho Công Trình Sắp Tới?",
    ctaBannerDesc:
      "Dù là công trình biệt thự nghỉ dưỡng, penthouse hay dự án cải tạo cao cấp, đội ngũ kỹ sư mộc và KTS Komorebi sẵn sàng đồng hành từ giai đoạn phác thảo sơ bộ.",
    ctaCallNow: "Gọi Hotline Kỹ Thuật: 0909 888 999",
    ctaBookSurvey: "Đặt Lịch Khảo Sát Tận Nơi",
  },
  EN: {
    breadcrumbHome: "Home",
    breadcrumbCurrent: "Architectural Projects",
    heroTag: "Real Completed Portfolio • Komorebi Atelier Portfolio 2024 - 2025",
    heroTitle: "Architectural Projects & Pristine Living Spaces",
    heroDesc:
      "Where technical blueprints become tactile living art. In partnership with principal architects, we tailor serene living environments that orchestrate natural daylight and deliver seamless flush mortise woodwork.",
    metric1: "Delivered Projects",
    metric2: "3D Laser Site Surveys",
    metric3: "Joinery Warranty",
    metric3Val: "10 Years",
    metric4: "Design Awards",
    metric4Val: "14+",
    heroCtaConsult: "Book Architectural Consultation",
    heroCtaEstimate: "Online M² Estimator",

    spotlightTag: "ICONIC ARCHITECTURAL SHOWCASE 2024",
    spotlightTitle: "Villa An Nhien — Thao Dien Peninsula",
    spotlightDesc:
      "A 620 sqm riverside sanctuary featuring 360-degree rotating teak louvers for passive microclimate ventilation. Vmark Gold Architecture Excellence Award 2024 winner.",
    spotlightBtn: "Explore Full Project Dossier",
    spotlightCode: "CODE: KM-V2408",

    filterTitle: "Architectural Dossier Filters",
    tabAll: "All Projects",
    tabVilla: "Villas & Estates",
    tabPenthouse: "Penthouses & Duplexes",
    tabResort: "Zen Resorts & Retreats",

    styleAll: "All Architectural Styles",
    locationAll: "All Locations",
    searchPlaceholder: "Search project name, address, code...",

    gridMode: "Visual Grid",
    listMode: "Technical Dossier List",

    areaLabel: "Area",
    styleLabel: "Aesthetic",
    materialLabel: "Timber & Craft",
    durationLabel: "Timeline",
    architectLabel: "Lead Architect",
    yearLabel: "Completion",
    viewDossierBtn: "View Project Dossier",
    requestDwgBtn: "Request CAD & PDF Drawing Set",
    photosCount: "Blueprints & Photos",

    modalDossierTitle: "Technical Project Dossier",
    modalTabGallery: "Gallery",
    modalTabBeforeAfter: "Before & After",
    modalTabSpecs: "Specifications",
    modalConceptTitle: "Architectural Concept & Spatial Solutions",
    modalFeaturesTitle: "Structural Highlights & Woodcraft Engineering",
    modalTechTitle: "Detailed Woodwork Specifications",
    modalRequestBtn: "Download Full CAD & Material Spec Kit",
    modalLaserSurveyBtn: "Book On-Site 3D Laser Survey",
    modalClose: "Close",

    sliderTitle: "Spatial Transformation in Action",
    sliderSub: "Visual comparison between raw concrete frame and completed bespoke Komorebi woodwork",
    sliderBefore: "Raw state prior to construction",
    sliderAfter: "After Komorebi timber completion",
    sliderDragHint: "Drag the slider to compare before and after",

    estimatorTag: "INSTANT ESTIMATOR FOR ARCHITECTS & PROPERTY OWNERS",
    estimatorTitle: "Preliminary Architectural Woodwork Estimator",
    estimatorDesc:
      "Calculate preliminary budgets based on floor area, building typology, and Komorebi Atelier timber material grades.",
    stepTypeLabel: "1. Building Typology",
    stepAreaLabel: "2. Timber Finishing Area (sqm)",
    stepMaterialLabel: "3. Timber Grade & Surface Finish",
    stepScopeLabel: "4. Execution Scope",

    scopeFull: "Full Architecture & Bespoke Woodwork",
    scopeWoodOnly: "Joinery, Casework & Cladding Only",
    scopeRenovate: "Villa Renovation & Upgrade",

    matOak: "FSC® European Oak (Clean & Resilient)",
    matWalnut: "North American Walnut (Deep & Dramatic Grain)",
    matTeak: "Master Teak & Hinoki (Heritage & Climate Resilient)",

    typeVilla: "Private Villa & Estate",
    typePenthouse: "Penthouse & Duplex",
    typeTownhouse: "Urban Townhouse",
    typeResort: "Eco-Resort & Retreat",

    estResultTitle: "Estimated Budget Range (VND)",
    estFabTime: "Atelier Fabrication Duration:",
    estInstallTime: "On-Site Installation Duration:",
    estIncluded: "Includes: 3D laser survey, CAD joinery drafting, 7-layer Osmo finish, dry assembly testing.",
    estCta: "Request Itemized Bill of Quantities (BoQ)",

    workflowTag: "B2B & BESPOKE COLLABORATION FRAMEWORK",
    workflowTitle: "5-Step International Standard Woodcraft Process",
    step1Title: "Blueprint Review & Microclimate Analysis",
    step1Desc: "Analyze CAD/3D plans, daylight vectors, and prescribe ideal timber moisture equilibrium.",
    step2Title: "3D Laser On-Site Survey",
    step2Desc: "Laser scanning with sub-millimeter precision before timber milling begins.",
    step3Title: "Kigumi Mortise Joinery Fabrication",
    step3Desc: "Artisanal dry joint hand crafting without visible fasteners or metal screws.",
    step4Title: "Dry Assembly & Osmo Finishing",
    step4Desc: "100% pre-assembly quality check and 7 coats of organic German Osmo hardwax oil.",
    step5Title: "White-Glove Delivery & Installation",
    step5Desc: "Master joiners supervise laser leveling and zero-waste packaging removal.",

    testimonialsTag: "VOICES OF PRINCIPAL ARCHITECTS",
    testimonialsTitle: "Trusted by Leading Architectural Practices",

    ctaBannerTitle: "Planning Your Next Architectural Landmark?",
    ctaBannerDesc:
      "Whether an ecological villa, sky penthouse, or boutique heritage resort, Komorebi's master joiners and architects are ready to collaborate from schematic concept.",
    ctaCallNow: "Technical Hotline: 0909 888 999",
    ctaBookSurvey: "Schedule On-Site Survey",
  },
};

const testimonials = [
  {
    quote:
      "Komorebi là xưởng mộc hiếm hoi tại Việt Nam xử lý được các hệ vách lam xoay 360 độ và ngàm âm tường giấu kín với dung sai cơ khí dưới 1mm. Mọi công trình bàn giao đều đạt chất lượng xuất sắc.",
    name: "KTS. Hoàng Minh Đức",
    role: "Giám Đốc Thiết Kế • Atelier D+A",
    project: "Dự án hợp tác: Villa An Nhiên & Komorebi Retreat",
  },
  {
    quote:
      "Đội ngũ thợ cả hiểu rất sâu về độ co ngót của gỗ sồi và gỗ teak khi tiếp xúc với điều kiện khí hậu nhiệt đới ẩm. Khâu quét laser 3D trước khi xuất xưởng giúp hạn chế 99% sai sót tại công trình.",
    name: "KTS. Lê Nhật Nam",
    role: "Chủ Trì Thiết Kế • Studio W",
    project: "Dự án hợp tác: Penthouse The Metropole",
  },
  {
    quote:
      "Mỗi sáng bước chân vào ngôi nhà, cảm giác ấm áp của gỗ tự nhiên và hương dầu thảo mộc hữu cơ làm cho cuộc sống trở nên nhẹ nhàng, tĩnh lặng hơn bao giờ hết.",
    name: "Bà Trần Phương Linh",
    role: "Chủ Sở Hữu Villa",
    project: "Dự án: Villa An Nhiên — Thảo Điền",
  },
];

export default function ArchitecturalPortfolioPage() {
  const { lang } = useLanguage();
  const t = portfolioTranslations[lang];

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStyle, setSelectedStyle] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Modal detail state
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [modalTab, setModalTab] = useState<"gallery" | "beforeAfter" | "specs">("gallery");
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number>(0);

  // Before / After Slider state
  const [sliderPosition, setSliderPosition] = useState<number>(50);

  // Estimator state
  const [estType, setEstType] = useState<string>("villa");
  const [estArea, setEstArea] = useState<number>(350);
  const [estMaterial, setEstMaterial] = useState<string>("walnut");
  const [estScope, setEstScope] = useState<string>("full");

  // Consultation modal
  const [isConsultationOpen, setIsConsultationOpen] = useState<boolean>(false);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (selectedCategory !== "all" && p.category !== selectedCategory) return false;
      if (selectedStyle !== "all" && !p.style.toLowerCase().includes(selectedStyle.toLowerCase()))
        return false;
      if (
        selectedLocation !== "all" &&
        !p.location.toLowerCase().includes(selectedLocation.toLowerCase())
      )
        return false;
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchCode = p.code.toLowerCase().includes(q);
        const matchLoc = p.location.toLowerCase().includes(q);
        const matchMat = p.materials.toLowerCase().includes(q);
        if (!matchTitle && !matchCode && !matchLoc && !matchMat) return false;
      }
      return true;
    });
  }, [selectedCategory, selectedStyle, selectedLocation, searchQuery]);

  // Estimator calculation logic
  const estimatedCost = useMemo(() => {
    let baseRatePerM2 = 4200000; // Base VND per m²
    if (estType === "penthouse") baseRatePerM2 = 5000000;
    if (estType === "villa") baseRatePerM2 = 5800000;
    if (estType === "resort") baseRatePerM2 = 4800000;
    if (estType === "townhouse") baseRatePerM2 = 3800000;

    let matMultiplier = 1.0;
    if (estMaterial === "walnut") matMultiplier = 1.35;
    if (estMaterial === "teak") matMultiplier = 1.55;

    let scopeMultiplier = 1.0;
    if (estScope === "woodOnly") scopeMultiplier = 0.65;
    if (estScope === "renovate") scopeMultiplier = 0.85;

    const totalEstimate = estArea * baseRatePerM2 * matMultiplier * scopeMultiplier;
    const minEstimate = Math.round(totalEstimate * 0.95);
    const maxEstimate = Math.round(totalEstimate * 1.15);

    return {
      min: minEstimate.toLocaleString("vi-VN"),
      max: maxEstimate.toLocaleString("vi-VN"),
      fabDays: Math.round(35 + (estArea / 100) * 10),
      installDays: Math.round(15 + (estArea / 100) * 5),
    };
  }, [estType, estArea, estMaterial, estScope]);

  const handleOpenProject = (p: Project) => {
    setActiveProject(p);
    setActiveGalleryIndex(0);
    setModalTab("gallery");
  };

  return (
    <>
      <Header onOpenConsultation={() => setIsConsultationOpen(true)} />

      <main className="min-h-screen bg-surface-container-lowest text-primary">
        {/* BREADCRUMB */}
        <nav
          aria-label="Breadcrumb"
          className="border-b border-outline-variant/40 bg-surface-container-low/40 py-3"
        >
          <div className="max-w-7xl mx-auto px-space-md sm:px-space-lg lg:px-margin text-xs flex items-center gap-2 text-outline">
            <Link href="/" className="hover:text-primary transition-colors">
              {t.breadcrumbHome}
            </Link>
            <span>/</span>
            <span className="text-primary font-medium">{t.breadcrumbCurrent}</span>
          </div>
        </nav>

        {/* HERO SECTION */}
        <section className="relative border-b border-outline-variant/40 bg-surface-container-lowest overflow-hidden">
          {/* Subtle architectural grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          <div className="max-w-7xl mx-auto px-space-md sm:px-space-lg lg:px-margin py-space-xl lg:py-space-2xl relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-block w-8 h-[2px] bg-primary"></span>
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest text-xs font-semibold">
                {t.heroTag}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-10">
              <div className="lg:col-span-8">
                <h1 className="font-headline text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-primary uppercase leading-[1.1] mb-5">
                  {t.heroTitle}
                </h1>
                <p className="font-body text-on-surface-variant max-w-3xl text-sm sm:text-base lg:text-lg leading-relaxed font-light">
                  {t.heroDesc}
                </p>

                <div className="flex flex-wrap items-center gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsConsultationOpen(true)}
                    className="px-6 py-3.5 bg-primary text-on-primary text-xs uppercase font-bold tracking-wider hover:bg-[#27272a] transition-all flex items-center gap-2 shadow-sm"
                  >
                    <span>{t.heroCtaConsult}</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                  <a
                    href="#du-toan-kien-truc"
                    className="px-6 py-3.5 bg-surface-container border border-outline-variant hover:border-primary text-primary text-xs uppercase font-bold tracking-wider transition-all flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">calculate</span>
                    <span>{t.heroCtaEstimate}</span>
                  </a>
                </div>
              </div>

              {/* Architectural Metrics */}
              <div className="lg:col-span-4 grid grid-cols-2 gap-4 border-t lg:border-t-0 lg:border-l border-outline-variant/50 pt-6 lg:pt-0 lg:pl-8">
                <div className="p-4 bg-surface-container-low border border-outline-variant/40">
                  <strong className="font-headline text-2xl lg:text-4xl text-primary font-bold block mb-1">
                    52+
                  </strong>
                  <span className="text-[11px] text-outline uppercase tracking-wider block font-medium">
                    {t.metric1}
                  </span>
                </div>
                <div className="p-4 bg-surface-container-low border border-outline-variant/40">
                  <strong className="font-headline text-2xl lg:text-4xl text-primary font-bold block mb-1">
                    100%
                  </strong>
                  <span className="text-[11px] text-outline uppercase tracking-wider block font-medium">
                    {t.metric2}
                  </span>
                </div>
                <div className="p-4 bg-surface-container-low border border-outline-variant/40">
                  <strong className="font-headline text-2xl lg:text-4xl text-primary font-bold block mb-1">
                    {t.metric3Val}
                  </strong>
                  <span className="text-[11px] text-outline uppercase tracking-wider block font-medium">
                    {t.metric3}
                  </span>
                </div>
                <div className="p-4 bg-surface-container-low border border-outline-variant/40">
                  <strong className="font-headline text-2xl lg:text-4xl text-primary font-bold block mb-1">
                    {t.metric4Val}
                  </strong>
                  <span className="text-[11px] text-outline uppercase tracking-wider block font-medium">
                    {t.metric4}
                  </span>
                </div>
              </div>
            </div>

            {/* FEATURED SPOTLIGHT SHOWCASE */}
            <div className="border border-outline-variant/60 bg-surface-container-low p-4 sm:p-6 lg:p-8 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-7 relative aspect-[16/10] bg-surface-container overflow-hidden group">
                  <Image
                    src="/images/portfolio-1.jpg"
                    alt="Villa An Nhiên Thảo Điền"
                    fill
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-primary text-on-primary px-3 py-1 text-[11px] uppercase font-bold tracking-wider">
                    {t.spotlightTag}
                  </div>
                  <div className="absolute bottom-4 left-4 bg-black/75 backdrop-blur-sm text-white px-3 py-1 font-mono text-xs">
                    {t.spotlightCode}
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-4">
                  <div className="flex items-center gap-2 text-xs text-outline font-mono">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    <span>Thảo Điền, TP. Hồ Chí Minh • 620 m²</span>
                  </div>
                  <h2 className="font-headline text-2xl sm:text-3xl font-bold text-primary">
                    {t.spotlightTitle}
                  </h2>
                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed font-light">
                    {t.spotlightDesc}
                  </p>

                  <div className="grid grid-cols-2 gap-3 py-3 border-y border-outline-variant/40 text-xs">
                    <div>
                      <span className="text-outline uppercase text-[10px] block">Phong cách</span>
                      <strong className="text-primary font-semibold">Japandi Modern</strong>
                    </div>
                    <div>
                      <span className="text-outline uppercase text-[10px] block">Vật liệu chủ đạo</span>
                      <strong className="text-primary font-semibold">Gỗ Teak & Bazan Núi</strong>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => handleOpenProject(projects[0])}
                      className="w-full sm:w-auto px-6 py-3 bg-primary text-on-primary text-xs uppercase font-bold tracking-wider hover:bg-[#27272a] transition-all flex items-center justify-center gap-2"
                    >
                      <span>{t.spotlightBtn}</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FILTER & CONTROLS TOOLBAR */}
        <section className="sticky top-0 z-30 bg-surface-container-lowest/95 backdrop-blur-md border-b border-outline-variant/50 py-3 shadow-xs">
          <div className="max-w-7xl mx-auto px-space-md sm:px-space-lg lg:px-margin">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Category tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
                {[
                  { id: "all", label: t.tabAll },
                  { id: "villa", label: t.tabVilla },
                  { id: "penthouse", label: t.tabPenthouse },
                  { id: "resort", label: t.tabResort },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSelectedCategory(tab.id)}
                    className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-all border ${
                      selectedCategory === tab.id
                        ? "bg-primary text-on-primary border-primary shadow-xs"
                        : "bg-surface-container-low text-primary border-outline-variant/60 hover:border-primary"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search & Style Filters */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                {/* Search input */}
                <div className="relative flex-1 sm:w-64">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.searchPlaceholder}
                    className="w-full bg-surface-container-low text-primary placeholder:text-outline text-xs px-3 py-2 pl-8 border border-outline-variant/60 focus:outline-hidden focus:border-primary transition-colors"
                  />
                  <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline text-sm">
                    search
                  </span>
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-outline hover:text-primary"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  )}
                </div>

                {/* Style selector */}
                <select
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  className="bg-surface-container-low text-primary text-xs px-3 py-2 border border-outline-variant/60 focus:outline-hidden focus:border-primary uppercase tracking-wider font-medium"
                >
                  <option value="all">{t.styleAll}</option>
                  <option value="japandi">Japandi Modern</option>
                  <option value="wabi-sabi">Wabi-Sabi Tối Giản</option>
                  <option value="brutalist">Brutalist Wood</option>
                  <option value="zen">Contemporary Zen</option>
                </select>

                {/* Location selector */}
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="bg-surface-container-low text-primary text-xs px-3 py-2 border border-outline-variant/60 focus:outline-hidden focus:border-primary uppercase tracking-wider font-medium"
                >
                  <option value="all">{t.locationAll}</option>
                  <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="Lâm Đồng">Đà Lạt (Lâm Đồng)</option>
                  <option value="Khánh Hòa">Cam Ranh (Khánh Hòa)</option>
                  <option value="Quảng Ninh">Quảng Ninh</option>
                </select>

                {/* View toggle */}
                <div className="hidden sm:flex items-center border border-outline-variant/60 bg-surface-container-low">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    title={t.gridMode}
                    className={`p-2 transition-colors ${
                      viewMode === "grid" ? "bg-primary text-on-primary" : "text-outline hover:text-primary"
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm block">grid_view</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    title={t.listMode}
                    className={`p-2 transition-colors ${
                      viewMode === "list" ? "bg-primary text-on-primary" : "text-outline hover:text-primary"
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm block">view_list</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section className="max-w-7xl mx-auto px-space-md sm:px-space-lg lg:px-margin py-space-xl">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-outline-variant/80 p-8 bg-surface-container-low">
              <span className="material-symbols-outlined text-5xl text-outline mb-3 block">
                search_off
              </span>
              <h3 className="font-headline text-lg font-bold text-primary mb-1">
                Không tìm thấy dự án phù hợp
              </h3>
              <p className="text-xs text-on-surface-variant max-w-md mx-auto mb-4">
                Vui lòng thử điều chỉnh lại bộ lọc phong cách, địa điểm hoặc từ khóa tìm kiếm.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedStyle("all");
                  setSelectedLocation("all");
                  setSearchQuery("");
                }}
                className="px-4 py-2 bg-primary text-on-primary text-xs uppercase font-bold"
              >
                Đặt lại tất cả bộ lọc
              </button>
            </div>
          ) : viewMode === "grid" ? (
            /* GRID VIEW */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
              {filteredProjects.map((p) => (
                <article
                  key={p.id}
                  className={`${
                    p.spanCol || "lg:col-span-6"
                  } bg-surface-container-lowest border border-outline-variant flex flex-col justify-between group hover:border-primary transition-all duration-300 shadow-xs hover:shadow-md`}
                >
                  <div>
                    {/* Media container */}
                    <div
                      className="relative aspect-[16/10] bg-surface-container overflow-hidden cursor-pointer"
                      onClick={() => handleOpenProject(p)}
                    >
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <span className="text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 bg-black/60 backdrop-blur-xs px-3 py-1.5">
                          <span className="material-symbols-outlined text-sm">visibility</span>
                          <span>{t.viewDossierBtn}</span>
                        </span>
                      </div>

                      {/* Tag badges */}
                      <div className="absolute top-3 left-3 bg-primary text-on-primary px-3 py-1 font-label-sm text-[11px] uppercase font-bold tracking-wider">
                        {p.tag}
                      </div>

                      <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur-xs px-2.5 py-1 text-[11px] font-mono text-primary font-semibold border border-outline-variant/40 flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">photo_camera</span>
                        <span>{p.gallery.length}</span>
                      </div>

                      <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-xs px-2.5 py-1 text-[11px] text-white font-medium flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs text-[#a1a1aa]">
                          location_on
                        </span>
                        <span>{p.location}</span>
                      </div>
                    </div>

                    {/* Content area */}
                    <div className="p-5 sm:p-6 space-y-4">
                      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-outline-variant/40 pb-3">
                        <h3
                          className="font-headline text-xl sm:text-2xl text-primary font-bold hover:underline cursor-pointer"
                          onClick={() => handleOpenProject(p)}
                        >
                          {p.title}
                        </h3>
                        <span className="font-mono text-xs text-outline font-semibold">
                          {p.code}
                        </span>
                      </div>

                      {/* Spec Badges Grid */}
                      <div className="grid grid-cols-3 gap-2 text-xs py-2 bg-surface-container-low p-3 border border-outline-variant/40">
                        <div>
                          <span className="text-outline uppercase block text-[10px] font-medium">
                            {t.areaLabel}
                          </span>
                          <strong className="text-primary font-semibold">{p.area}</strong>
                        </div>
                        <div>
                          <span className="text-outline uppercase block text-[10px] font-medium">
                            {t.styleLabel}
                          </span>
                          <strong className="text-primary font-semibold truncate block">
                            {p.style}
                          </strong>
                        </div>
                        <div>
                          <span className="text-outline uppercase block text-[10px] font-medium">
                            {t.materialLabel}
                          </span>
                          <strong className="text-primary font-semibold truncate block">
                            {p.materials}
                          </strong>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed line-clamp-2 font-light">
                        {p.desc}
                      </p>

                      <div className="text-[11px] text-outline flex items-center gap-1.5 font-medium pt-1">
                        <span className="material-symbols-outlined text-sm text-primary">
                          verified
                        </span>
                        <span>{p.highlight}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card footer */}
                  <div className="p-5 sm:p-6 pt-0 border-t border-outline-variant/30 flex items-center justify-between text-xs mt-3">
                    <button
                      type="button"
                      onClick={() => handleOpenProject(p)}
                      className="font-bold text-primary hover:underline flex items-center gap-1.5 uppercase tracking-wider text-xs"
                    >
                      <span>{t.viewDossierBtn}</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                    <span className="text-outline uppercase font-mono text-[11px]">
                      Hoàn thành {p.year}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            /* TECHNICAL LIST VIEW */
            <div className="space-y-4">
              {filteredProjects.map((p) => (
                <div
                  key={p.id}
                  className="bg-surface-container-lowest border border-outline-variant p-4 sm:p-6 hover:border-primary transition-all flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between group"
                >
                  <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center w-full lg:w-auto">
                    <div
                      className="relative w-full sm:w-48 aspect-[16/10] bg-surface-container overflow-hidden shrink-0 cursor-pointer"
                      onClick={() => handleOpenProject(p)}
                    >
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 left-2 bg-primary text-on-primary px-2 py-0.5 text-[9px] uppercase font-bold">
                        {p.code}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-surface-container text-secondary px-2 py-0.5 uppercase font-bold tracking-wider">
                          {p.tag}
                        </span>
                        <span className="text-xs text-outline">{p.location}</span>
                      </div>
                      <h3
                        className="font-headline text-lg sm:text-xl font-bold text-primary hover:underline cursor-pointer"
                        onClick={() => handleOpenProject(p)}
                      >
                        {p.title}
                      </h3>
                      <p className="text-xs text-on-surface-variant max-w-xl line-clamp-2">
                        {p.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 border-outline-variant/40 pt-3 lg:pt-0">
                    <div className="text-left lg:text-right text-xs">
                      <span className="text-outline uppercase text-[10px] block">Quy mô</span>
                      <strong className="text-primary font-semibold">{p.area}</strong>
                    </div>
                    <div className="text-left lg:text-right text-xs">
                      <span className="text-outline uppercase text-[10px] block">Vật liệu</span>
                      <strong className="text-primary font-semibold">{p.materials}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenProject(p)}
                      className="px-4 py-2 bg-primary text-on-primary text-xs uppercase font-bold hover:bg-[#27272a] transition-all flex items-center gap-1"
                    >
                      <span>{t.viewDossierBtn}</span>
                      <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* INTERACTIVE BEFORE / AFTER TRANSFORMATION SLIDER */}
        <section className="bg-surface-container-low border-y border-outline-variant/40 py-space-2xl">
          <div className="max-w-7xl mx-auto px-space-md sm:px-space-lg lg:px-margin">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="text-label-sm font-label-sm text-secondary uppercase tracking-widest text-xs block mb-2 font-semibold">
                CHẾ TÁC MỘC BẢN THỰC ĐỊA
              </span>
              <h2 className="text-headline font-headline text-2xl sm:text-4xl text-primary font-bold uppercase mb-3">
                {t.sliderTitle}
              </h2>
              <p className="text-xs sm:text-sm text-on-surface-variant font-light">
                {t.sliderSub}
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="relative aspect-[16/9] w-full select-none overflow-hidden border border-outline-variant/60 shadow-lg bg-surface-container">
                {/* AFTER image (Full background) */}
                <Image
                  src="/images/portfolio-1.jpg"
                  alt="Sau khi hoàn thiện mộc"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-4 right-4 bg-primary/80 backdrop-blur-xs text-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wider">
                  {t.sliderAfter}
                </div>

                {/* BEFORE image (Clipped with sliderPosition) */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${sliderPosition}%` }}
                >
                  <div className="relative w-full h-full min-w-[700px] sm:min-w-[900px]">
                    <Image
                      src="/images/curated-1.jpg"
                      alt="Hiện trạng trước khi thi công"
                      fill
                      className="object-cover grayscale contrast-125"
                    />
                  </div>
                  <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-xs text-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wider">
                    {t.sliderBefore}
                  </div>
                </div>

                {/* Slider bar & handle */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl cursor-ew-resize flex items-center justify-center -translate-x-1/2"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="w-8 h-8 rounded-full bg-primary text-white border-2 border-white flex items-center justify-center shadow-lg">
                    <span className="material-symbols-outlined text-sm">unfold_more</span>
                  </div>
                </div>

                {/* Native Range input overlaid for smooth touch/drag */}
                <input
                  type="range"
                  min="5"
                  max="95"
                  value={sliderPosition}
                  onChange={(e) => setSliderPosition(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                  aria-label="So sánh trước và sau thi công"
                />
              </div>

              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-outline">
                <span className="material-symbols-outlined text-sm">swipe</span>
                <span>{t.sliderDragHint}</span>
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE ARCHITECTURAL BUDGET ESTIMATOR */}
        <section
          id="du-toan-kien-truc"
          className="border-b border-outline-variant/40 bg-surface-container-lowest py-space-2xl"
        >
          <div className="max-w-7xl mx-auto px-space-md sm:px-space-lg lg:px-margin">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <span className="text-label-sm font-label-sm text-secondary uppercase tracking-widest text-xs block mb-2 font-semibold">
                {t.estimatorTag}
              </span>
              <h2 className="text-headline font-headline text-2xl sm:text-4xl text-primary font-bold uppercase mb-3">
                {t.estimatorTitle}
              </h2>
              <p className="text-xs sm:text-sm text-on-surface-variant font-light">
                {t.estimatorDesc}
              </p>
            </div>

            <div className="max-w-5xl mx-auto bg-surface-container-low border border-outline-variant p-6 sm:p-10 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Inputs column */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Step 1: Typology */}
                  <div>
                    <label className="text-xs uppercase font-bold text-primary block mb-2">
                      {t.stepTypeLabel}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: "villa", label: t.typeVilla, icon: "villa" },
                        { id: "penthouse", label: t.typePenthouse, icon: "apartment" },
                        { id: "townhouse", label: t.typeTownhouse, icon: "home" },
                        { id: "resort", label: t.typeResort, icon: "hotel" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setEstType(item.id)}
                          className={`p-3 text-center border text-xs font-semibold uppercase transition-all ${
                            estType === item.id
                              ? "bg-primary text-on-primary border-primary shadow-xs"
                              : "bg-surface-container-lowest text-primary border-outline-variant/70 hover:border-primary"
                          }`}
                        >
                          <span className="material-symbols-outlined text-lg block mb-1">
                            {item.icon}
                          </span>
                          <span className="text-[11px] leading-tight block">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 2: Area slider */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs uppercase font-bold text-primary">
                        {t.stepAreaLabel}
                      </label>
                      <span className="font-headline font-bold text-lg text-primary">
                        {estArea} m²
                      </span>
                    </div>
                    <input
                      type="range"
                      min="80"
                      max="1000"
                      step="10"
                      value={estArea}
                      onChange={(e) => setEstArea(Number(e.target.value))}
                      className="w-full accent-primary h-2 bg-surface-container rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-outline mt-1 font-mono">
                      <span>80 m²</span>
                      <span>350 m²</span>
                      <span>600 m²</span>
                      <span>1,000 m²</span>
                    </div>
                  </div>

                  {/* Step 3: Material selection */}
                  <div>
                    <label className="text-xs uppercase font-bold text-primary block mb-2">
                      {t.stepMaterialLabel}
                    </label>
                    <div className="space-y-2">
                      {[
                        {
                          id: "oak",
                          title: t.matOak,
                          sub: "Sồi sấy chân không, độ ẩm 8-11%, phủ dầu Osmo Đức",
                        },
                        {
                          id: "walnut",
                          title: t.matWalnut,
                          sub: "Óc chó Bắc Mỹ FAS tuyển chọn vân núi, mộng xuyên thấu",
                        },
                        {
                          id: "teak",
                          title: t.matTeak,
                          sub: "Teak Miến Điện kháng ẩm 100%, vách lam xoay & ngoại thất",
                        },
                      ].map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setEstMaterial(item.id)}
                          className={`p-3 border text-xs cursor-pointer transition-all flex items-start gap-3 ${
                            estMaterial === item.id
                              ? "bg-surface-container-lowest border-primary shadow-xs ring-1 ring-primary"
                              : "bg-surface-container-lowest border-outline-variant/60 hover:border-primary"
                          }`}
                        >
                          <input
                            type="radio"
                            name="estMaterial"
                            checked={estMaterial === item.id}
                            onChange={() => setEstMaterial(item.id)}
                            className="mt-0.5 accent-primary"
                          />
                          <div>
                            <strong className="text-primary font-bold block">{item.title}</strong>
                            <span className="text-on-surface-variant text-[11px] font-light">
                              {item.sub}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Step 4: Execution Scope */}
                  <div>
                    <label className="text-xs uppercase font-bold text-primary block mb-2">
                      {t.stepScopeLabel}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        { id: "full", label: t.scopeFull },
                        { id: "woodOnly", label: t.scopeWoodOnly },
                        { id: "renovate", label: t.scopeRenovate },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setEstScope(item.id)}
                          className={`p-2.5 text-center border text-[11px] font-semibold uppercase transition-all ${
                            estScope === item.id
                              ? "bg-primary text-on-primary border-primary"
                              : "bg-surface-container-lowest text-primary border-outline-variant/70 hover:border-primary"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Calculation Output column */}
                <div className="lg:col-span-5 bg-surface-container-lowest border border-outline-variant p-6 sm:p-8 space-y-6">
                  <div className="border-b border-outline-variant/40 pb-4">
                    <span className="text-[10px] text-outline uppercase font-mono tracking-wider block mb-1">
                      KẾT QUẢ DỰ TOÁN BÓC TÁCH
                    </span>
                    <h3 className="font-headline text-xs uppercase font-bold text-secondary">
                      {t.estResultTitle}
                    </h3>
                    <div className="mt-3">
                      <div className="text-2xl sm:text-3xl font-headline font-bold text-primary tracking-tight">
                        {estimatedCost.min} — {estimatedCost.max}{" "}
                        <span className="text-sm font-normal text-outline">VNĐ</span>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Estimates */}
                  <div className="space-y-3 text-xs py-1">
                    <div className="flex items-center justify-between border-b border-outline-variant/30 pb-2">
                      <span className="text-outline">{t.estFabTime}</span>
                      <strong className="text-primary font-semibold">
                        ~{estimatedCost.fabDays} Ngày làm việc
                      </strong>
                    </div>
                    <div className="flex items-center justify-between border-b border-outline-variant/30 pb-2">
                      <span className="text-outline">{t.estInstallTime}</span>
                      <strong className="text-primary font-semibold">
                        ~{estimatedCost.installDays} Ngày hoàn thiện
                      </strong>
                    </div>
                  </div>

                  <p className="text-[11px] text-on-surface-variant leading-relaxed bg-surface-container-low p-3 border border-outline-variant/40 font-light">
                    {t.estIncluded}
                  </p>

                  <button
                    type="button"
                    onClick={() => setIsConsultationOpen(true)}
                    className="w-full py-3.5 bg-primary text-on-primary text-xs uppercase font-bold tracking-wider hover:bg-[#27272a] transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>{t.estCta}</span>
                    <span className="material-symbols-outlined text-sm">send</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5-STEP WORKFLOW SECTION */}
        <section className="bg-surface-container-low border-b border-outline-variant/40 py-space-2xl">
          <div className="max-w-7xl mx-auto px-space-md sm:px-space-lg lg:px-margin">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-label-sm font-label-sm text-secondary uppercase tracking-widest text-xs block mb-1 font-semibold">
                {t.workflowTag}
              </span>
              <h2 className="text-headline font-headline text-2xl sm:text-3xl text-primary font-bold uppercase">
                {t.workflowTitle}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { step: "01", title: t.step1Title, desc: t.step1Desc },
                { step: "02", title: t.step2Title, desc: t.step2Desc },
                { step: "03", title: t.step3Title, desc: t.step3Desc },
                { step: "04", title: t.step4Title, desc: t.step4Desc },
                { step: "05", title: t.step5Title, desc: t.step5Desc },
              ].map((item) => (
                <div
                  key={item.step}
                  className="p-5 bg-surface-container-lowest border border-outline-variant hover:border-primary transition-colors space-y-2 flex flex-col justify-between"
                >
                  <div>
                    <span className="font-mono text-2xl font-bold text-primary block mb-2">
                      {item.step}
                    </span>
                    <h4 className="font-headline text-sm text-primary font-bold mb-2">
                      {item.title}
                    </h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed font-light">
                      {item.desc}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-outline-variant/30 text-[10px] text-outline uppercase font-mono">
                    Tiêu chuẩn Komorebi
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section className="bg-surface-container-lowest border-b border-outline-variant/40 py-space-2xl">
          <div className="max-w-7xl mx-auto px-space-md sm:px-space-lg lg:px-margin">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-label-sm font-label-sm text-secondary uppercase tracking-widest text-xs block mb-1 font-semibold">
                {t.testimonialsTag}
              </span>
              <h2 className="text-headline font-headline text-2xl sm:text-3xl text-primary font-bold uppercase">
                {t.testimonialsTitle}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-surface-container-low border border-outline-variant space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <span className="material-symbols-outlined text-3xl text-outline block">
                      format_quote
                    </span>
                    <p className="text-xs sm:text-sm text-on-surface-variant italic leading-relaxed font-light">
                      “{item.quote}”
                    </p>
                  </div>

                  <div className="pt-4 border-t border-outline-variant/40 space-y-1">
                    <strong className="text-primary text-sm font-bold block">{item.name}</strong>
                    <span className="text-[11px] text-outline block">{item.role}</span>
                    <span className="text-[10px] text-secondary font-mono block pt-1">
                      {item.project}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="bg-primary text-on-primary py-space-2xl">
          <div className="max-w-5xl mx-auto px-space-md sm:px-space-lg lg:px-margin text-center space-y-6">
            <h2 className="font-headline text-2xl sm:text-4xl font-bold uppercase tracking-tight text-white">
              {t.ctaBannerTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#e4e4e7] max-w-2xl mx-auto font-light leading-relaxed">
              {t.ctaBannerDesc}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => setIsConsultationOpen(true)}
                className="px-8 py-3.5 bg-white text-[#09090b] text-xs uppercase font-bold tracking-wider hover:bg-[#e4e4e7] transition-all flex items-center gap-2"
              >
                <span>{t.ctaBookSurvey}</span>
                <span className="material-symbols-outlined text-sm">calendar_month</span>
              </button>
              <a
                href="tel:0909888999"
                className="px-8 py-3.5 border border-white/40 text-white text-xs uppercase font-bold tracking-wider hover:bg-white/10 transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">phone</span>
                <span>{t.ctaCallNow}</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* FULL ARCHITECTURAL DOSSIER MODAL */}
      {activeProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-surface-container-lowest border border-outline text-primary max-w-5xl w-full max-h-[94vh] overflow-y-auto shadow-2xl relative rounded-none flex flex-col">
            {/* Modal Header */}
            <div className="sticky top-0 bg-surface-container-lowest z-20 flex items-center justify-between px-5 py-4 border-b border-outline-variant">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold bg-primary text-on-primary px-2.5 py-1">
                  {activeProject.code}
                </span>
                <div>
                  <h3 className="font-headline text-base sm:text-lg font-bold text-primary">
                    {activeProject.title}
                  </h3>
                  <span className="text-[11px] text-outline">
                    {activeProject.location} • {activeProject.area} • {activeProject.year}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveProject(null)}
                className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container text-outline hover:text-primary transition-colors"
                aria-label={t.modalClose}
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="bg-surface-container-low px-5 border-b border-outline-variant flex items-center gap-4 text-xs font-semibold uppercase tracking-wider">
              <button
                type="button"
                onClick={() => setModalTab("gallery")}
                className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                  modalTab === "gallery"
                    ? "border-primary text-primary font-bold"
                    : "border-transparent text-outline hover:text-primary"
                }`}
              >
                <span className="material-symbols-outlined text-sm">photo_library</span>
                <span>{t.modalTabGallery}</span>
              </button>
              <button
                type="button"
                onClick={() => setModalTab("beforeAfter")}
                className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                  modalTab === "beforeAfter"
                    ? "border-primary text-primary font-bold"
                    : "border-transparent text-outline hover:text-primary"
                }`}
              >
                <span className="material-symbols-outlined text-sm">compare</span>
                <span>{t.modalTabBeforeAfter}</span>
              </button>
              <button
                type="button"
                onClick={() => setModalTab("specs")}
                className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                  modalTab === "specs"
                    ? "border-primary text-primary font-bold"
                    : "border-transparent text-outline hover:text-primary"
                }`}
              >
                <span className="material-symbols-outlined text-sm">architecture</span>
                <span>{t.modalTabSpecs}</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-8 space-y-8">
              {modalTab === "gallery" && (
                <div className="space-y-4">
                  {/* Main active photo */}
                  <div className="relative aspect-[16/10] bg-surface-container overflow-hidden border border-outline-variant/60">
                    <Image
                      src={activeProject.gallery[activeGalleryIndex] || activeProject.image}
                      alt={activeProject.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 font-mono">
                      {activeGalleryIndex + 1} / {activeProject.gallery.length}
                    </div>
                  </div>

                  {/* Thumbnails list */}
                  <div className="grid grid-cols-4 gap-3">
                    {activeProject.gallery.map((imgUrl, i) => (
                      <div
                        key={i}
                        onClick={() => setActiveGalleryIndex(i)}
                        className={`relative aspect-[16/10] bg-surface-container cursor-pointer border-2 transition-all overflow-hidden ${
                          activeGalleryIndex === i
                            ? "border-primary scale-102"
                            : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={imgUrl}
                          alt={`${activeProject.title} thumb ${i + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {modalTab === "beforeAfter" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <span className="text-xs uppercase font-bold text-outline block">
                        Hiện trạng trước cải tạo
                      </span>
                      <div className="relative aspect-[16/10] bg-surface-container border border-outline-variant/60 overflow-hidden">
                        <Image
                          src={activeProject.beforeImage}
                          alt="Hiện trạng trước khi thi công"
                          fill
                          className="object-cover grayscale contrast-125"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <span className="text-xs uppercase font-bold text-primary block">
                        Bàn giao mộc hoàn thiện
                      </span>
                      <div className="relative aspect-[16/10] bg-surface-container border border-outline-variant/60 overflow-hidden">
                        <Image
                          src={activeProject.afterImage}
                          alt="Sau khi hoàn thiện mộc"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed italic bg-surface-container-low p-3">
                    Mọi chi tiết liên kết mộng mộc đều được khảo sát bằng máy quét 3D laser trước khi lắp đặt, đảm bảo khe hở hoàn thiện sai số tuyệt đối dưới 1mm.
                  </p>
                </div>
              )}

              {modalTab === "specs" && (
                <div className="space-y-6">
                  {/* Technical Table */}
                  <div className="border border-outline-variant overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <tbody>
                        <tr className="border-b border-outline-variant/50 bg-surface-container-low">
                          <th className="p-3 font-semibold text-outline w-1/3">Mã công trình</th>
                          <td className="p-3 font-mono font-bold text-primary">{activeProject.code}</td>
                        </tr>
                        <tr className="border-b border-outline-variant/50">
                          <th className="p-3 font-semibold text-outline">Địa điểm</th>
                          <td className="p-3 text-primary">{activeProject.location}</td>
                        </tr>
                        <tr className="border-b border-outline-variant/50 bg-surface-container-low">
                          <th className="p-3 font-semibold text-outline">Diện tích sàn</th>
                          <td className="p-3 font-bold text-primary">{activeProject.area}</td>
                        </tr>
                        <tr className="border-b border-outline-variant/50">
                          <th className="p-3 font-semibold text-outline">KTS Chủ trì & Xưởng</th>
                          <td className="p-3 text-primary">{activeProject.architect}</td>
                        </tr>
                        <tr className="border-b border-outline-variant/50 bg-surface-container-low">
                          <th className="p-3 font-semibold text-outline">Chủng loại phôi mộc</th>
                          <td className="p-3 font-bold text-primary">{activeProject.materials}</td>
                        </tr>
                        <tr className="border-b border-outline-variant/50">
                          <th className="p-3 font-semibold text-outline">Xử lý hoàn thiện bề mặt</th>
                          <td className="p-3 text-primary">{activeProject.finishing}</td>
                        </tr>
                        <tr className="bg-surface-container-low">
                          <th className="p-3 font-semibold text-outline">Thời gian chế tác & thi công</th>
                          <td className="p-3 text-primary">{activeProject.duration}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Highlights list */}
                  <div className="space-y-3">
                    <h4 className="text-xs uppercase font-bold text-primary">
                      {t.modalFeaturesTitle}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {activeProject.features.map((feat, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 p-2.5 bg-surface-container-low border border-outline-variant/40 text-xs"
                        >
                          <span className="material-symbols-outlined text-sm text-primary">
                            check_circle
                          </span>
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Concept & Narrative */}
              <div className="space-y-3 border-t border-outline-variant/40 pt-6">
                <h4 className="font-headline text-base font-bold text-primary">
                  {t.modalConceptTitle}
                </h4>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed font-light">
                  {activeProject.concept}
                </p>
              </div>

              {/* Action Buttons in Modal */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-outline-variant/40">
                <button
                  type="button"
                  onClick={() => {
                    setActiveProject(null);
                    setIsConsultationOpen(true);
                  }}
                  className="px-6 py-3 bg-primary text-on-primary text-xs uppercase font-bold tracking-wider hover:bg-[#27272a] transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  <span>{t.modalRequestBtn}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveProject(null);
                    setIsConsultationOpen(true);
                  }}
                  className="px-6 py-3 bg-surface-container border border-outline-variant hover:border-primary text-primary text-xs uppercase font-bold tracking-wider transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">calendar_month</span>
                  <span>{t.modalLaserSurveyBtn}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />

      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />
    </>
  );
}
