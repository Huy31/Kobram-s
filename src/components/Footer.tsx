import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest text-primary border-t border-outline-variant mt-space-2xl">
      {/* Top Showroom & Workshop Details Bar */}
      <div className="max-w-7xl mx-auto px-space-md sm:px-space-lg lg:px-margin py-space-lg border-b border-outline-variant/40">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-body-sm">
          <div>
            <span className="text-label-sm font-label-sm text-outline uppercase tracking-wider block mb-1">
              Showroom TP. Hồ Chí Minh
            </span>
            <p className="text-on-surface font-medium">18 Đường Số 10, Thảo Điền, TP. Thủ Đức</p>
            <p className="text-outline text-xs mt-0.5">Mở cửa: 09:00 - 20:30 (Thứ 2 - Chủ Nhật)</p>
          </div>
          <div>
            <span className="text-label-sm font-label-sm text-outline uppercase tracking-wider block mb-1">
              Showroom Hà Nội
            </span>
            <p className="text-on-surface font-medium">45 Quang Trung, Quận Hoàn Kiếm</p>
            <p className="text-outline text-xs mt-0.5">Mở cửa: 09:00 - 20:30 (Thứ 2 - Chủ Nhật)</p>
          </div>
          <div>
            <span className="text-label-sm font-label-sm text-outline uppercase tracking-wider block mb-1">
              Xưởng Chế Tác Mộc Bản
            </span>
            <p className="text-on-surface font-medium">Kyoto Atelier &amp; Xưởng Sinh Thái Bình Dương</p>
            <p className="text-outline text-xs mt-0.5">Tiêu chuẩn mộc thủ công mộng âm dương không đinh</p>
          </div>
        </div>
      </div>

      {/* Main Footer Row */}
      <div className="max-w-7xl mx-auto px-space-md sm:px-space-lg lg:px-margin py-space-md flex flex-col md:flex-row justify-between items-center gap-space-md">
        {/* Brand & Copyright */}
        <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
          <Link
            href="/"
            className="font-headline-md text-headline-md text-primary tracking-tight font-bold hover:opacity-80 transition-opacity"
          >
            Komorebi Living
          </Link>
          <span className="hidden md:inline-block w-1.5 h-1.5 bg-outline rounded-full"></span>
          <p className="text-body-sm font-body-sm text-on-surface-variant">
            © 2025 Komorebi Living. Bản quyền thuộc về thương hiệu nội thất gỗ &amp; kiến trúc tối giản.
          </p>
        </div>

        {/* Links */}
        <nav className="flex flex-wrap items-center justify-center gap-space-md text-label-md font-label-md">
          <Link href="/#triet-ly" className="text-on-surface-variant hover:text-primary transition-colors">
            Về chúng tôi
          </Link>
          <Link href="/#xuong-moc" className="text-on-surface-variant hover:text-primary transition-colors">
            Xưởng chế tác thủ công
          </Link>
          <Link href="/#bao-hanh" className="text-on-surface-variant hover:text-primary transition-colors">
            Chính sách bảo hành 10 năm
          </Link>
          <Link href="/gio-hang" className="text-on-surface-variant hover:text-primary transition-colors">
            Dịch vụ giao vận &amp; Lắp đặt
          </Link>
          <Link href="/#showroom" className="text-on-surface-variant hover:text-primary transition-colors">
            Hệ thống Showroom
          </Link>
        </nav>
      </div>
    </footer>
  );
}
