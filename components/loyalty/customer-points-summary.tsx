"use client";

import { Coins, Sparkles } from "lucide-react";

type Props = {
  pointsBalance: number;
  pointValueSar: number;
  minimumRedemptionPoints?: number;
};

export function CustomerPointsSummary({ pointsBalance, pointValueSar, minimumRedemptionPoints = 100 }: Props) {
  const valueSar = Math.round(pointsBalance * pointValueSar * 100) / 100;
  const ready = pointsBalance >= minimumRedemptionPoints;

  return (
    <div className="grid gap-3 sm:grid-cols-2" dir="rtl">
      <div className="rounded-[14px] border border-[#E7D7C6] bg-[#FCF8F3] p-4">
        <div className="flex items-center gap-2 text-[#6B3A25]">
          <Coins className="h-4 w-4" />
          <span className="text-xs font-black">رصيد النقاط</span>
        </div>
        <p className="mt-2 text-2xl font-black text-[#311912]">{pointsBalance} نقطة</p>
        <p className="mt-1 text-xs font-bold text-[#806A5E]">تساوي تقريباً {valueSar} ر.س</p>
      </div>
      <div className="rounded-[14px] border border-[#E7D7C6] bg-[#FFF8EA] p-4">
        <div className="flex items-center gap-2 text-[#6B3A25]">
          <Sparkles className="h-4 w-4" />
          <span className="text-xs font-black">حالة الاستبدال</span>
        </div>
        <p className="mt-2 text-xl font-black text-[#311912]">{ready ? "جاهز للاستبدال" : "استمر في جمع النقاط"}</p>
        <p className="mt-1 text-xs font-bold text-[#806A5E]">الحد الأدنى {minimumRedemptionPoints} نقطة</p>
      </div>
    </div>
  );
}
