"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ConsultationModal from "@/components/ConsultationModal";
import { useCart } from "@/context/CartContext";

export default function CuratedCollectionsPage() {
  const { addToCart, showToast } = useCart();
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  const curatedAccessories = [
    {
      id: "cur-acc-1",
      sku: "KL-ACC-SHI",
      title: "Đèn Bàn Gốm Shigaraki Hữu Cơ",
      price: 6200000,
      material: "Đất sét núi nung củi 7 ngày • Chụp giấy dó Washi",
      image: "/images/curated-6.jpg",
    },
    {
      id: "cur-acc-2",
      sku: "KL-ACC-BIZ",
      title: "Bình Hoa Gốm Bizen Không Tráng Men",
      price: 3800000,
      material: "Hỏa biến tự nhiên từ tro gỗ thông đỏ Shigaraki",
      image: "/images/curated-7.jpg",
    },
    {
      id: "cur-acc-3",
      sku: "KL-ACC-MIN",
      title: "Đèn Thả Giấy Dó Mino Washi",
      price: 4500000,
      material: "Giấy dó thủ công di sản UNESCO • Khung nan tre",
      image: "/images/curated-8.jpg",
    },
    {
      id: "cur-acc-4",
      sku: "KL-ACC-INC",
      title: "Khay Đốt Trầm Gỗ Mun Than Khói",
      price: 1800000,
      material: "Gỗ Mun sấy nhiệt • Khay lót đồng thau mộc",
      image: "/images/curated-9.jpg",
    },
  ];

  return (
    <>
      <Header onOpenConsultation={() => setIsConsultationOpen(true)} />

      <main className="min-h-screen">
        {/* HERO SECTION */}
        <section className="border-b border-outline-variant/40 bg-surface-container-lowest">
          <div className="max-w-7xl mx-auto px-space-md sm:px-space-lg lg:px-margin py-space-xl lg:py-space-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-7 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-block w-8 h-[1px] bg-primary"></span>
                  <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest text-xs">
                    Komorebi Living • Limited Archive &amp; Seasonal
                  </span>
                </div>
                <h1 className="font-headline-lg text-2xl sm:text-4xl lg:text-5xl leading-tight text-primary uppercase font-bold tracking-tight mb-space-md">
                  Bộ Sưu Tập Đặc Biệt &amp; Di Sản Giới Hạn
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-space-lg leading-relaxed text-sm sm:text-base">
                  Nơi hội tụ những tạo tác nội thất phiên bản đánh số giới hạn, kết tinh từ phôi gỗ cổ thụ quý hiếm, kỹ thuật mộng mộc truyền đời và những sự kết hợp độc bản cùng nghệ nhân gốm sứ - dệt tay thủ công Nhật Bản.
                </p>

                <div className="pt-2 flex flex-wrap gap-3">
                  <a
                    href="#kyoto-archive"
                    className="px-6 py-3 bg-primary text-on-primary text-label-md font-label-md uppercase tracking-wider hover:bg-[#27272a] transition-colors"
                  >
                    Khám phá BST Kyoto Archive
                  </a>
                  <button
                    type="button"
                    onClick={() => setIsConsultationOpen(true)}
                    className="px-6 py-3 border border-primary text-primary text-label-md font-label-md uppercase tracking-wider hover:bg-surface-container transition-colors"
                  >
                    Đăng ký giữ số serial
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 relative aspect-[4/3] overflow-hidden border border-outline-variant shadow-md">
                <Image
                  src="/images/curated-1.jpg"
                  alt="Bộ sưu tập độc bản Komorebi Living Atelier"
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: BST KYOTO ATELIER ARCHIVE (BENTO 3 COLUMNS) */}
        <section id="kyoto-archive" className="max-w-7xl mx-auto px-space-md sm:px-space-lg lg:px-margin py-space-xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-lg pb-4 border-b border-outline-variant/40">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-label-sm text-label-sm bg-primary text-on-primary px-2.5 py-1 tracking-widest uppercase text-xs font-bold">
                  Di Sản Giới Hạn
                </span>
                <span className="font-label-sm text-label-sm text-secondary text-xs">
                  Đã phát hành 32/50 bộ
                </span>
              </div>
              <h2 className="font-headline-md text-headline-md text-2xl sm:text-3xl font-bold text-primary uppercase tracking-tight">
                BST Kyoto Atelier Archive (Giới Hạn 50 Bộ Đánh Số)
              </h2>
            </div>
            <p className="font-body-md text-body-md text-secondary max-w-md mt-2 md:mt-0 text-xs sm:text-sm">
              Kỹ thuật ghép mộng mộc truyền thống không dùng đinh ốc (Kigumi) kết hợp phôi gỗ óc chó 80 năm tuổi tuyển chọn khắt khe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento Card 1 */}
            <div className="border border-outline-variant bg-surface-container-lowest p-6 flex flex-col justify-between hover:border-primary transition-colors">
              <div>
                <div className="aspect-square bg-surface-container mb-space-md overflow-hidden relative">
                  <Image
                    src="/images/curated-2.jpg"
                    alt="Khớp mộng Kigumi thủ công bàn tam diện Kyoto"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-white/95 border border-primary px-2 py-0.5 text-xs font-bold uppercase">
                    Kỹ thuật Kigumi
                  </span>
                </div>
                <h3 className="font-headline-sm text-lg text-primary font-bold mb-1">
                  Bàn Ghép Mộng Tam Diện Kyoto
                </h3>
                <p className="text-body-sm text-secondary text-xs mb-4 leading-relaxed">
                  Gỗ óc chó đen Bắc Mỹ 80 năm tuổi, mộng xuyên thấu thủ công không dùng một hạt đinh kim loại.
                </p>
              </div>
              <div className="pt-4 border-t border-outline-variant/40 flex items-center justify-between">
                <span className="font-label-md text-primary font-bold text-xs">Bộ số #09 / 50</span>
                <button
                  type="button"
                  onClick={() => setIsConsultationOpen(true)}
                  className="font-label-sm text-xs uppercase tracking-wider text-primary underline underline-offset-4 hover:text-secondary"
                >
                  Đăng ký thẩm định
                </button>
              </div>
            </div>

            {/* Bento Card 2 */}
            <div className="border border-outline-variant bg-surface-container-lowest p-6 flex flex-col justify-between hover:border-primary transition-colors">
              <div>
                <div className="aspect-square bg-surface-container mb-space-md overflow-hidden relative">
                  <Image
                    src="/images/curated-3.jpg"
                    alt="Ghế bành tĩnh tọa Gion đánh số riêng"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-white/95 border border-primary px-2 py-0.5 text-xs font-bold uppercase">
                    Đánh số riêng
                  </span>
                </div>
                <h3 className="font-headline-sm text-lg text-primary font-bold mb-1">
                  Ghế Bành Tĩnh Tọa Gion #24
                </h3>
                <p className="text-body-sm text-secondary text-xs mb-4 leading-relaxed">
                  Đan dây cói Washi thủ công nhuộm than tre hữu cơ, tựa lưng vát 15 độ cân bằng giải phẫu học.
                </p>
              </div>
              <div className="pt-4 border-t border-outline-variant/40 flex items-center justify-between">
                <span className="font-label-md text-primary font-bold text-xs">Bộ số #24 / 50</span>
                <button
                  type="button"
                  onClick={() => setIsConsultationOpen(true)}
                  className="font-label-sm text-xs uppercase tracking-wider text-primary underline underline-offset-4 hover:text-secondary"
                >
                  Đăng ký thẩm định
                </button>
              </div>
            </div>

            {/* Bento Card 3: Craftsman Manifesto */}
            <div className="border border-outline-variant bg-surface-container-low p-6 flex flex-col justify-between">
              <div>
                <div className="mb-4 pb-3 border-b border-outline-variant/60">
                  <span className="font-label-sm text-xs uppercase text-secondary tracking-widest block">
                    Tuyên Ngôn Xưởng Kyoto
                  </span>
                  <h4 className="font-headline-sm text-lg text-primary font-bold mt-1">
                    Chứng Chỉ Mộc Bản Khắc Chìm
                  </h4>
                </div>
                <blockquote className="text-body-md italic text-on-surface-variant mb-4 leading-relaxed text-xs sm:text-sm">
                  &ldquo;Mỗi khúc gỗ là một sinh mệnh tròn trăm năm. Chúng tôi không cưỡng ép hình thù mà lắng nghe đường thở của từng thớ vân để định hình nên các khớp nối vĩnh cửu.&rdquo;
                </blockquote>
                <p className="text-xs text-primary font-medium">
                  — Nghệ nhân Kenzo Murata, Đệ tử đời thứ tư xưởng mộc Arashiyama.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-outline-variant/40">
                <div className="bg-surface-container-lowest p-2.5 border border-outline-variant/40 mb-3 flex items-center justify-between text-xs">
                  <span className="uppercase text-secondary">Chứng thực:</span>
                  <span className="font-bold text-primary">Dấu Triện Đồng Khắc Laze &amp; Số Serial</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsConsultationOpen(true)}
                  className="w-full bg-primary text-on-primary py-3 font-label-md text-xs uppercase tracking-wider hover:bg-[#27272a] transition-colors"
                >
                  Đăng ký giữ suất bộ số tiếp theo
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: BST NỘI THẤT XANH CHỨNG CHỈ FSC 100% */}
        <section className="max-w-7xl mx-auto px-space-md sm:px-space-lg lg:px-margin py-space-xl border-t border-outline-variant/30">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-xl text-primary">forest</span>
                <span className="font-label-sm text-xs uppercase tracking-widest text-primary font-bold">
                  Tiêu Chuẩn Rừng Bền Vững Toàn Cầu
                </span>
              </div>
              <h2 className="font-headline-md text-2xl sm:text-3xl font-bold text-primary uppercase tracking-tight">
                BST Nội Thất Xanh Chứng Chỉ FSC® 100%
              </h2>
              <p className="text-body-md text-on-surface-variant text-xs sm:text-sm leading-relaxed">
                Khai thác gỗ có trách nhiệm là cốt lõi trong đạo đức nghề mộc Komorebi. Mỗi sản phẩm trong bộ sưu tập này đều minh bạch chuỗi hành trình gỗ (Chain of Custody) từ những cánh rừng tái sinh được chứng nhận FSC tại Thụy Điển và Bắc Mỹ.
              </p>
              <div className="p-3 bg-surface-container-low border border-outline-variant text-xs space-y-1">
                <p><strong>Mã chứng chỉ:</strong> FSC-C149811 (Chain of Custody Standard)</p>
                <p><strong>Tiêu chuẩn sấy:</strong> Sấy lò nhiệt chân không đạt độ ẩm lý tưởng 8 - 11%</p>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-outline-variant bg-surface-container-lowest overflow-hidden group">
                <div className="relative aspect-[4/3]">
                  <Image
                    src="/images/curated-4.jpg"
                    alt="Ghế ăn tái sinh Eco Oak"
                    fill
                    sizes="(max-width: 768px) 100vw, 30vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-headline-sm text-base font-bold text-primary">Ghế Ăn Tái Sinh Eco Oak</h4>
                  <span className="text-xs text-outline block mt-0.5">Sồi tái sinh FSC® 100%</span>
                  <span className="text-sm font-bold text-primary block mt-2">7.500.000 đ</span>
                </div>
              </div>

              <div className="border border-outline-variant bg-surface-container-lowest overflow-hidden group">
                <div className="relative aspect-[4/3]">
                  <Image
                    src="/images/curated-5.jpg"
                    alt="Tủ rương Teak trồng rừng"
                    fill
                    sizes="(max-width: 768px) 100vw, 30vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-headline-sm text-base font-bold text-primary">Tủ Rương Teak Trồng Rừng</h4>
                  <span className="text-xs text-outline block mt-0.5">Teak rừng trồng bền vững</span>
                  <span className="text-sm font-bold text-primary block mt-2">22.800.000 đ</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: PHỤ KIỆN GỐM & ÁNH SÁNG THIỀN WABI-SABI */}
        <section className="bg-surface-container-lowest border-t border-outline-variant/40 py-space-xl">
          <div className="max-w-7xl mx-auto px-space-md sm:px-space-lg lg:px-margin">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-3 border-b border-outline-variant/40">
              <div>
                <span className="text-label-sm font-label-sm text-outline uppercase tracking-widest text-xs block">
                  NGHỆ THUẬT BÀN TRÀ &amp; ÁNH SÁNG
                </span>
                <h2 className="text-headline-md font-headline-md text-2xl font-bold text-primary">
                  Phụ Kiện Gốm Shigaraki &amp; Ánh Sáng Thiền Wabi-Sabi
                </h2>
              </div>
              <span className="text-xs text-outline">Chế tác thủ công từ các làng gốm nghìn năm Nhật Bản</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {curatedAccessories.map((acc) => (
                <div
                  key={acc.id}
                  className="border border-outline-variant bg-surface-container-lowest flex flex-col justify-between group hover:border-primary transition-colors"
                >
                  <div>
                    <div className="relative aspect-square overflow-hidden bg-surface-container">
                      <Image
                        src={acc.image}
                        alt={acc.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4 space-y-1">
                      <h4 className="font-headline-sm text-base text-primary font-bold">{acc.title}</h4>
                      <p className="text-xs text-on-surface-variant">{acc.material}</p>
                    </div>
                  </div>
                  <div className="p-4 pt-0 border-t border-outline-variant/20 mt-3 flex items-center justify-between">
                    <span className="font-bold text-primary text-sm">
                      {acc.price.toLocaleString("vi-VN")} đ
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        addToCart({
                          id: acc.id,
                          sku: acc.sku,
                          title: acc.title,
                          subtitle: acc.material,
                          price: acc.price,
                          image: acc.image,
                          quantity: 1,
                        })
                      }
                      className="px-3 py-1.5 border border-primary text-primary hover:bg-primary hover:text-on-primary text-xs uppercase font-semibold transition-colors"
                    >
                      Thêm vào giỏ
                    </button>
                  </div>
                </div>
              ))}
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
