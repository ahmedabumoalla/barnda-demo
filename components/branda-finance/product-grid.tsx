import { ProductCard } from "@/components/branda-finance/product-card";
import type { FinanceProduct } from "@/lib/branda-finance/invoice-types";

type ProductGridProps = {
  products: FinanceProduct[];
  showTranslationPreview: boolean;
  onAdd: (product: FinanceProduct) => void;
};

export function ProductGrid({ products, showTranslationPreview, onAdd }: ProductGridProps) {
  if (!products.length) {
    return (
      <div className="flex min-h-[260px] items-center justify-center rounded-[8px] border border-dashed border-[#D8C3A2] bg-[#FFFDF8] p-8 text-center">
        <p className="text-sm font-black text-[#7D6654]">لا توجد منتجات مطابقة للبحث الحالي.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} showTranslationPreview={showTranslationPreview} onAdd={onAdd} />
      ))}
    </div>
  );
}
