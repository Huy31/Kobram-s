"use client";

import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export type ExpandingSearchDockProps = {
  onSearch?: (query: string) => void;
  placeholder?: string;
  autoNavigate?: boolean;
  align?: "left" | "right";
};

// Dữ liệu sản phẩm mẫu phong cách kiến trúc Nhật Bản (với Unsplash stock images)
const SEARCH_PRODUCTS = [
  {
    id: "kura-lounge-chair",
    title: "Ghế Bành Thư Giãn Kura Lounge Chair",
    category: "Phòng Khách • Ghế Bành",
    price: "18.500.000₫",
    href: "/san-pham/kura-lounge-chair",
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "nordic-cloud-sofa",
    title: "Sofa Nỉ Tự Nhiên Nordic Cloud",
    category: "Phòng Khách • Sofa",
    price: "32.600.000₫",
    href: "/phong-khach",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "mori-oak-table",
    title: "Bàn Ăn Mộc Mori Oak Table",
    category: "Phòng Bếp • Bàn Ăn",
    price: "24.500.000₫",
    href: "/phong-bep",
    image: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "zen-platform-bed",
    title: "Giường Gỗ Zen Platform Bed",
    category: "Phòng Ngủ • Giường Ngủ",
    price: "28.900.000₫",
    href: "/phong-ngu",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "wabi-dome-lamp",
    title: "Đèn Thả Giấy Washi Wabi Dome",
    category: "Chiếu Sáng • Nghệ Thuật",
    price: "8.200.000₫",
    href: "/bo-suu-tap",
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=300&auto=format&fit=crop",
  },
];

export function ExpandingSearchDock({
  onSearch,
  placeholder = "Tìm kiếm nội thất mộc bản...",
  autoNavigate = true,
  align = "right",
}: ExpandingSearchDockProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleExpand = () => {
    setIsExpanded(true);
    setShowResults(true);
  };

  const handleCollapse = () => {
    setIsExpanded(false);
    setQuery("");
    setShowResults(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && query) {
      onSearch(query);
    }
    if (autoNavigate && query.trim()) {
      const matched = SEARCH_PRODUCTS.find((p) =>
        p.title.toLowerCase().includes(query.toLowerCase())
      );
      if (matched) {
        router.push(matched.href);
        handleCollapse();
      } else {
        router.push(`/phong-khach`);
        handleCollapse();
      }
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredProducts = query.trim()
    ? SEARCH_PRODUCTS.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
      )
    : SEARCH_PRODUCTS.slice(0, 3);

  return (
    <div ref={containerRef} className="relative z-50">
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          <motion.button
            key="icon"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={handleExpand}
            aria-label="Mở tìm kiếm"
            className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-outline-variant bg-surface-container-low text-primary shadow-xs transition-all hover:bg-surface-container active:scale-95 cursor-pointer dark:bg-[#18181c] dark:border-white/20 dark:text-white dark:hover:bg-[#272730] dark:hover:border-white/35 dark:shadow-[0_2px_12px_rgba(0,0,0,0.6)] group"
            title="Tìm kiếm tác phẩm"
          >
            <Search className="h-4 w-4 text-primary dark:text-zinc-100 group-hover:scale-110 transition-transform" />
          </motion.button>
        ) : (
          <motion.form
            key="input"
            initial={{ width: 40, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 40, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            onSubmit={handleSubmit}
            className="relative"
          >
            <motion.div
              initial={{ backdropFilter: "blur(0px)" }}
              animate={{ backdropFilter: "blur(12px)" }}
              className="relative flex items-center gap-2 overflow-hidden rounded-xl border border-outline-variant bg-white/95 shadow-md backdrop-blur-md dark:bg-[#18181c] dark:border-white/25 dark:shadow-[0_4px_25px_rgba(0,0,0,0.7)]"
            >
              <div className="ml-3.5 text-outline dark:text-zinc-400">
                <Search className="h-4 w-4 text-outline dark:text-zinc-400" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowResults(true);
                }}
                onFocus={() => setShowResults(true)}
                placeholder={placeholder}
                autoFocus
                className="h-10 sm:h-11 flex-1 bg-transparent pr-2 text-xs sm:text-sm outline-none text-primary dark:text-white placeholder:text-outline dark:placeholder:text-zinc-500"
              />
              <motion.button
                type="button"
                onClick={handleCollapse}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Đóng tìm kiếm"
                className="mr-1.5 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg hover:bg-surface-container text-outline hover:text-primary dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white cursor-pointer transition-colors"
              >
                <X className="h-4 w-4" />
              </motion.button>
            </motion.div>

            {/* Live Search Results Dropdown */}
            {showResults && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.15 }}
                className={`absolute top-full mt-2 ${
                  align === "right" ? "right-0" : "left-0"
                } w-72 sm:w-96 rounded-2xl border border-outline-variant bg-white/95 dark:bg-[#16161b] dark:border-white/20 p-3 shadow-2xl backdrop-blur-xl z-50 text-left`}
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-outline-variant/60 dark:border-white/10 text-[11px] font-mono uppercase tracking-wider text-outline dark:text-zinc-400">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>{query.trim() ? "Kết quả gợi ý" : "Tác phẩm tiêu biểu"}</span>
                  </span>
                  <span className="dark:text-zinc-400">{filteredProducts.length} mục</span>
                </div>

                <div className="space-y-1.5 max-h-72 overflow-y-auto">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={handleCollapse}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-container-low dark:hover:bg-[#202028] transition-colors group"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-11 h-11 rounded-lg object-cover border border-outline-variant dark:border-white/10 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-primary dark:text-zinc-100 truncate group-hover:underline dark:group-hover:text-white">
                            {item.title}
                          </p>
                          <p className="text-[10px] text-outline dark:text-zinc-400 truncate mt-0.5">
                            {item.category}
                          </p>
                          <p className="text-[11px] font-mono font-bold text-primary dark:text-amber-400 mt-0.5">
                            {item.price}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-outline dark:text-zinc-400 group-hover:text-primary dark:group-hover:text-white group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
                      </Link>
                    ))
                  ) : (
                    <div className="py-6 text-center text-xs text-outline dark:text-zinc-400">
                      Không tìm thấy sản phẩm phù hợp với &ldquo;{query}&rdquo;
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
