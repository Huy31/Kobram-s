"use client";

import React, { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";

/**
 * Chuẩn hóa mọi định dạng đường dẫn ảnh:
 * - "bo-sofa.jpg" -> "/images/bo-sofa.jpg"
 * - "images/bo-sofa.jpg" -> "/images/bo-sofa.jpg"
 * - "public/images/bo-sofa.jpg" -> "/images/bo-sofa.jpg"
 * - "/public/images/bo-sofa.jpg" -> "/images/bo-sofa.jpg"
 * - "\\images\\bo-sofa.jpg" -> "/images/bo-sofa.jpg"
 * - "https://..." hoặc "http://..." -> giữ nguyên
 */
export function normalizeImageUrl(src?: string | null): string {
  if (!src || typeof src !== "string") {
    return "/images/living-1.jpg";
  }

  let cleaned = src.trim().replace(/\\/g, "/");
  if (!cleaned) return "/images/living-1.jpg";

  // URL từ xa hoặc data URI
  if (
    cleaned.startsWith("http://") ||
    cleaned.startsWith("https://") ||
    cleaned.startsWith("data:")
  ) {
    return cleaned;
  }

  // Loại bỏ tiền tố /public hoặc public/
  if (cleaned.startsWith("/public/")) {
    cleaned = cleaned.substring(7); // bỏ qua "/public"
  } else if (cleaned.startsWith("public/")) {
    cleaned = cleaned.substring(6); // bỏ qua "public"
  }

  // Đảm bảo có dấu gạch chéo đầu tiên
  if (!cleaned.startsWith("/")) {
    cleaned = "/" + cleaned;
  }

  // Nếu người dùng chỉ gõ tên file (ví dụ "/anh-sofa.jpg" hoặc "anh-sofa.jpg")
  if (!cleaned.startsWith("/images/")) {
    cleaned = "/images" + cleaned;
  }

  return cleaned;
}

export interface SafeImageProps extends Omit<ImageProps, "src"> {
  src: string;
  fallbackSrc?: string;
}

export default function SafeImage({
  src,
  alt,
  fallbackSrc = "/images/living-1.jpg",
  className = "",
  ...props
}: SafeImageProps) {
  const normalizedSrc = normalizeImageUrl(src);
  const [imgSrc, setImgSrc] = useState<string>(normalizedSrc);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    setImgSrc(normalizeImageUrl(src));
    setHasError(false);
  }, [src]);

  return (
    <Image
      {...props}
      src={hasError ? fallbackSrc : imgSrc}
      alt={alt || "Hình ảnh nội thất Komorebi"}
      className={className}
      onError={() => {
        if (!hasError) {
          setHasError(true);
        }
      }}
    />
  );
}
