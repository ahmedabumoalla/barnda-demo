import { InvoiceWorkspace } from "@/components/branda-finance/invoice-workspace";
import { getBrandaFinanceInvoiceDemoData } from "@/lib/branda-finance/invoice-demo-data";

export default async function BrandaFinanceInvoiceCreatePage() {
  const data = await getBrandaFinanceInvoiceDemoData();
  return <InvoiceWorkspace data={data} />;
}
