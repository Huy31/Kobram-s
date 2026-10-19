"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { submitOrderToDb } from "@/services/productService";

interface VietQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderCode?: string;
  totalAmount?: number;
}

const qrTranslations = {
  VN: {
    badgeDirect: "KOMOREBI DIRECT PAY",
    badgeAuto: "TỰ ĐỘNG 24/7",
    title: "Thanh Toán Đơn Hàng Qua VietQR Pro",
    closeModal: "Đóng modal",
    successTitle: "Đã Nhận Thanh Toán Thành Công!",
    successDesc: (code: string) =>
      `Đơn hàng #${code} đã được chuyển tới Xưởng Chế Tác Komorebi. Kỹ thuật viên mộc sẽ liên hệ gia chủ trong vòng 2 giờ.`,
    contractLabel: "Mã hợp đồng:",
    matchedLabel: "Số tiền đã khớp:",
    standardLabel: "Tiêu chuẩn bàn giao:",
    standardVal: "White-glove installation tận phòng",
    completeBtn: "Hoàn tất và Quay lại trang chủ",
    timerPrefix: "Mã QR tự hủy sau:",
    orderTag: (code: string) => `Đơn #${code}`,
    scanApp: "Quét bằng ứng dụng ngân hàng",
    scanSub: "Hỗ trợ tất cả ngân hàng & ví điện tử VN",
    beneficiaryBank: "Ngân Hàng Thụ Hưởng",
    branch: "Chi nhánh Hội Sở",
    accountNum: "Số Tài Khoản",
    copy: "Sao chép",
    copied: "Đã chép",
    accountHolder: "Chủ Tài Khoản",
    exactAmount: "Số Tiền Chính Xác",
    referenceLabel: "Nội Dung Chuyển Khoản Bắt Buộc",
    statusWait: "Trạng thái: Đang chờ tín hiệu xác nhận từ cổng Napas247... Hệ thống tự động phê duyệt đơn sau 10 - 30 giây.",
    changeMethodBtn: "Đổi phương thức thanh toán",
    iHavePaidBtn: "Tôi đã chuyển khoản",
    copiedToast: (val: string) => `Đã sao chép: ${val}`,
    paidSuccessToast: "Giao dịch thanh toán VietQR thành công! Đơn hàng đã được lưu vào hệ thống.",
    currency: "đ",
  },
  EN: {
    badgeDirect: "KOMOREBI DIRECT PAY",
    badgeAuto: "24/7 AUTOMATIC",
    title: "Order Payment via VietQR Pro",
    closeModal: "Close modal",
    successTitle: "Payment Received Successfully!",
    successDesc: (code: string) =>
      `Order #${code} has been dispatched to Komorebi Atelier. Our timber technicians will reach out within 2 hours.`,
    contractLabel: "Contract Code:",
    matchedLabel: "Settled Amount:",
    standardLabel: "Delivery Standard:",
    standardVal: "White-glove room-of-choice installation",
    completeBtn: "Done and Return to Home",
    timerPrefix: "QR code expires in:",
    orderTag: (code: string) => `Order #${code}`,
    scanApp: "Scan with any banking app",
    scanSub: "Supports all major banks & e-wallets",
    beneficiaryBank: "Beneficiary Bank",
    branch: "Headquarters Branch",
    accountNum: "Account Number",
    copy: "Copy",
    copied: "Copied",
    accountHolder: "Beneficiary Name",
    exactAmount: "Exact Amount",
    referenceLabel: "Required Transfer Message",
    statusWait: "Status: Awaiting signal from Napas247 gateway... Auto-approved within 10 - 30 seconds.",
    changeMethodBtn: "Change payment method",
    iHavePaidBtn: "I Have Transferred",
    copiedToast: (val: string) => `Copied: ${val}`,
    paidSuccessToast: "VietQR transaction successful! Order has been recorded.",
    currency: "VND",
  },
};

