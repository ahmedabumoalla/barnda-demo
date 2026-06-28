"use client";

import { Download, UserRound, WalletCards } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CustomerPointsSummary } from "@/components/loyalty/customer-points-summary";
import { SharedLoyaltyCard } from "@/components/loyalty/shared-loyalty-card";
import { useLoyaltyDemoState } from "@/components/loyalty/use-loyalty-demo-state";
import { getCustomerLoginHref } from "@/lib/cafe/theme-links";
import { getCustomerSession } from "@/lib/customer/session";

type Program = {
  enabled: boolean;
  cardTitle: string;
  cardSubtitle: string;
  purchasesRequired: number;
  rewardName: string;
  cardBackground: string;
  cardForeground: string;
  cardAccent: string;
};

type Props = {
  slug: string;
  cafeName: string;
  program?: Program | null;
  logoUrl?: string | null;
};

const POINT_VALUE_SAR = 0.25;
const MINIMUM_REDEMPTION_POINTS = 100;

export function PublicLoyaltyCardSection({ slug, cafeName, program, logoUrl }: Props) {
  const [demoState] = useLoyaltyDemoState();
  const [cardCode, setCardCode] = useState("");
  const [hasCustomerSession, setHasCustomerSession] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    setCheckingSession(true);

    void getCustomerSession(slug)
      .then((session) => {
        if (!cancelled) setHasCustomerSession(Boolean(session));
      })
      .finally(() => {
        if (!cancelled) setCheckingSession(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const displayCode = cardCode || `${slug.toUpperCase().slice(0, 10)}-LOYALTY`;
  const pointsBalance = demoState.points.enabled
    ? demoState.points.customerPointsBalance
    : cardCode ? 320 : 180;
  const pointValueSar = demoState.points.enabled ? demoState.points.pointValueSar : POINT_VALUE_SAR;
  const effectiveStampsRequired = demoState.card.stampsRequired || program?.purchasesRequired || 8;
  const completedStamps = useMemo(
    () => Math.min(effectiveStampsRequired, cardCode ? 5 : 3),
    [cardCode, effectiveStampsRequired]
  );

  if (!program?.enabled || !demoState.card.enabled) return null;

  const previewCard = {
    ...demoState.card,
    brandName: cafeName,
    cardTitle: demoState.card.cardTitle || program.cardTitle,
    subtitle: demoState.card.subtitle || program.cardSubtitle,
    rewardTitle: demoState.card.rewardTitle || program.rewardName,
    stampsRequired: effectiveStampsRequired,
    completedStamps,
    logoPreviewUrl: demoState.card.logoPreviewUrl || logoUrl || undefined,
    sampleCode: displayCode,
    pointsBadgeVisible: demoState.points.enabled && demoState.card.pointsBadgeVisible,
  };

  function showCard() {
    setCardCode(`${slug.toUpperCase().slice(0, 8)}-2408`);
    setMessage("هذه معاينة بطاقة الولاء داخل الديمو بدون إنشاء بيانات حقيقية.");
  }

  return (
    <section id="loyalty-card" dir="rtl" className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="grid gap-5 rounded-[18px] border border-[#E7D7C6] bg-white p-4 shadow-[0_16px_42px_rgba(49,25,18,0.08)] lg:grid-cols-[minmax(0,0.95fr)_minmax(340px,1.05fr)] lg:p-5">
        <div className="min-w-0">
          <p className="text-sm font-black text-[var(--ci-accent-bg,#2F7D69)]">بطاقة الولاء</p>
          <h2 className="mt-2 text-2xl font-black leading-tight text-[var(--ci-page-fg,#17212B)] sm:text-3xl">
            بطاقة رقمية واضحة خاصة بـ {cafeName}
          </h2>
          <p className="mt-3 max-w-2xl text-sm font-bold leading-7 text-[var(--ci-muted-fg,#806A5E)]">
            تظهر للعميل الأختام والنقاط والباركود و QR بنفس التصميم المحفوظ من مصمم بطاقة الولاء في لوحة الديمو.
          </p>

          <div className="mt-5">
            <CustomerPointsSummary
              pointsBalance={pointsBalance}
              pointValueSar={pointValueSar}
              minimumRedemptionPoints={demoState.points.minimumRedemptionPoints || MINIMUM_REDEMPTION_POINTS}
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            {checkingSession ? (
              <button
                type="button"
                disabled
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--ci-button-bg,#6B3A25)] px-5 py-3 text-sm font-black text-[var(--ci-button-fg,#FCF8F3)] opacity-60"
              >
                <UserRound className="h-4 w-4" />
                جار التحقق من الدخول
              </button>
            ) : hasCustomerSession ? (
              <button
                type="button"
                onClick={showCard}
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--ci-button-bg,#6B3A25)] px-5 py-3 text-sm font-black text-[var(--ci-button-fg,#FCF8F3)]"
              >
                <Download className="h-4 w-4" />
                {cardCode ? "تحديث معاينة البطاقة" : "عرض بطاقة الولاء"}
              </button>
            ) : (
              <a
                href={getCustomerLoginHref(slug, `/c/${slug}`)}
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--ci-button-bg,#6B3A25)] px-5 py-3 text-sm font-black text-[var(--ci-button-fg,#FCF8F3)]"
              >
                <UserRound className="h-4 w-4" />
                تسجيل الدخول لربط البطاقة
              </a>
            )}
            <a
              href={`/loyalty-card/${encodeURIComponent(displayCode)}`}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--ci-button-bg,#6B3A25)] px-5 py-3 text-sm font-black text-[var(--ci-button-bg,#6B3A25)]"
            >
              <WalletCards className="h-4 w-4" />
              فتح QR البطاقة
            </a>
          </div>

          {message ? <p className="mt-3 text-sm font-bold text-[var(--ci-button-bg,#6B3A25)]">{message}</p> : null}
        </div>

        <SharedLoyaltyCard
          card={previewCard}
          pointsBalance={pointsBalance}
          pointValueSar={pointValueSar}
        />
      </div>
    </section>
  );
}
