import { CashierSalesWorkspace } from "@/components/branda-finance/cashier-sales-workspace";
import { getBrandaFinanceRealWorkspaceData } from "@/lib/branda-finance/real-data";
import { getOwnerFeatureCodes } from "@/lib/data/feature-entitlements";
import { featureCodesAllow } from "@/lib/platform/feature-gates";

export default async function BrandaFinanceSalesPage() {
  const [data, features] = await Promise.all([
    getBrandaFinanceRealWorkspaceData(),
    getOwnerFeatureCodes().catch(() => []),
  ]);

  return (
    <CashierSalesWorkspace
      data={data}
      loyaltyEnabled={featureCodesAllow(features, "loyalty")}
      realInvoicePersistenceReady={false}
    />
  );
}
