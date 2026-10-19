"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SafeImage from "@/components/SafeImage";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ConsultationModal from "@/components/ConsultationModal";
import { useCart } from "@/context/CartContext";

export default function WishlistPage() {
  const {
    wishlist,
    removeFromWishlist,
    clearWishlist,
    addToCart,
    moveAllWishlistToCart,
  } = useCart();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  const filteredItems = wishlist.filter((item) => {
    if (selectedCategory === "all") return true;
    return item.category === selectedCategory;
  });

  const categories = ["all", "Phòng Khách", "Phòng Ăn", "Phòng Ngủ"];

  return (
    <>
      <Header onOpenConsultation={() => setIsConsultationOpen(true)} />

      <main className="flex-1 w-full min-h-screen bg-[#FAFAFA]">
        {/* SUB-HEADER: Breadcrumbs */}
        <section className="bg-surface-container-lowest border-b border-outline-variant/40">
          <div className="max-w-7xl mx-auto px-space-md sm:px-space-lg lg:px-margin py-4">
            <nav className="flex items-center gap-2 text-label-md font-label-md text-on-surface-variant text-xs sm:text-sm">
              <Link href="/" className="hover:text-primary transition-colors">
                Trang chủ
              </Link>
              <span className="material-symbols-outlined text-sm text-outline">chevron_right</span>
              <span className="text-primary font-bold">Danh sách yêu thích &amp; Độc bản</span>
            </nav>
          </div>
        </section>

        {/* HERO HEADER */}
        <section className="py-space-xl px-space-md lg:px-margin max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between pb-6 border-b border-outline-variant gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 bg-primary rounded-full"></span>
                <span className="text-xs uppercase tracking-widest font-mono text-outline">
                  KOMOREBI LIVING ARCHIVE • CURATION
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-tight font-headline-lg uppercase">
                Tác Phẩm Yêu Thích Của Quý Khách
              </h1>
              <p className="text-on-surface-variant text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
                Nơi lưu giữ các tác phẩm nội thất mộc bản do quý khách chọn lọc. Dễ dàng đối chiếu vân gỗ, kích thước và chuyển sang giỏ hàng để hoàn thiện không gian sống.
              </p>
            </div>

            {/* Quick Actions */}
            {wishlist.length > 0 && (
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={moveAllWishlistToCart}
                  className="px-5 py-3 bg-primary text-on-primary text-xs sm:text-sm font-semibold uppercase tracking-wider rounded-xl hover:bg-[#27272a] transition-all flex items-center gap-2 shadow-sm"
                >
                  <span className="material-symbols-outlined text-base">add_shopping_cart</span>
                  <span>Chuyển tất cả ({wishlist.length}) vào giỏ</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsConsultationOpen(true)}
                  className="px-5 py-3 border border-primary text-primary text-xs sm:text-sm font-semibold uppercase tracking-wider rounded-xl hover:bg-surface-container transition-all"
                >
                  Tư vấn phối cảnh 3D
                </button>
              </div>
            )}
          </div>

          {/* FILTER ROW */}
          {wishlist.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-b border-outline-variant/40 mt-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-outline uppercase mr-2 font-semibold">
                  Lọc theo không gian:
                </span>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 text-xs uppercase tracking-wider rounded-lg transition-colors border ${
                      selectedCategory === cat
                        ? "bg-primary text-on-primary border-primary font-bold shadow-2xs"
                        : "bg-surface-container-lowest text-on-surface border-outline-variant hover:border-primary"
                    }`}
                  >
                    {cat === "all" ? `Tất cả (${wishlist.length})` : cat}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={clearWishlist}
                className="text-xs text-outline hover:text-error transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">delete_sweep</span>
                <span>Xóa toàn bộ danh sách</span>
              </button>
            </div>
          )}

          {/* GRID CONTENT */}
          <div className="pt-8">
            {wishlist.length === 0 ? (
              <div className="py-20 text-center space-y-4 bg-surface-container-lowest border border-outline-variant p-8">
                <div className="w-20 h-20 rounded-full bg-surface-container-low border border-outline-variant mx-auto flex items-center justify-center text-outline">
                  <span className="material-symbols-outlined text-4xl">favorite_border</span>
                </div>
                <div className="space-y-1">
                  <h3 className="font-headline-sm text-xl font-bold text-primary">
                    Danh mục yêu thích đang trống
                  </h3>
                  <p className="text-on-surface-variant max-w-md mx-auto text-sm leading-relaxed">
                    Khám phá các bộ sưu tập nội thất Wabi-sabi và nhấn vào biểu tượng trái tim để lưu lại những tác phẩm tâm đắc nhất.
                  </p>
                </div>
                <div className="pt-4 flex flex-wrap justify-center gap-3">
                  <Link
                    href="/bo-suu-tap"
                    className="px-6 py-3 bg-primary text-on-primary text-xs uppercase tracking-wider font-semibold hover:bg-[#27272a] transition-all"
                  >
                    Khám phá Bộ Sưu Tập
                  </Link>
                  <Link
                    href="/phong-khach"
                    className="px-6 py-3 border border-primary text-primary text-xs uppercase tracking-wider font-semibold hover:bg-surface-container transition-all"
                  >
                    Nội thất Phòng Khách
                  </Link>
                </div>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="py-16 text-center text-outline bg-surface-container-lowest border border-outline-variant">
                <p>Không có tác phẩm nào thuộc danh mục "{selectedCategory}".</p>
                <button
                  type="button"
                  onClick={() => setSelectedCategory("all")}
                  className="mt-3 text-xs uppercase font-bold text-primary underline"
                >
                  Xem lại tất cả
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden group flex flex-col justify-between hover:border-primary hover:shadow-xl transition-all duration-300"
                  >
                    {/* Image Ratio 4:5 with Delete Heart */}
                    <div className="relative aspect-[4/5] bg-surface-container overflow-hidden">
                      <Link
                        href={item.slug ? `/san-pham/${item.slug}` : "/san-pham/kura-lounge-chair"}
                        className="relative block w-full h-full"
                      >
                        <SafeImage
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </Link>

                      {item.category && (
                        <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-primary text-label-sm font-label-sm px-2.5 py-1 rounded-md border border-outline-variant/60 shadow-sm text-xs font-semibold">
                          {item.category}
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => removeFromWishlist(item.id)}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center border border-outline-variant/60 text-error hover:bg-error hover:text-white transition-colors"
                        title="Bỏ khỏi yêu thích"
                        aria-label="Xóa tác phẩm"
                      >
                        <span className="material-symbols-outlined text-[18px]">favorite</span>
                      </button>
                    </div>

                    {/* Content Details */}
                    <div className="p-4 flex flex-col flex-1 justify-between">
                      <div>
                        {item.material && (
                          <span className="text-[11px] text-outline uppercase tracking-wider block mb-1">
                            {item.material}
                          </span>
                        )}

                        <Link
                          href={item.slug ? `/san-pham/${item.slug}` : "/san-pham/kura-lounge-chair"}
                          className="font-headline-sm text-base text-primary font-bold hover:underline block"
                        >
                          {item.title}
                        </Link>
                        <p className="text-body-sm text-outline text-xs mt-0.5 line-clamp-1">
                          {item.subtitle}
                        </p>
                      </div>

                      {/* Price & Add to Cart button */}
                      <div className="flex items-center justify-between pt-4 mt-3 border-t border-outline-variant/30">
                        <div>
                          <span className="font-headline-sm text-base text-primary font-bold block">
                            {item.price.toLocaleString("vi-VN")} đ
                          </span>
                          {item.originalPrice && (
                            <span className="text-xs text-outline line-through">
                              {item.originalPrice.toLocaleString("vi-VN")} đ
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            addToCart({
                              id: item.id,
                              sku: item.sku,
                              title: item.title,
                              subtitle: item.subtitle,
                              price: item.price,
                              originalPrice: item.originalPrice,
                              image: item.image,
                              quantity: 1,
                            })
                          }
                          className="px-3.5 py-2 bg-primary text-on-primary text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-[#27272a] transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                          title="Thêm vào giỏ hàng"
                        >
                          <span className="material-symbols-outlined text-sm">shopping_bag</span>
                          <span>Thêm vào giỏ</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
