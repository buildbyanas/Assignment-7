"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isLoading) return;

    if (!name.trim()) {
      toast.error("আপনার নাম লিখুন।");
      return;
    }

    if (!email.trim()) {
      toast.error("আপনার ইমেইল লিখুন।");
      return;
    }

    if (password.length < 8) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("দুটি পাসওয়ার্ড মিলছে না।");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("অ্যাকাউন্ট তৈরি হচ্ছে...");

    try {
      const { error: authError } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (authError) {
        toast.error(
          authError.message || "অ্যাকাউন্ট তৈরি করা যায়নি। আবার চেষ্টা করুন।",
          { id: toastId }
        );
        return;
      }

      toast.success("অ্যাকাউন্ট তৈরি হয়েছে!", { id: toastId });
      router.push("/signin?registered=1");
    } catch {
      toast.error("সার্ভারের সঙ্গে সংযোগ করা যায়নি। আবার চেষ্টা করুন।", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignUp = async (
    provider: "google" | "github"
  ) => {
    if (isLoading) return;

    setIsLoading(true);

    const toastId = toast.loading(
      `${provider === "google" ? "Google" : "GitHub"} দিয়ে সাইন আপ হচ্ছে...`
    );

    try {
      const { error: socialError } = await authClient.signIn.social({
        provider,
        callbackURL: "/",
        newUserCallbackURL: "/",
      });

      if (socialError) {
        toast.error(
          socialError.message || "সোশ্যাল সাইন আপ করা যায়নি। আবার চেষ্টা করুন।",
          { id: toastId }
        );
        setIsLoading(false);
      }
    } catch {
      toast.error("সার্ভারের সঙ্গে সংযোগ করা যায়নি। আবার চেষ্টা করুন।", {
        id: toastId,
      });
      setIsLoading(false);
    }
  };

  return (
    <main className="flex w-full flex-1 flex-col items-center bg-[#f0f5f0] px-4 py-10 sm:py-11">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-[#202820]">
          অ্যাকাউন্ট তৈরি করুন
        </h1>
        <p className="mt-2 text-xs text-[#697469]">
          বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।
        </p>
      </div>

      <section className="w-full max-w-sm rounded-2xl border border-[#e1e9e1] bg-[#fbfdfb] p-5 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-[#202820]">
              নাম
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="যেমন: রহিম উদ্দিন"
              className="w-full rounded-lg border border-[#dce4dc] bg-transparent px-3 py-2.5 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#202820]">
              ইমেইল
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-[#dce4dc] bg-transparent px-3 py-2.5 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-[#202820]">
              পাসওয়ার্ড
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="কমপক্ষে ৮ অক্ষর"
              className="w-full rounded-lg border border-[#dce4dc] bg-transparent px-3 py-2.5 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-[#202820]">
              পাসওয়ার্ড নিশ্চিত করুন
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="আবার লিখুন"
              className="w-full rounded-lg border border-[#dce4dc] bg-transparent px-3 py-2.5 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-[#168442] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "অ্যাকাউন্ট তৈরি করুন"}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#e1e9e1]" />
          <span className="text-xs text-[#697469]">অথবা</span>
          <div className="h-px flex-1 bg-[#e1e9e1]" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleSocialSignUp("google")}
            disabled={isLoading}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-[#dce4dc] px-2 py-2.5 text-xs font-medium text-[#364136] transition hover:bg-[#f0f5f0] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="text-base font-bold text-blue-600">G</span>
            Google দিয়ে চালিয়ে যান
          </button>

          <button
            type="button"
            onClick={() => handleSocialSignUp("github")}
            disabled={isLoading}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-[#dce4dc] px-2 py-2.5 text-xs font-medium text-[#364136] transition hover:bg-[#f0f5f0] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
              <path d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.77-.24.77-.54v-2.1c-3.13.68-3.79-1.33-3.79-1.33-.5-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 .72 2.63.52 3.27.4.1-.72.39-1.22.71-1.5-2.5-.29-5.13-1.25-5.13-5.56 0-1.23.44-2.24 1.16-3.03-.12-.29-.5-1.44.11-2.99 0 0 .95-.3 3.08 1.16a10.7 10.7 0 0 1 5.6 0c2.13-1.46 3.08-1.16 3.08-1.16.61 1.55.23 2.7.11 2.99.72.79 1.16 1.8 1.16 3.03 0 4.32-2.63 5.27-5.14 5.55.4.35.75 1.03.75 2.08v3.09c0 .3.2.65.78.54A11.2 11.2 0 0 0 12 .8Z" />
            </svg>
            GitHub দিয়ে চালিয়ে যান
          </button>
        </div>

        <p className="mt-5 text-center text-xs text-[#697469]">
          অ্যাকাউন্ট আছে?{" "}
          <Link href="/signin" className="font-medium text-[#168442] hover:underline">
            সাইন ইন করুন
          </Link>
        </p>
      </section>

      <Link href="/" className="mt-6 text-xs text-[#697469] transition hover:text-green-700">
        ← হোম পেজে ফিরে যান
      </Link>
    </main>
  );
}