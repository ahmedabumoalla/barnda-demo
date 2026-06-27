import { CashierSalesWorkspace } from "@/components/branda-finance/cashier-sales-workspace";
import { getBrandaFinanceInvoiceDemoData } from "@/lib/branda-finance/invoice-demo-data";

export default async function BrandaFinanceSalesPage() {
  const data = await getBrandaFinanceInvoiceDemoData();
  return <CashierSalesWorkspace data={data} />;
}
