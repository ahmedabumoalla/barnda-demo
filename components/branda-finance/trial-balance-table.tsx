import {
  getTrialBalanceTotals,
  trialBalanceRows,
  type TrialBalanceAmount,
} from "@/lib/branda-finance/trial-balance";

function formatAmount(value: TrialBalanceAmount) {
  if (!value) return "-";
  return new Intl.NumberFormat("ar-SA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

const numberCellClass = "whitespace-nowrap px-4 py-3 text-left font-mono text-sm font-bold tabular-nums text-[#3B2417]";

export function TrialBalanceTable() {
  const totals = getTrialBalanceTotals();

  return (
    <section className="overflow-hidden rounded-[26px] border border-[#E3CFB0] bg-[#FFFDF8] shadow-[0_18px_42px_rgba(86,52,31,0.10)]">
      <div className="flex flex-col gap-2 border-b border-[#E6D5BD] bg-[#FBF5EC] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-[#3B2417]">جدول ميزان المراجعة</h2>
          <p className="mt-1 text-sm font-bold text-[#806851]">الأرصدة والحركات بالريال السعودي SAR</p>
        </div>
        <span className="w-fit rounded-full border border-[#E2C690] bg-[#F7E7C8] px-3 py-1.5 text-xs font-extrabold text-[#7A4D1F]">
          بيانات تجريبية
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[1280px] w-full border-collapse text-right">
          <thead>
            <tr className="border-b border-[#E6D5BD] bg-[#F6E9D4] text-xs font-black text-[#6B3F22]">
              <th rowSpan={2} className="w-[120px] border-l border-[#E1C9A6] px-4 py-4">رقم الحساب</th>
              <th rowSpan={2} className="w-[230px] border-l border-[#E1C9A6] px-4 py-4">اسم الحساب</th>
              <th rowSpan={2} className="w-[170px] border-l border-[#E1C9A6] px-4 py-4">التصنيف الرئيسي</th>
              <th rowSpan={2} className="w-[190px] border-l border-[#E1C9A6] px-4 py-4">التصنيف الفرعي</th>
              <th colSpan={2} className="border-l border-[#E1C9A6] px-4 py-3 text-center">الرصيد الافتتاحي</th>
              <th colSpan={2} className="border-l border-[#E1C9A6] px-4 py-3 text-center">الحركات</th>
              <th colSpan={2} className="px-4 py-3 text-center">الرصيد الختامي</th>
            </tr>
            <tr className="border-b border-[#E6D5BD] bg-[#FBF5EC] text-[11px] font-black text-[#7A4D1F]">
              <th className="border-l border-[#E1C9A6] px-4 py-3 text-left">مدين SAR</th>
              <th className="border-l border-[#E1C9A6] px-4 py-3 text-left">دائن SAR</th>
              <th className="border-l border-[#E1C9A6] px-4 py-3 text-left">مدين SAR</th>
              <th className="border-l border-[#E1C9A6] px-4 py-3 text-left">دائن SAR</th>
              <th className="border-l border-[#E1C9A6] px-4 py-3 text-left">مدين SAR</th>
              <th className="px-4 py-3 text-left">دائن SAR</th>
            </tr>
          </thead>
          <tbody>
            {trialBalanceRows.map((row, index) => (
              <tr
                key={row.accountNumber}
                className={`border-b border-[#EFE2CF] ${index % 2 === 0 ? "bg-[#FFFDF8]" : "bg-[#FFFAF2]"}`}
              >
                <td className="whitespace-nowrap border-l border-[#F1E3CE] px-4 py-3 font-mono text-sm font-black text-[#6B3F22]">{row.accountNumber}</td>
                <td className="border-l border-[#F1E3CE] px-4 py-3 text-sm font-black text-[#3B2417]">{row.accountName}</td>
                <td className="border-l border-[#F1E3CE] px-4 py-3 text-sm font-bold text-[#806851]">{row.primaryCategory}</td>
                <td className="border-l border-[#F1E3CE] px-4 py-3 text-sm font-bold text-[#806851]">{row.subCategory}</td>
                <td className={`${numberCellClass} border-l border-[#F1E3CE]`}>{formatAmount(row.openingDebit)}</td>
                <td className={`${numberCellClass} border-l border-[#F1E3CE]`}>{formatAmount(row.openingCredit)}</td>
                <td className={`${numberCellClass} border-l border-[#F1E3CE]`}>{formatAmount(row.movementDebit)}</td>
                <td className={`${numberCellClass} border-l border-[#F1E3CE]`}>{formatAmount(row.movementCredit)}</td>
                <td className={`${numberCellClass} border-l border-[#F1E3CE]`}>{formatAmount(row.closingDebit)}</td>
                <td className={numberCellClass}>{formatAmount(row.closingCredit)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-[#3B2417] text-white">
              <td className="border-l border-white/10 px-4 py-4 text-sm font-black" />
              <td className="border-l border-white/10 px-4 py-4 text-base font-black">{totals.accountName}</td>
              <td className="border-l border-white/10 px-4 py-4" />
              <td className="border-l border-white/10 px-4 py-4" />
              <td className="border-l border-white/10 px-4 py-4 text-left font-mono text-sm font-black">{formatAmount(totals.openingDebit)}</td>
              <td className="border-l border-white/10 px-4 py-4 text-left font-mono text-sm font-black">{formatAmount(totals.openingCredit)}</td>
              <td className="border-l border-white/10 px-4 py-4 text-left font-mono text-sm font-black">{formatAmount(totals.movementDebit)}</td>
              <td className="border-l border-white/10 px-4 py-4 text-left font-mono text-sm font-black">{formatAmount(totals.movementCredit)}</td>
              <td className="border-l border-white/10 px-4 py-4 text-left font-mono text-sm font-black">{formatAmount(totals.closingDebit)}</td>
              <td className="px-4 py-4 text-left font-mono text-sm font-black">{formatAmount(totals.closingCredit)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
