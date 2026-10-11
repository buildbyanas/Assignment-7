import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategories, getProducts } from "@/lib/api";

type Category = {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
};

type Product = {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  today: number;
  change?: {
    dir: "up" | "down";
    pct: number;
  };
};

export default async function CategoryContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [categoryData, productData] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  const categories: Category[] = Array.isArray(categoryData)
    ? categoryData
    : categoryData?.categories ?? categoryData?.data ?? [];

  const products: Product[] = Array.isArray(productData)
    ? productData
    : productData?.products ?? productData?.data ?? [];

  const category = categories.find((item) => item.slug === slug);

  if (!category) {
    notFound();
  }

  const categoryProducts = products.filter(
    (product) => product.category === category.id
  );

  return (
    <main className="min-h-screen flex-1 bg-[#f0f5f0] px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 rounded-2xl border border-[#e1e9e1] bg-[#fbfdfb] p-6">
          <Link href="/" className="text-sm text-green-700 hover:underline">
            ← হোম
          </Link>

          <div className="mt-4 flex items-center gap-3">
            <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#e1f3e7] text-3xl">
              {category.icon}
            </span>

            <div>
              <h1 className="text-2xl font-bold text-[#202820]">
                {category.nameBn}
              </h1>
              <p className="mt-1 text-sm text-[#697469]">
                মোট {categoryProducts.length.toLocaleString("bn-BD")} টি পণ্য
              </p>
            </div>
          </div>
        </div>

        {categoryProducts.length === 0 ? (
          <p className="rounded-xl border border-[#e1e9e1] bg-[#fbfdfb] p-6 text-sm text-gray-600">
            এই ক্যাটাগরিতে কোনো পণ্যের তথ্য পাওয়া যায়নি।
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categoryProducts.map((product) => {
              const isUp = product.change?.dir === "up";

              return (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="rounded-xl border border-[#e1e9e1] bg-[#fbfdfb] p-4 transition hover:border-green-300 hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#f0f5f0] text-2xl">
                      {product.categoryIcon || category.icon}
                    </span>

                    <div className="min-w-0 flex-1">
                      <h2 className="truncate font-semibold text-[#202820]">
                        {product.nameBn}
                      </h2>
                      <p className="text-xs text-[#697469]">
                        {product.categoryNameBn || category.nameBn}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-end justify-between gap-2">
                    <div>
                      <p className="text-xs text-[#697469]">আজকের দাম</p>
                      <p className="mt-1 font-bold text-[#202820]">
                        ৳{product.today.toLocaleString("bn-BD")}
                        <span className="ml-1 text-xs font-normal text-[#697469]">
                          /{product.unit}
                        </span>
                      </p>
                    </div>

                    {product.change && (
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          isUp
                            ? "bg-red-50 text-red-600"
                            : "bg-green-50 text-green-700"
                        }`}
                      >
                        {isUp ? "▲" : "▼"}{" "}
                        {product.change.pct.toLocaleString("bn-BD")}%
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}