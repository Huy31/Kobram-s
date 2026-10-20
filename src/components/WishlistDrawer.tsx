"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import SafeImage from "@/components/SafeImage";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";

export default function WishlistDrawer() {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const {
    wishlist,
    isWishlistOpen,
    closeWishlist,
    removeFromWishlist,
    clearWishlist,
    addToCart,
    moveAllWishlistToCart,
  } = useCart();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isWishlistOpen) {
        closeWishlist();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isWishlistOpen, closeWishlist]);

  // Prevent body scrolling when open
  useEffect(() => {
    if (isWishlistOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isWishlistOpen]);

  if (!mounted || !isWishlistOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex justify-end animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeWishlist}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <aside
        className="relative z-10 w-full max-w-md sm:max-w-lg bg-surface-container-lowest h-screen sm:h-[100dvh] shadow-2xl border-l border-outline-variant flex flex-col justify-between overflow-hidden animate-slide-in-right"
        role="dialog"
        aria-modal="true"
        aria-label="Danh sách tác phẩm yêu thích"
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-outline-variant flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-base">favorite</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-headline-sm font-headline-sm text-base sm:text-lg font-bold text-primary">
                  {t.wishlist.title}
                </h2>
                <span className="px-2 py-0.5 bg-surface-container-low text-primary text-xs font-mono font-bold border border-outline-variant">
                  {wishlist.length.toString().padStart(2, "0")}
                </span>
              </div>
              <p className="text-[11px] text-outline mt-0.5">
                {t.wishlist.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {wishlist.length > 0 && (
              <button
                type="button"
                onClick={clearWishlist}
                className="text-xs text-outline hover:text-error transition-colors px-2 py-1 mr-1"
                title={t.wishlist.clearAll}
              >
                {t.wishlist.clearAll}
              </button>
            )}
            <button
              type="button"
              onClick={closeWishlist}
              className="p-2 text-outline hover:text-primary transition-colors hover:bg-surface-container-low"
              aria-label="Đóng bảng yêu thích"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>

        {/* Scrollable Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-outline-variant/30 space-y-4">
          {wishlist.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-surface-container-low border border-outline-variant flex items-center justify-center text-outline">
                <span className="material-symbols-outlined text-3xl">favorite_border</span>
              </div>
              <div className="space-y-1">
                <h3 className="font-headline-sm text-lg font-bold text-primary">
                  {t.wishlist.emptyTitle}
                </h3>
                <p className="text-body-sm text-outline max-w-xs text-xs sm:text-sm">
                  {t.wishlist.emptyDesc}
                </p>
              </div>
              <Link
                href="/bo-suu-tap"
                onClick={closeWishlist}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary text-label-md font-label-md uppercase tracking-wider hover:bg-[#27272a] transition-colors"
              >
                <span>{t.wishlist.exploreBtn}</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          ) : (
            wishlist.map((item) => (
              <div
                key={item.id}
                className="pt-4 first:pt-0 flex gap-3 sm:gap-4 items-start group"
              >
                {/* Product Image */}
                <Link
                  href={item.slug ? `/san-pham/${item.slug}` : "/san-pham/kura-lounge-chair"}
                  onClick={closeWishlist}
                  className="relative w-20 sm:w-24 aspect-[4/5] bg-surface-container overflow-hidden border border-outline-variant flex-shrink-0 group-hover:border-primary transition-colors"
                >
                  <SafeImage
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="96px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {item.category && (
                    <span className="absolute bottom-1 left-1 bg-black/75 text-white text-[9px] px-1 py-0.2">
                      {item.category}
                    </span>
                  )}
                </Link>

                {/* Info & Actions */}
                <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={item.slug ? `/san-pham/${item.slug}` : "/san-pham/kura-lounge-chair"}
                        onClick={closeWishlist}
                        className="font-headline-sm text-sm sm:text-base font-bold text-primary hover:underline line-clamp-1"
                      >
                        {item.title}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeFromWishlist(item.id)}
                        className="text-outline hover:text-error transition-colors p-1"
                        title="Bỏ khỏi yêu thích"
                        aria-label={`Xóa ${item.title}`}
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>

                    <p className="text-xs text-outline line-clamp-1 mt-0.5">
                      {item.subtitle}
                    </p>

                    {item.material && (
                      <span className="inline-block text-[10px] text-zinc-500 uppercase tracking-wider mt-1">
                        Chất liệu: {item.material}
                      </span>
                    )}
                  </div>

                  {/* Price & Add to Cart */}
                  <div className="flex items-center justify-between pt-3 mt-2 border-t border-outline-variant/30">
                    <div>
                      <span className="text-sm sm:text-base font-bold text-primary block">
                        {item.price.toLocaleString("vi-VN")} đ
                      </span>
                      {item.originalPrice && (
                        <span className="text-[11px] text-outline line-through block">
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
                      className="px-3 py-1.5 bg-primary text-on-primary text-xs font-semibold uppercase tracking-wider hover:bg-[#27272a] transition-all flex items-center gap-1.5 shadow-2xs active:scale-95"
                    >
                      <span className="material-symbols-outlined text-sm">shopping_bag</span>
                      <span>Thêm vào giỏ</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {wishlist.length > 0 && (
          <div className="p-4 sm:p-5 bg-white border-t border-outline-variant space-y-2.5">
            <button
              type="button"
              onClick={moveAllWishlistToCart}
              className="w-full py-3.5 bg-primary text-on-primary text-label-md font-label-md uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#27272a] transition-all active:scale-98 shadow-sm font-bold"
            >
              <span className="material-symbols-outlined text-base">add_shopping_cart</span>
              <span>{t.wishlist.addAllToCart(wishlist.length)}</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/yeu-thich"
                onClick={closeWishlist}
                className="py-2.5 border border-outline-variant text-center text-xs font-semibold uppercase tracking-wider text-primary hover:bg-surface-container-low transition-colors"
              >
                {t.wishlist.title}
              </Link>
              <Link
                href="/gio-hang"
                onClick={closeWishlist}
                className="py-2.5 bg-surface-container-low text-center text-xs font-semibold uppercase tracking-wider text-primary hover:bg-surface-container transition-colors"
              >
                {t.wishlist.checkoutBtn} &rarr;
              </Link>
            </div>

            <p className="text-[11px] text-center text-outline pt-1">
              * Tác phẩm đã lưu sẽ được ghi nhớ tự động cho các lần ghé thăm tiếp theo.
            </p>
          </div>
        )}
      </aside>
    </div>,
    document.body
  );
}
