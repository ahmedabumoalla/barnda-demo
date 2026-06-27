import type { FinanceCustomField } from "@/lib/branda-finance/invoice-types";

type CustomFieldModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (field: FinanceCustomField) => void;
};

const fieldTypes: Array<{ value: FinanceCustomField["type"]; label: string }> = [
  { value: "text", label: "نص" },
  { value: "textarea", label: "نص متعدد الأسطر" },
  { value: "number", label: "رقم" },
  { value: "date", label: "تاريخ" },
  { value: "select", label: "اختيار" },
];

export function CustomFieldModal({ open, onClose, onSave }: CustomFieldModalProps) {
  if (!open) return null;

  function handleSubmit(formData: FormData) {
    onSave({
      id: `custom-local-${Date.now()}`,
      name: String(formData.get("name") ?? "").trim() || "حقل مخصص",
      appliesTo: String(formData.get("appliesTo") ?? "").trim() || "الفاتورة",
      type: String(formData.get("type") ?? "text") as FinanceCustomField["type"],
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#24160F]/45 p-4">
      <form action={handleSubmit} className="w-full max-w-lg overflow-hidden rounded-[8px] border border-[#E3CFB0] bg-[#FFFDF8] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#E8D8C2] px-5 py-4">
          <h2 className="text-xl font-black text-[#2F241D]">إضافة حقل مخصص</h2>
          <button type="button" onClick={onClose} className="h-9 w-9 rounded-[8px] border border-[#E3CFB0] font-black text-[#6B3F22]">
            ×
          </button>
        </div>
        <div className="space-y-4 p-5">
          <label className="block">
            <span className="mb-2 block text-xs font-black text-[#6D5544]">الاسم</span>
            <input name="name" className="h-11 w-full rounded-[8px] border border-[#E1D1BD] bg-white px-3 text-sm font-bold outline-none focus:border-[#B88334] focus:ring-2 focus:ring-[#D9A33F]/20" />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-black text-[#6D5544]">ينطبق على</span>
            <select name="appliesTo" className="h-11 w-full rounded-[8px] border border-[#E1D1BD] bg-white px-3 text-sm font-bold outline-none focus:border-[#B88334] focus:ring-2 focus:ring-[#D9A33F]/20">
              <option>الفاتورة</option>
              <option>العميل</option>
              <option>بند الفاتورة</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-black text-[#6D5544]">نوع الحقل</span>
            <select name="type" className="h-11 w-full rounded-[8px] border border-[#E1D1BD] bg-white px-3 text-sm font-bold outline-none focus:border-[#B88334] focus:ring-2 focus:ring-[#D9A33F]/20">
              {fieldTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </label>
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
