export type TrialBalanceAmount = number;

export type TrialBalanceRow = {
  accountNumber: string;
  accountName: string;
  primaryCategory: string;
  subCategory: string;
  openingDebit: TrialBalanceAmount;
  openingCredit: TrialBalanceAmount;
  movementDebit: TrialBalanceAmount;
  movementCredit: TrialBalanceAmount;
  closingDebit: TrialBalanceAmount;
  closingCredit: TrialBalanceAmount;
};

export type TrialBalanceOption = {
  id: string;
  label: string;
};

export type TrialBalanceColumn = TrialBalanceOption & {
  defaultEnabled: boolean;
};

export const trialBalanceDateRanges: TrialBalanceOption[] = [
  { id: "last-3-months", label: "آخر 3 أشهر" },
  { id: "last-6-months", label: "آخر 6 أشهر" },
  { id: "last-12-months", label: "آخر 12 شهر" },
  { id: "current-month", label: "الشهر الحالي" },
  { id: "current-quarter", label: "الربع الحالي" },
  { id: "current-fiscal-year", label: "السنة المالية الحالية" },
  { id: "two-fiscal-years", label: "سنتان ماليتان" },
  { id: "three-fiscal-years", label: "3 سنوات مالية" },
  { id: "previous-month", label: "الشهر السابق" },
  { id: "previous-quarter", label: "الربع السابق" },
  { id: "previous-fiscal-year", label: "السنة المالية السابقة" },
  { id: "previous-two-fiscal-years", label: "السنتان الماليتان السابقتان" },
  { id: "custom-range", label: "نطاق زمني مخصص" },
];

export const trialBalanceFilters: TrialBalanceOption[] = [
  { id: "branch", label: "الفرع" },
  { id: "income-statement-balances", label: "عرض أرصدة حسابات قائمة الدخل" },
  { id: "zero-balance-accounts", label: "عرض الحسابات برصيد صفر" },
];

export const trialBalanceColumns: TrialBalanceColumn[] = [
  { id: "account-number", label: "رقم الحساب", defaultEnabled: true },
  { id: "account-name", label: "اسم الحساب", defaultEnabled: true },
  { id: "primary-category", label: "التصنيف الرئيسي", defaultEnabled: true },
  { id: "sub-category", label: "التصنيف الفرعي", defaultEnabled: true },
  { id: "revalued-balances", label: "الأرصدة المعاد تقييمها", defaultEnabled: false },
  { id: "opening-debit", label: "الرصيد الافتتاحي مدين", defaultEnabled: true },
  { id: "opening-credit", label: "الرصيد الافتتاحي دائن", defaultEnabled: true },
  { id: "movement-debit", label: "الحركات مدين", defaultEnabled: true },
  { id: "movement-credit", label: "الحركات دائن", defaultEnabled: true },
  { id: "closing-debit", label: "الرصيد الختامي مدين", defaultEnabled: true },
  { id: "closing-credit", label: "الرصيد الختامي دائن", defaultEnabled: true },
];

export const trialBalanceExportOptions: TrialBalanceOption[] = [
  { id: "pdf", label: "إلى PDF" },
  { id: "excel", label: "تصدير إلى Excel" },
  { id: "pdf-en", label: "إلى PDF في الإنجليزي" },
  { id: "excel-en", label: "إلى Excel في الإنجليزي" },
];

