"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-surface-container-lowest text-primary border-t border-outline-variant mt-space-2xl">
      {/* Top Showroom & Workshop Details Bar */}
      <div className="max-w-7xl mx-auto px-space-md sm:px-space-lg lg:px-margin py-space-lg border-b border-outline-variant/40">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-body-sm">
          <div>
            <span className="text-label-sm font-label-sm text-outline uppercase tracking-wider block mb-1">
              {t.footer.showroomHcm}
            </span>
            <p className="text-on-surface font-medium">{t.footer.showroomHcmAddr}</p>
            <p className="text-outline text-xs mt-0.5">{t.footer.showroomHcmHours}</p>
          </div>
          <div>
            <span className="text-label-sm font-label-sm text-outline uppercase tracking-wider block mb-1">
              {t.footer.showroomHn}
            </span>
            <p className="text-on-surface font-medium">{t.footer.showroomHnAddr}</p>
            <p className="text-outline text-xs mt-0.5">{t.footer.showroomHnHours}</p>
          </div>
          <div>
            <span className="text-label-sm font-label-sm text-outline uppercase tracking-wider block mb-1">
              {t.footer.workshopTitle}
            </span>
            <p className="text-on-surface font-medium">{t.footer.workshopDesc}</p>
            <p className="text-outline text-xs mt-0.5">{t.footer.workshopStandard}</p>
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
            {t.footer.copyright}
          </p>
        </div>

        {/* Links */}
        <nav className="flex flex-wrap items-center justify-center gap-space-md text-label-md font-label-md">
          <Link href="/#triet-ly" className="text-on-surface-variant hover:text-primary transition-colors">
            {t.footer.aboutUs}
          </Link>
          <Link href="/#xuong-moc" className="text-on-surface-variant hover:text-primary transition-colors">
            {t.footer.craftWorkshop}
          </Link>
          <Link href="/#bao-hanh" className="text-on-surface-variant hover:text-primary transition-colors">
            {t.footer.warrantyPolicy}
          </Link>
          <Link href="/gio-hang" className="text-on-surface-variant hover:text-primary transition-colors">
            {t.footer.deliveryService}
          </Link>
          <Link href="/#showroom" className="text-on-surface-variant hover:text-primary transition-colors">
            {t.footer.showroomSystem}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
