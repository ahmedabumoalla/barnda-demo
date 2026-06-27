import { Minus, Plus, Printer, ReceiptText, ScanLine, Trash2 } from "lucide-react";
import type {
  FinanceBranch,
  FinanceCustomer,
  FinancePaymentMethod,
  FinanceProduct,
  FinanceWarehouse,
} from "@/lib/branda-finance/invoice-types";
import { formatFinanceAmount } from "@/components/branda-finance/invoice-totals";

export type CartItem = {
  product: FinanceProduct;
  quantity: number;
};

type CashierCartPanelProps = {
  items: CartItem[];
  customer: FinanceCustomer;
  branch: FinanceBranch;
  warehouse: FinanceWarehouse;
  paymentMethod: "cash" | "card" | "";
  paymentMethods: FinancePaymentMethod[];
  loyaltyCode: string;
  onPaymentMethodChange: (method: "cash" | "card") => void;
  onIncrease: (productId: string) => void;
  onDecrease: (productId: string) => void;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  onOpenLoyalty: () => void;
};

export function cartTotals(items: CartItem[]) {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const vat = items.reduce((sum, item) => sum + item.product.price * item.quantity * (item.product.vatRate / 100), 0);
  return { subtotal, vat, total: subtotal + vat };
}

export function CashierCartPanel({
  items,
  customer,
  branch,
  warehouse,
  paymentMethod,
  paymentMethods,
  loyaltyCode,
  onPaymentMethodChange,
  onIncrease,
  onDecrease,
  onQuantityChange,
  onRemove,
  onOpenLoyalty,
}: CashierCartPanelProps) {
  const totals = cartTotals(items);
  const methodLabel = paymentMethods.find((method) => method.id === paymentMethod)?.name ?? "غير محدد";

  return (
    <aside className="rounded-[8px] border border-[#D8C3A2] bg-[#FFFDF8] p-4 shadow-[0_16px_38px_rgba(69,43,28,0.10)] lg:sticky lg:top-5">
      <div className="flex items-start justify-between gap-3 border-b border-[#E8D8C2] pb-4">
        <div>
          <p className="text-xs font-black text-[#9C6B2E]">فاتورة الكاشير</p>
          <h2 className="mt-1 text-xl font-black text-[#2F241D]">مسودة بيع مباشر</h2>
        </div>
        <ReceiptText className="h-7 w-7 text-[#5B3926]" />
      </div>

      <div className="mt-4 grid gap-2 text-xs font-bold text-[#6D5544]">
        <SummaryLine label="العميل" value={customer.name} />
        <SummaryLine label="الفرع" value={branch.displayName || branch.name} />
        <SummaryLine label="المستودع" value={warehouse.name} />
      </div>

      <div className="mt-4 space-y-3">
        {items.length ? (
          items.map((item) => (
            <div key={item.product.id} className="rounded-[8px] border border-[#E6D7C3] bg-white p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="line-clamp-1 text-sm font-black text-[#2F241D]">{item.product.name}</h3>
                  <p className="mt-1 text-xs font-bold text-[#806A58]" dir="ltr">{item.product.sku}</p>
                </div>
                <button type="button" onClick={() => onRemove(item.product.id)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] border border-[#E6CFC8] bg-[#FFF7F4] text-[#9B3327]">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <div className="flex items-center rounded-[8px] border border-[#E1D1BD] bg-[#FFFDF8]">
                  <button type="button" onClick={() => onIncrease(item.product.id)} className="flex h-9 w-9 items-center justify-center text-[#5B3926]">
                    <Plus className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(event) => onQuantityChange(item.product.id, Math.max(1, Number(event.target.value) || 1))}
                    className="h-9 w-14 border-x border-[#E1D1BD] bg-white text-center text-sm font-black outline-none"
                  />
                  <button type="button" onClick={() => onDecrease(item.product.id)} className="flex h-9 w-9 items-center justify-center text-[#5B3926]">
                    <Minus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-sm font-black text-[#2F241D]" dir="ltr">
                  {formatFinanceAmount(item.product.price * item.quantity)}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-[8px] border border-dashed border-[#D8C3A2] bg-[#FAF3E8] p-6 text-center text-sm font-black text-[#7D6654]">
            اختر منتجًا لإضافته إلى الفاتورة.
          </div>
        )}
      </div>

      <div className="mt-4 rounded-[8px] border border-[#E6D7C3] bg-white p-3">
        <p className="mb-3 text-sm font-black text-[#2F241D]">طريقة الدفع</p>
        <div className="grid grid-cols-2 gap-2">
          {(["cash", "card"] as const).map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => onPaymentMethodChange(method)}
              className={`h-11 rounded-[8px] border text-sm font-black ${
                paymentMethod === method
                  ? "border-[#2F5D50] bg-[#2F5D50] text-white"
                  : "border-[#E1D1BD] bg-[#FFFDF8] text-[#5B3926]"
              }`}
            >
              {method === "cash" ? "كاش" : "بطاقة"}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs font-bold leading-6 text-[#806A58]">
          سيتم ربط طريقة الدفع لاحقًا بدفتر برندا فايننس وصندوق الكاشير ومزود البطاقة.
        </p>
      </div>

      <div className="mt-4 space-y-2 rounded-[8px] border border-[#E6D7C3] bg-[#FAF3E8] p-3 text-sm">
        <TotalLine label="الإجمالي الفرعي" value={totals.subtotal} />
        <TotalLine label="VAT 15%" value={totals.vat} />
        <TotalLine label="الإجمالي" value={totals.total} strong />
      </div>

      <div className="mt-4 rounded-[8px] border border-[#E6D7C3] bg-white p-3">
        <div className="mb-2 flex items-center justify-between gap-3">
          <h3 className="text-sm font-black text-[#2F241D]">معاينة بيان الفاتورة</h3>
          <span className="text-xs font-black text-[#2F5D50]">{methodLabel}</span>
        </div>
        <p className="text-xs font-bold leading-6 text-[#806A58]">
          {items.length} بند، إجمالي {formatFinanceAmount(totals.total)}، العميل {customer.name}.
          {loyaltyCode ? ` بطاقة الولاء: ${loyaltyCode}.` : ""}
        </p>
      </div>

      <div className="mt-4 grid gap-2">
        <button disabled={!items.length || !paymentMethod} type="button" className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] bg-[#5B3926] text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-50">
          <ReceiptText className="h-4 w-4" />
          إنشاء فاتورة
        </button>
        <button disabled type="button" className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] border border-[#D8C7B2] bg-white text-sm font-black text-[#5B3926] opacity-60">
          <Printer className="h-4 w-4" />
          طباعة
        </button>
        <button type="button" onClick={onOpenLoyalty} className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] border border-[#D6B677] bg-[#F8E8C9] text-sm font-black text-[#6B431C]">
          <ScanLine className="h-4 w-4" />
          قراءة باركود الولاء
        </button>
        <button type="button" className="h-11 rounded-[8px] border border-[#D8C7B2] bg-white text-sm font-black text-[#5B3926]">
          حفظ كمسودة
        </button>
      </div>
    </aside>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[8px] bg-[#FAF3E8] px-3 py-2">
      <span>{label}</span>
      <span className="font-black text-[#2F241D]">{value}</span>
    </div>
  );
}

function TotalLine({ label, value, strong }: { label: string; value: number; strong?: boolean }) {
  return (
    <div className={`flex items-center justify-between gap-4 ${strong ? "border-t border-[#D8C3A2] pt-2 text-lg font-black text-[#2F241D]" : "font-bold text-[#6D5544]"}`}>
      <span>{label}</span>
      <span dir="ltr">{formatFinanceAmount(value)}</span>
    </div>
  );
}
