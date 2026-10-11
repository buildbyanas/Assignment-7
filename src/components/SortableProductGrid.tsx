"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Product = {
  id: number;
  slug: string;
  nameBn: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  today: number;
  change?: {
    dir: "up" | "down";
    pct: number;
  };
};

type SortOption = "default" | "low" | "high";

type Props = {
  products: Product[];
};

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "default", label: "ডিফল্ট" },
  { value: "low", label: "দাম: কম থেকে বেশি" },
  { value: "high", label: "দাম: বেশি থেকে কম" },
];

export default function SortableProductGrid({ products }: Props) {
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [isOpen, setIsOpen] = useState(false);

  const sortedProducts = useMemo(() => {
    if (sortBy === "default") return products;

    return [...products].sort((a, b) =>
      sortBy === "low" ? a.today - b.today : b.today - a.today
    );
  }, [products, sortBy]);

  const selectedOption =
    sortOptions.find((option) => option.value === sortBy) ??
    sortOptions[0];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-xs text-[#697469]">
          মোট {products.length.toLocaleString("bn-BD")}টি পণ্য দেখানো হচ্ছে
        </p>

        <div className="relative shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#697469]">সাজান</span>

            <button
              type="button"
              onClick={() => setIsOpen((previous) => !previous)}
              aria-expanded={isOpen}
              className="flex items-center gap-2 rounded-lg border border-[#dce4dc] bg-white px-3 py-2 text-xs text-[#364136] shadow-sm transition hover:border-green-400"
            >
              {selectedOption.label}
              <span className="text-[10px]">
                {isOpen ? "▲" : "▼"}
              </span>
            </button>
          </div>

          {isOpen && (
            <>
              <button
                type="button"
                aria-label="মেনু বন্ধ করুন"
                className="fixed inset-0 z-10 cursor-default"
                onClick={() => setIsOpen(false)}
              />

              <div className="absolute right-0 top-full z-20 mt-2 w-48 rounded-xl border border-[#e1e9e1] bg-white p-1.5 shadow-lg">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setSortBy(option.value);
                      setIsOpen(false);
                    }}
                    className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-xs transition hover:bg-[#f0f5f0] ${
                      sortBy === option.value
                        ? "font-semibold text-[#364136]"
                        : "text-[#697469]"
                    }`}
                  >
                    <span>{option.label}</span>
                    {sortBy === option.value && (
                      <span className="text-green-700">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {sortedProducts.length === 0 ? (
        <p className="rounded-xl border border-[#e1e9e1] bg-[#fbfdfb] p-5 text-sm text-[#697469]">
          কোনো পণ্যের তথ্য পাওয়া যায়নি।
        </p>
      ) : (
        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sortedProducts.map((product) => {
            const isUp = product.change?.dir === "up";

            return (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="flex min-w-0 min-h-[138px] w-full flex-col justify-between rounded-2xl border border-[#e1e9e1] bg-[#fbfdfb] p-4 transition hover:border-green-300 hover:shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f0f5f0] text-2xl">
                    {product.categoryIcon}
                  </span>

                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-[#202820]">
                      {product.nameBn}
                    </h3>
                    <p className="mt-0.5 text-xs text-[#697469]">
                      প্রতি {product.unit}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-end justify-between gap-2">
                  <div>
                    <p className="text-[11px] text-[#697469]">
                      আজকের দাম
                    </p>
                    <p className="mt-1 text-base font-bold text-[#202820]">
                      {product.today.toLocaleString("bn-BD")} টাকা
                    </p>
                  </div>

                  {product.change && (
                    <span
                      className={`shrink-0 rounded-full px-2 py-1 text-[10px] ${
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
  );
}