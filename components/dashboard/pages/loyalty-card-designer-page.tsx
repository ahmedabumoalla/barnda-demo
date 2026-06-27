"use client";

import Link from "next/link";
import { ArrowRight, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { LoyaltyCardBuilder } from "@/components/loyalty/loyalty-card-builder";
import { LoyaltyCardPreview } from "@/components/loyalty/loyalty-card-preview";
import { useLoyaltyDemoState } from "@/components/loyalty/use-loyalty-demo-state";
import { DashboardPageShell, PrimaryButton } from "@/components/ui/design-system";
import type { LoyaltyDashboardDemoState } from "@/lib/loyalty/types";

export function LoyaltyCardDesignerPage() {
  const [storedState, setStoredState] = useLoyaltyDemoState();
  const [draft, setDraft] = useState<LoyaltyDashboardDemoState>(storedState);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setDraft(storedState);
  }, [storedState]);

  function saveDesign() {
    setStoredState(draft);
    setMessage("تم حفظ تصميم البطاقة في ديمو المتصفح وسيظهر في صفحة الولاء الرئيسية.");
    window.setTimeout(() => setMessage(""), 2600);
  }

  return (
    <div dir="rtl">
      <DashboardPageShell
        title="تصميم البطاقة"
        subtitle="مصمم مستقل لبطاقة الولاء مع معاينة عميل كبيرة، سحب للعناصر، وتحكم محلي في الشعار والباركود والنقاط."
        action={
          <div className="flex flex-wrap gap-2">
            <Link
              href="/dashboard/loyalty"
              className="inline-flex items-center gap-2 rounded-xl border border-[#E7D7C6] bg-white px-4 py-3 text-sm font-black text-[#6B3A25]"
            >
              <ArrowRight className="h-4 w-4" />
              العودة للولاء
            </Link>
            <PrimaryButton type="button" onClick={saveDesign} className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm">
              <Save className="h-4 w-4" />
              حفظ تصميم البطاقة
            </PrimaryButton>
          </div>
        }
      >
        {message ? (
          <div className="mb-4 rounded-[14px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-700">
            {message}
          </div>
        ) : null}

        <div className="grid gap-5 2xl:grid-cols-[minmax(420px,0.9fr)_minmax(0,1.1fr)]">
          <aside className="2xl:sticky 2xl:top-4 2xl:self-start">
            <div className="rounded-[16px] border border-[#E7D7C6] bg-white p-4 shadow-[0_18px_48px_rgba(49,25,18,0.08)]">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-black text-[#311912]">معاينة العميل</h2>
                  <p className="mt-1 text-xs font-bold text-[#806A5E]">اسحب الشعار أو وسم النقاط أو الباركود داخل البطاقة.</p>
                </div>
                <span className="rounded-xl bg-[#FFF8EA] px-3 py-1 text-xs font-black text-[#6B3A25]">ديمو محلي</span>
              </div>
              <LoyaltyCardPreview
                card={draft.card}
                pointsBalance={draft.points.customerPointsBalance}
                pointValueSar={draft.points.pointValueSar}
                editable
                onCardChange={(card) => setDraft((current) => ({ ...current, card }))}
              />
            </div>
          </aside>

          <LoyaltyCardBuilder
            value={draft.card}
            onChange={(card) => setDraft((current) => ({ ...current, card }))}
          />
        </div>
      </DashboardPageShell>
    </div>
  );
}
