import { PurchaseInvoiceWorkspace } from "@/components/branda-finance/purchase-invoice-workspace";
import { getBrandaFinanceInvoiceDemoData } from "@/lib/branda-finance/invoice-demo-data";

export default async function BrandaFinancePurchasesPage() {
  const data = await getBrandaFinanceInvoiceDemoData();
  return <PurchaseInvoiceWorkspace data={data} />;
}
