"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";

interface VietQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderCode?: string;
  totalAmount?: number;
}

export default function VietQRModal({
  isOpen,
  onClose,
  orderCode = "KL84920",
  totalAmount,
}: VietQRModalProps) {
  const { total, clearCart, showToast } = useCart();
  const effectiveTotal = totalAmount !== undefined ? totalAmount : total;

  // Countdown timer: 10 minutes (600 seconds)
  const [secondsLeft, setSecondsLeft] = useState(600);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setSecondsLeft(600);
    setIsSuccess(false);

    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeFormatted = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  const copyToClipboard = (text: string, fieldName: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      showToast(`Đã sao chép: ${text}`);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const handleConfirmPaid = () => {
    setIsSuccess(true);
    showToast("Giao dịch thanh toán VietQR thành công! Đơn hàng đã được xác nhận.");
    setTimeout(() => {
      clearCart();
    }, 1500);
  };

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=00020101021238540010A0000007270126000697043601121903882999990208QRIBFTTA53037045408${effectiveTotal}5802VN62110807${orderCode}6304C63E`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-space-md sm:p-space-lg bg-black/75 backdrop-blur-sm transition-all duration-300"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-surface-container-lowest border border-outline text-primary max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in-95 rounded-2xl sm:rounded-3xl">
        {/* Header */}
        <div className="sticky top-0 bg-surface-container-lowest z-10 flex items-center justify-between px-space-lg py-space-md border-b border-outline-variant/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-label-sm font-label-sm text-outline uppercase tracking-widest">
                KOMOREBI DIRECT PAY
              </span>
              <span className="px-1.5 py-0.5 bg-primary text-on-primary text-label-sm font-label-sm font-bold rounded-md">
                TỰ ĐỘNG 24/7
              </span>
            </div>
            <h3 className="text-headline-sm font-headline-sm text-primary tracking-tight mt-0.5">
              Thanh Toán Đơn Hàng Qua VietQR Pro
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-outline hover:text-primary border border-outline-variant hover:border-primary transition-colors rounded-lg"
            aria-label="Đóng modal"
          >
            <span className="material-symbols-outlined text-[20px] block">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-space-lg space-y-space-md">
          {isSuccess ? (
            <div className="py-12 px-6 text-center space-y-4">
              <div className="w-16 h-16 bg-primary text-on-primary mx-auto flex items-center justify-center rounded-full shadow-lg">
                <span className="material-symbols-outlined text-4xl">check</span>
              </div>
              <h4 className="text-headline-md font-bold text-primary">
                Đã Nhận Thanh Toán Thành Công!
              </h4>
              <p className="text-on-surface-variant max-w-md mx-auto text-body-md">
                Đơn hàng <span className="font-mono font-bold text-primary">#{orderCode}</span> đã được chuyển tới Xưởng Chế Tác Komorebi. Kỹ thuật viên mộc sẽ liên hệ gia chủ trong vòng 2 giờ.
              </p>
              <div className="p-4 bg-surface-container-low border border-outline-variant text-body-sm text-left max-w-md mx-auto space-y-1 rounded-xl">
                <p><strong>Mã hợp đồng:</strong> KL-2025-KYOTO-{orderCode}</p>
                <p><strong>Số tiền đã khớp:</strong> {effectiveTotal.toLocaleString("vi-VN")} đ</p>
                <p><strong>Tiêu chuẩn bàn giao:</strong> White-glove installation tận phòng</p>
              </div>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-8 py-3 bg-primary text-on-primary uppercase text-label-md tracking-wider hover:bg-[#27272a] transition-colors rounded-xl"
                >
                  Hoàn tất và Quay lại trang chủ
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Countdown Banner */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-space-sm bg-surface-container-low p-space-sm px-space-md border border-outline-variant/60 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">schedule</span>
                  <span className="text-body-sm font-body-sm text-on-surface-variant">
                    Mã QR tự hủy sau:
                  </span>
                  <span className="font-mono font-bold text-primary text-body-md" id="qr-countdown">
                    {timeFormatted}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                  <span className="text-label-sm font-label-sm text-primary font-bold tracking-wider uppercase">
                    Đơn #{orderCode}
                  </span>
                </div>
              </div>

              {/* QR and Transfer Info */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-space-md items-center">
                {/* QR Code Column */}
                <div className="md:col-span-6 flex flex-col items-center justify-center p-space-md bg-white border border-primary relative group rounded-2xl">
                  <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-outline-variant/30 text-label-sm font-label-sm font-mono text-outline">
                    <span>VIETQR</span>
                    <span>NAPAS 247</span>
                  </div>
                  <div className="relative p-2 bg-white border border-outline-variant/60 shadow-inner flex items-center justify-center rounded-xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="w-48 h-48 sm:w-52 sm:h-52 object-contain"
                      src={qrUrl}
                      alt={`Mã QR Thanh Toán Vietcombank ${effectiveTotal.toLocaleString("vi-VN")}đ ${orderCode}`}
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-9 h-9 bg-white border border-primary flex items-center justify-center shadow-sm rounded-lg">
                        <span className="material-symbols-outlined text-[20px] text-primary">
                          account_balance
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-center">
                    <span className="text-label-sm font-label-sm text-primary font-bold tracking-wider uppercase block">
                      Quét bằng ứng dụng ngân hàng
                    </span>
                    <span className="text-body-sm font-body-sm text-outline">
                      Hỗ trợ tất cả ngân hàng &amp; ví điện tử VN
                    </span>
                  </div>
                </div>

                {/* Details Column */}
                <div className="md:col-span-6 space-y-space-sm text-body-sm font-body-sm">
                  {/* Bank */}
                  <div className="p-space-sm bg-surface-container-low border border-outline-variant/40 rounded-xl">
                    <span className="text-label-sm font-label-sm text-outline uppercase block">
                      Ngân Hàng Thụ Hưởng
                    </span>
                    <div className="flex items-center justify-between mt-0.5">
                      <strong className="text-on-surface font-semibold text-body-md">
                        Vietcombank (VCB)
                      </strong>
                      <span className="text-label-sm font-label-sm text-outline">Chi nhánh Hội Sở</span>
                    </div>
                  </div>

                  {/* Account Number */}
                  <div className="p-space-sm bg-surface-container-low border border-outline-variant/40 rounded-xl">
                    <span className="text-label-sm font-label-sm text-outline uppercase block">
                      Số Tài Khoản
                    </span>
                    <div className="flex items-center justify-between mt-0.5">
                      <strong className="text-primary font-mono text-body-lg font-bold tracking-wider">
                        1903 8829 9999
                      </strong>
                      <button
                        type="button"
                        onClick={() => copyToClipboard("190388299999", "account")}
                        className="text-label-sm font-label-sm text-primary hover:underline font-bold border border-outline-variant px-2 py-0.5 bg-surface-container-lowest transition-colors rounded-lg"
                      >
                        {copiedField === "account" ? "Đã chép" : "Sao chép"}
                      </button>
                    </div>
                  </div>

                  {/* Beneficiary */}
                  <div className="p-space-sm bg-surface-container-low border border-outline-variant/40 rounded-xl">
                    <span className="text-label-sm font-label-sm text-outline uppercase block">
                      Chủ Tài Khoản
                    </span>
                    <strong className="text-on-surface font-medium block mt-0.5 uppercase tracking-wide">
                      CÔNG TY CP KOMOREBI LIVING
                    </strong>
                  </div>

                  {/* Exact Amount */}
                  <div className="p-space-sm bg-surface-container-low border border-primary rounded-xl">
                    <span className="text-label-sm font-label-sm text-outline uppercase block">
                      Số Tiền Chính Xác
                    </span>
                    <div className="flex items-center justify-between mt-0.5">
                      <strong className="text-headline-sm font-headline-sm text-primary font-bold">
                        {effectiveTotal.toLocaleString("vi-VN")} đ
                      </strong>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(effectiveTotal.toString(), "amount")}
                        className="text-label-sm font-label-sm text-primary hover:underline font-bold border border-outline-variant px-2 py-0.5 bg-surface-container-lowest transition-colors rounded-lg"
                      >
                        {copiedField === "amount" ? "Đã chép" : "Sao chép"}
                      </button>
                    </div>
                  </div>

                  {/* Reference / Code */}
                  <div className="p-space-sm bg-surface-container-low border border-primary rounded-xl">
                    <span className="text-label-sm font-label-sm text-outline uppercase block">
                      Nội Dung Chuyển Khoản Bắt Buộc
                    </span>
                    <div className="flex items-center justify-between mt-0.5">
                      <strong className="text-primary font-mono text-headline-sm font-bold tracking-widest">
                        {orderCode}
                      </strong>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(orderCode, "code")}
                        className="text-label-sm font-label-sm text-primary hover:underline font-bold border border-outline-variant px-2 py-0.5 bg-surface-container-lowest transition-colors rounded-lg"
                      >
                        {copiedField === "code" ? "Đã chép" : "Sao chép"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-3 p-space-sm px-space-md border border-outline-variant/40 bg-surface-container-lowest rounded-xl">
                <span className="material-symbols-outlined text-primary text-[20px] animate-spin">
                  progress_activity
                </span>
                <p className="text-body-sm font-body-sm text-on-surface-variant flex-1">
                  <span className="font-medium text-primary">Trạng thái:</span> Đang chờ tín hiệu xác nhận từ cổng Napas247... Hệ thống tự động phê duyệt đơn sau 10 - 30 giây.
                </p>
              </div>

              {/* Bottom Actions */}
              <div className="pt-space-md border-t border-outline-variant/40 flex flex-col sm:flex-row items-center justify-between gap-space-sm">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-space-md py-3 text-label-md font-label-md border border-outline-variant hover:border-primary text-primary transition-colors text-center rounded-xl"
                >
                  Đổi phương thức thanh toán
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPaid}
                  className="w-full sm:w-auto px-space-lg py-3 bg-primary text-on-primary text-label-md font-label-md tracking-wider uppercase hover:bg-[#27272A] transition-colors flex items-center justify-center gap-2 rounded-xl"
                >
                  <span>Tôi đã chuyển khoản</span>
                  <span className="material-symbols-outlined text-[16px]">check</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
