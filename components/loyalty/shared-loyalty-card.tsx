"use client";

import { Crown, Gift, Heart, Star, Trophy, WalletCards } from "lucide-react";
import { useRef, type PointerEvent } from "react";
import { SecureQrCode } from "@/components/loyalty/secure-qr-code";
import type { LoyaltyCardDesign, LoyaltyProgressIcon } from "@/lib/loyalty/types";

export type LoyaltyDesignerLayer = "logo" | "points" | "barcode" | "qr";

type Props = {
  card: LoyaltyCardDesign;
  pointsBalance?: number;
  pointValueSar?: number;
  compact?: boolean;
  editable?: boolean;
  activeLayer?: LoyaltyDesignerLayer | null;
  onActiveLayerChange?: (layer: LoyaltyDesignerLayer) => void;
  onCardChange?: (card: LoyaltyCardDesign) => void;
};

const progressIcons: Record<LoyaltyProgressIcon, typeof Star> = {
  star: Star,
  cup: Trophy,
  gift: Gift,
  heart: Heart,
  crown: Crown,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function layerStyle(x: number, y: number, width: number, height: number) {
  return {
    left: `${x}%`,
    top: `${y}%`,
    width: `${width}%`,
    height: `${height}%`,
  };
}

function getLayerMetrics(card: LoyaltyCardDesign, layer: LoyaltyDesignerLayer) {
  if (layer === "logo") return { width: card.logoWidth, height: card.logoHeight };
  if (layer === "points") return { width: card.pointsBadgeWidth, height: card.pointsBadgeHeight };
  if (layer === "qr") return { width: card.qrWidth, height: card.qrHeight };
  return { width: card.barcodeWidth, height: card.barcodeHeight };
}

function applyLayerPosition(card: LoyaltyCardDesign, layer: LoyaltyDesignerLayer, x: number, y: number) {
  if (layer === "logo") return { ...card, logoX: x, logoY: y };
  if (layer === "points") return { ...card, pointsBadgeX: x, pointsBadgeY: y };
  if (layer === "qr") return { ...card, qrX: x, qrY: y };
  return { ...card, barcodeX: x, barcodeY: y };
}

export function LoyaltyBarcode({ value, dark = false }: { value: string; dark?: boolean }) {
  return (
    <div className={`h-full min-h-[64px] rounded-xl border p-2 ${dark ? "border-white/15 bg-white/90" : "border-[#E7D7C6] bg-white"}`}>
      <div
        className="h-[62%] w-full rounded-md"
        style={{
          background:
            "repeating-linear-gradient(90deg,#17100d 0 2px,transparent 2px 5px,#17100d 5px 8px,transparent 8px 12px,#17100d 12px 13px,transparent 13px 17px)",
        }}
        aria-hidden="true"
      />
      <p className="mt-1 truncate text-center font-mono text-[10px] font-black tracking-[0.14em] text-[#17100d]">
        {value}
      </p>
    </div>
  );
}

export function SharedLoyaltyCard({
  card,
  pointsBalance = 320,
  pointValueSar = 0.25,
  compact = false,
  editable = false,
  activeLayer = null,
  onActiveLayerChange,
  onCardChange,
}: Props) {
  const ProgressIcon = progressIcons[card.progressIcon];
  const cardRef = useRef<HTMLDivElement | null>(null);
  const earnedValue = Math.round(pointsBalance * pointValueSar * 100) / 100;
  const stamps = Array.from({ length: Math.max(1, card.stampsRequired) });
  const logoVisible = Boolean(card.logoPreviewUrl);
  const showPoints = card.pointsBadgeVisible;

  function activeRing(layer: LoyaltyDesignerLayer) {
    if (!editable) return "";
    return activeLayer === layer
      ? "cursor-move ring-2 ring-[#F6C35B] shadow-[0_0_0_4px_rgba(246,195,91,0.18)]"
      : "cursor-move ring-2 ring-[#D9A33F]/45";
  }

  function selectLayer(layer: LoyaltyDesignerLayer) {
    onActiveLayerChange?.(layer);
  }

  function startDrag(event: PointerEvent<HTMLDivElement>, layer: LoyaltyDesignerLayer) {
    if (!editable || !onCardChange) return;
    selectLayer(layer);
    const target = event.currentTarget;
    target.setPointerCapture(event.pointerId);

    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const activeRect = rect;
    const updateCard = onCardChange;
    const { width, height } = getLayerMetrics(card, layer);

    function move(moveEvent: globalThis.PointerEvent) {
      const nextX = clamp(((moveEvent.clientX - activeRect.left) / activeRect.width) * 100 - width / 2, 0, 100 - width);
      const nextY = clamp(((moveEvent.clientY - activeRect.top) / activeRect.height) * 100 - height / 2, 0, 100 - height);
      updateCard(applyLayerPosition(card, layer, nextX, nextY));
    }

    function stop() {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
    }

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
  }

  return (
    <div
      ref={cardRef}
      className={`relative mx-auto aspect-[1.58/1] w-full overflow-hidden rounded-[18px] border border-black/10 p-5 text-right shadow-[0_24px_70px_rgba(49,25,18,0.20)] ${
        compact ? "max-w-[440px]" : "max-w-[860px]"
      } ${editable ? "select-none ring-2 ring-[#D9A33F]/25" : ""}`}
      style={{ background: card.cardBackground, color: card.cardForeground }}
      dir="rtl"
    >
      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 pe-16">
            <p className="text-[11px] font-black opacity-75">{card.brandName}</p>
            <h3 className={compact ? "mt-1 text-xl font-black leading-tight" : "mt-2 text-3xl font-black leading-tight"}>
              {card.cardTitle}
            </h3>
            <p className="mt-1 max-w-[56%] text-xs font-bold leading-5 opacity-80 sm:text-sm">{card.subtitle}</p>
          </div>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ background: card.cardAccent, color: card.cardForeground }}>
            <WalletCards className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-auto max-w-[55%] rounded-[14px] bg-white/14 p-3">
          <p className="text-xs font-black sm:text-sm" style={{ color: card.cardAccent }}>{card.rewardTitle}</p>
          <div className="mt-3 grid grid-cols-4 gap-1.5 sm:grid-cols-8">
            {stamps.map((_, index) => {
              const filled = index < card.completedStamps;
              return (
                <span
                  key={index}
                  className={`flex aspect-square items-center justify-center rounded-lg border text-[10px] font-black ${
                    filled ? "border-transparent" : "border-white/30 bg-white/10 opacity-80"
                  }`}
                  style={filled ? { background: card.cardAccent, color: card.cardForeground } : undefined}
                >
                  {card.customIconPreviewUrl ? (
                    <img src={card.customIconPreviewUrl} alt="" className="h-4 w-4 object-contain" />
                  ) : (
                    <ProgressIcon className="h-3.5 w-3.5" />
                  )}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {logoVisible ? (
        <div
          role={editable ? "button" : undefined}
          tabIndex={editable ? 0 : undefined}
          onClick={() => selectLayer("logo")}
          onPointerDown={(event) => startDrag(event, "logo")}
          className={`absolute z-20 rounded-xl ${activeRing("logo")}`}
          style={layerStyle(card.logoX, card.logoY, card.logoWidth, card.logoHeight)}
        >
          <img src={card.logoPreviewUrl} alt="" className="h-full w-full object-contain" />
        </div>
      ) : null}

      {showPoints ? (
        <div
          role={editable ? "button" : undefined}
          tabIndex={editable ? 0 : undefined}
          onClick={() => selectLayer("points")}
          onPointerDown={(event) => startDrag(event, "points")}
          className={`absolute z-20 flex flex-col justify-center rounded-xl border border-white/15 bg-white/90 px-3 text-[#17100d] shadow-lg ${activeRing("points")}`}
          style={layerStyle(card.pointsBadgeX, card.pointsBadgeY, card.pointsBadgeWidth, card.pointsBadgeHeight)}
        >
          <p className="truncate text-[10px] font-black text-[#806A5E]">نقاط الولاء</p>
          <p className="truncate text-sm font-black">{pointsBalance} نقطة</p>
          <p className="truncate text-[10px] font-bold text-[#806A5E]">{earnedValue} ر.س</p>
        </div>
      ) : null}

      {card.barcodeVisible ? (
        <div
          role={editable ? "button" : undefined}
          tabIndex={editable ? 0 : undefined}
          onClick={() => selectLayer("barcode")}
          onPointerDown={(event) => startDrag(event, "barcode")}
          className={`absolute z-20 ${activeRing("barcode")}`}
          style={layerStyle(card.barcodeX, card.barcodeY, card.barcodeWidth, card.barcodeHeight)}
        >
          <LoyaltyBarcode value={card.sampleCode} />
        </div>
      ) : null}

      <div
        role={editable ? "button" : undefined}
        tabIndex={editable ? 0 : undefined}
        onClick={() => selectLayer("qr")}
        onPointerDown={(event) => startDrag(event, "qr")}
        className={`absolute z-20 flex items-center justify-center rounded-xl bg-white p-1 text-[#17100d] ${activeRing("qr")}`}
        style={layerStyle(card.qrX, card.qrY, card.qrWidth, card.qrHeight)}
      >
        <SecureQrCode
          kind="loyalty-card"
          value={card.sampleCode}
          title="QR بطاقة الولاء"
          size={compact ? 44 : clamp(Math.min(card.qrWidth * 8, card.qrHeight * 5), 48, 148)}
        />
      </div>

      {editable ? (
        <div className="absolute right-4 top-4 z-30 rounded-xl bg-black/35 px-3 py-1 text-[11px] font-black text-white backdrop-blur">
          اسحب العناصر داخل حدود البطاقة
        </div>
      ) : null}
    </div>
  );
}
