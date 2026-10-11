import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-[#e1e9e1] bg-[#fbfdfb]">
      <div className="mx-auto flex min-h-[76px] max-w-[1100px] flex-col items-center justify-between gap-3 px-4 py-5 text-center sm:flex-row sm:px-0 sm:text-left">
        <Link
          href="/"
          className="text-xs text-[#364136] transition hover:text-green-700"
        >
          বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।
        </Link>

        <p className="text-xs text-[#364136]">
          সকল দাম সংগ্রহ; বাজার অবস্থা উপর নির্ভর করে পরিবর্তিত হয়।
        </p>
      </div>
    </footer>
  );
}