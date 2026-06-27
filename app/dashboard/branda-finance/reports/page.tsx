import { FinanceActionCard } from "@/components/branda-finance/finance-action-card";
import { FinancePageShell } from "@/components/branda-finance/finance-page-shell";
import { FinanceStatCard } from "@/components/branda-finance/finance-stat-card";
import { brandaFinanceReportSections, brandaFinanceReports } from "@/lib/branda-finance/reports";

export default function BrandaFinanceReportsRoutePage() {
  return (
    <FinancePageShell
      title="التقارير المالية"
      description="مركز تقارير موحد: أرباح وخسائر، تدفق نقدي، ميزان مراجعة، دفتر أستاذ، كشوف حساب، مبيعات، مشتريات، مخزون، ضريبة، فروع ومنتجات."
      status="جاهز"
      actions={[
        { label: "دفتر الأستاذ", href: "/dashboard/branda-finance/reports/general-ledger", primary: true },
        { label: "ميزان المراجعة", href: "/dashboard/branda-finance/reports/trial-balance" },
      ]}
    >
      <section className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <FinanceStatCard label="عدد التقارير" value={String(brandaFinanceReports.length)} hint="كلها Routes حقيقية" tone="green" />
        <FinanceStatCard label="تقارير محاسبية" value="4" hint="دفتر وميزان وكشوف" tone="brown" />
        <FinanceStatCard label="الأقسام" value={String(brandaFinanceReportSections.length)} hint="مبيعات ومشتريات ومخزون" tone="gold" />
        <FinanceStatCard label="مصدر البيانات" value="محلي" hint="typed demo data" tone="brown" />
      </section>

      <section className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {brandaFinanceReports.map((report) => (
          <FinanceActionCard
            key={report.slug}
            title={report.title}
            href={`/dashboard/branda-finance/reports/${report.slug}`}
            description={report.description}
          />
        ))}
      </section>
    </FinancePageShell>
  );
}
