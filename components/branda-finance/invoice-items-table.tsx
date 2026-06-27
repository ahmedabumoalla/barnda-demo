import { Plus, Trash2 } from "lucide-react";
import { formatFinanceAmount, lineTotal, lineVat } from "@/components/branda-finance/invoice-totals";
import type {
  FinanceAccount,
  FinanceInvoiceItem,
  FinanceProduct,
  FinanceTaxRate,
  FinanceWarehouse,
} from "@/lib/branda-finance/invoice-types";

type InvoiceItemsTableProps = {
  items: FinanceInvoiceItem[];
  products: FinanceProduct[];
  accounts: FinanceAccount[];
  warehouses: FinanceWarehouse[];
  taxRates: FinanceTaxRate[];
  onChangeItem: (id: string, patch: Partial<FinanceInvoiceItem>) => void;
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
};

export function InvoiceItemsTable({
  items,
  products,
  accounts,
  warehouses,
  taxRates,
  onChangeItem,
  onAddItem,
  onRemoveItem,
}: InvoiceItemsTableProps) {
  return (
    <div className="overflow-hidden rounded-[8px] border border-[#E1D1BD] bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1180px] text-right text-sm">
          <thead className="bg-[#F4E8D8] text-xs font-black text-[#674C38]">
            <tr>
              <th className="px-3 py-3">الصنف / الوصف</th>
              <th className="px-3 py-3">الكمية</th>
              <th className="px-3 py-3">سعر الوحدة</th>
              <th className="px-3 py-3">الخصم</th>
              <th className="px-3 py-3">VAT 15%</th>
              <th className="px-3 py-3">الحساب</th>
              <th className="px-3 py-3">المستودع</th>
              <th className="px-3 py-3">الاعتراف بالإيراد</th>
              <th className="px-3 py-3">إجمالي السطر</th>
              <th className="px-3 py-3" aria-label="إجراءات" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EFE3D2]">
            {items.map((item) => {
              const selectedProduct = products.find((product) => product.id === item.productId);

              return (
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
                          {product.name} - {product.sku} - {product.barcode}
                        </option>
                      ))}
                    </select>
                    <input
                      value={item.description}
                      onChange={(event) => onChangeItem(item.id, { description: event.target.value })}
                      className="h-10 w-full rounded-[8px] border border-[#E1D1BD] px-3 text-xs font-bold outline-none focus:border-[#B88334]"
                      placeholder="وصف البند"
                    />
                    {selectedProduct ? (
                      <div className="mt-2 flex gap-2 rounded-[8px] bg-[#FAF3E8] p-2 text-[11px] font-bold leading-5 text-[#735A45]">
                        {selectedProduct.imageUrl ? (
                          <img src={selectedProduct.imageUrl} alt="" className="h-12 w-12 rounded-[8px] object-cover" loading="lazy" />
                        ) : null}
                        <div>
                          <p>{selectedProduct.category}</p>
                          <p dir="ltr">SKU {selectedProduct.sku}</p>
                          <p dir="ltr">Barcode {selectedProduct.barcode}</p>
                          <p dir="ltr">{formatFinanceAmount(selectedProduct.price)} / VAT {selectedProduct.vatRate}%</p>
                        </div>
                      </div>
                    ) : null}
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
                    <input
                      type="number"
                      min="0"
                      value={item.discount}
                      onChange={(event) => onChangeItem(item.id, { discount: Math.max(0, Number(event.target.value) || 0) })}
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
                    <p className="mt-2 text-[11px] font-black text-[#2F5D50]" dir="ltr">
                      {formatFinanceAmount(lineVat(item))}
                    </p>
                  </td>
                  <td className="px-3 py-3">
                    <select
                      value={item.accountId}
                      onChange={(event) => onChangeItem(item.id, { accountId: event.target.value })}
                      className="h-10 w-40 rounded-[8px] border border-[#E1D1BD] bg-white px-2 text-xs font-bold outline-none focus:border-[#B88334]"
                    >
                      {accounts.map((account) => (
                        <option key={account.id} value={account.id}>
                          {account.code} - {account.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-3">
                    <select
                      value={item.warehouseId ?? warehouses[0]?.id ?? ""}
                      onChange={(event) => onChangeItem(item.id, { warehouseId: event.target.value })}
                      className="h-10 w-40 rounded-[8px] border border-[#E1D1BD] bg-white px-2 text-xs font-bold outline-none focus:border-[#B88334]"
                    >
                      {warehouses.map((warehouse) => (
                        <option key={warehouse.id} value={warehouse.id}>
                          {warehouse.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-3">
                    <input
                      value={item.revenueRecognition}
                      onChange={(event) => onChangeItem(item.id, { revenueRecognition: event.target.value })}
                      className="h-10 w-44 rounded-[8px] border border-[#E1D1BD] px-3 text-xs font-bold outline-none focus:border-[#B88334]"
                    />
                  </td>
                  <td className="px-3 py-3 font-black text-[#2F241D]" dir="ltr">
                    {formatFinanceAmount(lineTotal(item))}
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
              );
            })}
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
