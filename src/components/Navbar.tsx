
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import logoIcon from "@/assets/logo-icon.png";

type Category = {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Navbar() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [authError, setAuthError] = useState("");

  const userName = session?.user?.name || "ব্যবহারকারী";
  const userEmail = session?.user?.email || "";
  const avatarUrl = session?.user?.image;
  const avatarLetter = userName.trim().charAt(0).toUpperCase() || "U";

  // Bangladesh date
  useEffect(() => {
    setCurrentDate(
      new Intl.DateTimeFormat("bn-BD", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Dhaka",
      }).format(new Date())
    );
  }, []);

  // Load categories
  useEffect(() => {
    const controller = new AbortController();

    async function fetchCategories() {
      try {
        if (!API_BASE_URL) {
          throw new Error("API base URL পাওয়া যায়নি।");
        }

        const response = await fetch(
          `${API_BASE_URL}/categories`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("ক্যাটাগরি লোড করা যায়নি।");
        }

        const data = await response.json();
        const result = Array.isArray(data) ? data : data?.data;

        setCategories(Array.isArray(result) ? result : []);
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Category fetch error:", error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsCategoriesLoading(false);
        }
      }
    }

    fetchCategories();

    return () => controller.abort();
  }, []);

  // Logout
  async function handleLogout() {
    setAuthError("");
    setIsLoggingOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        setAuthError("সাইন আউট করা যায়নি। আবার চেষ্টা করুন।");
        return;
      }

      setIsUserMenuOpen(false);
      router.replace("/signin");
      router.refresh();
    } catch {
      setAuthError("সার্ভারের সঙ্গে সংযোগ করা যায়নি।");
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#e1e9e1] bg-white">
      {/* Main navbar */}
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <Link
          href="/"
          className="flex min-w-0 shrink-0 items-center gap-3"
        >
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-green-700">
            <Image
              src={logoIcon}
              alt="Bazar-Dor logo"
              fill
              priority
              sizes="40px"
              className="object-contain p-1"
            />
          </div>

          <div>
            <h1 className="text-lg font-bold text-gray-900">
              বাজার দর
            </h1>
            <p className="text-xs text-gray-500">
              {currentDate || " "}
            </p>
          </div>
        </Link>

        {/* Authentication menu */}
        <div className="relative flex shrink-0 items-center gap-2">
          {isPending ? (
            <span className="text-xs text-gray-500">
              লোড হচ্ছে...
            </span>
          ) : session?.user ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setIsUserMenuOpen((open) => !open);
                  setAuthError("");
                }}
                aria-expanded={isUserMenuOpen}
                aria-haspopup="true"
                className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-gray-100"
              >
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={`${userName} avatar`}
                    width={36}
                    height={36}
                    unoptimized
                    className="h-9 w-9 rounded-full border border-[#e1e9e1] object-cover"
                  />
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-800">
                    {avatarLetter}
                  </span>
                )}

                <span className="hidden max-w-32 truncate text-sm font-medium text-gray-800 sm:block">
                  {userName}
                </span>

                <span className="text-xs text-gray-500">
                  {isUserMenuOpen ? "▴" : "▾"}
                </span>
              </button>

              {isUserMenuOpen && (
                <>
                  <button
                    type="button"
                    aria-label="মেনু বন্ধ করুন"
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setIsUserMenuOpen(false)}
                  />

                  <div className="absolute right-0 top-full z-50 mt-2 w-60 max-w-[calc(100vw-2rem)] rounded-2xl border border-[#e1e9e1] bg-white p-2 shadow-lg">
                    <div className="border-b border-gray-100 px-3 py-3">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {userName}
                      </p>
                      <p className="mt-1 truncate text-xs text-gray-500">
                        {userEmail}
                      </p>
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition hover:bg-green-50"
                    >
                      <span aria-hidden="true">👤</span>
                      আমার প্রোফাইল
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <span aria-hidden="true">↪</span>
                      {isLoggingOut ? "সাইন আউট হচ্ছে..." : "সাইন আউট"}
                    </button>
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                সাইন ইন
              </Link>

              <Link
                href="/signup"
                className="rounded-lg bg-green-700 px-3 py-2 text-sm font-medium text-white transition hover:bg-green-800"
              >
                সাইন আপ
              </Link>
            </>
          )}
        </div>
      </div>

      {authError && (
        <p
          role="alert"
          className="mx-auto w-full max-w-5xl px-4 pb-2 text-xs text-red-600"
        >
          {authError}
        </p>
      )}

      {/* Category navigation */}
      <nav className="border-t border-gray-100">
        <div className="mx-auto flex w-full max-w-5xl items-center gap-3 px-4 py-2">
          <Link
            href="/"
            className="shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-green-50 hover:text-green-700"
          >
            🏠 হোম
          </Link>

          {/* All categories dropdown */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setIsDropdownOpen((open) => !open)}
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
              className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-800 transition hover:bg-green-100"
            >
              সব ক্যাটাগরি
              <span aria-hidden="true">
                {isDropdownOpen ? "▲" : "▼"}
              </span>
            </button>

            {isDropdownOpen && (
              <>
                <button
                  type="button"
                  aria-label="ক্যাটাগরি মেনু বন্ধ করুন"
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setIsDropdownOpen(false)}
                />

                <div className="absolute left-0 top-full z-50 mt-2 max-h-80 w-56 overflow-y-auto rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
                  {isCategoriesLoading ? (
                    <p className="px-3 py-2 text-sm text-gray-500">
                      ক্যাটাগরি লোড হচ্ছে...
                    </p>
                  ) : categories.length > 0 ? (
                    categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/category/${category.slug}`}
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition hover:bg-green-50 hover:text-green-800"
                      >
                        <span>{category.icon}</span>
                        <span>{category.nameBn}</span>
                      </Link>
                    ))
                  ) : (
                    <p className="px-3 py-2 text-sm text-gray-500">
                      কোনো ক্যাটাগরি পাওয়া যায়নি।
                    </p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Category links */}
          <div className="flex min-w-0 flex-1 items-center gap-5 overflow-x-auto whitespace-nowrap">
            {isCategoriesLoading ? (
              <span className="text-sm text-gray-500">
                ক্যাটাগরি লোড হচ্ছে...
              </span>
            ) : categories.length > 0 ? (
              categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="shrink-0 text-sm text-gray-700 transition hover:text-green-700"
                >
                  <span className="mr-1">{category.icon}</span>
                  {category.nameBn}
                </Link>
              ))
            ) : (
              <span className="text-sm text-gray-500">
                ক্যাটাগরি পাওয়া যায়নি।
              </span>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
