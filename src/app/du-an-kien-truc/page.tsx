"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ConsultationModal from "@/components/ConsultationModal";

interface Project {
  id: string;
  code: string;
  title: string;
  location: string;
  category: string;
  area: string;
  style: string;
  materials: string;
  desc: string;
  image: string;
  tag: string;
  spanCol?: string;
}

const projects: Project[] = [
  {
    id: "proj-1",
    code: "KM-V2408",
    title: "Villa An Nhiên — Thảo Điền",
    location: "TP. Hồ Chí Minh",
    category: "villa",
    area: "450 m²",
    style: "Japandi Modern",
    materials: "Gỗ Teak & Sồi",
    desc: "Dự án biệt thự hướng sông tối ưu luồng đối lưu khí tự nhiên. Hệ vách lam xoay 360 độ từ xưởng mộc Komorebi kết hợp đảo bếp đá bazan nguyên khối tạo điểm tựa thị giác vững chãi.",
    image: "/images/portfolio-1.jpg",
    tag: "VILLA SINH THÁI",
    spanCol: "lg:col-span-8",
  },
  {
    id: "proj-2",
    code: "KM-P2411",
    title: "Penthouse The Metropole",
    location: "Thủ Thiêm, TP. HCM",
    category: "penthouse",
    area: "280 m²",
    style: "Tối Giản Wabi-Sabi",
    materials: "Tủ mộng âm & Bàn ăn 3m",
    desc: "Loại bỏ hoàn toàn tay nắm cơ học với kỹ thuật finger-joint âm gỗ sồi hun khói, hòa nhập tuyệt đối vào vách tường phẳng.",
    image: "/images/portfolio-2.jpg",
    tag: "PENTHOUSE",
    spanCol: "lg:col-span-4",
  },
  {
    id: "proj-3",
    code: "KM-R2403",
    title: "Komorebi Retreat Đà Lạt",
    location: "Lâm Đồng",
    category: "villa",
    area: "1200 m²",
    style: "Brutalist Japanese Wood",
    materials: "Gỗ thông sấy nhiệt & Ghế Kura",
    desc: "Tận dụng độ dốc triền đồi thông, đưa toàn bộ hệ cửa lùa kính và lam gỗ mộc bao bọc lấy sương sớm và ánh nắng ban mai cao nguyên.",
    image: "/images/portfolio-3.jpg",
    tag: "RESORT & RETREAT ZEN",
    spanCol: "lg:col-span-6",
  },
  {
    id: "proj-4",
    code: "KM-D2409",
    title: "Duplex Starlake Tây Hồ",
    location: "Hà Nội",
    category: "penthouse",
    area: "360 m²",
    style: "Scandinavian Minimalist",
    materials: "Cầu thang bay & Đèn Washi 4m",
    desc: "Khoảng thông tầng 6.5m đón ánh sáng phương Bắc, vách tủ sách kiến trúc Sora cao chạm trần tạo trục đối xứng trang nhã và tôn nghiêm.",
    image: "/images/portfolio-4.jpg",
    tag: "DUPLEX THÔNG TẦNG",
    spanCol: "lg:col-span-6",
  },
];