export default function VietQRModal({
  isOpen,
  onClose,
  orderCode = "KL84920",
  totalAmount,
}: VietQRModalProps) {
  const { items, total, clearCart, showToast } = useCart();
  const { lang } = useLanguage();
  const t = qrTranslations[lang];
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
      showToast(t.copiedToast(text));
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const handleConfirmPaid = async () => {
    setIsSuccess(true);
    await submitOrderToDb({
      orderCode: orderCode,
      customerName: "Khách hàng Komorebi (VietQR)",
      customerPhone: "0900000000",
      shippingAddress: "Địa chỉ theo xác nhận thanh toán trực tuyến VietQR",
      subtotal: effectiveTotal,
      totalAmount: effectiveTotal,
      paymentMethod: "vietqr",
      items: items.map((it) => ({
        productId: it.id,
        productTitle: it.title,
        productSku: it.sku,
        productImage: it.image,
        selectedWood: it.options?.wood,
        selectedUpholstery: it.options?.upholstery,
        selectedSize: it.options?.size,
        unitPrice: it.price,
        quantity: it.quantity,
        subtotal: it.price * it.quantity,
      })),
    });
    showToast(t.paidSuccessToast);
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
                {t.badgeDirect}
              </span>
              <span className="px-1.5 py-0.5 bg-primary text-on-primary text-label-sm font-label-sm font-bold rounded-md">
                {t.badgeAuto}
              </span>
            </div>
            <h3 className="text-headline-sm font-headline-sm text-primary tracking-tight mt-0.5">
              {t.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-outline hover:text-primary border border-outline-variant hover:border-primary transition-colors rounded-lg"
            aria-label={t.closeModal}
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
                {t.successTitle}
              </h4>
              <p className="text-on-surface-variant max-w-md mx-auto text-body-md">
                {t.successDesc(orderCode)}
              </p>
              <div className="p-4 bg-surface-container-low border border-outline-variant text-body-sm text-left max-w-md mx-auto space-y-1 rounded-xl">
                <p><strong>{t.contractLabel}</strong> KL-2025-KYOTO-{orderCode}</p>
                <p><strong>{t.matchedLabel}</strong> {effectiveTotal.toLocaleString(lang === "EN" ? "en-US" : "vi-VN")} {t.currency}</p>
                <p><strong>{t.standardLabel}</strong> {t.standardVal}</p>
              </div>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-8 py-3 bg-primary text-on-primary uppercase text-label-md tracking-wider hover:bg-[#27272a] transition-colors rounded-xl"
                >
                  {t.completeBtn}
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
                    {t.timerPrefix}
                  </span>
                  <span className="font-mono font-bold text-primary text-body-md" id="qr-countdown">
                    {timeFormatted}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                  <span className="text-label-sm font-label-sm text-primary font-bold tracking-wider uppercase">
                    {t.orderTag(orderCode)}
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
                      alt={`QR ${effectiveTotal} ${orderCode}`}
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
                      {t.scanApp}
                    </span>
                    <span className="text-body-sm font-body-sm text-outline">
                      {t.scanSub}
                    </span>
                  </div>
                </div>

                {/* Details Column */}
                <div className="md:col-span-6 space-y-space-sm text-body-sm font-body-sm">
                  {/* Bank */}
                  <div className="p-space-sm bg-surface-container-low border border-outline-variant/40 rounded-xl">
                    <span className="text-label-sm font-label-sm text-outline uppercase block">
                      {t.beneficiaryBank}
                    </span>
                    <div className="flex items-center justify-between mt-0.5">
                      <strong className="text-on-surface font-semibold text-body-md">
                        Vietcombank (VCB)
                      </strong>
                      <span className="text-label-sm font-label-sm text-outline">{t.branch}</span>
                    </div>
                  </div>

                  {/* Account Number */}
                  <div className="p-space-sm bg-surface-container-low border border-outline-variant/40 rounded-xl">
                    <span className="text-label-sm font-label-sm text-outline uppercase block">
                      {t.accountNum}
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
                        {copiedField === "account" ? t.copied : t.copy}
                      </button>
                    </div>
                  </div>

                  {/* Beneficiary */}
                  <div className="p-space-sm bg-surface-container-low border border-outline-variant/40 rounded-xl">
                    <span className="text-label-sm font-label-sm text-outline uppercase block">
                      {t.accountHolder}
                    </span>
                    <strong className="text-on-surface font-medium block mt-0.5 uppercase tracking-wide">
                      CÔNG TY CP KOMOREBI LIVING
                    </strong>
                  </div>

                  {/* Exact Amount */}
                  <div className="p-space-sm bg-surface-container-low border border-primary rounded-xl">
                    <span className="text-label-sm font-label-sm text-outline uppercase block">
                      {t.exactAmount}
                    </span>
                    <div className="flex items-center justify-between mt-0.5">
                      <strong className="text-headline-sm font-headline-sm text-primary font-bold">
                        {effectiveTotal.toLocaleString(lang === "EN" ? "en-US" : "vi-VN")} {t.currency}
                      </strong>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(effectiveTotal.toString(), "amount")}
                        className="text-label-sm font-label-sm text-primary hover:underline font-bold border border-outline-variant px-2 py-0.5 bg-surface-container-lowest transition-colors rounded-lg"
                      >
                        {copiedField === "amount" ? t.copied : t.copy}
                      </button>
                    </div>
                  </div>

                  {/* Reference / Code */}
                  <div className="p-space-sm bg-surface-container-low border border-primary rounded-xl">
                    <span className="text-label-sm font-label-sm text-outline uppercase block">
                      {t.referenceLabel}
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
                        {copiedField === "code" ? t.copied : t.copy}
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
                  {t.statusWait}
                </p>
              </div>

              {/* Bottom Actions */}
              <div className="pt-space-md border-t border-outline-variant/40 flex flex-col sm:flex-row items-center justify-between gap-space-sm">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-space-md py-3 text-label-md font-label-md border border-outline-variant hover:border-primary text-primary transition-colors text-center rounded-xl"
                >
                  {t.changeMethodBtn}
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPaid}
                  className="w-full sm:w-auto px-space-lg py-3 bg-primary text-on-primary text-label-md font-label-md tracking-wider uppercase hover:bg-[#27272A] transition-colors flex items-center justify-center gap-2 rounded-xl"
                >
                  <span>{t.iHavePaidBtn}</span>
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
