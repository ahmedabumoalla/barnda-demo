import { InvoiceWorkspace } from "@/components/branda-finance/invoice-workspace";
import { getBrandaFinanceRealWorkspaceData } from "@/lib/branda-finance/real-data";

export default async function BrandaFinanceInvoiceCreatePage() {
  const data = await getBrandaFinanceRealWorkspaceData();
  return <InvoiceWorkspace data={data} realPersistenceReady={false} />;
}
