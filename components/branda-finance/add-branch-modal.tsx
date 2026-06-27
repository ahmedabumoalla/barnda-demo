import type { FinanceBranch } from "@/lib/branda-finance/invoice-types";

type AddBranchModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (branch: FinanceBranch) => void;
};

export function AddBranchModal({ open, onClose, onSave }: AddBranchModalProps) {
  if (!open) return null;

  function handleSubmit(formData: FormData) {
    const name = String(formData.get("name") ?? "").trim() || "فرع جديد";
    onSave({
      id: `branch-local-${Date.now()}`,
      name,
      displayName: String(formData.get("displayName") ?? "").trim() || name,
      city: String(formData.get("city") ?? "").trim() || "الرياض",
      address: String(formData.get("address") ?? "").trim() || "عنوان تجريبي",
      phone: String(formData.get("phone") ?? "").trim() || undefined,
      licenseType: String(formData.get("licenseType") ?? "").trim() || undefined,
      licenseNumber: String(formData.get("licenseNumber") ?? "").trim() || undefined,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#24160F]/45 p-4">
      <form action={handleSubmit} className="w-full max-w-3xl overflow-hidden rounded-[8px] border border-[#E3CFB0] bg-[#FFFDF8] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#E8D8C2] px-5 py-4">
          <h2 className="text-xl font-black text-[#2F241D]">إضافة فرع</h2>
          <button type="button" onClick={onClose} className="h-9 w-9 rounded-[8px] border border-[#E3CFB0] font-black text-[#6B3F22]">
            ×
          </button>
        </div>
        <div className="grid max-h-[62vh] gap-4 overflow-auto p-5 sm:grid-cols-2">
          <TextField name="displayName" label="اسم العرض" />
          <TextField name="name" label="اسم الفرع" />
          <TextField name="phone" label="الهاتف" />
          <TextField name="licenseType" label="نوع الترخيص" />
          <TextField name="licenseNumber" label="رقم الترخيص" />
          <TextField name="address" label="العنوان" />
          <TextField name="city" label="المدينة" defaultValue="الرياض" />
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

function TextField({ name, label, defaultValue = "" }: { name: string; label: string; defaultValue?: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black text-[#6D5544]">{label}</span>
      <input
        name={name}
        defaultValue={defaultValue}
        className="h-11 w-full rounded-[8px] border border-[#E1D1BD] bg-white px-3 text-sm font-bold text-[#2F241D] outline-none focus:border-[#B88334] focus:ring-2 focus:ring-[#D9A33F]/20"
      />
    </label>
  );
}
