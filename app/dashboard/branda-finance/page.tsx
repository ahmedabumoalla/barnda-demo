import { FinanceMenuGrid } from "@/components/branda-finance/finance-menu-grid";

export default function BrandaFinancePage() {
  return (
    <main dir="rtl" className="min-h-screen bg-[#F7EFE4] px-4 py-6 text-right sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="overflow-hidden rounded-[28px] border border-[#E3CFB0] bg-[#FFFDF8] shadow-[0_24px_60px_rgba(86,52,31,0.12)]">
          <div className="relative px-6 py-8 sm:px-8 lg:px-10">
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-l from-[#B88334] via-[#D8B46E] to-[#6B3F22]" />
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <span className="inline-flex rounded-full border border-[#E2C690] bg-[#F7E7C8] px-4 py-1.5 text-xs font-extrabold text-[#7A4D1F] shadow-sm">
                  قريبًا
                </span>
                <h1 className="mt-5 text-3xl font-black tracking-normal text-[#3B2417] sm:text-4xl">
                  برندة المالية
                </h1>
                <p className="mt-3 max-w-3xl text-base font-bold leading-8 text-[#806851] sm:text-lg">
                  اختر القسم الذي تريد البدء به وسنقوم بتشغيله معك خطوة بخطوة
                </p>
              </div>

              <div className="rounded-2xl border border-[#E5D0AE] bg-[#FBF4EA] px-5 py-4 text-sm font-extrabold leading-7 text-[#6B3F22] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                لوحة مالية خفيفة الآن، وتشغيل الوحدات لاحقًا
              </div>
            </div>
          </div>
        </header>

        <FinanceMenuGrid />
      </div>
    </main>
  );
}
