"use client";

import Link from "next/link";
import { ArrowRight, Gift, Home, WalletCards } from "lucide-react";
import { SharedLoyaltyCard } from "@/components/loyalty/shared-loyalty-card";
import { useLoyaltyDemoState } from "@/components/loyalty/use-loyalty-demo-state";

type Props = {
  cardCode: string;
  cafeName: string;
  cafeHref: string;
  backHref: string;
  cardTitle: string;
  cardSubtitle: string;
  rewardName: string;
  terms?: string | null;
  required: number;
  lit: number;
  availableRewards: number;
  loyaltyUnitLit: string;
  loyaltyUnitPlural: string;
};

export function PublicLoyaltyCardView({
  cardCode,
  cafeName,
  cafeHref,
  backHref,
  cardTitle,
  cardSubtitle,
  rewardName,
  terms,
  required,
  lit,
  availableRewards,
  loyaltyUnitLit,
  loyaltyUnitPlural,
}: Props) {
  const [demoState] = useLoyaltyDemoState();
  const previewCard = {
    ...demoState.card,
    brandName: cafeName,
    cardTitle: demoState.card.cardTitle || cardTitle,
    subtitle: demoState.card.subtitle || cardSubtitle,
    rewardTitle: demoState.card.rewardTitle || rewardName,
    stampsRequired: required,
    completedStamps: lit,
    sampleCode: cardCode,
    pointsBadgeVisible: demoState.points.enabled && demoState.card.pointsBadgeVisible,
  };

  return (
    <main dir="rtl" className="min-h-screen bg-[#F6F0E7] px-4 py-8 text-[#17212B]">
      <section className="mx-auto max-w-5xl">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-black text-[#2F7D69] shadow-sm"
          >
            <ArrowRight className="h-4 w-4" />
            {"\u0631\u062c\u0648\u0639"}
          </Link>
          <Link
            href={cafeHref}
            className="inline-flex items-center gap-2 rounded-2xl border border-[#2F7D69] px-5 py-3 font-black text-[#2F7D69]"
          >
            <Home className="h-4 w-4" />
            {"\u0627\u0644\u0635\u0641\u062d\u0629 \u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629"}
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <section>
            <SharedLoyaltyCard
              card={previewCard}
              pointsBalance={demoState.points.customerPointsBalance}
              pointValueSar={demoState.points.pointValueSar}
            />
          </section>

          <section className="rounded-[28px] bg-white p-6 shadow-[0_18px_45px_rgba(49,25,18,0.08)]">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#64BFA9] text-[#17212B]">
                <WalletCards className="h-6 w-6" />
              </span>
              <div>
                <p className="text-sm font-black text-[#2F7D69]">{cafeName}</p>
                <h1 className="mt-1 text-3xl font-black">{cardTitle}</h1>
              </div>
            </div>

            <p className="mt-4 text-sm font-bold leading-7 text-[#5F6870]">
              {"\u0627\u0639\u0631\u0636 \u0647\u0630\u0647 \u0627\u0644\u0628\u0637\u0627\u0642\u0629 \u0644\u0644\u0643\u0627\u0634\u064a\u0631 \u0639\u0646\u062f \u0643\u0644 \u0639\u0645\u0644\u064a\u0629. \u0627\u0644\u0628\u0637\u0627\u0642\u0629 \u062a\u0633\u062a\u062e\u062f\u0645 \u0646\u0641\u0633 \u062a\u0635\u0645\u064a\u0645 \u0627\u0644\u0648\u0644\u0627\u0621 \u0627\u0644\u0645\u062d\u0641\u0648\u0638 \u0641\u064a \u0644\u0648\u062d\u0629 \u0627\u0644\u062f\u064a\u0645\u0648."}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-[#F6F0E7] p-5 text-center">
                <p className="text-3xl font-black">{lit}</p>
                <p className="mt-1 text-xs font-bold text-[#5F6870]">{loyaltyUnitLit}</p>
              </div>
              <div className="rounded-2xl bg-[#F6F0E7] p-5 text-center">
                <p className="text-3xl font-black">{required}</p>
                <p className="mt-1 text-xs font-bold text-[#5F6870]">{loyaltyUnitPlural}</p>
              </div>
              <div className="rounded-2xl bg-[#F6F0E7] p-5 text-center">
                <p className="text-3xl font-black">{availableRewards}</p>
                <p className="mt-1 text-xs font-bold text-[#5F6870]">{"\u0645\u0643\u0627\u0641\u0622\u062a \u062c\u0627\u0647\u0632\u0629"}</p>
              </div>
            </div>

            {availableRewards > 0 ? (
              <div className="mt-5 flex items-center gap-3 rounded-2xl bg-[#F6BE18] p-5 font-black text-[#17212B]">
                <Gift className="h-6 w-6" />
                {"\u0627\u0643\u062a\u0645\u0644\u062a \u0627\u0644\u0628\u0637\u0627\u0642\u0629\u060c \u0644\u062f\u064a\u0643"} {rewardName}
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-[#E7D7C6] p-5 font-bold leading-7 text-[#5F6870]">
                {"\u0627\u0644\u0645\u062a\u0628\u0642\u064a"} {Math.max(0, required - lit)} {"\u0644\u0644\u0648\u0635\u0648\u0644 \u0625\u0644\u0649"} {rewardName}
              </div>
            )}

            {terms ? <p className="mt-5 text-xs font-bold leading-6 text-[#5F6870]">{terms}</p> : null}
          </section>
        </div>
      </section>
    </main>
  );
}
