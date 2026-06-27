import type {
  FinanceBranch,
  FinanceCustomer,
  FinanceInvoiceItem,
  FinancePaymentMethod,
} from "@/lib/branda-finance/invoice-types";
import { formatFinanceAmount, type InvoiceTotalsValue } from "@/components/branda-finance/invoice-totals";

type InvoicePreviewProps = {
  branch: FinanceBranch;
  customer: FinanceCustomer;
  items: FinanceInvoiceItem[];
  totals: InvoiceTotalsValue;
  issueDate: string;
  dueDate: string;
  paymentMethod: FinancePaymentMethod;
};

export function InvoicePreview({
  branch,
  customer,
  items,
  totals,
  issueDate,
  dueDate,
  paymentMethod,
}: InvoicePreviewProps) {
  return (
    <aside className="rounded-[8px] border border-[#D8C3A2] bg-[#FFFDF8] p-4 shadow-[0_16px_38px_rgba(69,43,28,0.10)] lg:sticky lg:top-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black text-[#9C6B2E]">معاينة غير نهائية</p>
          <h2 className="mt-1 text-2xl font-black text-[#2F241D]">فاتورة ضريبية</h2>
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-[8px] border border-[#D8BD89] bg-[#F2E0BF] text-lg font-black text-[#5B3926]">
          B
        </div>
      </div>

      <div className="rounded-[8px] border border-[#E6D7C3] bg-[#FAF3E8] p-4">
        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <PreviewLine label="البائع" value={branch.displayName || branch.name} />
          <PreviewLine label="الدولة" value="المملكة العربية السعودية" />
          <PreviewLine label="رقم الفاتورة" value="INV-000101" />
          <PreviewLine label="تاريخ الإصدار" value={issueDate} />
          <PreviewLine label="تاريخ الاستحقاق" value={dueDate} />
          <PreviewLine label="العميل" value={customer.name} />
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-[8px] border border-[#E6D7C3]">
        <table className="w-full text-right text-xs">
          <thead className="bg-[#2F241D] text-white">
            <tr>
              <th className="px-3 py-2">البند</th>
              <th className="px-3 py-2">الكمية</th>
              <th className="px-3 py-2">السعر</th>
              <th className="px-3 py-2">الإجمالي</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EFE3D2] bg-white">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-3 py-3 font-bold text-[#2F241D]">{item.description || "بند فاتورة"}</td>
                <td className="px-3 py-3">{item.quantity}</td>
                <td className="px-3 py-3" dir="ltr">{formatFinanceAmount(item.price)}</td>
                <td className="px-3 py-3 font-black" dir="ltr">{formatFinanceAmount(item.quantity * item.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 space-y-2 rounded-[8px] border border-[#E6D7C3] bg-white p-4 text-sm">
        <PreviewTotal label="الإجمالي الفرعي" value={totals.subtotal} />
        <PreviewTotal label="ضريبة القيمة المضافة 15%" value={totals.vat} />
        <PreviewTotal label="الإجمالي" value={totals.total} strong />
      </div>

      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div className="rounded-[8px] border border-[#E6D7C3] bg-[#FAF3E8] p-3">
          <p className="text-xs font-black text-[#856A54]">طريقة الدفع</p>
          <p className="mt-1 font-black text-[#2F241D]">{paymentMethod.name}</p>
        </div>
        <div className="rounded-[8px] border border-[#E6D7C3] bg-[#FAF3E8] p-3">
          <p className="text-xs font-black text-[#856A54]">قالب الفاتورة</p>
          <p className="mt-1 font-black text-[#2F241D]">قالب برندا القياسي</p>
        </div>
      </div>

      <div className="mt-4 rounded-[8px] border border-dashed border-[#CFA85F] bg-[#FFF8EA] p-3 text-xs font-bold leading-6 text-[#6B431C]">
        ملاحظات: هذه المعاينة محلية لغرض تجربة إنشاء الفواتير. الاعتماد والترحيل للدفتر العام سيتم ربطهما لاحقًا بإجراءات آمنة مخصصة للديمو.
      </div>
    </aside>
  );
}

function PreviewLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-black text-[#856A54]">{label}</p>
      <p className="mt-1 font-black text-[#2F241D]">{value}</p>
    </div>
  );
}

function PreviewTotal({ label, value, strong }: { label: string; value: number; strong?: boolean }) {
  return (
    <div className={`flex items-center justify-between gap-4 ${strong ? "border-t border-[#E6D7C3] pt-2 text-lg font-black text-[#2F241D]" : "font-bold text-[#6D5544]"}`}>
      <span>{label}</span>
      <span dir="ltr">{formatFinanceAmount(value)}</span>
    </div>
  );
}
