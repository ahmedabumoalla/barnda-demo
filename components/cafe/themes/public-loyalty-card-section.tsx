"use client";

import { Download, UserRound, WalletCards } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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
};

export function PublicLoyaltyCardSection({ slug, cafeName, program }: Props) {
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
    sampleCode: displayCode,
    pointsBadgeVisible: demoState.points.enabled && demoState.card.pointsBadgeVisible,
  };

  function showCard() {
    setCardCode(`${slug.toUpperCase().slice(0, 8)}-2408`);
    setMessage("هذه معاينة بطاقة الولاء داخل الديمو بدون إنشاء بيانات حقيقية.");
  }

  return (
    <section id="loyalty-card" dir="rtl" className="mt-6 scroll-mt-28">
      <div className="rounded-[28px] border border-[#E7D7C6] bg-white p-4 shadow-[0_18px_45px_rgba(49,25,18,0.08)]">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--ci-button-bg,#6B3A25)] text-[var(--ci-button-fg,#fff)]">
            <WalletCards className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-black text-[var(--ci-accent-bg,#D9A33F)]">بطاقة الولاء</p>
            <h2 className="text-2xl font-black text-[var(--ci-page-fg,#311912)]">{previewCard.cardTitle}</h2>
          </div>
        </div>

        <p className="mt-3 text-sm font-bold leading-7 text-[var(--ci-muted-fg,#806A5E)]">
          تظهر هذه البطاقة بنفس ألوان ومواضع تصميم بطاقة الولاء المحفوظة في لوحة الديمو.
        </p>

        <div className="mt-5">
          <SharedLoyaltyCard card={previewCard} compact />
        </div>

        <div className="mt-5 grid gap-3">
          {checkingSession ? (
            <button
              type="button"
              disabled
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--ci-button-bg,#6B3A25)] px-5 py-4 font-black text-[var(--ci-button-fg,#FCF8F3)] opacity-60"
            >
              <UserRound className="h-5 w-5" />
              جار التحقق من الدخول
            </button>
          ) : hasCustomerSession ? (
            <button
              type="button"
              onClick={showCard}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--ci-button-bg,#6B3A25)] px-5 py-4 font-black text-[var(--ci-button-fg,#FCF8F3)]"
            >
              <Download className="h-5 w-5" />
              {cardCode ? "تحديث معاينة البطاقة" : "عرض بطاقة الولاء"}
            </button>
          ) : (
            <a
              href={getCustomerLoginHref(slug, `/c/${slug}`)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--ci-button-bg,#6B3A25)] px-5 py-4 font-black text-[var(--ci-button-fg,#FCF8F3)]"
            >
              <UserRound className="h-5 w-5" />
              تسجيل الدخول لعرض البطاقة
            </a>
          )}

          <a
            href={`/loyalty-card/${encodeURIComponent(displayCode)}`}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--ci-button-bg,#6B3A25)] px-5 py-4 font-black text-[var(--ci-button-bg,#6B3A25)]"
          >
            <WalletCards className="h-5 w-5" />
            فتح QR البطاقة
          </a>
        </div>

        {message ? <p className="mt-3 text-center font-bold text-[var(--ci-button-bg,#6B3A25)]">{message}</p> : null}
      </div>
    </section>
  );
}
