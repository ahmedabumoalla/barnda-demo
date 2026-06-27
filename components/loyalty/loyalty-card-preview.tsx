"use client";

import { Crown, Gift, Heart, Star, Trophy, WalletCards } from "lucide-react";
import { SecureQrCode } from "@/components/loyalty/secure-qr-code";
import type { LoyaltyCardDesign, LoyaltyProgressIcon } from "@/lib/loyalty/types";

type Props = {
  card: LoyaltyCardDesign;
  pointsBalance?: number;
  pointValueSar?: number;
  compact?: boolean;
};

const progressIcons: Record<LoyaltyProgressIcon, typeof Star> = {
  star: Star,
  cup: Trophy,
  gift: Gift,
  heart: Heart,
  crown: Crown,
};

function logoPosition(card: LoyaltyCardDesign) {
  const base = {
    width: card.logoSize,
    height: card.logoSize,
    transform: `translate(${card.logoOffsetX}px, ${card.logoOffsetY}px)`,
  };

  if (card.logoPlacement === "top-left") return { ...base, left: 18, top: 18 };
  if (card.logoPlacement === "center") return { ...base, left: "50%", top: 18, transform: `translate(calc(-50% + ${card.logoOffsetX}px), ${card.logoOffsetY}px)` };
  if (card.logoPlacement === "bottom-right") return { ...base, right: 18, bottom: 18 };
  if (card.logoPlacement === "custom") return { ...base, right: 18 + card.logoOffsetX, top: 18 + card.logoOffsetY, transform: "none" };
  return { ...base, right: 18, top: 18 };
}

export function LoyaltyBarcode({ value, dark = false }: { value: string; dark?: boolean }) {
  return (
    <div className={`rounded-xl border p-3 ${dark ? "border-white/15 bg-white/90" : "border-[#E7D7C6] bg-white"}`}>
      <div
        className="h-12 w-full rounded-md"
        style={{
          background:
            "repeating-linear-gradient(90deg,#17100d 0 2px,transparent 2px 5px,#17100d 5px 8px,transparent 8px 12px,#17100d 12px 13px,transparent 13px 17px)",
        }}
        aria-hidden="true"
      />
      <p className="mt-2 truncate text-center font-mono text-[11px] font-black tracking-[0.18em] text-[#17100d]">
        {value}
      </p>
    </div>
  );
}

export function LoyaltyCardPreview({ card, pointsBalance = 320, pointValueSar = 0.25, compact = false }: Props) {
  const ProgressIcon = progressIcons[card.progressIcon];
  const earnedValue = Math.round(pointsBalance * pointValueSar * 100) / 100;
  const stamps = Array.from({ length: Math.max(1, card.stampsRequired) });

  return (
    <div
      className={`relative overflow-hidden rounded-[18px] border border-black/10 p-5 shadow-[0_24px_70px_rgba(49,25,18,0.20)] ${compact ? "max-w-[420px]" : "w-full"}`}
      style={{ background: card.cardBackground, color: card.cardForeground }}
      dir="rtl"
    >
      {card.logoPreviewUrl ? (
        <img
          src={card.logoPreviewUrl}
          alt=""
          className="absolute rounded-xl bg-white/90 object-contain p-1 shadow-lg"
          style={logoPosition(card)}
        />
      ) : null}

      <div className="flex items-start justify-between gap-4 pe-20">
        <div className="min-w-0">
          <p className="text-xs font-black opacity-75">{card.brandName}</p>
          <h3 className="mt-2 text-2xl font-black leading-tight">{card.cardTitle}</h3>
          <p className="mt-2 max-w-sm text-sm font-bold leading-6 opacity-80">{card.subtitle}</p>
        </div>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl" style={{ background: card.cardAccent, color: card.cardBackground }}>
          <WalletCards className="h-6 w-6" />
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-[minmax(0,1fr)_132px] sm:items-stretch">
        <div className="rounded-[14px] bg-white/12 p-4">
          <p className="text-sm font-black" style={{ color: card.cardAccent }}>{card.rewardTitle}</p>
          <p className="mt-1 text-xs font-bold leading-5 opacity-80">{card.supportingText}</p>
          <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-8">
            {stamps.map((_, index) => {
              const filled = index < card.completedStamps;
              return (
                <span
                  key={index}
                  className={`flex aspect-square items-center justify-center rounded-xl border text-xs font-black ${
                    filled ? "border-transparent" : "border-white/20 bg-white/10 opacity-70"
                  }`}
                  style={filled ? { background: card.cardAccent, color: card.cardBackground } : undefined}
                >
                  {card.customIconPreviewUrl ? (
                    <img src={card.customIconPreviewUrl} alt="" className="h-5 w-5 object-contain" />
                  ) : (
                    <ProgressIcon className="h-4 w-4" />
                  )}
                </span>
              );
            })}
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-black">
            <span className="rounded-full bg-white/12 px-3 py-1.5">{card.completedStamps} / {card.stampsRequired} {card.stampLabel}</span>
            <span className="rounded-full bg-white/12 px-3 py-1.5">{pointsBalance} نقطة</span>
            <span className="rounded-full bg-white/12 px-3 py-1.5">{earnedValue} ر.س قيمة تقريبية</span>
          </div>
        </div>

        <div className="grid gap-3 rounded-[14px] bg-white p-3 text-[#17100d]">
          <SecureQrCode kind="loyalty-card" value={card.sampleCode} title="QR بطاقة الولاء" size={108} />
          {card.barcodeVisible ? <LoyaltyBarcode value={card.sampleCode} /> : null}
        </div>
      </div>

      <p className="mt-4 text-xs font-bold leading-5 opacity-75">{card.terms}</p>
    </div>
  );
}
