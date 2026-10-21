"use client";

import React from "react";
import "./NeumorphicCard.css";

export interface NeumorphicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  borderRadius?: string;
}

export default function NeumorphicCard({
  children,
  className = "",
  borderRadius = "30px",
  style,
  ...props
}: NeumorphicCardProps) {
  return (
    <div
      className={`neumorphic-card ${className}`}
      style={{
        borderRadius,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
