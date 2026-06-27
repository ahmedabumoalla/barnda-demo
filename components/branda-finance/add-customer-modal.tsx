import type { FinanceCustomer } from "@/lib/branda-finance/invoice-types";

type AddCustomerModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (customer: FinanceCustomer) => void;
};

const customerFields = [
  "اسم المنشأة",
  "البلد",
  "جهة الاتصال مسجلة في ضريبة القيمة المضافة في السعودية",
  "رقم التسجيل الضريبي",
  "العنوان",
  "المدينة",
  "الشارع",
  "رقم المبنى",
  "الحي",
  "الرمز البريدي",
  "بيانات الفاتورة",
  "المعرف",
  "البريد الإلكتروني",
  "الهاتف",
  "العملة",
  "شروط الدفع",
  "الحساب الافتراضي للإيرادات",
  "مركز تكلفة الإيرادات الافتراضي",
  "معدل الضريبة الافتراضي",
  "الحقول المخصصة",
];

export function AddCustomerModal({ open, onClose, onSave }: AddCustomerModalProps) {
  if (!open) return null;

  function handleSubmit(formData: FormData) {
    const name = String(formData.get("اسم المنشأة") ?? "").trim() || "عميل جديد";
    const country = String(formData.get("البلد") ?? "").trim() || "المملكة العربية السعودية";
    onSave({
      id: `customer-local-${Date.now()}`,
      name,
      country,
      vatRegistered: String(formData.get("جهة الاتصال مسجلة في ضريبة القيمة المضافة في السعودية") ?? "") === "on",
      vatNumber: String(formData.get("رقم التسجيل الضريبي") ?? "").trim() || undefined,
      city: String(formData.get("المدينة") ?? "").trim() || undefined,
      address: String(formData.get("العنوان") ?? "").trim() || undefined,
      email: String(formData.get("البريد الإلكتروني") ?? "").trim() || undefined,
      phone: String(formData.get("الهاتف") ?? "").trim() || undefined,
      currency: "SAR",
      paymentTerms: String(formData.get("شروط الدفع") ?? "").trim() || "فوري",
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#24160F]/45 p-4">
      <form action={handleSubmit} className="max-h-[88vh] w-full max-w-4xl overflow-hidden rounded-[8px] border border-[#E3CFB0] bg-[#FFFDF8] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#E8D8C2] px-5 py-4">
          <h2 className="text-xl font-black text-[#2F241D]">إضافة عميل</h2>
          <button type="button" onClick={onClose} className="h-9 w-9 rounded-[8px] border border-[#E3CFB0] font-black text-[#6B3F22]">
            ×
          </button>
        </div>
        <div className="grid max-h-[62vh] gap-4 overflow-auto p-5 sm:grid-cols-2">
          {customerFields.map((field) =>
            field.includes("مسجلة") ? (
              <label key={field} className="flex min-h-11 items-center gap-3 rounded-[8px] border border-[#E8D8C2] bg-[#FAF3E8] px-3 text-sm font-bold text-[#4A3528]">
                <input name={field} type="checkbox" className="h-4 w-4 accent-[#6B3F22]" />
                <span>{field}</span>
              </label>
            ) : (
              <label key={field} className="block">
                <span className="mb-2 block text-xs font-black text-[#6D5544]">{field}</span>
                <input
                  name={field}
                  defaultValue={field === "البلد" ? "المملكة العربية السعودية" : field === "العملة" ? "SAR" : ""}
                  className="h-11 w-full rounded-[8px] border border-[#E1D1BD] bg-white px-3 text-sm font-bold text-[#2F241D] outline-none focus:border-[#B88334] focus:ring-2 focus:ring-[#D9A33F]/20"
                />
              </label>
            ),
          )}
        </div>
        <div className="flex justify-end gap-3 border-t border-[#E8D8C2] px-5 py-4">
          <button type="button" onClick={onClose} className="rounded-[8px] border border-[#D8C7B2] px-5 py-2 text-sm font-black text-[#654B3B]">
            إلغاء
          </button>
          <button type="submit" className="rounded-[8px] bg-[#5B3926] px-5 py-2 text-sm font-black text-white">
            حفظ محلي
          </button>
        </div>
      </form>
    </div>
  );
}
