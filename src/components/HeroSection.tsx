import Link from "next/link";
import Image from "next/image";
import heroImage from "@/assets/bazar-hero.png";

export default function HeroSection() {
  return (
    <section className="rounded-2xl border border-[#e1e9e1] bg-[#fbfdfb] px-6 py-8 sm:px-10 sm:py-10">
      <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
        <div className="max-w-xl">
          <span className="inline-flex rounded-full bg-[#e1f3e7] px-3 py-1 text-xs font-medium text-[#168442]">
            {new Intl.DateTimeFormat("bn-BD", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }).format(new Date())}
          </span>

          <h1 className="mt-3 text-2xl font-bold leading-tight text-[#202820] sm:text-3xl">
            আজকের বাজারের দাম এক নজরে
          </h1>

          <p className="mt-4 text-sm leading-6 text-[#697469]">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারজাত তথ্য দেখে
            সহজেই জেনে নিন নিত্যপ্রয়োজনীয় পণ্যের সর্বশেষ বাজারদর।
          </p>

          <Link
            href="#all-products"
            className="mt-5 inline-flex rounded-md bg-[#168442] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#116b35]"
          >
            সব দাম দেখুন
          </Link>
        </div>

        <div className="relative h-36 w-44 shrink-0 sm:h-40 sm:w-48">
  <Image
    src={heroImage}
    alt="বাজারের পণ্যভর্তি ঝুড়ি"
    fill
    priority
    sizes="192px"
    className="object-contain"
  />
</div>
      </div>
    </section>
  );
}
