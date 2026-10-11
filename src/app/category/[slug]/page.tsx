import { Suspense } from "react";
import CategoryContent from "./CategoryContent";

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#f0f5f0] px-4 py-6 sm:px-6">
          <div className="mx-auto max-w-5xl rounded-xl border border-[#e1e9e1] bg-[#fbfdfb] p-6">
            ক্যাটাগরির পণ্য লোড হচ্ছে...
          </div>
        </main>
      }
    >
      <CategoryContent params={params} />
    </Suspense>
  );
}