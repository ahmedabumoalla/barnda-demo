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
            رجوع
          </Link>
          <Link
            href={cafeHref}
            className="inline-flex items-center gap-2 rounded-2xl border border-[#2F7D69] px-5 py-3 font-black text-[#2F7D69]"
          >
            <Home className="h-4 w-4" />
            الصفحة الرئيسية
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
              اعرض هذه البطاقة للكاشير عند كل عملية. البطاقة تستخدم نفس تصميم الولاء المحفوظ في لوحة الديمو.
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
                <p className="mt-1 text-xs font-bold text-[#5F6870]">مكافآت جاهزة</p>
              </div>
            </div>

            {availableRewards > 0 ? (
              <div className="mt-5 flex items-center gap-3 rounded-2xl bg-[#F6BE18] p-5 font-black text-[#17212B]">
                <Gift className="h-6 w-6" />
                اكتملت البطاقة، لديك {rewardName}
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-[#E7D7C6] p-5 font-bold leading-7 text-[#5F6870]">
                المتبقي {Math.max(0, required - lit)} للوصول إلى {rewardName}
              </div>
            )}

            {terms ? <p className="mt-5 text-xs font-bold leading-6 text-[#5F6870]">{terms}</p> : null}
          </section>
        </div>
      </section>
    </main>
  );
}
