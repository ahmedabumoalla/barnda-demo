"use client";

import { CreditCard, Save, Sparkles, WalletCards } from "lucide-react";
import { useMemo, useState } from "react";
import { LoyaltyCardBuilder } from "@/components/loyalty/loyalty-card-builder";
import { LoyaltyCardPreview } from "@/components/loyalty/loyalty-card-preview";
import { LoyaltyPointsSettings } from "@/components/loyalty/loyalty-points-settings";
import { LoyaltyPointsSummary } from "@/components/loyalty/loyalty-points-summary";
import { LoyaltySectionTabs, type LoyaltySectionTab } from "@/components/loyalty/loyalty-section-tabs";
import { DashboardPageShell, PrimaryButton } from "@/components/ui/design-system";
import { loyaltyDashboardDemoState } from "@/lib/loyalty/demo-data";
import type { LoyaltyDashboardDemoState } from "@/lib/loyalty/types";

export function LoyaltyDashboardPage() {
  const [activeTab, setActiveTab] = useState<LoyaltySectionTab>("card");
  const [state, setState] = useState<LoyaltyDashboardDemoState>(loyaltyDashboardDemoState);
  const [message, setMessage] = useState("");

  const redeemableValue = useMemo(
    () => Math.round(state.points.customerPointsBalance * state.points.pointValueSar * 100) / 100,
    [state.points.customerPointsBalance, state.points.pointValueSar]
  );

  function setCard(card: LoyaltyDashboardDemoState["card"]) {
    setState((current) => ({ ...current, card }));
    setMessage("");
  }

  function setPoints(points: LoyaltyDashboardDemoState["points"]) {
    setState((current) => ({ ...current, points }));
    setMessage("");
  }

  function markDemoSaved() {
    setMessage("تم تحديث معاينة الديمو محلياً فقط.");
    window.setTimeout(() => setMessage(""), 2200);
  }

  return (
    <div dir="rtl">
      <DashboardPageShell
        title="الولاء والمكافآت"
        subtitle="قسّم تجربة الولاء بين تصميم بطاقة واضحة للعميل وقواعد نقاط مالية قابلة للفهم."
        action={
          <PrimaryButton type="button" onClick={markDemoSaved} className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm">
            <Save className="h-4 w-4" />
            حفظ معاينة الديمو
          </PrimaryButton>
        }
      >
        {message ? (
          <div className="mb-5 rounded-[14px] border border-[#D9A33F]/40 bg-[#FFF8EA] px-4 py-3 text-sm font-black text-[#6B3A25]">
            {message}
          </div>
        ) : null}

        <div className="mb-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-[14px] border border-[#E7D7C6] bg-[#FCF8F3] p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-black text-[#806A5E]">حالة بطاقة الولاء</p>
              <CreditCard className="h-4 w-4 text-[#6B3A25]" />
            </div>
            <p className="mt-2 text-xl font-black text-[#311912]">{state.card.enabled ? "مفعلة" : "متوقفة"}</p>
          </div>
          <div className="rounded-[14px] border border-[#E7D7C6] bg-[#FCF8F3] p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-black text-[#806A5E]">أختام المعاينة</p>
              <WalletCards className="h-4 w-4 text-[#6B3A25]" />
            </div>
            <p className="mt-2 text-xl font-black text-[#311912]">{state.card.completedStamps} / {state.card.stampsRequired}</p>
          </div>
          <div className="rounded-[14px] border border-[#E7D7C6] bg-[#FCF8F3] p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-black text-[#806A5E]">قيمة رصيد النقاط</p>
              <Sparkles className="h-4 w-4 text-[#6B3A25]" />
            </div>
            <p className="mt-2 text-xl font-black text-[#311912]">{redeemableValue} ر.س</p>
          </div>
        </div>

        <div className="mb-5">
          <LoyaltySectionTabs value={activeTab} onChange={setActiveTab} />
        </div>

        {activeTab === "card" ? (
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]">
            <LoyaltyCardBuilder value={state.card} onChange={setCard} />
            <aside className="xl:sticky xl:top-5 xl:self-start">
              <div className="rounded-[16px] border border-[#E7D7C6] bg-white p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h2 className="text-base font-black text-[#311912]">معاينة البطاقة</h2>
                  <span className="rounded-xl bg-[#FFF8EA] px-3 py-1 text-xs font-black text-[#6B3A25]">ديمو محلي</span>
                </div>
                <LoyaltyCardPreview
                  card={state.card}
                  pointsBalance={state.points.customerPointsBalance}
                  pointValueSar={state.points.pointValueSar}
                />
              </div>
            </aside>
          </div>
        ) : (
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.8fr)]">
            <LoyaltyPointsSettings value={state.points} onChange={setPoints} />
            <aside className="space-y-5 xl:sticky xl:top-5 xl:self-start">
              <div className="rounded-[16px] border border-[#E7D7C6] bg-white p-4">
                <h2 className="text-base font-black text-[#311912]">ملخص النقاط</h2>
                <p className="mt-1 text-xs font-bold text-[#806A5E]">كل القيم هنا للمعاينة المحلية فقط.</p>
                <div className="mt-4">
                  <LoyaltyPointsSummary points={state.points} />
                </div>
              </div>
              <div className="rounded-[16px] border border-[#E7D7C6] bg-[#FCF8F3] p-4">
                <h3 className="text-sm font-black text-[#311912]">السياسة الظاهرة</h3>
                <p className="mt-2 text-sm font-bold leading-7 text-[#806A5E]">{state.points.policyText}</p>
                <div className="mt-4 grid gap-2 text-xs font-black text-[#6B3A25]">
                  <span className="rounded-xl bg-white px-3 py-2">{state.points.earningRule}</span>
                  <span className="rounded-xl bg-white px-3 py-2">{state.points.redemptionRule}</span>
                  <span className="rounded-xl bg-white px-3 py-2">تنتهي بعد {state.points.expiryDays} يوم</span>
                </div>
              </div>
            </aside>
          </div>
        )}
      </DashboardPageShell>
    </div>
  );
}
