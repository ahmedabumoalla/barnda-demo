type LoyaltyScanModalProps = {
  open: boolean;
  onClose: () => void;
  onApply: (code: string) => void;
};

export function LoyaltyScanModal({ open, onClose, onApply }: LoyaltyScanModalProps) {
  if (!open) return null;

  function handleSubmit(formData: FormData) {
    const code = String(formData.get("code") ?? "").trim();
    const customerName = String(formData.get("customerName") ?? "").trim();
    const discount = formData.get("demoDiscount") ? "خصم تجريبي" : "";
    onApply([code, customerName, discount].filter(Boolean).join(" - "));
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#24160F]/45 p-4">
      <form action={handleSubmit} className="w-full max-w-md overflow-hidden rounded-[8px] border border-[#E3CFB0] bg-[#FFFDF8] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#E8D8C2] px-5 py-4">
          <h2 className="text-lg font-black text-[#2F241D]">قراءة باركود الولاء</h2>
          <button type="button" onClick={onClose} className="h-9 w-9 rounded-[8px] border border-[#E3CFB0] font-black text-[#6B3F22]">
            ×
          </button>
        </div>
        <div className="space-y-4 p-5">
          <label className="block">
            <span className="mb-2 block text-xs font-black text-[#6D5544]">رقم بطاقة الولاء / الباركود</span>
            <input name="code" className="h-11 w-full rounded-[8px] border border-[#E1D1BD] bg-white px-3 text-sm font-bold outline-none focus:border-[#B88334] focus:ring-2 focus:ring-[#D9A33F]/20" />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-black text-[#6D5544]">اسم العميل</span>
            <input name="customerName" className="h-11 w-full rounded-[8px] border border-[#E1D1BD] bg-white px-3 text-sm font-bold outline-none focus:border-[#B88334] focus:ring-2 focus:ring-[#D9A33F]/20" />
          </label>
          <label className="flex items-center gap-3 rounded-[8px] border border-[#E6D7C3] bg-[#FAF3E8] p-3 text-xs font-black text-[#6B431C]">
            <input name="demoDiscount" type="checkbox" className="h-4 w-4 accent-[#5B3926]" />
            تطبيق الخصم التجريبي
          </label>
          <div className="rounded-[8px] border border-[#E6D7C3] bg-[#FAF3E8] p-3 text-xs font-bold leading-6 text-[#6B431C]">
            التطبيق هنا محلي فقط. لا يوجد وصول للكاميرا أو أجهزة قراءة خارجية في نسخة الديمو.
          </div>
        </div>
        <div className="flex justify-end gap-3 border-t border-[#E8D8C2] px-5 py-4">
          <button type="button" onClick={onClose} className="rounded-[8px] border border-[#D8C7B2] px-5 py-2 text-sm font-black text-[#654B3B]">
            إلغاء
          </button>
          <button type="submit" className="rounded-[8px] bg-[#5B3926] px-5 py-2 text-sm font-black text-white">
            تطبيق العميل
          </button>
        </div>
      </form>
    </div>
  );
}