export const trialBalanceRows: TrialBalanceRow[] = [
  {
    accountNumber: "1001",
    accountName: "النقدية في الصندوق",
    primaryCategory: "الأصول",
    subCategory: "الأصول المتداولة",
    openingDebit: 12500,
    openingCredit: 0,
    movementDebit: 32000,
    movementCredit: 28100,
    closingDebit: 16400,
    closingCredit: 0,
  },
  {
    accountNumber: "1010",
    accountName: "الحساب البنكي",
    primaryCategory: "الأصول",
    subCategory: "النقد وما في حكمه",
    openingDebit: 85500,
    openingCredit: 0,
    movementDebit: 123000,
    movementCredit: 96500,
    closingDebit: 112000,
    closingCredit: 0,
  },
  {
    accountNumber: "1200",
    accountName: "العملاء",
    primaryCategory: "الأصول",
    subCategory: "الذمم المدينة",
    openingDebit: 46200,
    openingCredit: 0,
    movementDebit: 78000,
    movementCredit: 69500,
    closingDebit: 54700,
    closingCredit: 0,
  },
  {
    accountNumber: "1400",
    accountName: "المخزون",
    primaryCategory: "الأصول",
    subCategory: "مخزون البضاعة",
    openingDebit: 33100,
    openingCredit: 0,
    movementDebit: 52000,
    movementCredit: 48600,
    closingDebit: 36500,
    closingCredit: 0,
  },
  {
    accountNumber: "2000",
    accountName: "الموردون",
    primaryCategory: "الالتزامات",
    subCategory: "الذمم الدائنة",
    openingDebit: 0,
    openingCredit: 38400,
    movementDebit: 41000,
    movementCredit: 56600,
    closingDebit: 0,
    closingCredit: 54000,
  },
  {
    accountNumber: "3000",
    accountName: "رأس المال",
    primaryCategory: "حقوق الملكية",
    subCategory: "رأس المال المدفوع",
    openingDebit: 0,
    openingCredit: 138900,
    movementDebit: 0,
    movementCredit: 0,
    closingDebit: 0,
    closingCredit: 138900,
  },
  {
    accountNumber: "4000",
    accountName: "المبيعات",
    primaryCategory: "الإيرادات",
    subCategory: "إيرادات النشاط",
    openingDebit: 0,
    openingCredit: 0,
    movementDebit: 0,
    movementCredit: 200700,
    closingDebit: 0,
    closingCredit: 200700,
  },
  {
    accountNumber: "5000",
    accountName: "تكلفة المبيعات",
    primaryCategory: "تكلفة الإيرادات",
    subCategory: "تكلفة المنتجات",
    openingDebit: 0,
    openingCredit: 0,
    movementDebit: 104000,
    movementCredit: 0,
    closingDebit: 104000,
    closingCredit: 0,
  },
  {
    accountNumber: "6000",
    accountName: "المصروفات التشغيلية",
    primaryCategory: "المصروفات",
    subCategory: "مصروفات عامة وإدارية",
    openingDebit: 0,
    openingCredit: 0,
    movementDebit: 41500,
    movementCredit: 0,
    closingDebit: 41500,
    closingCredit: 0,
  },
  {
    accountNumber: "6100",
    accountName: "الرواتب والأجور",
    primaryCategory: "المصروفات",
    subCategory: "تكلفة الموظفين",
    openingDebit: 0,
    openingCredit: 0,
    movementDebit: 28500,
    movementCredit: 0,
    closingDebit: 28500,
    closingCredit: 0,
  },
];

export function getTrialBalanceTotals(rows: TrialBalanceRow[] = trialBalanceRows): TrialBalanceRow {
  return rows.reduce<TrialBalanceRow>(
    (totals, row) => ({
      ...totals,
      openingDebit: totals.openingDebit + row.openingDebit,
      openingCredit: totals.openingCredit + row.openingCredit,
      movementDebit: totals.movementDebit + row.movementDebit,
      movementCredit: totals.movementCredit + row.movementCredit,
      closingDebit: totals.closingDebit + row.closingDebit,
      closingCredit: totals.closingCredit + row.closingCredit,
    }),
    {
      accountNumber: "",
      accountName: "إجمالي",
      primaryCategory: "",
      subCategory: "",
      openingDebit: 0,
      openingCredit: 0,
      movementDebit: 0,
      movementCredit: 0,
      closingDebit: 0,
      closingCredit: 0,
    },
  );
}
