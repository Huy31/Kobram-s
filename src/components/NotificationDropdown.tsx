"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  timeEn: string;
  category: "project" | "order" | "collection" | "survey" | "system";
  categoryLabelVn: string;
  categoryLabelEn: string;
  icon: string;
  link?: string;
  isRead: boolean;
}

const initialNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Cập nhật tiến độ dự án Villa An Nhiên",
    desc: "Bộ hồ sơ bản vẽ CAD & 3D quét laser công trình KM-V2408 đã được cập nhật thành công.",
    time: "15 phút trước",
    timeEn: "15 mins ago",
    category: "project",
    categoryLabelVn: "Dự án kiến trúc",
    categoryLabelEn: "Architecture",
    icon: "architecture",
    link: "/du-an-kien-truc",
    isRead: false,
  },
  {
    id: "notif-2",
    title: "Đơn hàng #KM-8829 đang vận chuyển",
    desc: "Tác phẩm Ghế Thư Giãn Kura Lounge Chair đã hoàn thiện kiểm thử mộng khô và đang giao White-Glove.",
    time: "2 giờ trước",
    timeEn: "2 hours ago",
    category: "order",
    categoryLabelVn: "Đơn hàng",
    categoryLabelEn: "Order",
    icon: "local_shipping",
    link: "/gio-hang",
    isRead: false,
  },
  {
    id: "notif-3",
    title: "Phát hành BST Kyoto Archive #09 - #15",
    desc: "Bộ sưu tập bàn ghế ghép mộng Kigumi giới hạn 50 bộ vừa mở thêm suất đăng ký mới.",
    time: "1 ngày trước",
    timeEn: "1 day ago",
    category: "collection",
    categoryLabelVn: "Bộ sưu tập",
    categoryLabelEn: "Collection",
    icon: "auto_awesome",
    link: "/bo-suu-tap",
    isRead: false,
  },
  {
    id: "notif-4",
    title: "Lịch khảo sát 3D Laser được xác nhận",
    desc: "Chuyên gia mộc Komorebi sẽ có mặt tại công trình của bạn vào 9h00 sáng Thứ Bảy.",
    time: "2 ngày trước",
    timeEn: "2 days ago",
    category: "survey",
    categoryLabelVn: "Khảo sát",
    categoryLabelEn: "3D Survey",
    icon: "calendar_month",
    link: "/du-an-kien-truc",
    isRead: true,
  },
  {
    id: "notif-5",
    title: "Chào mừng đến với Komorebi Circle",
    desc: "Kích hoạt thành công đặc quyền tư vấn mộc 1-1 cùng nghệ nhân xưởng Arashiyama.",
    time: "4 ngày trước",
    timeEn: "4 days ago",
    category: "system",
    categoryLabelVn: "Hội viên",
    categoryLabelEn: "Membership",
    icon: "verified",
    link: "/tai-khoan",
    isRead: true,
  },
];

