import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import SortableProductGrid from "@/components/SortableProductGrid";
import { getProducts } from "@/lib/api";

export const instant = false;

type Product = {
  id: number;
  slug: string;
  nameBn: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  today: number;
  yesterday: number;
  change?: {
    dir: "up" | "down";
    pct: number;
  };
};

function ProductCard({ product }: { product: Product }) {
  const isUp = product.change?.dir === "up";

  return (
    <Link
      href={`/product/${product.id}`}
      className="flex min-h-[100px] min-w-0 flex-col justify-between rounded-xl border border-[#e1e9e1] bg-[#fbfdfb] p-3 transition hover:border-green-300 hover:shadow-sm"
    >
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f0f5f0] text-xl">
          {product.categoryIcon}
        </span>

        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-[#202820]">
            {product.nameBn}
          </h3>
          <p className="text-[11px] text-[#697469]">{product.categoryNameBn}</p>
        </div>
      </div>

      <div className="mt-3 flex items-end justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] text-[#697469]">আজকের দাম</p>
          <p className="text-sm font-bold text-[#202820]">
            ৳{product.today.toLocaleString("bn-BD")}
            <span className="ml-1 text-[10px] font-normal text-[#697469]">
              /{product.unit}
            </span>
          </p>
        </div>

        {product.change && (
          <span
            className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-medium ${
              isUp ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700"
            }`}
          >
            {isUp ? "▲" : "▼"} {product.change.pct.toLocaleString("bn-BD")}%
          </span>
        )}
      </div>
    </Link>
  );
}

function ProductSection({
  title,
  products,
  direction,
}: {
  title: string;
  products: Product[];
  direction: "up" | "down";
}) {
  return (
    <section>
      <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-[#202820]">
        <span
          className={direction === "up" ? "text-red-600" : "text-green-700"}
        >
          {direction === "up" ? "▲" : "▼"}
        </span>
        {title}
      </h2>

      {products.length === 0 ? (
        <p className="text-sm text-gray-500">কোনো পণ্যের তথ্য পাওয়া যায়নি।</p>
      ) : (
        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

export default async function Home() {
  let products: Product[] = [];

  try {
    const response = await getProducts();

    const result = Array.isArray(response)
      ? response
      : (response?.products ?? response?.data ?? []);

    products = Array.isArray(result) ? result : [];
  } catch (error) {
    console.error("Products load error:", error);
  }

  const increased = products
    .filter((product) => product.change?.dir === "up")
    .slice(0, 6);

  const decreased = products
    .filter((product) => product.change?.dir === "down")
    .slice(0, 6);

  return (
    <main className="w-full flex-1 bg-[#f0f5f0] px-4 py-5 sm:px-6">
      <div className="mx-auto w-full max-w-5xl space-y-7">
        <HeroSection />

        <ProductSection
          title="আজ দাম বেড়েছে"
          products={increased}
          direction="up"
        />

        <ProductSection
          title="আজ দাম কমেছে"
          products={decreased}
          direction="down"
        />

        <section id="all-products">
          <div className="mb-3">
            <h2 className="text-base font-bold text-[#202820]">সকল পণ্য</h2>
          </div>

          {products.length === 0 ? (
            <p className="rounded-xl border border-[#e1e9e1] bg-[#fbfdfb] p-5 text-sm text-gray-600">
              API থেকে পণ্যের তথ্য পাওয়া যায়নি।
            </p>
          ) : (
            <SortableProductGrid products={products} />
          )}
        </section>
      </div>
    </main>
  );
}
