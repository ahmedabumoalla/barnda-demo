import type { FinanceInvoiceItem } from "@/lib/branda-finance/invoice-types";

export type InvoiceTotalsValue = {
  subtotal: number;
  discount: number;
  vat: number;
  total: number;
};

export function calculateInvoiceTotals(items: FinanceInvoiceItem[], discount: number): InvoiceTotalsValue {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const taxable = items.reduce((sum, item) => sum + item.quantity * item.price * (item.taxRate / 100), 0);
  const safeDiscount = Math.min(Math.max(discount, 0), subtotal);
  return {
    subtotal,
    discount: safeDiscount,
    vat: taxable,
    total: subtotal - safeDiscount + taxable,
  };
}

export function formatFinanceAmount(value: number) {
  return new Intl.NumberFormat("ar-SA", {
    style: "currency",
    currency: "SAR",
    maximumFractionDigits: 2,
  }).format(value);
}

export function InvoiceTotals({ totals }: { totals: InvoiceTotalsValue }) {
  const rows = [
    ["الإجمالي قبل الخصم", totals.subtotal],
    ["الخصم", totals.discount],
    ["ضريبة القيمة المضافة", totals.vat],
    ["الإجمالي المستحق", totals.total],
  ] as const;

  return (
    <div className="rounded-[8px] border border-[#E6D7C3] bg-[#FFFDF8] p-4">
      <div className="space-y-3">
        {rows.map(([label, value], index) => (
          <div
            key={label}
            className={`flex items-center justify-between gap-4 text-sm ${
              index === rows.length - 1
                ? "border-t border-[#E6D7C3] pt-3 text-lg font-black text-[#2F241D]"
                : "font-bold text-[#725D4D]"
            }`}
          >
            <span>{label}</span>
            <span dir="ltr" className="font-black">
              {formatFinanceAmount(value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
