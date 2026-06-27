import { Plus, Trash2 } from "lucide-react";
import type {
  FinanceAccount,
  FinanceInvoiceItem,
  FinanceProduct,
  FinanceTaxRate,
} from "@/lib/branda-finance/invoice-types";
import { formatFinanceAmount } from "@/components/branda-finance/invoice-totals";

type InvoiceItemsTableProps = {
  items: FinanceInvoiceItem[];
  products: FinanceProduct[];
  accounts: FinanceAccount[];
  taxRates: FinanceTaxRate[];
  onChangeItem: (id: string, patch: Partial<FinanceInvoiceItem>) => void;
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
};

export function InvoiceItemsTable({
  items,
  products,
  accounts,
  taxRates,
  onChangeItem,
  onAddItem,
  onRemoveItem,
}: InvoiceItemsTableProps) {
  return (
    <div className="overflow-hidden rounded-[8px] border border-[#E1D1BD] bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-right text-sm">
          <thead className="bg-[#F4E8D8] text-xs font-black text-[#674C38]">
            <tr>
              <th className="px-3 py-3">الوصف / البحث عن الأصناف</th>
              <th className="px-3 py-3">الكمية</th>
              <th className="px-3 py-3">السعر</th>
              <th className="px-3 py-3">معدل ضريبي</th>
              <th className="px-3 py-3">الحساب</th>
              <th className="px-3 py-3">الاعتراف بالإيرادات</th>
              <th className="px-3 py-3">الإجمالي</th>
              <th className="px-3 py-3" aria-label="إجراءات" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EFE3D2]">
            {items.map((item) => (
              <tr key={item.id} className="align-top">
                <td className="px-3 py-3">
                  <select
                    value={item.productId ?? ""}
                    onChange={(event) => {
                      const product = products.find((candidate) => candidate.id === event.target.value);
                      if (!product) return;
                      onChangeItem(item.id, {
                        productId: product.id,
                        description: product.name,
                        price: product.price,
                        taxRate: product.vatRate,
                        accountId: product.accountId,
                        revenueRecognition: product.revenueRecognition,
                      });
                    }}
                    className="mb-2 h-10 w-full rounded-[8px] border border-[#E1D1BD] bg-[#FFFDF8] px-3 text-xs font-bold outline-none focus:border-[#B88334]"
                  >
                    <option value="">اختر صنفًا</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} - {product.sku}
                      </option>
                    ))}
                  </select>
                  <input
                    value={item.description}
                    onChange={(event) => onChangeItem(item.id, { description: event.target.value })}
                    className="h-10 w-full rounded-[8px] border border-[#E1D1BD] px-3 text-xs font-bold outline-none focus:border-[#B88334]"
                    placeholder="وصف البند"
                  />
                </td>
                <td className="px-3 py-3">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(event) => onChangeItem(item.id, { quantity: Math.max(1, Number(event.target.value) || 1) })}
                    className="h-10 w-20 rounded-[8px] border border-[#E1D1BD] px-3 text-center text-xs font-black outline-none focus:border-[#B88334]"
                  />
                </td>
                <td className="px-3 py-3">
                  <input
                    type="number"
                    min="0"
                    value={item.price}
                    onChange={(event) => onChangeItem(item.id, { price: Math.max(0, Number(event.target.value) || 0) })}
                    className="h-10 w-24 rounded-[8px] border border-[#E1D1BD] px-3 text-center text-xs font-black outline-none focus:border-[#B88334]"
                  />
                </td>
                <td className="px-3 py-3">
                  <select
                    value={String(item.taxRate)}
                    onChange={(event) => onChangeItem(item.id, { taxRate: Number(event.target.value) })}
                    className="h-10 w-32 rounded-[8px] border border-[#E1D1BD] bg-white px-2 text-xs font-bold outline-none focus:border-[#B88334]"
                  >
                    {taxRates.map((taxRate) => (
                      <option key={taxRate.id} value={taxRate.rate}>
                        {taxRate.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-3">
                  <select
                    value={item.accountId}
                    onChange={(event) => onChangeItem(item.id, { accountId: event.target.value })}
                    className="h-10 w-36 rounded-[8px] border border-[#E1D1BD] bg-white px-2 text-xs font-bold outline-none focus:border-[#B88334]"
                  >
                    {accounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.code} - {account.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-3">
                  <input
                    value={item.revenueRecognition}
                    onChange={(event) => onChangeItem(item.id, { revenueRecognition: event.target.value })}
                    className="h-10 w-40 rounded-[8px] border border-[#E1D1BD] px-3 text-xs font-bold outline-none focus:border-[#B88334]"
                  />
                </td>
                <td className="px-3 py-3 font-black text-[#2F241D]" dir="ltr">
                  {formatFinanceAmount(item.quantity * item.price)}
                </td>
                <td className="px-3 py-3">
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-[#E6CFC8] bg-[#FFF7F4] text-[#9B3327] transition hover:bg-[#FBE5DF]"
                    title="حذف البند"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-[#EFE3D2] bg-[#FFFDF8] p-3">
        <button
          type="button"
          onClick={onAddItem}
          className="inline-flex items-center gap-2 rounded-[8px] border border-[#D6B677] bg-[#F8E8C9] px-4 py-2 text-xs font-black text-[#6B431C] transition hover:bg-[#F1D9A8]"
        >
          <Plus className="h-4 w-4" />
          إضافة بند
        </button>
      </div>
    </div>
  );
}