export default function ArchitecturalPortfolioPage() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  const filteredProjects = projects.filter((p) => {
    if (selectedFilter !== "all" && p.category !== selectedFilter) return false;
    return true;
  });

  return (
    <>
      <Header onOpenConsultation={() => setIsConsultationOpen(true)} />

      <main className="min-h-screen">
        {/* HERO BANNER SECTION */}
        <section className="border-b border-outline-variant/40 bg-surface-container-lowest">
          <div className="max-w-7xl mx-auto px-space-md sm:px-space-lg lg:px-margin py-space-xl lg:py-space-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-block w-8 h-[1px] bg-primary"></span>
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest text-xs">
                Hồ Sơ Công Trình Thực Tế • Komorebi Atelier Portfolio 2024 - 2025
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
              <div className="lg:col-span-8">
                <h1 className="font-headline-lg text-2xl sm:text-4xl lg:text-5xl leading-tight text-primary uppercase font-bold tracking-tight mb-space-md">
                  Dự Án Kiến Trúc &amp; Không Gian Nội Thất Nguyên Bản
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl font-light text-sm sm:text-base leading-relaxed">
                  Nơi những bản vẽ kỹ thuật trở thành thực tại sống động. Chúng tôi kết hợp cùng các kiến trúc sư chủ trì để may đo không gian sống tĩnh tại, tối ưu luồng sáng tự nhiên và kiến tạo những hệ tủ - vách gỗ mộng âm đồng bộ từ sảnh đón đến phòng ngủ master.
                </p>
              </div>

              {/* Metrics */}
              <div className="lg:col-span-4 grid grid-cols-3 gap-4 border-t lg:border-t-0 lg:border-l border-outline-variant/40 pt-4 lg:pt-0 lg:pl-6 text-center lg:text-left">
                <div>
                  <strong className="font-headline-md text-2xl lg:text-3xl text-primary font-bold block">48+</strong>
                  <span className="text-[11px] text-outline uppercase tracking-wider">Công trình bàn giao</span>
                </div>
                <div>
                  <strong className="font-headline-md text-2xl lg:text-3xl text-primary font-bold block">100%</strong>
                  <span className="text-[11px] text-outline uppercase tracking-wider">Khảo sát 3D tận nơi</span>
                </div>
                <div>
                  <strong className="font-headline-md text-2xl lg:text-3xl text-primary font-bold block">10 Năm</strong>
                  <span className="text-[11px] text-outline uppercase tracking-wider">Bảo hành mộc</span>
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="mt-space-xl pt-space-lg border-t border-outline-variant/30 flex items-center gap-2 overflow-x-auto pb-2">
              {[
                { id: "all", label: "Tất Cả Dự Án" },
                { id: "villa", label: "Biệt Thự & Villa Nghỉ Dưỡng" },
                { id: "penthouse", label: "Penthouse & Căn Hộ Cao Cấp" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedFilter(tab.id)}
                  className={`font-label-sm text-label-sm uppercase px-4 py-2 text-xs transition-colors whitespace-nowrap ${
                    selectedFilter === tab.id
                      ? "bg-primary text-on-primary font-bold"
                      : "bg-surface-container-lowest text-on-surface border border-outline-variant/60 hover:border-primary"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* PROJECTS PORTFOLIO BENTO GRID */}
        <section className="max-w-7xl mx-auto px-space-md sm:px-space-lg lg:px-margin py-space-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {filteredProjects.map((p) => (
              <article
                key={p.id}
                className={`${p.spanCol || "lg:col-span-6"} bg-surface-container-lowest border border-outline-variant flex flex-col justify-between group hover:border-primary transition-colors`}
              >
                <div>
                  <div className="relative aspect-[16/10] bg-surface-container overflow-hidden">
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover group-hover:scale-103 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 bg-primary text-on-primary px-3 py-1 font-label-sm text-xs uppercase font-bold">
                      {p.tag}
                    </div>
                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 border border-outline-variant/40 font-label-sm text-xs text-primary font-medium">
                      {p.location}
                    </div>
                  </div>

                  <div className="p-space-lg space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-outline-variant/30 pb-3">
                      <h3 className="font-headline-md text-xl sm:text-2xl text-primary font-bold">
                        {p.title}
                      </h3>
                      <span className="font-label-sm text-xs text-outline uppercase">{p.code}</span>
                    </div>

                    {/* Spec Table */}
                    <div className="grid grid-cols-3 gap-2 text-xs py-1 bg-surface-container-low p-3 border border-outline-variant/40">
                      <div>
                        <span className="text-outline uppercase block text-[10px]">Diện tích</span>
                        <strong className="text-primary font-semibold">{p.area}</strong>
                      </div>
                      <div>
                        <span className="text-outline uppercase block text-[10px]">Phong cách</span>
                        <strong className="text-primary font-semibold">{p.style}</strong>
                      </div>
                      <div>
                        <span className="text-outline uppercase block text-[10px]">Vật liệu</span>
                        <strong className="text-primary font-semibold">{p.materials}</strong>
                      </div>
                    </div>

                    <p className="text-body-sm text-on-surface-variant text-xs sm:text-sm leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </div>

                <div className="p-space-lg pt-0 border-t border-outline-variant/30 flex items-center justify-between text-xs mt-2">
                  <button
                    type="button"
                    onClick={() => setIsConsultationOpen(true)}
                    className="font-semibold text-primary hover:underline flex items-center gap-1 uppercase tracking-wider"
                  >
                    <span>Yêu cầu hồ sơ bản vẽ công trình này</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                  <span className="text-outline uppercase font-mono">Bản quyền KTS Komorebi</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* WORKFLOW COLLABORATION BANNER */}
        <section className="bg-surface-container-low border-t border-outline-variant/40 py-space-2xl">
          <div className="max-w-7xl mx-auto px-space-md sm:px-space-lg lg:px-margin">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-label-sm font-label-sm text-outline uppercase tracking-widest text-xs block mb-1">
                QUY TRÌNH HỢP TÁC B2B &amp; KHÁCH HÀNG CAO CẤP
              </span>
              <h2 className="text-headline-md font-headline-md text-2xl sm:text-3xl text-primary font-bold">
                Quy Trình Triển Khai Mộc Bản Cho Công Trình
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: "01",
                  title: "Tiếp Nhận Hồ Sơ Bản Vẽ",
                  desc: "KTS Komorebi phân tích bản vẽ CAD/3D và đề xuất chủng loại gỗ, độ dày mặt phôi và phương án giấu ngàm.",
                },
                {
                  step: "02",
                  title: "Khảo Sát Hiện Trạng 3D",
                  desc: "Đo laser độ nghiêng tường, vi khí hậu độ ẩm sàn và lối vận chuyển hàng cồng kềnh trước khi xuất phôi.",
                },
                {
                  step: "03",
                  title: "Gia Công Mộng Tại Xưởng",
                  desc: "Chế tác thủ công ghép mộng khô kiểm thử độ chính xác 100% trước khi phủ 7 lớp dầu dưỡng Osmo an toàn.",
                },
                {
                  step: "04",
                  title: "Lắp Đặt White-Glove",
                  desc: "Thợ cả xưởng trực tiếp kê đặt căn chỉnh tại công trình, nghiệm thu độ phẳng và dọn sạch bao bì zero-waste.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="p-6 bg-surface-container-lowest border border-outline-variant space-y-3"
                >
                  <span className="font-mono text-3xl font-bold text-primary block">
                    {item.step}
                  </span>
                  <h4 className="font-headline-sm text-base text-primary font-bold">
                    {item.title}
                  </h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <button
                type="button"
                onClick={() => setIsConsultationOpen(true)}
                className="px-8 py-3.5 bg-primary text-on-primary text-label-md font-label-md uppercase tracking-wider hover:bg-[#27272a] transition-all inline-flex items-center gap-2"
              >
                <span>Đăng Ký Tư Vấn Dự Án Của Bạn</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />
    </>
  );
}
