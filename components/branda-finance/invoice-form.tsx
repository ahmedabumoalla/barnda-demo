import { Paperclip, Upload } from "lucide-react";
import { EntitySelect } from "@/components/branda-finance/entity-select";
import { InvoiceItemsTable } from "@/components/branda-finance/invoice-items-table";
import { InvoiceTotals, type InvoiceTotalsValue } from "@/components/branda-finance/invoice-totals";
import type {
  FinanceBranch,
  FinanceCustomField,
  FinanceCustomer,
  FinanceInvoiceItem,
  FinancePaymentMethod,
  FinanceWarehouse,
  FinanceWorkspaceData,
} from "@/lib/branda-finance/invoice-types";

type InvoiceFormProps = {
  data: FinanceWorkspaceData;
  branches: FinanceBranch[];
  warehouses: FinanceWarehouse[];
  customers: FinanceCustomer[];
  customFields: FinanceCustomField[];
  items: FinanceInvoiceItem[];
  totals: InvoiceTotalsValue;
  selectedBranchId: string;
  selectedWarehouseId: string;
  selectedCustomerId: string;
  selectedPaymentMethodId: FinancePaymentMethod["id"];
  issueDate: string;
  dueDate: string;
  taxMode: string;
  invoiceStatus: string;
  discount: number;
  amountPaid: number;
  onBranchChange: (id: string) => void;
  onWarehouseChange: (id: string) => void;
  onCustomerChange: (id: string) => void;
  onPaymentMethodChange: (id: FinancePaymentMethod["id"]) => void;
  onIssueDateChange: (value: string) => void;
  onDueDateChange: (value: string) => void;
  onTaxModeChange: (value: string) => void;
  onInvoiceStatusChange: (value: string) => void;
  onDiscountChange: (value: number) => void;
  onAmountPaidChange: (value: number) => void;
  onOpenCustomerModal: () => void;
  onOpenBranchModal: () => void;
  onOpenCustomFieldModal: () => void;
  onChangeItem: (id: string, patch: Partial<FinanceInvoiceItem>) => void;
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
};

const inputClass =
  "h-11 w-full rounded-[8px] border border-[#E1D1BD] bg-white px-3 text-sm font-bold text-[#2F241D] outline-none transition focus:border-[#B88334] focus:ring-2 focus:ring-[#D9A33F]/20";

