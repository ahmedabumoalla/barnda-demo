import { FinanceActionCard } from "@/components/branda-finance/finance-action-card";
import { FinanceEmptyState } from "@/components/branda-finance/finance-empty-state";
import { FinanceModuleGrid } from "@/components/branda-finance/finance-module-grid";
import { FinancePageShell } from "@/components/branda-finance/finance-page-shell";
import { FinanceStatCard } from "@/components/branda-finance/finance-stat-card";
import { calculateDemoInvoice, financeAmount } from "@/lib/branda-finance/calculations";
import { getBrandaFinanceDemoData } from "@/lib/branda-finance/demo-data";
import { brandaFinanceRoutes } from "@/lib/branda-finance/navigation";
import { brandaFinanceWorkflowBoundaries } from "@/lib/branda-finance/workflows";

export default function BrandaFinancePage() {
  const data = getBrandaFinanceDemoData();
  const invoiceTotals = data.invoices.map(calculateDemoInvoice);
  const salesToday = invoiceTotals.reduce((sum, total) => sum + total.total, 0);
  const unpaid = invoiceTotals.reduce((sum, total) => sum + total.remainingBalance, 0);
  const purchases = data.purchaseInvoices.reduce((sum, invoice) => sum + invoice.subtotal + invoice.vat, 0);
  const cash = data.cashBoxes.reduce((sum, box) => sum + box.balance, 0);
  const bank = data.bankAccounts.reduce((sum, account) => sum + account.balance, 0);

  const stats = [
    ["مبيعات اليوم", financeAmount(salesToday), "من فواتير الديمو", "green"],
    ["فواتير غير مدفوعة", financeAmount(unpaid), "ذمم عملاء", "gold"],
    ["مشتريات هذا الشهر", financeAmount(purchases), "فواتير موردين", "brown"],
    ["نقدية الصندوق", financeAmount(cash), "صناديق الفروع", "green"],
    ["رصيد البنك", financeAmount(bank), "بدون ربط بنكي", "brown"],
    ["تنبيهات المخزون", String(data.alerts.length), "مخزون وتكاملات", "red"],
    ["مستحقات العملاء", financeAmount(unpaid), "تحصيل لاحق", "gold"],
    ["مستحقات الموردين", financeAmount(purchases), "دائنون تجريبيون", "brown"],
  ] as const;

  const actions = [
    { title: "إنشاء فاتورة مبيعات", href: "/dashboard/branda-finance/invoicing/create", description: "نموذج فاتورة كامل ومعاينة" },
    { title: "فتح شاشة المبيعات", href: "/dashboard/branda-finance/sales", description: "كاشير محلي وسلة بيع" },
    { title: "طلبات الصالة", href: "/dashboard/branda-finance/hall-orders", description: "طاولات وويتر وتحويل لفاتورة" },
    { title: "إضافة فاتورة مشتريات", href: "/dashboard/branda-finance/purchases", description: "مساحة مشتريات تجريبية" },
    { title: "إضافة عميل", href: "/dashboard/branda-finance/parties", description: "ملف العملاء والموردين" },
    { title: "إضافة مورد", href: "/dashboard/branda-finance/parties", description: "أرصدة ومشتريات" },
    { title: "تسجيل مصروف", href: "/dashboard/branda-finance/accountant", description: "قيد مصروف تجريبي" },
    { title: "فتح تقرير مالي", href: "/dashboard/branda-finance/reports", description: "مركز التقارير" },
    { title: "الكشوف الموحدة", href: "/dashboard/branda-finance/statements", description: "عميل ومورد ومنتج وخدمة" },
    { title: "شجرة الحسابات", href: "/dashboard/branda-finance/accountant/chart-of-accounts", description: "حسابات وإضافة محلية" },
    { title: "نقاط الولاء", href: "/dashboard/branda-finance/loyalty-points", description: "قواعد كسب واستبدال" },
  ];

  return (
    <FinancePageShell
      title="برندة المالية"
      description="نظام تشغيل مالي داخلي متصل لأصحاب العلامات: مبيعات، فواتير، مشتريات، مخزون، تقارير، محاسبة، بنوك، قوالب وتكاملات. كل شيء هنا محلي وتجريبي وجاهز لربط قاعدة البيانات لاحقا."
      status="DEMO"
      backHref="/dashboard"
      actions={[
        { label: "إنشاء فاتورة", href: "/dashboard/branda-finance/invoicing/create", primary: true },
        { label: "فتح الكاشير", href: "/dashboard/branda-finance/sales" },
      ]}
    >
      <section className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value, hint, tone]) => (
          <FinanceStatCard key={label} label={label} value={value} hint={hint} tone={tone} />
        ))}
      </section>

      <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-4">
          <div className="rounded-[8px] border border-[#D8C3A2] bg-[#FFFDF8] p-3">
            <h2 className="text-[14px] font-black text-[#2F241D]">إجراءات سريعة</h2>
            <div className="mt-3 grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {actions.map((action) => (
                <FinanceActionCard key={action.href + action.title} {...action} />
              ))}
            </div>
          </div>

          <div className="rounded-[8px] border border-[#D8C3A2] bg-[#FFFDF8] p-3">
            <h2 className="text-[14px] font-black text-[#2F241D]">الوحدات المالية</h2>
            <div className="mt-3">
              <FinanceModuleGrid routes={brandaFinanceRoutes.filter((route) => route.href !== "/dashboard/branda-finance")} />
            </div>
          </div>
        </div>

        <aside className="min-w-0 space-y-3">
          <div className="rounded-[8px] border border-[#D8C3A2] bg-[#FFFDF8] p-3">
            <h2 className="text-[13px] font-black text-[#2F241D]">تنبيهات اليوم</h2>
            <div className="mt-2 space-y-2">
              {data.alerts.map((alert) => (
                <div key={alert.id} className="rounded-[8px] border border-[#E8D8C2] bg-[#FAF3E8] p-2">
                  <p className="truncate text-[12px] font-black text-[#2F241D]">{alert.title}</p>
                  <p className="mt-1 text-[11px] font-bold leading-5 text-[#806A58]">{alert.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <FinanceEmptyState title="حدود الديمو" detail={brandaFinanceWorkflowBoundaries.join(" ")} />
        </aside>
      </section>
    </FinancePageShell>
  );
}
