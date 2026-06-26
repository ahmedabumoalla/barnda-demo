"use client";

import { useState } from "react";
import { ChevronDown, Columns3, Download, Filter, Search, SlidersHorizontal } from "lucide-react";
import {
  trialBalanceColumns,
  trialBalanceDateRanges,
  trialBalanceExportOptions,
  trialBalanceFilters,
} from "@/lib/branda-finance/trial-balance";

type OpenMenu = "date" | "filter" | "columns" | "export" | null;

const buttonClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-[#E3CFB0] bg-[#FFFDF8] px-4 py-2.5 text-sm font-black text-[#4C2D1E] shadow-[0_8px_20px_rgba(86,52,31,0.08)] transition hover:border-[#C99A4D] hover:bg-[#FFF9F0] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B88334]";

function DropdownShell({
  children,
  wide = false,
}: {
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div
      className={`absolute right-0 top-full z-30 mt-2 max-h-[70vh] overflow-y-auto rounded-[22px] border border-[#E3CFB0] bg-[#FFFDF8] p-3 text-right shadow-[0_24px_60px_rgba(86,52,31,0.18)] ${
        wide ? "w-[min(92vw,420px)]" : "w-[min(88vw,300px)]"
      }`}
    >
      {children}
    </div>
  );
}

export function TrialBalanceToolbar() {
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const [selectedRange, setSelectedRange] = useState("التاريخ إلى 31 مايو 2026");
  const [enabledColumns, setEnabledColumns] = useState(() =>
    new Set(trialBalanceColumns.filter((column) => column.defaultEnabled).map((column) => column.id)),
  );

  function toggleMenu(menu: OpenMenu) {
    setOpenMenu((current) => (current === menu ? null : menu));
  }

  function toggleColumn(columnId: string) {
    setEnabledColumns((current) => {
      const next = new Set(current);
      if (next.has(columnId)) {
        next.delete(columnId);
      } else {
        next.add(columnId);
      }
      return next;
    });
  }

  return (
    <div className="rounded-[24px] border border-[#E3CFB0] bg-[#FBF4EA] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.82)]">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <button type="button" onClick={() => toggleMenu("date")} className={buttonClass}>
            {selectedRange}
            <ChevronDown aria-hidden="true" className="h-4 w-4" />
          </button>
          {openMenu === "date" ? (
            <DropdownShell wide>
              <div className="grid gap-1">
                {trialBalanceDateRanges.map((range) => (
                  <button
                    key={range.id}
                    type="button"
                    onClick={() => {
                      setSelectedRange(range.label);
                      setOpenMenu(null);
                    }}
                    className="rounded-2xl px-3 py-2.5 text-right text-sm font-bold text-[#4C2D1E] transition hover:bg-[#FBF5EC]"
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </DropdownShell>
          ) : null}
        </div>

        <div className="relative">
          <button type="button" onClick={() => toggleMenu("filter")} className={buttonClass}>
            <Filter aria-hidden="true" className="h-4 w-4" />
            أضف فلتر
          </button>
          {openMenu === "filter" ? (
            <DropdownShell wide>
              <label className="mb-3 flex items-center gap-2 rounded-2xl border border-[#E6D5BD] bg-[#FBF5EC] px-3 py-2">
                <Search aria-hidden="true" className="h-4 w-4 text-[#8A5B24]" />
                <input
                  type="search"
                  placeholder="ابحث عن فلتر"
                  className="h-8 min-w-0 flex-1 bg-transparent text-sm font-bold text-[#3B2417] outline-none placeholder:text-[#A89077]"
                />
              </label>
              <div className="grid gap-1">
                {trialBalanceFilters.map((filter) => (
                  <button
                    key={filter.id}
                    type="button"
                    className="rounded-2xl px-3 py-2.5 text-right text-sm font-bold text-[#4C2D1E] transition hover:bg-[#FBF5EC]"
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </DropdownShell>
          ) : null}
        </div>

        <div className="relative">
          <button type="button" onClick={() => toggleMenu("columns")} className={buttonClass}>
            <Columns3 aria-hidden="true" className="h-4 w-4" />
            تعديل الأعمدة
          </button>
          {openMenu === "columns" ? (
            <DropdownShell wide>
              <div className="mb-3 flex items-center justify-between gap-3 border-b border-[#E6D5BD] pb-3">
                <h3 className="text-base font-black text-[#3B2417]">كل الأعمدة</h3>
                <button
                  type="button"
                  onClick={() => setEnabledColumns(new Set(trialBalanceColumns.filter((column) => column.defaultEnabled).map((column) => column.id)))}
                  className="text-xs font-black text-[#8A5B24] hover:text-[#4C2D1E]"
                >
                  إعادة الضبط
                </button>
              </div>

              <div className="rounded-2xl border border-dashed border-[#D8C3A4] bg-[#FFF9F0] p-3">
                <p className="text-xs font-black text-[#7A4D1F]">أعمدة مثبتة</p>
                <p className="mt-1 text-xs font-bold text-[#806851]">لا توجد أعمدة مثبتة</p>
              </div>

              <div className="mt-4">
                <p className="mb-2 text-xs font-black text-[#7A4D1F]">أعمدة أخرى</p>
                <div className="grid gap-1">
                  {trialBalanceColumns.map((column) => {
                    const enabled = enabledColumns.has(column.id);
                    return (
                      <button
                        key={column.id}
                        type="button"
                        onClick={() => toggleColumn(column.id)}
                        className="flex items-center justify-between gap-3 rounded-2xl px-3 py-2.5 text-right transition hover:bg-[#FBF5EC]"
                      >
                        <span className="text-sm font-bold text-[#4C2D1E]">{column.label}</span>
                        <span
                          className={`relative h-6 w-11 rounded-full transition ${
                            enabled ? "bg-[#B88334]" : "bg-[#E6D5BD]"
                          }`}
                        >
                          <span
                            className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
                              enabled ? "right-6" : "right-1"
                            }`}
                          />
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </DropdownShell>
          ) : null}
        </div>

        <div className="relative">
          <button type="button" onClick={() => toggleMenu("export")} className={buttonClass}>
            <Download aria-hidden="true" className="h-4 w-4" />
            التصدير
          </button>
          {openMenu === "export" ? (
            <DropdownShell>
              <div className="grid gap-1">
                {trialBalanceExportOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className="rounded-2xl px-3 py-2.5 text-right text-sm font-bold text-[#4C2D1E] transition hover:bg-[#FBF5EC]"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </DropdownShell>
          ) : null}
        </div>

        <span className="ms-auto inline-flex items-center gap-2 rounded-2xl border border-[#E3CFB0] bg-[#FFFDF8] px-4 py-2.5 text-xs font-extrabold text-[#806851]">
          <SlidersHorizontal aria-hidden="true" className="h-4 w-4 text-[#8A5B24]" />
          أدوات واجهة فقط
        </span>
      </div>
    </div>
  );
}
