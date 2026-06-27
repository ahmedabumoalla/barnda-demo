import Link from "next/link";

type FinanceActionCardProps = {
  title: string;
  href: string;
  description?: string;
};

export function FinanceActionCard({ title, href, description }: FinanceActionCardProps) {
  return (
    <Link
      href={href}
      className="group min-w-0 rounded-[8px] border border-[#D8C3A2] bg-[#FFFDF8] p-3 shadow-[0_10px_22px_rgba(69,43,28,0.06)] transition hover:border-[#B88334] hover:bg-[#FFF8EA]"
    >
      <p className="truncate text-[13px] font-black text-[#2F241D]">{title}</p>
      {description ? <p className="mt-1 line-clamp-2 text-[11px] font-bold leading-5 text-[#806A58]">{description}</p> : null}
    </Link>
  );
}
