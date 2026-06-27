import Link from "next/link";
import { FinanceActionCard } from "@/components/branda-finance/finance-action-card";
import { FinancePageShell } from "@/components/branda-finance/finance-page-shell";
import { FinanceStatCard } from "@/components/branda-finance/finance-stat-card";
import { FinanceTable } from "@/components/branda-finance/finance-table";
import { FinanceTabs } from "@/components/branda-finance/finance-tabs";
import { calculateDemoInvoice, financeAmount } from "@/lib/branda-finance/calculations";
import { getBrandaFinanceDemoData } from "@/lib/branda-finance/demo-data";

export default function BrandaFinanceInvoicingPage() {
  const data = getBrandaFinanceDemoData();
  const totals = data.invoices.map(calculateDemoInvoice);
  const totalSales = totals.reduce((sum, total) => sum + total.total, 0);
  const unpaid = totals.reduce((sum, total) => sum + total.remainingBalance, 0);
  const paid = totals.reduce((sum, total) => sum + total.paidAmount, 0);

  return (
    <FinancePageShell
      title="فواتير المبيعات"
      description="قائمة فواتير مبيعات محلية مع فلاتر ومؤشرات وإجراءات عرض وتعديل ونسخ وطباعة تجريبية."
      status="محلي فقط"
      actions={[
        { label: "إنشاء فاتورة", href: "/dashboard/branda-finance/invoicing/create", primary: true },
        { label: "فتح المبيعات", href: "/dashboard/branda-finance/sales" },
        { label: "الكشوف", href: "/dashboard/branda-finance/statements" },
      ]}
    >
      <section className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <FinanceStatCard label="إجمالي الفواتير" value={financeAmount(totalSales)} hint={`${data.invoices.length} فاتورة`} tone="green" />
        <FinanceStatCard label="المحصّل" value={financeAmount(paid)} hint="كاش وبطاقة وتجريبي" tone="brown" />
        <FinanceStatCard label="غير مدفوع" value={financeAmount(unpaid)} hint="ذمم مدينة" tone="gold" />
        <FinanceStatCard label="متوسط الضريبة" value="15%" hint="VAT محلي" tone="brown" />
      </section>

      <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-3">
          <FinanceTabs tabs={["الكل", "مسودة", "مدفوعة", "غير مدفوعة", "حسب الفرع", "حسب العميل"]} />
          <div className="grid min-w-0 gap-2 rounded-[8px] border border-[#D8C3A2] bg-[#FFFDF8] p-3 sm:grid-cols-2 xl:grid-cols-5">
            {["الحالة", "الفرع", "العميل", "طريقة الدفع", "التاريخ"].map((filter) => (
              <div key={filter} className="h-9 rounded-[8px] border border-[#E1D1BD] bg-white px-2 py-2 text-[11px] font-black text-[#6D5544]">
                {filter}
              </div>
            ))}
          </div>
          <FinanceTable
            headers={["رقم الفاتورة", "العميل", "الفرع", "الحالة", "الدفع", "الإجمالي", "إجراءات"]}
            minWidth="900px"
            rows={data.invoices.map((invoice) => {
              const invoiceTotal = calculateDemoInvoice(invoice);
              return [
                invoice.number,
                data.customers.find((customer) => customer.id === invoice.customerId)?.name ?? "عميل",
                data.branches.find((branch) => branch.id === invoice.branchId)?.name ?? "فرع",
                invoice.status,
                data.paymentMethods.find((method) => method.id === invoice.paymentMethodId)?.name ?? "غير محدد",
                financeAmount(invoiceTotal.total),
                <Link key={invoice.id} href={`/dashboard/branda-finance/statements/customer/${invoice.customerId}`}>كشف العميل</Link>,
              ];
            })}
          />
        </div>
        <aside className="min-w-0 space-y-3">
          <FinanceActionCard title="إنشاء فاتورة جديدة" href="/dashboard/branda-finance/invoicing/create" description="افتح نموذج إنشاء الفاتورة" />
          <FinanceActionCard title="فتح شاشة المبيعات" href="/dashboard/branda-finance/sales" description="حوّل السلة إلى فاتورة" />
          <Link href="/dashboard/branda-finance/reports/sales" className="block rounded-[8px] border border-[#D8C3A2] bg-[#FFFDF8] p-3 text-[12px] font-black text-[#5B3926]">
            فتح تقرير المبيعات
          </Link>
        </aside>
      </section>
    </FinancePageShell>
  );
}
