"use client";

import React, { forwardRef } from "react";
import "./RetroInput.css";

export interface RetroInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  wrapperClassName?: string;
}

const RetroInput = forwardRef<HTMLInputElement, RetroInputProps>(
  ({ wrapperClassName = "", className = "", ...props }, ref) => {
    return (
      <div className={`retro-input-wrapper ${wrapperClassName}`}>
        <input
          ref={ref}
          className={`retro-input ${className}`}
          {...props}
        />
      </div>
    );
  }
);

RetroInput.displayName = "RetroInput";

export default RetroInput;
