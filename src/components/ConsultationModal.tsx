"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { submitConsultationToDb } from "@/services/productService";

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConsultationModal({ isOpen, onClose }: ConsultationModalProps) {
  const { showToast } = useCart();
  const { t } = useLanguage();
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [spaceType, setSpaceType] = useState(t.consultation.spaces.apartment);
  const [notes, setNotes] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      showToast(t.consultation.phoneRequiredError);
      return;
    }
    await submitConsultationToDb({
      fullName: name,
      phone: phone,
      spaceType: spaceType,
      notes: notes,
    });
    setIsSubmitted(true);
    showToast(t.consultation.submitSuccessToast);
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
              {t.consultation.badge}
            </span>
            <h3 className="text-base sm:text-headline-sm font-headline-sm text-primary tracking-tight font-bold">
              {t.consultation.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 sm:p-1.5 text-outline hover:text-primary transition-colors rounded-lg"
            aria-label={t.common.close}
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
                {t.consultation.successTitle}
              </h4>
              <p className="text-body-sm text-on-surface-variant max-w-sm mx-auto">
                {t.consultation.successDesc}
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="mt-4 px-6 py-2.5 bg-primary text-on-primary text-label-md uppercase tracking-wider hover:bg-[#27272a] transition-colors rounded-xl"
              >
                {t.consultation.closeBtn}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-body-sm">
              <div>
                <label className="block text-label-sm font-label-sm text-outline uppercase mb-1">
                  {t.consultation.fullNameLabel}
                </label>
                <input
                  type="text"
                  required
                  placeholder={t.consultation.fullNamePlaceholder}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 px-3 bg-surface-container-low border border-outline-variant text-primary focus:border-primary focus:outline-none rounded-xl"
                />
              </div>

              <div>
                <label className="block text-label-sm font-label-sm text-outline uppercase mb-1">
                  {t.consultation.phoneLabel}
                </label>
                <input
                  type="tel"
                  required
                  placeholder={t.consultation.phonePlaceholder}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-11 px-3 bg-surface-container-low border border-outline-variant text-primary focus:border-primary focus:outline-none rounded-xl"
                />
              </div>

              <div>
                <label className="block text-label-sm font-label-sm text-outline uppercase mb-1">
                  {t.consultation.spaceTypeLabel}
                </label>
                <select
                  value={spaceType}
                  onChange={(e) => setSpaceType(e.target.value)}
                  className="w-full h-11 px-3 bg-surface-container-low border border-outline-variant text-primary focus:border-primary focus:outline-none rounded-xl"
                >
                  <option>{t.consultation.spaces.apartment}</option>
                  <option>{t.consultation.spaces.villa}</option>
                  <option>{t.consultation.spaces.commercial}</option>
                  <option>{t.consultation.spaces.penthouse}</option>
                </select>
              </div>

              <div>
                <label className="block text-label-sm font-label-sm text-outline uppercase mb-1">
                  {t.consultation.notesLabel}
                </label>
                <textarea
                  rows={3}
                  placeholder={t.consultation.notesPlaceholder}
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
                  <span>{t.consultation.submitBtn}</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
                <p className="text-xs text-outline text-center mt-2">
                  {t.consultation.freeNotice}
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
