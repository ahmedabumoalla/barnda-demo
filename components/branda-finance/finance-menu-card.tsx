import Link from "next/link";
import type { ElementType, ReactNode } from "react";
import {
  BadgeHelp,
  BadgeDollarSign,
  Banknote,
  Boxes,
  BriefcaseBusiness,
  Building2,
  CircleDollarSign,
  Code2,
  FileStack,
  Handshake,
  Landmark,
  PlugZap,
  ReceiptText,
  ShoppingCart,
  SquareLibrary,
  UserCog,
  UsersRound,
} from "lucide-react";
import type { BrandaFinanceMenuItem, BrandaFinanceIconKey } from "@/lib/branda-finance/menu";

const iconMap: Record<BrandaFinanceIconKey, ElementType> = {
  reports: ReceiptText,
  sales: CircleDollarSign,
  purchases: ShoppingCart,
  contacts: UsersRound,
  payroll: BadgeDollarSign,
  inventory: Boxes,
  accountant: UserCog,
  banking: Landmark,
  assets: Banknote,
  costCenters: SquareLibrary,
  projects: BriefcaseBusiness,
  branches: Building2,
  developers: Code2,
  integrations: PlugZap,
  templates: FileStack,
  hireAccountant: Handshake,
  help: BadgeHelp,
};

type FinanceMenuCardProps = {
  item: BrandaFinanceMenuItem;
};

const cardClassName =
  "group flex min-h-[156px] flex-col justify-between rounded-[18px] border border-[#E8D7BE] bg-[#FFFDF8] p-5 text-right shadow-[0_14px_30px_rgba(86,52,31,0.12),inset_0_1px_0_rgba(255,255,255,0.85)] transition duration-200 hover:-translate-y-1 hover:border-[#C99A4D] hover:shadow-[0_20px_45px_rgba(86,52,31,0.18),inset_0_1px_0_rgba(255,255,255,0.9)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B88334] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7EFE4]";

function CardContent({ item, icon: Icon }: { item: BrandaFinanceMenuItem; icon: ElementType }) {
  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#E7D1AE] bg-[#F6E9D4] text-[#6B3F22] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] transition duration-200 group-hover:bg-[#E9D0A4]">
          <Icon aria-hidden="true" className="h-6 w-6" strokeWidth={1.8} />
        </span>
        <span className="rounded-full border border-[#E6D5BD] bg-[#FBF5EC] px-3 py-1 text-[11px] font-extrabold text-[#8A5B24]">
          قريبًا
        </span>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-black leading-7 text-[#3D2418]">{item.title}</h2>
        <p className="mt-2 text-sm font-bold leading-6 text-[#8F765F]">{item.description}</p>
      </div>
    </>
  );
}

export function FinanceMenuCard({ item }: FinanceMenuCardProps) {
  const Icon = iconMap[item.icon];
  const content: ReactNode = <CardContent item={item} icon={Icon} />;

  if (item.href) {
    return (
      <Link href={item.href} className={cardClassName}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" disabled className={cardClassName}>
      {content}
    </button>
  );
}
