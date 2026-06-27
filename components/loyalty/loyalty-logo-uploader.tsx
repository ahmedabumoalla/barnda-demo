"use client";

import { ImagePlus, X } from "lucide-react";
import { useId } from "react";

type Props = {
  label: string;
  value?: string;
  onChange: (value?: string) => void;
};

export function LoyaltyLogoUploader({ label, value, onChange }: Props) {
  const inputId = useId();

  function handleFile(file?: File) {
    if (!file) return;
    onChange(URL.createObjectURL(file));
  }

  return (
    <div className="rounded-[14px] border border-[#E7D7C6] bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black text-[#311912]">{label}</p>
          <p className="mt-1 text-xs font-bold text-[#806A5E]">معاينة محلية فقط بدون رفع حقيقي.</p>
        </div>
        {value ? (
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="inline-flex items-center gap-1 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-black text-red-700"
          >
            <X className="h-4 w-4" />
            إزالة
          </button>
        ) : null}
      </div>

      <div className="mt-3 flex items-center gap-3">
        <label
          htmlFor={inputId}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#4A281D] px-4 py-3 text-sm font-black text-[#FCF8F3]"
        >
          <ImagePlus className="h-4 w-4" />
          اختيار ملف
        </label>
        <input
          id={inputId}
          type="file"
          accept="image/*,.svg"
          className="sr-only"
          onChange={(event) => handleFile(event.target.files?.[0])}
        />
        {value ? (
          <img src={value} alt="" className="h-12 w-12 rounded-xl border border-[#E7D7C6] bg-[#FCF8F3] object-contain p-1" />
        ) : (
          <span className="text-xs font-bold text-[#806A5E]">لم يتم اختيار صورة.</span>
        )}
      </div>
    </div>
  );
}
