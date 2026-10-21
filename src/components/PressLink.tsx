"use client";

import Link from "next/link";
import { useState, type ComponentProps } from "react";

type Props = ComponentProps<typeof Link> & { ring?: boolean };

// 클릭하면 눌렸다가 튀어오르는 애니메이션을 재생하는 링크
export default function PressLink({ className = "", ring = false, onClick, children, ...props }: Props) {
  const [pressKey, setPressKey] = useState(0);

  return (
    <Link
      {...props}
      onClick={(e) => {
        setPressKey((k) => k + 1);
        onClick?.(e);
      }}
      className={`relative inline-flex ${className}`}
    >
      <span key={pressKey} className={`inline-flex flex-col items-center ${pressKey ? "animate-press" : ""}`}>
        {children}
      </span>
      {ring && pressKey > 0 && (
        <span
          key={`ring-${pressKey}`}
          aria-hidden
          className="animate-press-ring pointer-events-none absolute inset-0 rounded-full border-2 border-point"
        />
      )}
    </Link>
  );
}
