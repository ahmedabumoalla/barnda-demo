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
    setMessage("\u0647\u0630\u0647 \u0645\u0639\u0627\u064a\u0646\u0629 \u0628\u0637\u0627\u0642\u0629 \u0627\u0644\u0648\u0644\u0627\u0621 \u062f\u0627\u062e\u0644 \u0627\u0644\u062f\u064a\u0645\u0648 \u0628\u062f\u0648\u0646 \u0625\u0646\u0634\u0627\u0621 \u0628\u064a\u0627\u0646\u0627\u062a \u062d\u0642\u064a\u0642\u064a\u0629.");
  }

  return (
    <section id="loyalty-card" dir="rtl" className="mt-6 scroll-mt-28">
      <div className="rounded-[28px] border border-[#E7D7C6] bg-white p-4 shadow-[0_18px_45px_rgba(49,25,18,0.08)]">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--ci-button-bg,#6B3A25)] text-[var(--ci-button-fg,#fff)]">
            <WalletCards className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-black text-[var(--ci-accent-bg,#D9A33F)]">{"\u0628\u0637\u0627\u0642\u0629 \u0627\u0644\u0648\u0644\u0627\u0621"}</p>
            <h2 className="text-2xl font-black text-[var(--ci-page-fg,#311912)]">{previewCard.cardTitle}</h2>
          </div>
        </div>

        <p className="mt-3 text-sm font-bold leading-7 text-[var(--ci-muted-fg,#806A5E)]">
          {"\u062a\u0638\u0647\u0631 \u0647\u0630\u0647 \u0627\u0644\u0628\u0637\u0627\u0642\u0629 \u0628\u0646\u0641\u0633 \u0623\u0644\u0648\u0627\u0646 \u0648\u0645\u0648\u0627\u0636\u0639 \u062a\u0635\u0645\u064a\u0645 \u0628\u0637\u0627\u0642\u0629 \u0627\u0644\u0648\u0644\u0627\u0621 \u0627\u0644\u0645\u062d\u0641\u0648\u0638\u0629 \u0641\u064a \u0644\u0648\u062d\u0629 \u0627\u0644\u062f\u064a\u0645\u0648."}
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
              {"\u062c\u0627\u0631 \u0627\u0644\u062a\u062d\u0642\u0642 \u0645\u0646 \u0627\u0644\u062f\u062e\u0648\u0644"}
            </button>
          ) : hasCustomerSession ? (
            <button
              type="button"
              onClick={showCard}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--ci-button-bg,#6B3A25)] px-5 py-4 font-black text-[var(--ci-button-fg,#FCF8F3)]"
            >
              <Download className="h-5 w-5" />
              {cardCode ? "\u062a\u062d\u062f\u064a\u062b \u0645\u0639\u0627\u064a\u0646\u0629 \u0627\u0644\u0628\u0637\u0627\u0642\u0629" : "\u0639\u0631\u0636 \u0628\u0637\u0627\u0642\u0629 \u0627\u0644\u0648\u0644\u0627\u0621"}
            </button>
          ) : (
            <a
              href={getCustomerLoginHref(slug, `/c/${slug}`)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--ci-button-bg,#6B3A25)] px-5 py-4 font-black text-[var(--ci-button-fg,#FCF8F3)]"
            >
              <UserRound className="h-5 w-5" />
              {"\u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062f\u062e\u0648\u0644 \u0644\u0639\u0631\u0636 \u0627\u0644\u0628\u0637\u0627\u0642\u0629"}
            </a>
          )}

          <a
            href={`/loyalty-card/${encodeURIComponent(displayCode)}`}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--ci-button-bg,#6B3A25)] px-5 py-4 font-black text-[var(--ci-button-bg,#6B3A25)]"
          >
            <WalletCards className="h-5 w-5" />
            {"\u0641\u062a\u062d QR \u0627\u0644\u0628\u0637\u0627\u0642\u0629"}
          </a>
        </div>

        {message ? <p className="mt-3 text-center font-bold text-[var(--ci-button-bg,#6B3A25)]">{message}</p> : null}
      </div>
    </section>
  );
}
