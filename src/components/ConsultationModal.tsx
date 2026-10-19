"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConsultationModal({ isOpen, onClose }: ConsultationModalProps) {
  const { showToast } = useCart();
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [spaceType, setSpaceType] = useState("Căn hộ cao cấp / Penthouse");
  const [notes, setNotes] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      showToast("Vui lòng nhập số điện thoại liên hệ.");
      return;
    }
    setIsSubmitted(true);
    showToast("Đã gửi yêu cầu tư vấn thành công!");
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setPhone("");
    setName("");
    setNotes("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-surface-container-lowest border border-outline text-primary max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl relative rounded-2xl sm:rounded-3xl">
        {/* Header */}
        <div className="sticky top-0 bg-surface-container-lowest z-10 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-outline-variant">
          <div>
            <span className="text-[10px] sm:text-label-sm font-label-sm text-outline uppercase tracking-widest block">
              ATELIER CONSULTING
            </span>
            <h3 className="text-base sm:text-headline-sm font-headline-sm text-primary tracking-tight font-bold">
              Tư Vấn Kiến Trúc &amp; Khảo Sát Không Gian
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 sm:p-1.5 text-outline hover:text-primary transition-colors rounded-lg"
            aria-label="Đóng"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-4 sm:p-6">
          {isSubmitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 bg-primary text-on-primary mx-auto flex items-center justify-center rounded-full">
                <span className="material-symbols-outlined text-3xl">done</span>
              </div>
              <h4 className="text-headline-sm font-bold text-primary">
                Đăng Ký Thành Công
              </h4>
              <p className="text-body-sm text-on-surface-variant max-w-sm mx-auto">
                KTS chủ trì của Komorebi Living sẽ liên hệ qua số điện thoại <strong className="text-primary">{phone}</strong> trong vòng 30 phút để lên lịch hẹn khảo sát thực tế.
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="mt-4 px-6 py-2.5 bg-primary text-on-primary text-label-md uppercase tracking-wider hover:bg-[#27272a] transition-colors rounded-xl"
              >
                Đóng cửa sổ
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-body-sm">
              <div>
                <label className="block text-label-sm font-label-sm text-outline uppercase mb-1">
                  Họ và tên của bạn *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Kts. Nguyễn Văn A / Gia chủ..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 px-3 bg-surface-container-low border border-outline-variant text-primary focus:border-primary focus:outline-none rounded-xl"
                />
              </div>

              <div>
                <label className="block text-label-sm font-label-sm text-outline uppercase mb-1">
                  Số điện thoại nhận tư vấn 1-1 *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="0988 xxx xxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-11 px-3 bg-surface-container-low border border-outline-variant text-primary focus:border-primary focus:outline-none rounded-xl"
                />
              </div>

              <div>
                <label className="block text-label-sm font-label-sm text-outline uppercase mb-1">
                  Loại hình công trình
                </label>
                <select
                  value={spaceType}
                  onChange={(e) => setSpaceType(e.target.value)}
                  className="w-full h-11 px-3 bg-surface-container-low border border-outline-variant text-primary focus:border-primary focus:outline-none rounded-xl"
                >
                  <option>Căn hộ cao cấp / Penthouse</option>
                  <option>Biệt thự nghỉ dưỡng / Nhà phố vườn</option>
                  <option>Studio thiết kế / Không gian triển lãm</option>
                  <option>Dự án kiến trúc thương mại / Khách sạn boutique</option>
                </select>
              </div>

              <div>
                <label className="block text-label-sm font-label-sm text-outline uppercase mb-1">
                  Yêu cầu mộc bản đặc thù
                </label>
                <textarea
                  rows={3}
                  placeholder="Ví dụ: Cần may đo bàn ăn dài 2.8m gỗ sồi tự nhiên; khảo sát góc ngả phòng trà thiền..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 bg-surface-container-low border border-outline-variant text-primary focus:border-primary focus:outline-none resize-none rounded-xl"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-primary text-on-primary text-label-md font-label-md uppercase tracking-wider hover:bg-[#27272a] transition-all flex items-center justify-center gap-2 rounded-xl"
                >
                  <span>Xác Nhận Đặt Lịch Tư Vấn Miễn Phí</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
                <p className="text-xs text-outline text-center mt-2">
                  * Miễn phí hoàn toàn bản vẽ 3D bố trí và báo giá vật tư chi tiết.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
