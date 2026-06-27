"use client";

import { useMemo, useState } from "react";
import { Eye, EyeOff, FileCheck2, Save, X, Paperclip } from "lucide-react";
import { AddBranchModal } from "@/components/branda-finance/add-branch-modal";
import { AddCustomerModal } from "@/components/branda-finance/add-customer-modal";
import { CustomFieldModal } from "@/components/branda-finance/custom-field-modal";
import { InvoiceForm } from "@/components/branda-finance/invoice-form";
import { InvoicePreview } from "@/components/branda-finance/invoice-preview";
import { calculateInvoiceTotals } from "@/components/branda-finance/invoice-totals";
import type {
  FinanceBranch,
  FinanceCustomField,
  FinanceCustomer,
  FinanceInvoiceItem,
  FinancePaymentMethod,
  FinanceWorkspaceData,
} from "@/lib/branda-finance/invoice-types";

type InvoiceWorkspaceProps = {
  data: FinanceWorkspaceData;
};

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function daysFromNowIso(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function createItemFromFirstProduct(data: FinanceWorkspaceData): FinanceInvoiceItem {
  const product = data.products[0];
  return {
    id: `item-${Date.now()}`,
    productId: product?.id,
    description: product?.name ?? "بند فاتورة",
    quantity: 1,
    price: product?.price ?? 0,
    taxRate: product?.vatRate ?? 15,
    accountId: product?.accountId ?? data.accounts[0]?.id ?? "sales-food",
    revenueRecognition: product?.revenueRecognition ?? "عند إصدار الفاتورة",
  };
}

export function InvoiceWorkspace({ data }: InvoiceWorkspaceProps) {
  const [branches, setBranches] = useState(data.branches);
  const [customers, setCustomers] = useState(data.customers);
  const [customFields, setCustomFields] = useState(data.customFields);
  const [selectedBranchId, setSelectedBranchId] = useState(data.branches[0]?.id ?? "");
  const [selectedWarehouseId, setSelectedWarehouseId] = useState(data.warehouses[0]?.id ?? "");
  const [selectedCustomerId, setSelectedCustomerId] = useState(data.customers[0]?.id ?? "");
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<FinancePaymentMethod["id"]>("unpaid");
  const [issueDate, setIssueDate] = useState(todayIso);
  const [dueDate, setDueDate] = useState(() => daysFromNowIso(15));
  const [taxMode, setTaxMode] = useState("السعر غير شامل الضريبة");
  const [discount, setDiscount] = useState(0);
  const [previewVisible, setPreviewVisible] = useState(true);
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [branchModalOpen, setBranchModalOpen] = useState(false);
  const [customFieldModalOpen, setCustomFieldModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState("مسودة محلية فقط");
  const [items, setItems] = useState<FinanceInvoiceItem[]>(() => [
    createItemFromFirstProduct(data),
    {
      ...createItemFromFirstProduct(data),
      id: "item-seed-2",
      productId: data.products[1]?.id,
      description: data.products[1]?.name ?? "بند إضافي",
      price: data.products[1]?.price ?? 0,
      taxRate: data.products[1]?.vatRate ?? 15,
      accountId: data.products[1]?.accountId ?? data.accounts[0]?.id ?? "sales-food",
      revenueRecognition: data.products[1]?.revenueRecognition ?? "عند إصدار الفاتورة",
    },
  ]);

  const totals = useMemo(() => calculateInvoiceTotals(items, discount), [items, discount]);
  const selectedBranch = branches.find((branch) => branch.id === selectedBranchId) ?? branches[0];
  const selectedCustomer = customers.find((customer) => customer.id === selectedCustomerId) ?? customers[0];
  const selectedPaymentMethod =
    data.paymentMethods.find((method) => method.id === selectedPaymentMethodId) ?? data.paymentMethods[0];

  function changeItem(id: string, patch: Partial<FinanceInvoiceItem>) {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function addItem() {
    setItems((current) => [...current, { ...createItemFromFirstProduct(data), id: `item-${Date.now()}-${current.length}` }]);
  }

  function removeItem(id: string) {
    setItems((current) => (current.length > 1 ? current.filter((item) => item.id !== id) : current));
  }

  function saveCustomer(customer: FinanceCustomer) {
    setCustomers((current) => [customer, ...current]);
    setSelectedCustomerId(customer.id);
    setStatusMessage("تمت إضافة العميل محليًا داخل الواجهة");
  }

  function saveBranch(branch: FinanceBranch) {
    setBranches((current) => [branch, ...current]);
    setSelectedBranchId(branch.id);
    setStatusMessage("تمت إضافة الفرع محليًا داخل الواجهة");
  }

  function saveCustomField(field: FinanceCustomField) {
    setCustomFields((current) => [field, ...current]);
    setStatusMessage("تمت إضافة الحقل المخصص محليًا داخل الواجهة");
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#F5EFE6] px-4 py-5 text-right text-[#2F241D] sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-[1720px] flex-col gap-5">
        <div className="rounded-[8px] border border-[#D8C3A2] bg-[#FFFDF8] p-4 shadow-[0_16px_38px_rgba(69,43,28,0.08)]">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-xs font-black text-[#9C6B2E]">برندا المالية</p>
              <h1 className="mt-1 text-2xl font-black text-[#2F241D] sm:text-3xl">إنشاء فاتورة مبيعات</h1>
              <p className="mt-2 text-sm font-bold text-[#7D6654]">{statusMessage}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => setStatusMessage("اعتماد تجريبي فقط، لا توجد آثار محاسبية")} className="inline-flex h-11 items-center gap-2 rounded-[8px] bg-[#2F5D50] px-4 text-sm font-black text-white">
                <FileCheck2 className="h-4 w-4" />
                اعتماد
              </button>
              <button type="button" onClick={() => setStatusMessage("تم حفظ المسودة محليًا داخل الواجهة")} className="inline-flex h-11 items-center gap-2 rounded-[8px] border border-[#D6B677] bg-[#F8E8C9] px-4 text-sm font-black text-[#6B431C]">
                <Save className="h-4 w-4" />
                حفظ المسودة
              </button>
              <button type="button" onClick={() => setPreviewVisible((visible) => !visible)} className="inline-flex h-11 items-center gap-2 rounded-[8px] border border-[#D8C7B2] bg-white px-4 text-sm font-black text-[#5B3926]">
                {previewVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {previewVisible ? "إخفاء المعاينة" : "إظهار المعاينة"}
              </button>
              <button type="button" className="inline-flex h-11 items-center gap-2 rounded-[8px] border border-[#D8C7B2] bg-white px-4 text-sm font-black text-[#5B3926]">
                <Paperclip className="h-4 w-4" />
                مرفقات
              </button>
              <button type="button" onClick={() => setStatusMessage("تم إغلاق مساحة العمل تجريبيًا بدون انتقال")} className="inline-flex h-11 items-center gap-2 rounded-[8px] border border-[#E6CFC8] bg-[#FFF7F4] px-4 text-sm font-black text-[#9B3327]">
                <X className="h-4 w-4" />
                إغلاق
              </button>
            </div>
          </div>
        </div>

        <div className={`grid gap-5 ${previewVisible ? "xl:grid-cols-[minmax(360px,0.9fr)_minmax(680px,1.3fr)]" : "xl:grid-cols-1"}`}>
          {previewVisible && selectedBranch && selectedCustomer && selectedPaymentMethod ? (
            <InvoicePreview
              branch={selectedBranch}
              customer={selectedCustomer}
              items={items}
              totals={totals}
              issueDate={issueDate}
              dueDate={dueDate}
              paymentMethod={selectedPaymentMethod}
            />
          ) : null}
          <InvoiceForm
            data={data}
            branches={branches}
            warehouses={data.warehouses}
            customers={customers}
            customFields={customFields}
            items={items}
            totals={totals}
            selectedBranchId={selectedBranchId}
            selectedWarehouseId={selectedWarehouseId}
            selectedCustomerId={selectedCustomerId}
            selectedPaymentMethodId={selectedPaymentMethodId}
            issueDate={issueDate}
            dueDate={dueDate}
            taxMode={taxMode}
            discount={discount}
            onBranchChange={setSelectedBranchId}
            onWarehouseChange={setSelectedWarehouseId}
            onCustomerChange={setSelectedCustomerId}
            onPaymentMethodChange={setSelectedPaymentMethodId}
            onIssueDateChange={setIssueDate}
            onDueDateChange={setDueDate}
            onTaxModeChange={setTaxMode}
            onDiscountChange={setDiscount}
            onOpenCustomerModal={() => setCustomerModalOpen(true)}
            onOpenBranchModal={() => setBranchModalOpen(true)}
            onOpenCustomFieldModal={() => setCustomFieldModalOpen(true)}
            onChangeItem={changeItem}
            onAddItem={addItem}
            onRemoveItem={removeItem}
          />
        </div>
      </div>

      <AddCustomerModal open={customerModalOpen} onClose={() => setCustomerModalOpen(false)} onSave={saveCustomer} />
      <AddBranchModal open={branchModalOpen} onClose={() => setBranchModalOpen(false)} onSave={saveBranch} />
      <CustomFieldModal open={customFieldModalOpen} onClose={() => setCustomFieldModalOpen(false)} onSave={saveCustomField} />
    </main>
  );
}
