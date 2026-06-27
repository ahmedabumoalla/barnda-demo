import { X } from "lucide-react";
import { InvoicePreview, type InvoicePreviewProps } from "@/components/branda-finance/invoice-preview";

type InvoicePreviewModalProps = InvoicePreviewProps & {
  open: boolean;
  onClose: () => void;
};

export function InvoicePreviewModal({ open, onClose, ...previewProps }: InvoicePreviewModalProps) {
  if (!open) return null;

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-stretch justify-center bg-[#2F241D]/45 p-0 text-right text-[#2F241D] sm:items-center sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="invoice-preview-modal-title"
      onClick={onClose}
    >
      <div
        className="flex h-full w-full max-w-6xl flex-col overflow-hidden bg-[#FFFDF8] shadow-[0_24px_70px_rgba(47,36,29,0.24)] sm:h-[92vh] sm:rounded-[8px] sm:border sm:border-[#D8C3A2]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E8D8C2] bg-[#FFFDF8] px-4 py-3 sm:px-5">
          <div>
            <h2 id="invoice-preview-modal-title" className="text-xl font-black text-[#2F241D]">
              معاينة الفاتورة
            </h2>
            <span className="mt-2 inline-flex rounded-[8px] border border-[#D6B677] bg-[#F8E8C9] px-3 py-1 text-xs font-black text-[#6B431C]">
              معاينة غير نهائية
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-[#E6CFC8] bg-[#FFF7F4] text-[#9B3327] transition hover:bg-[#FBE5DF]"
            aria-label="إغلاق معاينة الفاتورة"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-[#F5EFE6] p-4 sm:p-5">
          <InvoicePreview {...previewProps} sticky={false} className="mx-auto max-w-5xl shadow-none" />
        </div>
      </div>
    </div>
  );
}