export default function NotificationDropdown() {
  const { lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead;
    return true;
  });

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true } : item))
    );
  };

  const deleteNotification = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        id="btn-header-notifications"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={lang === "VN" ? "Thông báo" : "Notifications"}
        aria-expanded={isOpen}
        className={`min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center p-2 text-on-surface hover:text-primary transition-all relative active:scale-95 group rounded-full hover:bg-surface-container-low dark:text-zinc-200 dark:hover:text-white dark:hover:bg-white/10 cursor-pointer ${
          isOpen ? "bg-surface-container-low dark:bg-white/15 text-primary dark:text-white" : ""
        }`}
        title={lang === "VN" ? `Thông báo (${unreadCount} mới)` : `Notifications (${unreadCount} new)`}
      >
        <span className="material-symbols-outlined text-[20px] sm:text-[22px] group-hover:scale-110 transition-transform pointer-events-none">
          notifications
        </span>
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-4 h-4 header-badge text-[10px] font-extrabold rounded-full flex items-center justify-center pointer-events-none shadow-sm leading-none bg-red-600 text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div className="absolute right-[-70px] sm:right-0 top-full mt-2 w-[330px] sm:w-[380px] bg-surface-container-lowest border border-outline-variant shadow-2xl rounded-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150 text-left">
          {/* Header */}
          <div className="px-4 py-3 border-b border-outline-variant/50 bg-surface-container-low/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-lg text-primary">notifications</span>
              <h3 className="font-headline font-bold text-sm text-primary">
                {lang === "VN" ? "Thông Báo" : "Notifications"}
              </h3>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-primary text-on-primary rounded-full">
                  {unreadCount} {lang === "VN" ? "mới" : "new"}
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-[11px] text-outline hover:text-primary transition-colors flex items-center gap-1 font-medium cursor-pointer"
                title={lang === "VN" ? "Đánh dấu tất cả đã đọc" : "Mark all as read"}
              >
                <span className="material-symbols-outlined text-sm">done_all</span>
                <span>{lang === "VN" ? "Đã đọc tất cả" : "Mark read"}</span>
              </button>
            )}
          </div>

          {/* Filter tabs */}
          <div className="px-4 py-1.5 border-b border-outline-variant/30 flex items-center gap-2 bg-surface-container-lowest text-xs">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                filter === "all"
                  ? "bg-primary text-on-primary"
                  : "text-outline hover:text-primary"
              }`}
            >
              {lang === "VN" ? "Tất cả" : "All"} ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("unread")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                filter === "unread"
                  ? "bg-primary text-on-primary"
                  : "text-outline hover:text-primary"
              }`}
            >
              {lang === "VN" ? "Chưa đọc" : "Unread"} ({unreadCount})
            </button>
          </div>

          {/* Notification Items List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-outline-variant/30">
            {filteredNotifications.length === 0 ? (
              <div className="py-10 text-center px-4 space-y-2">
                <span className="material-symbols-outlined text-4xl text-outline block">
                  notifications_off
                </span>
                <p className="text-xs text-on-surface-variant font-light">
                  {lang === "VN"
                    ? "Không có thông báo nào trong danh mục này."
                    : "No notifications in this category."}
                </p>
              </div>
            ) : (
              filteredNotifications.map((item) => {
                const categoryLabel = lang === "VN" ? item.categoryLabelVn : item.categoryLabelEn;
                const timeText = lang === "VN" ? item.time : item.timeEn;

                return (
                  <div
                    key={item.id}
                    onClick={() => markAsRead(item.id)}
                    className={`p-3.5 sm:p-4 hover:bg-surface-container-low transition-colors cursor-pointer relative group flex items-start gap-3 ${
                      !item.isRead ? "bg-primary/[0.03] dark:bg-white/[0.04]" : ""
                    }`}
                  >
                    {/* Category Icon */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105 ${
                        !item.isRead
                          ? "bg-primary text-on-primary border-primary dark:bg-white dark:text-[#09090b]"
                          : "bg-surface-container text-outline border-outline-variant"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {item.icon}
                      </span>
                    </div>

                    {/* Notification content */}
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-outline font-semibold">
                          {categoryLabel}
                        </span>
                        <span className="text-[10px] text-outline font-mono">
                          {timeText}
                        </span>
                      </div>

                      <h4
                        className={`text-xs font-bold leading-snug line-clamp-1 mb-1 ${
                          !item.isRead ? "text-primary" : "text-on-surface"
                        }`}
                      >
                        {item.title}
                      </h4>

                      <p className="text-[11px] text-on-surface-variant line-clamp-2 leading-relaxed font-light">
                        {item.desc}
                      </p>

                      {item.link && (
                        <div className="mt-2">
                          <Link
                            href={item.link}
                            onClick={() => setIsOpen(false)}
                            className="text-[11px] text-primary hover:underline font-semibold inline-flex items-center gap-0.5"
                          >
                            <span>{lang === "VN" ? "Xem chi tiết" : "View details"}</span>
                            <span className="material-symbols-outlined text-xs">arrow_forward</span>
                          </Link>
                        </div>
                      )}
                    </div>

                    {/* Unread dot / Delete button */}
                    <div className="absolute top-4 right-3 flex flex-col items-center gap-2">
                      {!item.isRead && (
                        <span
                          className="w-2 h-2 rounded-full bg-red-600 block shadow-xs"
                          title={lang === "VN" ? "Chưa đọc" : "Unread"}
                        />
                      )}
                      <button
                        type="button"
                        onClick={(e) => deleteNotification(e, item.id)}
                        className="opacity-0 group-hover:opacity-100 text-outline hover:text-red-500 transition-opacity p-0.5 cursor-pointer"
                        title={lang === "VN" ? "Xóa thông báo" : "Delete"}
                        aria-label="Delete notification"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-outline-variant/40 bg-surface-container-low/40 flex items-center justify-between text-xs">
            <Link
              href="/tai-khoan"
              onClick={() => setIsOpen(false)}
              className="text-outline hover:text-primary transition-colors text-[11px] font-medium"
            >
              {lang === "VN" ? "Cài đặt thông báo" : "Notification settings"}
            </Link>
            <span className="text-[10px] text-outline font-mono">Komorebi Atelier</span>
          </div>
        </div>
      )}
    </div>
  );
}
