"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

interface Message {
  id: string;
  sender: "ai" | "user";
  text: string;
  time: string;
}

export default function ChatbotWidget() {
  const pathname = usePathname();
  const { lang, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = customText || inputMessage.trim();
    if (!textToSend) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString(lang === "VN" ? "vi-VN" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend,
      time: timeStr,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputMessage("");

    setTimeout(() => {
      const aiReply: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: t.chatbot.aiReplyIntro,
        time: new Date().toLocaleTimeString(lang === "VN" ? "vi-VN" : "en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, aiReply]);
    }, 600);
  };

  // Không hiển thị chatbot trên trang đăng nhập
  if (pathname === "/dang-nhap" || pathname?.startsWith("/dang-nhap")) {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans selection:bg-black selection:text-white">
      {/* 1. Nút bong bóng tròn mở Chatbot (không có chữ) */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#18181B] text-white shadow-2xl hover:bg-black hover:scale-110 active:scale-95 transition-all flex items-center justify-center border border-white/20 cursor-pointer"
          title={t.chatbot.openTooltip}
          aria-label={t.chatbot.openTooltip}
        >
          <span className="material-symbols-outlined text-[24px] sm:text-[26px] text-amber-200 group-hover:scale-110 group-hover:rotate-12 transition-transform">
            auto_awesome
          </span>
          <span className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#18181B] animate-pulse" />
        </button>
      )}

      {/* 2. Cửa sổ Chatbot đang mở */}
      {isOpen && (
        <div className="w-[350px] sm:w-[390px] h-[520px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-[#E4E4E7] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300 dark:bg-[#121215] dark:border-white/15">
          {/* Header */}
          <div className="px-4 sm:px-5 py-3.5 bg-[#18181B] text-white flex items-center justify-between border-b border-white/10 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-full bg-white/10 flex items-center justify-center border border-white/20 text-amber-200">
                <span className="material-symbols-outlined text-[20px]">
                  auto_awesome
                </span>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#18181B]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold tracking-tight text-white">
                    {t.chatbot.title}
                  </h3>
                  <span className="text-[9px] uppercase font-mono tracking-widest px-1.5 py-0.2 bg-amber-400/20 text-amber-300 border border-amber-300/30 rounded">
                    Beta
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 font-light flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>{t.chatbot.subtitle}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                title={t.chatbot.minimizeTooltip}
                aria-label={t.chatbot.minimizeTooltip}
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
          </div>

          {/* Chat Body: Để trống theo yêu cầu của người dùng */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 bg-[#FAF9F8] dark:bg-[#0d0d10]">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-4 my-auto space-y-3.5 select-none">
                <div className="w-14 h-14 rounded-2xl bg-[#F4F4F5] border border-[#E4E4E7] flex items-center justify-center text-[#71717A] shadow-xs chatbot-empty-icon dark:bg-[#202026] dark:border-white/15">
                  <span className="material-symbols-outlined text-[28px] text-[#18181B] dark:text-white">
                    chair
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#18181B] dark:text-white">
                    {t.chatbot.emptyTitle}
                  </h4>
                  <p className="text-xs text-[#71717A] mt-1 max-w-[260px] leading-relaxed dark:text-zinc-300">
                    {t.chatbot.emptyDesc}
                  </p>
                </div>

                {/* Gợi ý bắt đầu nhanh */}
                <div className="pt-2 w-full space-y-1.5">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-[#A1A1AA] dark:text-zinc-400">
                    {t.chatbot.suggestedLabel}
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {t.chatbot.suggestions.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSendMessage(undefined, item)}
                        className="text-left text-xs text-[#3F3F46] bg-white hover:bg-[#F4F4F5] border border-[#E4E4E7] hover:border-black/30 px-3 py-2 rounded-xl transition-all flex items-center justify-between group dark:bg-[#18181c] dark:text-zinc-200 dark:border-white/10 dark:hover:bg-[#202026] dark:hover:border-white/20 dark:hover:text-white"
                      >
                        <span className="truncate pr-2">{item}</span>
                        <span className="material-symbols-outlined text-[14px] text-[#A1A1AA] group-hover:translate-x-0.5 group-hover:text-black dark:text-zinc-400 dark:group-hover:text-white transition-all">
                          arrow_forward
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-[#18181B] text-white rounded-br-xs dark:bg-white dark:text-[#09090b]"
                          : "bg-white text-[#18181B] border border-[#E4E4E7] shadow-2xs rounded-bl-xs dark:bg-[#18181c] dark:text-zinc-100 dark:border-white/10"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-[#A1A1AA] font-mono mt-1 px-1 dark:text-zinc-400">
                      {msg.time}
                    </span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-[#E4E4E7] flex-shrink-0 dark:bg-[#121215] dark:border-white/15">
            <form
              onSubmit={(e) => handleSendMessage(e)}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={t.chatbot.placeholder}
                  className="w-full h-10 bg-[#F4F4F5] border border-transparent focus:border-black px-3.5 pr-8 text-xs text-[#18181B] placeholder:text-[#A1A1AA] rounded-xl focus:bg-white focus:outline-none transition-colors dark:bg-[#18181c] dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-white/30 dark:focus:bg-[#18181c]"
                />
                {inputMessage && (
                  <button
                    type="button"
                    onClick={() => setInputMessage("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black dark:hover:text-white"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      cancel
                    </span>
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="w-10 h-10 rounded-xl bg-[#18181B] text-white hover:bg-black active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center flex-shrink-0 dark:bg-white dark:text-[#09090b] dark:hover:bg-zinc-200"
                title={t.chatbot.sendTooltip}
              >
                <span className="material-symbols-outlined text-[18px]">
                  arrow_upward
                </span>
              </button>
            </form>

            <div className="flex items-center justify-between text-[10px] font-mono text-[#A1A1AA] mt-2 px-1 dark:text-zinc-400">
              <span>Komorebi AI Assistant</span>
              <span>Wabi-Sabi Atelier</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
