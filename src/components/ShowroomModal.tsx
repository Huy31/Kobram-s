"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";

interface ShowroomModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
}

export default function ShowroomModal({
  isOpen,
  onClose,
  productName = "Ghế Thư Giãn Gỗ Sồi Kura Lounge Chair",
}: ShowroomModalProps) {
  const { showToast } = useCart();
  const { t, lang } = useLanguage();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("2025-11-20");
  const [time, setTime] = useState("10:00 - 11:30");
  const [showroom, setShowroom] = useState(
    lang === "VN"
      ? "Showroom Thảo Điền (18 Đường Số 10, TP. Thủ Đức, HCM)"
      : "Thao Dien Showroom (18 Street 10, Thu Duc City, HCMC)"
  );
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      showToast(t.showroomModal.phoneRequiredError);
      return;
    }
    setSubmitted(true);
    showToast(t.showroomModal.bookedToast(productName));
  };

  const handleClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-surface-container-lowest border border-outline text-primary max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl relative rounded-2xl sm:rounded-3xl">
        <div className="sticky top-0 bg-surface-container-lowest z-10 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-outline-variant">
          <div>
            <span className="text-[10px] sm:text-label-sm font-label-sm text-outline uppercase tracking-widest block">
              {t.showroomModal.badge}
            </span>
            <h3 className="text-base sm:text-headline-sm font-headline-sm text-primary tracking-tight font-bold">
              {t.showroomModal.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1 sm:p-1.5 text-outline hover:text-primary transition-colors rounded-lg"
            aria-label={t.common.close}
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-4 sm:p-6">
          {submitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 bg-primary text-on-primary mx-auto flex items-center justify-center rounded-full">
                <span className="material-symbols-outlined text-3xl">verified</span>
              </div>
              <h4 className="text-headline-sm font-bold text-primary">
                {t.showroomModal.successTitle}
              </h4>
              <p className="text-body-sm text-on-surface-variant max-w-sm mx-auto">
                {t.showroomModal.successDesc(showroom.split("(")[0].trim(), productName, time, date)}
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="mt-4 px-6 py-2.5 bg-primary text-on-primary text-label-md uppercase tracking-wider hover:bg-[#27272a] transition-colors rounded-xl"
              >
                {t.showroomModal.closeBtn}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-body-sm">
              <div className="p-3 bg-surface-container-low border border-outline-variant/60 rounded-xl">
                <span className="text-label-sm font-label-sm text-outline uppercase block">
                  {t.showroomModal.productLabel}
                </span>
                <strong className="text-primary font-headline-sm text-base">{productName}</strong>
              </div>

              <div>
                <label className="block text-label-sm font-label-sm text-outline uppercase mb-1">
                  {t.showroomModal.chooseShowroom}
                </label>
                <select
                  value={showroom}
                  onChange={(e) => setShowroom(e.target.value)}
                  className="w-full h-11 px-3 bg-surface-container-low border border-outline-variant text-primary focus:border-primary focus:outline-none rounded-xl"
                >
                  <option>
                    {lang === "VN"
                      ? "Showroom Thảo Điền (18 Đường Số 10, TP. Thủ Đức, HCM)"
                      : "Thao Dien Showroom (18 Street 10, Thu Duc City, HCMC)"}
                  </option>
                  <option>
                    {lang === "VN"
                      ? "Showroom Hoàn Kiếm (45 Quang Trung, Hoàn Kiếm, Hà Nội)"
                      : "Hoan Kiem Showroom (45 Quang Trung, Hoan Kiem, Hanoi)"}
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-label-sm font-label-sm text-outline uppercase mb-1">
                    {t.showroomModal.dateLabel}
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full h-11 px-3 bg-surface-container-low border border-outline-variant text-primary focus:border-primary focus:outline-none rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-label-sm font-label-sm text-outline uppercase mb-1">
                    {t.showroomModal.timeLabel}
                  </label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full h-11 px-3 bg-surface-container-low border border-outline-variant text-primary focus:border-primary focus:outline-none rounded-xl"
                  >
                    <option>{lang === "VN" ? "09:30 - 11:00 (Sáng yên tĩnh)" : "09:30 - 11:00 (Quiet Morning)"}</option>
                    <option>{lang === "VN" ? "14:00 - 15:30 (Trưa ánh sáng đẹp)" : "14:00 - 15:30 (Daylight)"}</option>
                    <option>{lang === "VN" ? "16:30 - 18:00 (Chiều hoàng hôn)" : "16:30 - 18:00 (Sunset)"}</option>
                    <option>{lang === "VN" ? "18:30 - 20:00 (Buổi tối ấm cúng)" : "18:30 - 20:00 (Cozy Evening)"}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-label-sm font-label-sm text-outline uppercase mb-1">
                    {t.showroomModal.nameLabel}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t.showroomModal.namePlaceholder}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-11 px-3 bg-surface-container-low border border-outline-variant text-primary focus:border-primary focus:outline-none rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-label-sm font-label-sm text-outline uppercase mb-1">
                    {t.showroomModal.phoneLabel}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder={t.showroomModal.phonePlaceholder}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-11 px-3 bg-surface-container-low border border-outline-variant text-primary focus:border-primary focus:outline-none rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-primary text-on-primary text-label-md font-label-md uppercase tracking-wider hover:bg-[#27272a] transition-all flex items-center justify-center gap-2 rounded-xl"
                >
                  <span>{t.showroomModal.submitBtn}</span>
                  <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
