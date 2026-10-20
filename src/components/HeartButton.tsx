"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface HeartButtonProps {
  isLiked: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showLabel?: boolean;
  label?: string;
  ariaLabel?: string;
  disabled?: boolean;
}

const sizeConfig = {
  xs: {
    button: "w-8 h-8 rounded-xl",
    svgSize: "w-4 h-4",
    label: "text-[9px] top-1 left-1.5",
  },
  sm: {
    button: "w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl",
    svgSize: "w-[18px] h-[18px] sm:w-5 sm:h-5",
    label: "text-[10px] top-1.5 left-2",
  },
  md: {
    button: "w-11 h-11 sm:w-12 sm:h-12 rounded-2xl",
    svgSize: "w-6 h-6",
    label: "text-[11px] top-2 left-2.5",
  },
  lg: {
    button: "w-14 h-14 rounded-2xl",
    svgSize: "w-7 h-7 sm:w-8 sm:h-8",
    label: "text-xs top-2 left-3",
  },
  xl: {
    button: "w-24 h-24 sm:w-28 sm:h-28 rounded-3xl",
    svgSize: "w-12 h-12 sm:w-14 sm:h-14",
    label: "text-xs font-medium tracking-wide top-2.5 left-3",
  },
};

// SVG Heart Path chuẩn đẹp mắt, uốn cong mềm mại bầu bĩnh và đáy nhọn thanh thoát
const HEART_PATH =
  "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

