import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, FileText } from "lucide-react";
import { TrialBalanceReport } from "@/components/branda-finance/trial-balance-report";
import {
  brandaFinanceReports,
  getBrandaFinanceReportBySlug,
} from "@/lib/branda-finance/reports";

export function generateStaticParams() {
  return brandaFinanceReports.map((report) => ({
    reportSlug: report.slug,
  }));
}

export default async function BrandaFinanceReportPlaceholderPage({
  params,
}: {
  params: Promise<{ reportSlug: string }>;
}) {
  const { reportSlug } = await params;
  const report = getBrandaFinanceReportBySlug(reportSlug);

  if (!report) notFound();

  if (reportSlug === "trial-balance") {
    return <TrialBalanceReport />;
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#F7EFE4] px-4 py-6 text-right sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[72vh] w-full max-w-5xl items-center">
        <section className="w-full overflow-hidden rounded-[30px] border border-[#E3CFB0] bg-[#FFFDF8] shadow-[0_24px_60px_rgba(86,52,31,0.12)]">
          <div className="relative px-6 py-8 sm:px-8 lg:px-10">
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-l from-[#B88334] via-[#D8B46E] to-[#6B3F22]" />
            <Link
              href="/dashboard/branda-finance/reports"
              className="inline-flex items-center gap-2 rounded-full border border-[#E6D5BD] bg-[#FBF5EC] px-4 py-2 text-xs font-extrabold text-[#6B3F22] transition hover:border-[#C99A4D]"
            >
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
              العودة إلى التقارير المالية
            </Link>

            <div className="mt-8 grid gap-7 lg:grid-cols-[96px_minmax(0,1fr)] lg:items-start">
              <span className="flex h-20 w-20 items-center justify-center rounded-[24px] border border-[#E7D1AE] bg-[#F6E9D4] text-[#6B3F22] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
                <FileText aria-hidden="true" className="h-9 w-9" strokeWidth={1.8} />
              </span>

              <div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-[#E2C690] bg-[#F7E7C8] px-4 py-1.5 text-xs font-extrabold text-[#7A4D1F]">
                    {report.section}
                  </span>
                  <span className="rounded-full border border-[#E6D5BD] bg-[#FBF5EC] px-4 py-1.5 text-xs font-extrabold text-[#8A5B24]">
                    قريبًا
                  </span>
                </div>

                <h1 className="mt-5 text-3xl font-black tracking-normal text-[#3B2417] sm:text-4xl">
                  {report.title}
                </h1>
                <p className="mt-4 max-w-3xl text-base font-bold leading-8 text-[#806851]">
                  {report.description}
                </p>

                {report.tags?.length ? (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {report.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[#E6D5BD] bg-[#FFF9F0] px-3 py-1.5 text-xs font-extrabold text-[#7A4D1F]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="mt-8 rounded-[22px] border border-[#E5D0AE] bg-[#FBF4EA] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                  <p className="text-sm font-black text-[#3B2417]">
                    سنبدأ بناء هذا التقرير في المرحلة القادمة
                  </p>
                  <p className="mt-2 text-sm font-bold leading-7 text-[#806851]">
                    هذه الصفحة تحضيرية فقط الآن، ومخصصة لتثبيت المسار وتجهيز تجربة التقارير داخل برندة المالية.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
