"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";

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
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("2025-11-20");
  const [time, setTime] = useState("10:00 - 11:30");
  const [showroom, setShowroom] = useState("Showroom Thảo Điền (18 Đường Số 10, TP. Thủ Đức, HCM)");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      showToast("Vui lòng cung cấp số điện thoại để nhận mã xác nhận.");
      return;
    }
    setSubmitted(true);
    showToast(`Đã đặt lịch trải nghiệm ${productName} thành công!`);
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
              SHOWROOM PRIVÉ
            </span>
            <h3 className="text-base sm:text-headline-sm font-headline-sm text-primary tracking-tight font-bold">
              Đặt Lịch Thử Sản Phẩm Trực Tiếp
            </h3>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1 sm:p-1.5 text-outline hover:text-primary transition-colors rounded-lg"
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
                Đã Khởi Tạo Lịch Hẹn Trải Nghiệm
              </h4>
              <p className="text-body-sm text-on-surface-variant max-w-sm mx-auto">
                Chuyên viên Atelier tại <strong className="text-primary">{showroom.split("(")[0]}</strong> đã chuẩn bị mẫu mộc <strong className="text-primary">{productName}</strong> và trà đạo đón tiếp quý khách vào lúc <strong className="text-primary">{time} ngày {date}</strong>.
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="mt-4 px-6 py-2.5 bg-primary text-on-primary text-label-md uppercase tracking-wider hover:bg-[#27272a] transition-colors rounded-xl"
              >
                Đóng
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-body-sm">
              <div className="p-3 bg-surface-container-low border border-outline-variant/60 rounded-xl">
                <span className="text-label-sm font-label-sm text-outline uppercase block">Vật Phẩm Trải Nghiệm</span>
                <strong className="text-primary font-headline-sm text-base">{productName}</strong>
              </div>

              <div>
                <label className="block text-label-sm font-label-sm text-outline uppercase mb-1">
                  Chọn không gian trưng bày *
                </label>
                <select
                  value={showroom}
                  onChange={(e) => setShowroom(e.target.value)}
                  className="w-full h-11 px-3 bg-surface-container-low border border-outline-variant text-primary focus:border-primary focus:outline-none rounded-xl"
                >
                  <option>Showroom Thảo Điền (18 Đường Số 10, TP. Thủ Đức, HCM)</option>
                  <option>Showroom Hoàn Kiếm (45 Quang Trung, Hoàn Kiếm, Hà Nội)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-label-sm font-label-sm text-outline uppercase mb-1">
                    Ngày hẹn *
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
                    Khung giờ *
                  </label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full h-11 px-3 bg-surface-container-low border border-outline-variant text-primary focus:border-primary focus:outline-none rounded-xl"
                  >
                    <option>09:30 - 11:00 (Sáng yên tĩnh)</option>
                    <option>14:00 - 15:30 (Trưa ánh sáng đẹp)</option>
                    <option>16:30 - 18:00 (Chiều hoàng hôn)</option>
                    <option>18:30 - 20:00 (Buổi tối ấm cúng)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-label-sm font-label-sm text-outline uppercase mb-1">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Quý khách..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-11 px-3 bg-surface-container-low border border-outline-variant text-primary focus:border-primary focus:outline-none rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-label-sm font-label-sm text-outline uppercase mb-1">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="09xx xxx xxx"
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
                  <span>Xác Nhận Giữ Chỗ Trải Nghiệm</span>
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
