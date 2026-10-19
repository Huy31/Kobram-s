"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-black text-white border-t border-zinc-800 mt-space-2xl selection:bg-white selection:text-black">
      {/* Top Showroom & Workshop Details Bar */}
      <div className="max-w-7xl mx-auto px-space-md sm:px-space-lg lg:px-margin py-space-lg border-b border-zinc-800/80">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-body-sm">
          <div>
            <span className="text-label-sm font-label-sm text-zinc-400 uppercase tracking-wider block mb-1">
              {t.footer.showroomHcm}
            </span>
            <p className="text-zinc-100 font-medium">{t.footer.showroomHcmAddr}</p>
            <p className="text-zinc-500 text-xs mt-0.5">{t.footer.showroomHcmHours}</p>
          </div>
          <div>
            <span className="text-label-sm font-label-sm text-zinc-400 uppercase tracking-wider block mb-1">
              {t.footer.showroomHn}
            </span>
            <p className="text-zinc-100 font-medium">{t.footer.showroomHnAddr}</p>
            <p className="text-zinc-500 text-xs mt-0.5">{t.footer.showroomHnHours}</p>
          </div>
          <div>
            <span className="text-label-sm font-label-sm text-zinc-400 uppercase tracking-wider block mb-1">
              {t.footer.workshopTitle}
            </span>
            <p className="text-zinc-100 font-medium">{t.footer.workshopDesc}</p>
            <p className="text-zinc-500 text-xs mt-0.5">{t.footer.workshopStandard}</p>
          </div>
        </div>
      </div>

      {/* Main Footer Row */}
      <div className="max-w-7xl mx-auto px-space-md sm:px-space-lg lg:px-margin py-space-md flex flex-col md:flex-row justify-between items-center gap-space-md">
        {/* Brand & Copyright */}
        <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
          <Link
            href="/"
            className="font-headline-md text-headline-md text-white tracking-tight font-bold hover:opacity-80 transition-opacity"
          >
            Komorebi Living
          </Link>
          <span className="hidden md:inline-block w-1.5 h-1.5 bg-zinc-600 rounded-full"></span>
          <p className="text-body-sm font-body-sm text-zinc-400">
            {t.footer.copyright}
          </p>
        </div>

        {/* Links */}
        <nav className="flex flex-wrap items-center justify-center gap-space-md text-label-md font-label-md">
          <Link href="/#triet-ly" className="text-zinc-400 hover:text-white transition-colors">
            {t.footer.aboutUs}
          </Link>
          <Link href="/#xuong-moc" className="text-zinc-400 hover:text-white transition-colors">
            {t.footer.craftWorkshop}
          </Link>
          <Link href="/#bao-hanh" className="text-zinc-400 hover:text-white transition-colors">
            {t.footer.warrantyPolicy}
          </Link>
          <Link href="/gio-hang" className="text-zinc-400 hover:text-white transition-colors">
            {t.footer.deliveryService}
          </Link>
          <Link href="/#showroom" className="text-zinc-400 hover:text-white transition-colors">
            {t.footer.showroomSystem}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