export default function HeartButton({
  isLiked,
  onClick,
  className = "",
  size = "sm",
  showLabel = false,
  label = "Like",
  ariaLabel = "Yêu thích",
  disabled = false,
}: HeartButtonProps) {
  const currentSize = sizeConfig[size] || sizeConfig.sm;
  const [animationPhase, setAnimationPhase] = useState<
    "idle" | "shrinking" | "filled-small" | "popped"
  >("idle");
  const isFirstRender = useRef(true);

  // Kích hoạt chuỗi animation 4 bước theo đúng hình thiết kế khi trạng thái like thay đổi
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (isLiked) {
      // Khung 2: Co lại (Shrink Outline)
      setAnimationPhase("shrinking");

      // Khung 3: Đổi sang trái tim đỏ đặc nhỏ (Filled Small)
      const t1 = setTimeout(() => {
        setAnimationPhase("filled-small");
      }, 130);

      // Khung 4: Bung to nảy ra lấp đầy nút (Pop Bounce)
      const t2 = setTimeout(() => {
        setAnimationPhase("popped");
      }, 210);

      // Hoàn tất: Về trạng thái ổn định (Liked Idle)
      const t3 = setTimeout(() => {
        setAnimationPhase("idle");
      }, 620);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    } else {
      // Khi bỏ like: co nhẹ rồi về viền rỗng
      setAnimationPhase("shrinking");
      const t = setTimeout(() => {
        setAnimationPhase("idle");
      }, 180);
      return () => clearTimeout(t);
    }
  }, [isLiked]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (onClick) {
      onClick(e);
    }
  };

  // Xác định xem tại frame hiện tại đang vẽ Outline hay Filled
  const showFilled =
    (isLiked && animationPhase !== "shrinking") ||
    animationPhase === "filled-small" ||
    animationPhase === "popped";

  // Xác định scale dựa trên phase
  let heartScale = 1;
  if (animationPhase === "shrinking" || animationPhase === "filled-small") {
    heartScale = 0.52;
  } else if (animationPhase === "popped") {
    heartScale = 1.2;
  }

  const hasPosition = /\b(absolute|fixed|sticky)\b/.test(className);
  const positionClass = hasPosition ? "" : "relative";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={isLiked}
      className={`${positionClass} ${className} ${currentSize.button} group bg-white flex flex-col items-center justify-center cursor-pointer select-none border border-black/[0.06] shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.16)] active:scale-95 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-red-400/50`}
    >
      {/* Label "Like" ở góc trên bên trái nếu showLabel = true */}
      {showLabel && (
        <span
          className={`absolute text-zinc-400 font-medium select-none pointer-events-none transition-colors ${
            isLiked ? "text-zinc-600" : "text-zinc-400"
          } ${currentSize.label}`}
        >
          {label}
        </span>
      )}

      {/* Vùng chứa Icon trái tim */}
      <div className={`relative flex items-center justify-center ${currentSize.svgSize}`}>
        {/* Vòng sáng loang nhẹ (Ring ripple) khi Like thành công */}
        <AnimatePresence>
          {isLiked && animationPhase === "popped" && (
            <motion.span
              initial={{ scale: 0.5, opacity: 0.8 }}
              animate={{ scale: 1.8, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute inset-0 rounded-full border-2 border-red-500/40 pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* Trái tim SVG có animation nảy và chuyển đổi viền sang đặc */}
        <motion.svg
          viewBox="0 0 24 24"
          className="w-full h-full overflow-visible"
          animate={{
            scale: heartScale,
          }}
          transition={
            animationPhase === "popped"
              ? {
                  type: "spring",
                  stiffness: 420,
                  damping: 14,
                }
              : {
                  duration: 0.15,
                  ease: "easeInOut",
                }
          }
        >
          {showFilled ? (
            // Trạng thái ĐÃ LIKE: Trái tim đỏ đặc (Filled Red Heart)
            <path
              d={HEART_PATH}
              fill="#EF4444"
              stroke="#EF4444"
              strokeWidth="0.5"
            />
          ) : (
            // Trạng thái CHƯA LIKE: Trái tim viền đỏ (Outline Red Heart)
            <path
              d={HEART_PATH}
              fill="none"
              stroke="#EF4444"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-colors group-hover:stroke-red-600"
            />
          )}
        </motion.svg>
      </div>
    </button>
  );
}

/**
 * Component Showcase 4 trạng thái giống 100% hình thiết kế mẫu:
 * Khung 1: Like (Outline to)
 * Khung 2: Like (Outline nhỏ)
 * Khung 3: Like (Đỏ đặc nhỏ)
 * Khung 4: Like (Đỏ đặc to)
 * Kèm một nút tương tác thử nghiệm trực tiếp
 */
export function HeartButtonShowcase() {
  const [interactiveLiked, setInteractiveLiked] = useState(false);

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-3xl p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-outline-variant/40 gap-4 mb-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-outline block mb-1">
            UI DESIGN SYSTEM • MICRO-INTERACTION
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-primary">
            Các Trạng Thái Chuyển Động Của Nút Yêu Thích
          </h3>
          <p className="text-xs sm:text-sm text-outline mt-1">
            Hiệu ứng 4 bước mô phỏng: Viền đỏ chuẩn → Thu nhỏ viền → Chuyển sang đỏ đặc → Bung nảy đầy đặn.
          </p>
        </div>

        {/* Nút bấm thử nghiệm tương tác */}
        <div className="flex items-center gap-3 bg-surface-container-low px-4 py-2.5 rounded-2xl border border-outline-variant/60 self-start sm:self-auto">
          <span className="text-xs text-on-surface-variant font-medium">Bấm thử:</span>
          <HeartButton
            isLiked={interactiveLiked}
            onClick={() => setInteractiveLiked(!interactiveLiked)}
            size="md"
            showLabel={true}
            ariaLabel="Bấm thử nghiệm nút yêu thích"
          />
          <span className="text-xs text-outline font-mono">
            {interactiveLiked ? "Trạng thái: Liked" : "Trạng thái: Unliked"}
          </span>
        </div>
      </div>

      {/* Dãy 4 khung giống hệt hình ảnh thiết kế */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {/* Khung 1: Like - Outline to */}
        <div className="flex flex-col items-center">
          <div className="relative w-full aspect-square max-w-[160px] bg-white rounded-3xl border border-black/[0.04] shadow-[0_10px_25px_rgba(0,0,0,0.08)] flex items-center justify-center p-6">
            <span className="absolute top-3 left-3.5 text-zinc-400 font-medium text-xs select-none">
              Like
            </span>
            <svg
              viewBox="0 0 24 24"
              className="w-12 h-12 sm:w-14 sm:h-14 overflow-visible"
            >
              <path
                d={HEART_PATH}
                fill="none"
                stroke="#EF4444"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-[11px] text-outline mt-2.5 font-medium text-center">
            1. Trạng thái chờ
          </span>
        </div>

        {/* Khung 2: Like - Outline nhỏ (Co lại) */}
        <div className="flex flex-col items-center">
          <div className="relative w-full aspect-square max-w-[160px] bg-white rounded-3xl border border-black/[0.04] shadow-[0_10px_25px_rgba(0,0,0,0.08)] flex items-center justify-center p-6">
            <span className="absolute top-3 left-3.5 text-zinc-400 font-medium text-xs select-none">
              Like
            </span>
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 sm:w-7 sm:h-7 overflow-visible scale-90"
            >
              <path
                d={HEART_PATH}
                fill="none"
                stroke="#EF4444"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-[11px] text-outline mt-2.5 font-medium text-center">
            2. Co lại khi chạm
          </span>
        </div>

        {/* Khung 3: Like - Filled nhỏ (Đổi màu đặc) */}
        <div className="flex flex-col items-center">
          <div className="relative w-full aspect-square max-w-[160px] bg-white rounded-3xl border border-black/[0.04] shadow-[0_10px_25px_rgba(0,0,0,0.08)] flex items-center justify-center p-6">
            <span className="absolute top-3 left-3.5 text-zinc-400 font-medium text-xs select-none">
              Like
            </span>
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 sm:w-7 sm:h-7 overflow-visible scale-90"
            >
              <path
                d={HEART_PATH}
                fill="#EF4444"
                stroke="#EF4444"
                strokeWidth="0.5"
              />
            </svg>
          </div>
          <span className="text-[11px] text-outline mt-2.5 font-medium text-center">
            3. Chuyển đỏ đặc
          </span>
        </div>

        {/* Khung 4: Like - Filled to (Bung nở nảy) */}
        <div className="flex flex-col items-center">
          <div className="relative w-full aspect-square max-w-[160px] bg-white rounded-3xl border border-black/[0.04] shadow-[0_10px_25px_rgba(0,0,0,0.08)] flex items-center justify-center p-6">
            <span className="absolute top-3 left-3.5 text-zinc-400 font-medium text-xs select-none">
              Like
            </span>
            <svg
              viewBox="0 0 24 24"
              className="w-12 h-12 sm:w-14 sm:h-14 overflow-visible"
            >
              <path
                d={HEART_PATH}
                fill="#EF4444"
                stroke="#EF4444"
                strokeWidth="0.5"
              />
            </svg>
          </div>
          <span className="text-[11px] text-outline mt-2.5 font-medium text-center">
            4. Bung to hoàn tất
          </span>
        </div>
      </div>
    </div>
  );
}