export function InvoiceForm({
  data,
  branches,
  warehouses,
  customers,
  customFields,
  items,
  totals,
  selectedBranchId,
  selectedWarehouseId,
  selectedCustomerId,
  selectedPaymentMethodId,
  issueDate,
  dueDate,
  taxMode,
  invoiceStatus,
  discount,
  amountPaid,
  onBranchChange,
  onWarehouseChange,
  onCustomerChange,
  onPaymentMethodChange,
  onIssueDateChange,
  onDueDateChange,
  onTaxModeChange,
  onInvoiceStatusChange,
  onDiscountChange,
  onAmountPaidChange,
  onOpenCustomerModal,
  onOpenBranchModal,
  onOpenCustomFieldModal,
  onChangeItem,
  onAddItem,
  onRemoveItem,
}: InvoiceFormProps) {
  return (
    <section className="rounded-[8px] border border-[#D8C3A2] bg-[#FFFDF8] p-4 shadow-[0_16px_38px_rgba(69,43,28,0.08)]">
      <div className="mb-5 flex flex-col gap-3 border-b border-[#E8D8C2] pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black text-[#9C6B2E]">مساحة إنشاء الفاتورة</p>
          <h2 className="mt-1 text-2xl font-black text-[#2F241D]">INV-000101</h2>
          <p className="mt-1 text-xs font-bold text-[#806A58]">عملة الفاتورة: SAR</p>
        </div>
        <button
          type="button"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] border border-[#D6B677] bg-[#F8E8C9] px-4 text-xs font-black text-[#6B431C]"
        >
          <Upload className="h-4 w-4" />
          شعار الفاتورة
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <EntitySelect
          label="جهة الإصدار / الفرع"
          value={selectedBranchId}
          options={branches.map((branch) => ({ id: branch.id, label: branch.displayName || branch.name, meta: branch.city }))}
          onChange={onBranchChange}
          actionLabel="إضافة فرع"
          onAction={onOpenBranchModal}
        />
        <EntitySelect
          label="العميل"
          value={selectedCustomerId}
          options={customers.map((customer) => ({ id: customer.id, label: customer.name, meta: customer.vatNumber ?? customer.paymentTerms }))}
          onChange={onCustomerChange}
          actionLabel="إضافة عميل"
          onAction={onOpenCustomerModal}
        />
        <label className="block">
          <span className="mb-2 block text-xs font-black text-[#6D5544]">تاريخ الإصدار</span>
          <input type="date" value={issueDate} onChange={(event) => onIssueDateChange(event.target.value)} className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs font-black text-[#6D5544]">تاريخ الاستحقاق</span>
          <input type="date" value={dueDate} onChange={(event) => onDueDateChange(event.target.value)} className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs font-black text-[#6D5544]">وضع الضريبة</span>
          <select value={taxMode} onChange={(event) => onTaxModeChange(event.target.value)} className={inputClass}>
            <option>شامل الضريبة</option>
            <option>غير شامل الضريبة</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block text-xs font-black text-[#6D5544]">حالة الفاتورة</span>
          <select value={invoiceStatus} onChange={(event) => onInvoiceStatusChange(event.target.value)} className={inputClass}>
            <option>مسودة</option>
            <option>جاهزة للاعتماد</option>
            <option>غير مدفوعة</option>
          </select>
        </label>
        <EntitySelect
          label="المستودع"
          value={selectedWarehouseId}
          options={warehouses.map((warehouse) => ({ id: warehouse.id, label: warehouse.name, meta: warehouse.city }))}
          onChange={onWarehouseChange}
        />
        <label className="block">
          <span className="mb-2 block text-xs font-black text-[#6D5544]">خصم الفاتورة</span>
          <input
            type="number"
            min="0"
            value={discount}
            onChange={(event) => onDiscountChange(Math.max(0, Number(event.target.value) || 0))}
            className={inputClass}
          />
        </label>
      </div>

      <div className="mt-5 rounded-[8px] border border-[#E8D8C2] bg-[#FAF3E8] p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-black text-[#2F241D]">الحقول المخصصة وربط الكيانات</h3>
          <button
            type="button"
            onClick={onOpenCustomFieldModal}
            className="rounded-[8px] border border-[#D6B677] bg-[#FFF8EA] px-3 py-2 text-xs font-black text-[#6B431C]"
          >
            إضافة حقل مخصص
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {customFields.map((field) => (
            <span key={field.id} className="rounded-[8px] border border-[#E1D1BD] bg-white px-3 py-2 text-xs font-black text-[#6D5544]">
              {field.name}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <InvoiceItemsTable
          items={items}
          products={data.products}
          accounts={data.accounts}
          warehouses={warehouses}
          taxRates={data.taxRates}
          onChangeItem={onChangeItem}
          onAddItem={onAddItem}
          onRemoveItem={onRemoveItem}
        />
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          <div className="rounded-[8px] border border-dashed border-[#D6B677] bg-[#FFF8EA] p-4 text-sm font-bold leading-7 text-[#6B431C]">
            <div className="mb-2 inline-flex items-center gap-2 font-black">
              <Paperclip className="h-4 w-4" />
              مرفقات وملاحظات
            </div>
            <p>المرفقات وملفات الدعم تظهر هنا لاحقًا. لا توجد أي عملية رفع فعلية في نسخة الديمو الحالية.</p>
            <p className="mt-2">بيانات الموردين موجودة تمهيديًا لتدفقات المشتريات المستقبلية، وعددها {data.suppliers.length}.</p>
          </div>

          <div className="rounded-[8px] border border-[#E8D8C2] bg-white p-4">
            <h3 className="mb-3 text-sm font-black text-[#2F241D]">طريقة الدفع</h3>
            <div className="grid gap-2 sm:grid-cols-5">
              {data.paymentMethods.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => onPaymentMethodChange(method.id)}
                  className={`min-h-16 rounded-[8px] border px-3 py-2 text-sm font-black transition ${
                    selectedPaymentMethodId === method.id
                      ? "border-[#5B3926] bg-[#5B3926] text-white"
                      : "border-[#E1D1BD] bg-[#FFFDF8] text-[#5B3926] hover:border-[#B88334]"
                  }`}
                >
                  <span>{method.name}</span>
                  <span className="mt-1 block text-[10px] font-bold opacity-80">{method.ledgerHint}</span>
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs font-bold leading-6 text-[#806A58]">
              سيتم ربطها لاحقًا مع الصندوق ودفتر اليومية في برندا المالية.
            </p>
          </div>

          <label className="block rounded-[8px] border border-[#E8D8C2] bg-white p-4">
            <span className="mb-2 block text-xs font-black text-[#6D5544]">المبلغ المدفوع</span>
            <input
              type="number"
              min="0"
              value={amountPaid}
              onChange={(event) => onAmountPaidChange(Math.max(0, Number(event.target.value) || 0))}
              className={inputClass}
            />
          </label>
        </div>
        <InvoiceTotals totals={totals} />
      </div>
    </section>
  );
}
