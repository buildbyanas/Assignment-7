
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getProductById } from "@/lib/api";

export const instant = false;

type Market = {
  market: string;
  division: string;
  min: number;
  max: number;
};

type Product = {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: {
    dir: "up" | "down";
    pct: number;
  };
  markets: Market[];
};

const formatPrice = (price: number) =>
  price.toLocaleString("bn-BD", {
    maximumFractionDigits: 2,
  });

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // লগইন করা আছে কি না Server থেকে যাচাই
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(
      `/signin?callbackURL=${encodeURIComponent(`/product/${id}`)}`
    );
  }

  let product: Product | null = null;

  try {
    const response = await getProductById(id);
    product = response?.product ?? response?.data ?? response;
  } catch (error) {
    console.error("Product details load error:", error);
  }

  if (!product || !product.id) {
    notFound();
  }

  const markets = Array.isArray(product.markets)
    ? product.markets
    : [];

  const lowestPrice = markets.length
    ? Math.min(...markets.map((market) => market.min))
    : product.today;

  const highestPrice = markets.length
    ? Math.max(...markets.map((market) => market.max))
    : product.today;

  const averagePrice = markets.length
    ? markets.reduce(
        (total, market) =>
          total + (market.min + market.max) / 2,
        0
      ) / markets.length
    : product.today;

  const isUp = product.change?.dir === "up";
  const isDown = product.change?.dir === "down";

  return (
    <main className="min-h-screen w-full flex-1 bg-[#f0f5f0] px-4 py-6 sm:px-6">
      <div className="mx-auto w-full max-w-5xl space-y-4">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-xs text-[#697469]"
        >
          <Link href="/" className="hover:text-green-700">
            হোম
          </Link>

          <span>›</span>

          <Link
            href={`/category/${product.category}`}
            className="hover:text-green-700"
          >
            {product.categoryNameBn}
          </Link>

          <span>›</span>

          <span className="text-[#364136]">
            {product.nameBn}
          </span>
        </nav>

        {/* Product summary */}
        <section className="flex flex-col gap-4 rounded-xl border border-[#e1e9e1] bg-[#fbfdfb] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#f0f5f0] text-3xl">
              {product.image || product.categoryIcon}
            </div>

            <div className="min-w-0">
              <h1 className="text-lg font-bold text-[#202820] sm:text-xl">
                {product.nameBn}
              </h1>

              <p className="mt-1 text-xs text-[#697469]">
                প্রতি {product.unit} · {product.categoryNameBn}
              </p>

              <p className="mt-2 text-xs text-[#364136]">
                গতকালের তুলনায় আজকের দাম{" "}
                {isUp
                  ? "বেড়েছে"
                  : isDown
                    ? "কমেছে"
                    : "অপরিবর্তিত"}{" "}
                · {formatPrice(product.yesterday)} টাকা
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-between gap-4 rounded-xl bg-[#f0f5f0] px-4 py-3 sm:min-w-[112px] sm:flex-col sm:gap-1 sm:text-center">
            <div>
              <p className="text-xs text-[#697469]">আজকের দাম</p>
              <p className="text-2xl font-bold text-[#202820]">
                {formatPrice(product.today)}
              </p>
              <p className="text-[11px] text-[#697469]">
                টাকা / {product.unit}
              </p>
            </div>

            {product.change && (
              <span
                className={`text-xs font-semibold ${
                  isUp
                    ? "text-red-600"
                    : isDown
                      ? "text-green-700"
                      : "text-[#697469]"
                }`}
              >
                {isUp ? "▲" : isDown ? "▼" : "—"}{" "}
                {formatPrice(product.change.pct)}%
              </span>
            )}
          </div>
        </section>

        {/* Price summary */}
        <section className="rounded-xl border border-[#e1e9e1] bg-[#fbfdfb] p-4">
          <h2 className="mb-3 text-sm font-bold text-[#202820]">
            দামের সারসংক্ষেপ
          </h2>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            <div className="rounded-xl border border-[#e1e9e1] p-3.5">
              <p className="text-xs text-[#697469]">সর্বনিম্ন দাম</p>
              <p className="mt-1 text-lg font-bold text-green-700">
                ৳{formatPrice(lowestPrice)}
              </p>
              <p className="mt-1 text-[11px] text-[#697469]">
                সবচেয়ে কম দামের বাজার
              </p>
            </div>

            <div className="rounded-xl border border-[#e1e9e1] p-3.5">
              <p className="text-xs text-[#697469]">সর্বোচ্চ দাম</p>
              <p className="mt-1 text-lg font-bold text-red-600">
                ৳{formatPrice(highestPrice)}
              </p>
              <p className="mt-1 text-[11px] text-[#697469]">
                সবচেয়ে বেশি দামের বাজার
              </p>
            </div>

            <div className="rounded-xl border border-[#e1e9e1] p-3.5">
              <p className="text-xs text-[#697469]">গড় দাম</p>
              <p className="mt-1 text-lg font-bold text-green-700">
                ৳{formatPrice(averagePrice)}
              </p>
              <p className="mt-1 text-[11px] text-[#697469]">
                বাজারগুলোর গড় হিসাব
              </p>
            </div>
          </div>
        </section>

        {/* Market prices */}
        <section className="rounded-xl border border-[#e1e9e1] bg-[#fbfdfb] p-4">
          <div className="mb-3">
            <h2 className="text-sm font-bold text-[#202820]">
              বাজারভিত্তিক আজকের দাম
            </h2>
          </div>

          {markets.length === 0 ? (
            <p className="rounded-lg bg-[#f0f5f0] p-4 text-sm text-[#697469]">
              বাজারভিত্তিক দামের তথ্য পাওয়া যায়নি।
            </p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-[#e1e9e1]">
              <table className="w-full min-w-[600px] border-collapse text-left text-xs">
                <thead className="bg-[#f7faf7] text-[#697469]">
                  <tr>
                    <th className="px-3 py-3 font-medium">বাজার</th>
                    <th className="px-3 py-3 font-medium">বিভাগ</th>
                    <th className="px-3 py-3 font-medium">সর্বনিম্ন</th>
                    <th className="px-3 py-3 font-medium">সর্বাধিক</th>
                    <th className="px-3 py-3 text-right font-medium">
                      গড়
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {markets.map((market, index) => {
                    const marketAverage =
                      (market.min + market.max) / 2;

                    return (
                      <tr
                        key={`${market.market}-${index}`}
                        className={`border-t border-[#e1e9e1] ${
                          index % 2 === 0
                            ? "bg-[#fbfdfb]"
                            : "bg-[#f0f5f0]"
                        }`}
                      >
                        <td className="px-3 py-3 font-medium text-[#202820]">
                          {market.market}
                        </td>
                        <td className="px-3 py-3 text-[#364136]">
                          {market.division}
                        </td>
                        <td className="px-3 py-3 text-[#364136]">
                          {formatPrice(market.min)} টাকা
                        </td>
                        <td className="px-3 py-3 text-[#364136]">
                          {formatPrice(market.max)} টাকা
                        </td>
                        <td className="px-3 py-3 text-right font-semibold text-[#202820]">
                          {formatPrice(marketAverage)} টাকা
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Price history */}
        <section className="rounded-xl border border-[#e1e9e1] bg-[#fbfdfb] p-4">
          <h2 className="mb-3 text-sm font-bold text-[#202820]">
            আগের দামের তথ্য
          </h2>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "আজকের দাম", price: product.today },
              { label: "গতকালের দাম", price: product.yesterday },
              { label: "গত সপ্তাহের দাম", price: product.lastWeek },
              { label: "গত মাসের দাম", price: product.lastMonth },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-lg bg-[#f0f5f0] p-3"
              >
                <p className="text-xs text-[#697469]">{item.label}</p>
                <p className="mt-1 font-bold text-[#202820]">
                  ৳{formatPrice(item.price)}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
