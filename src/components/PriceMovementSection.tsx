import Link from "next/link";

type PriceChange = {
  id: number;
  nameBn: string;
  categoryNameBn: string;
  categoryIcon: string;
  today: number;
  yesterday: number;
  unit: string;
  change: {
    dir: "up" | "down";
    pct: number;
  };
};

type PriceMovementSectionProps = {
  products: PriceChange[];
};

export default function PriceMovementSection({
  products,
}: PriceMovementSectionProps) {
  const increasedProducts = products.filter(
    (product) => product.change?.dir === "up",
  );

  const decreasedProducts = products.filter(
    (product) => product.change?.dir === "down",
  );

  const renderProducts = (items: PriceChange[], direction: "up" | "down") => (
    <div className="space-y-3">
      {items.length === 0 ? (
        <p className="rounded-lg bg-white p-4 text-sm text-gray-500">
          এই মুহূর্তে কোনো তথ্য পাওয়া যায়নি।
        </p>
      ) : (
        items.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="flex items-center justify-between gap-3 rounded-lg border border-[#e1e9e1] bg-[#fbfdfb] p-3 transition hover:shadow-sm"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="text-2xl">{product.categoryIcon}</span>
              <div className="min-w-0">
                <p className="truncate font-medium text-gray-900">
                  {product.nameBn}
                </p>
                <p className="text-xs text-gray-500">
                  {product.categoryNameBn}
                </p>
              </div>
            </div>

            <div className="shrink-0 text-right">
              <p className="font-semibold text-gray-900">
                ৳{product.today}/{product.unit}
              </p>
              <p
                className={`text-xs ${
                  direction === "up" ? "text-red-600" : "text-green-700"
                }`}
              >
                {direction === "up" ? "▲" : "▼"} {product.change.pct}%
              </p>
            </div>
          </Link>
        ))
      )}
    </div>
  );

  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-[#f0d8d8] bg-[#fffafa] p-5">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
          <span className="text-red-600">↗</span>
          দাম বেড়েছে
          <span className="ml-auto rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
            {increasedProducts.length}
          </span>
        </h2>

        {renderProducts(increasedProducts, "up")}
      </div>

      <div className="rounded-xl border border-[#d8eadb] bg-[#fafffa] p-5">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
          <span className="text-green-700">↘</span>
          দাম কমেছে
          <span className="ml-auto rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
            {decreasedProducts.length}
          </span>
        </h2>

        {renderProducts(decreasedProducts, "down")}
      </div>
    </section>
  );
}