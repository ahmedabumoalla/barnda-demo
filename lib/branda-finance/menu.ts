export type BrandaFinanceIconKey =
  | "reports"
  | "invoices"
  | "sales"
  | "purchases"
  | "contacts"
  | "payroll"
  | "inventory"
  | "accountant"
  | "banking"
  | "assets"
  | "costCenters"
  | "projects"
  | "branches"
  | "developers"
  | "integrations"
  | "templates"
  | "hireAccountant"
  | "help";

export type BrandaFinanceMenuItem = {
  title: string;
  icon: BrandaFinanceIconKey;
  description: string;
  href?: string;
  badge?: string;
};

const comingSoonLine = "قريبًا بنشغلها وحدة وحدة";

export const brandaFinanceMenuItems: BrandaFinanceMenuItem[] = [
  {
    title: "التقارير المالية",
    icon: "reports",
    description: "تقارير مالية تجريبية جاهزة للعرض",
    href: "/dashboard/branda-finance/reports",
    badge: "جاهز",
  },
  {
    title: "الفواتير",
    icon: "invoices",
    description: "إنشاء فاتورة مبيعات مع معاينة ونموذج تفصيلي",
    href: "/dashboard/branda-finance/invoicing/create",
    badge: "جديد",
  },
  {
    title: "المبيعات",
    icon: "sales",
    description: "صفحة كاشير ونقطة بيع مرتبطة بمنتجات العلامة",
    href: "/dashboard/branda-finance/sales",
    badge: "جديد",
  },
  { title: "المشتريات", icon: "purchases", description: comingSoonLine },
  { title: "العملاء والموردين", icon: "contacts", description: comingSoonLine },
  { title: "الرواتب والموظفين", icon: "payroll", description: comingSoonLine },
  { title: "المنتجات والخدمات والمخزون", icon: "inventory", description: comingSoonLine },
  { title: "للمحاسب", icon: "accountant", description: comingSoonLine },
  { title: "الحسابات البنكية", icon: "banking", description: comingSoonLine },
  { title: "الأصول الثابتة", icon: "assets", description: comingSoonLine },
  { title: "مراكز التكلفة", icon: "costCenters", description: comingSoonLine },
  { title: "المشاريع", icon: "projects", description: comingSoonLine },
  { title: "الفروع", icon: "branches", description: comingSoonLine },
  { title: "للمطورين", icon: "developers", description: comingSoonLine },
  { title: "التكاملات", icon: "integrations", description: comingSoonLine },
  { title: "القوالب", icon: "templates", description: comingSoonLine },
  { title: "التعاقد مع محاسب", icon: "hireAccountant", description: comingSoonLine },
  { title: "مركز المساعدة", icon: "help", description: comingSoonLine },
];
