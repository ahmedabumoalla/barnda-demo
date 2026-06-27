"use client";

import { Eye, Palette, ToggleLeft, ToggleRight } from "lucide-react";
import { LoyaltyIconPicker } from "@/components/loyalty/loyalty-icon-picker";
import { LoyaltyLogoUploader } from "@/components/loyalty/loyalty-logo-uploader";
import { NeumoInput, NeumoSelect, NeumoTextarea } from "@/components/ui/design-system";
import type { LoyaltyCardDesign, LoyaltyLogoPlacement } from "@/lib/loyalty/types";

type Props = {
  value: LoyaltyCardDesign;
  onChange: (value: LoyaltyCardDesign) => void;
};

const logoPlacements: Array<{ value: LoyaltyLogoPlacement; label: string }> = [
  { value: "top-right", label: "أعلى اليمين" },
  { value: "top-left", label: "أعلى اليسار" },
  { value: "center", label: "في المنتصف" },
  { value: "bottom-right", label: "أسفل اليمين" },
  { value: "custom", label: "مخصص" },
];

export function LoyaltyCardBuilder({ value, onChange }: Props) {
  function patch(next: Partial<LoyaltyCardDesign>) {
    onChange({ ...value, ...next });
  }

  return (
    <div className="space-y-5" dir="rtl">
      <div className="rounded-[16px] border border-[#E7D7C6] bg-[#FCF8F3] p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-[#311912]">قسم بطاقة الولاء</h2>
            <p className="mt-1 text-xs font-bold text-[#806A5E]">تخصيص البطاقة الرقمية، النصوص، الأختام، الشعار والرموز.</p>
          </div>
          <button
            type="button"
            onClick={() => patch({ enabled: !value.enabled })}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-black ${
              value.enabled ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
            }`}
          >
            {value.enabled ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
            {value.enabled ? "مفعلة" : "متوقفة"}
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <label className="space-y-2">
            <span className="text-xs font-black text-[#6B3A25]">اسم العلامة</span>
            <NeumoInput value={value.brandName} onChange={(event) => patch({ brandName: event.target.value })} />
          </label>
          <label className="space-y-2">
            <span className="text-xs font-black text-[#6B3A25]">عنوان البطاقة</span>
            <NeumoInput value={value.cardTitle} onChange={(event) => patch({ cardTitle: event.target.value })} />
          </label>
          <label className="space-y-2">
            <span className="text-xs font-black text-[#6B3A25]">عنوان المكافأة</span>
            <NeumoInput value={value.rewardTitle} onChange={(event) => patch({ rewardTitle: event.target.value })} />
          </label>
          <label className="space-y-2 lg:col-span-2">
            <span className="text-xs font-black text-[#6B3A25]">وصف البطاقة</span>
            <NeumoInput value={value.subtitle} onChange={(event) => patch({ subtitle: event.target.value })} />
          </label>
          <label className="space-y-2">
            <span className="text-xs font-black text-[#6B3A25]">النص المساند</span>
            <NeumoInput value={value.supportingText} onChange={(event) => patch({ supportingText: event.target.value })} />
          </label>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[16px] border border-[#E7D7C6] bg-white p-4">
          <div className="mb-4 flex items-center gap-2">
            <Eye className="h-5 w-5 text-[#6B3A25]" />
            <h3 className="text-base font-black text-[#311912]">الأختام والتقدم</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-2">
              <span className="text-xs font-black text-[#6B3A25]">عدد الأختام</span>
              <NeumoInput type="number" min={1} max={16} value={value.stampsRequired} onChange={(event) => patch({ stampsRequired: Math.max(1, Number(event.target.value) || 1) })} />
            </label>
            <label className="space-y-2">
              <span className="text-xs font-black text-[#6B3A25]">المكتمل في المعاينة</span>
              <NeumoInput type="number" min={0} max={value.stampsRequired} value={value.completedStamps} onChange={(event) => patch({ completedStamps: Math.min(value.stampsRequired, Math.max(0, Number(event.target.value) || 0)) })} />
            </label>
            <label className="space-y-2">
              <span className="text-xs font-black text-[#6B3A25]">تسمية الختم</span>
              <NeumoInput value={value.stampLabel} onChange={(event) => patch({ stampLabel: event.target.value })} />
            </label>
          </div>
          <div className="mt-4">
            <LoyaltyIconPicker
              value={value.progressIcon}
              customIconPreviewUrl={value.customIconPreviewUrl}
              onChange={(progressIcon) => patch({ progressIcon })}
              onCustomIconChange={(customIconPreviewUrl) => patch({ customIconPreviewUrl })}
            />
          </div>
        </div>

        <div className="rounded-[16px] border border-[#E7D7C6] bg-white p-4">
          <div className="mb-4 flex items-center gap-2">
            <Palette className="h-5 w-5 text-[#6B3A25]" />
            <h3 className="text-base font-black text-[#311912]">الألوان والشعار</h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="space-y-2">
              <span className="text-xs font-black text-[#6B3A25]">الخلفية</span>
              <NeumoInput type="color" value={value.cardBackground} onChange={(event) => patch({ cardBackground: event.target.value })} className="h-12 p-2" />
            </label>
            <label className="space-y-2">
              <span className="text-xs font-black text-[#6B3A25]">النص</span>
              <NeumoInput type="color" value={value.cardForeground} onChange={(event) => patch({ cardForeground: event.target.value })} className="h-12 p-2" />
            </label>
            <label className="space-y-2">
              <span className="text-xs font-black text-[#6B3A25]">التمييز</span>
              <NeumoInput type="color" value={value.cardAccent} onChange={(event) => patch({ cardAccent: event.target.value })} className="h-12 p-2" />
            </label>
          </div>
          <div className="mt-4">
            <LoyaltyLogoUploader label="شعار البطاقة" value={value.logoPreviewUrl} onChange={(logoPreviewUrl) => patch({ logoPreviewUrl })} />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-xs font-black text-[#6B3A25]">مكان الشعار</span>
              <NeumoSelect value={value.logoPlacement} onChange={(event) => patch({ logoPlacement: event.target.value as LoyaltyLogoPlacement })}>
                {logoPlacements.map((placement) => (
                  <option key={placement.value} value={placement.value}>{placement.label}</option>
                ))}
              </NeumoSelect>
            </label>
            <label className="space-y-2">
              <span className="text-xs font-black text-[#6B3A25]">حجم الشعار</span>
              <NeumoInput type="range" min={36} max={96} value={value.logoSize} onChange={(event) => patch({ logoSize: Number(event.target.value) })} />
            </label>
            <label className="space-y-2">
              <span className="text-xs font-black text-[#6B3A25]">إزاحة أفقية</span>
              <NeumoInput type="range" min={-60} max={60} value={value.logoOffsetX} onChange={(event) => patch({ logoOffsetX: Number(event.target.value) })} />
            </label>
            <label className="space-y-2">
              <span className="text-xs font-black text-[#6B3A25]">إزاحة رأسية</span>
              <NeumoInput type="range" min={-60} max={60} value={value.logoOffsetY} onChange={(event) => patch({ logoOffsetY: Number(event.target.value) })} />
            </label>
          </div>
        </div>
      </div>

      <div className="rounded-[16px] border border-[#E7D7C6] bg-white p-4">
        <label className="space-y-2">
          <span className="text-xs font-black text-[#6B3A25]">الشروط والنص السفلي</span>
          <NeumoTextarea value={value.terms} onChange={(event) => patch({ terms: event.target.value })} className="min-h-20" />
        </label>
      </div>
    </div>
  );
}
