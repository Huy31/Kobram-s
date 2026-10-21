"use client";

import React from "react";
import "./ValueCard.css";

export interface ValueCardProps {
  icon?: string;
  title?: string;
  description?: string;
  subText?: string;
  subIcon?: string;
  className?: string;
  index?: number;
  children?: React.ReactNode;
}

export default function ValueCard({
  icon,
  title,
  description,
  subText,
  subIcon,
  className = "",
  children,
}: ValueCardProps) {
  if (children) {
    return <div className={`tunnel-card ${className}`}>{children}</div>;
  }

  return (
    <div className={`tunnel-card ${className}`}>
      {/* Stage 1: Front visible card before hover */}
      <div className="stage-one">
        <div>
          {icon && (
            <div className="w-12 h-12 rounded-2xl bg-white/80 border border-black/10 shadow-sm flex items-center justify-center mb-6 text-primary">
              <span className="material-symbols-outlined text-2xl">{icon}</span>
            </div>
          )}
          {title && (
            <h3 className="font-headline-sm text-xl text-primary font-bold mb-3 tracking-tight">
              {title}
            </h3>
          )}
          {subText && (
            <span className="inline-block text-xs uppercase tracking-wider text-outline font-medium">
              {subText}
            </span>
          )}
        </div>
        <div className="pt-4 border-t border-black/10 flex items-center justify-between text-xs text-on-surface-variant font-medium">
          <span className="flex items-center gap-1.5 font-bold">
            Khám phá chiều sâu
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </span>
          {subIcon && (
            <span className="material-symbols-outlined text-base text-primary">
              {subIcon}
            </span>
          )}
        </div>
      </div>

      {/* Stage 2: Nested 6-layer depth tunnel cascading on hover */}
      <div className="layer-one">
        <div className="layer-two">
          <div className="layer-three">
            <div className="layer-four">
              <div className="layer-five">
                <div className="layer-six">
                  <div className="stage-two">
                    <div>
                      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
                        {icon && (
                          <span className="material-symbols-outlined text-lg text-white">
                            {icon}
                          </span>
                        )}
                        <h4 className="font-headline-sm text-sm font-bold text-white tracking-tight line-clamp-1">
                          {title}
                        </h4>
                      </div>
                      {description && (
                        <p className="text-body-sm text-zinc-300 text-xs sm:text-[13px] leading-relaxed">
                          {description}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 mt-2 border-t border-white/10 flex items-center justify-between text-[11px] uppercase tracking-wider text-zinc-400">
                      <span>{subText}</span>
                      {subIcon && (
                        <span className="material-symbols-outlined text-sm text-white">
                          {subIcon}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
