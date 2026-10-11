"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Product = {
  id: number;
  slug: string;
  nameBn: string;
  today: number;
  change: {
    dir: "up" | "down";
    pct: number;
  };
  unit: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Marquee() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/products`);

        if (!response.ok) {
          throw new Error("Products load failed");
        }

        const data: Product[] = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Marquee products error:", error);
      }
    };

    fetchProducts();
  }, []);

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="overflow-hidden border-b border-gray-200 bg-white">
      <div className="marquee-track flex w-max items-center">
        {[...products, ...products].map((product, index) => (
          <Link
            key={`${product.id}-${index}`}
            href={`/product/${product.id}`}
            className="flex shrink-0 items-center gap-2 border-r border-gray-200 px-4 py-3 text-sm hover:bg-gray-50"
          >
            <span>{product.nameBn}</span>

            <span className="whitespace-nowrap font-medium">
              ৳{product.today}/{product.unit}
            </span>

            <span
              className={
                product.change.dir === "up"
                  ? "whitespace-nowrap text-red-600"
                  : "whitespace-nowrap text-green-600"
              }
            >
              {product.change.dir === "up" ? "▲" : "▼"} {product.change.pct}%
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
