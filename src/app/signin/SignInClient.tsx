"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function SignInClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const registered = searchParams.get("registered") === "1";

  const getCallbackURL = () => {
    const callbackURL = searchParams.get("callbackURL");

    if (
      callbackURL &&
      callbackURL.startsWith("/") &&
      !callbackURL.startsWith("//")
    ) {
      return callbackURL;
    }

    return "/";
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (isLoading) return;

    setError("");

    if (!email.trim() || !password) {
      const message = "ইমেইল ও পাসওয়ার্ড লিখুন।";
      setError(message);
      toast.error(message);
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("সাইন ইন হচ্ছে...");

    try {
      const { error: authError } = await authClient.signIn.email({
        email: email.trim(),
        password,
        callbackURL: getCallbackURL(),
      });

      if (authError) {
        const message =
          authError.message ||
          "লগইন করা যায়নি। ইমেইল ও পাসওয়ার্ড যাচাই করুন।";

        setError(message);
        toast.error(message, { id: toastId });
        return;
      }

      toast.success("সফলভাবে সাইন ইন হয়েছে!", { id: toastId });

      router.replace(getCallbackURL());
      router.refresh();
    } catch {
      const message =
        "সার্ভারের সঙ্গে সংযোগ করা যায়নি। আবার চেষ্টা করুন।";

      setError(message);
      toast.error(message, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = async (
    provider: "google" | "github"
  ) => {
    if (isLoading) return;

    setError("");
    setIsLoading(true);

    const toastId = toast.loading(
      provider === "google"
        ? "Google দিয়ে সাইন ইন হচ্ছে..."
        : "GitHub দিয়ে সাইন ইন হচ্ছে..."
    );

    try {
      const { error: socialError } = await authClient.signIn.social({
        provider,
        callbackURL: getCallbackURL(),
      });

      if (socialError) {
        const message =
          socialError.message ||
          "সোশ্যাল লগইন করা যায়নি। আবার চেষ্টা করুন।";

        setError(message);
        toast.error(message, { id: toastId });
        setIsLoading(false);
        return;
      }

      // Social sign-in সাধারণত অন্য পেজে Redirect করে।
      // Redirect শুরু হলে Loading Toast-কে আলাদা Success Toast দিয়ে
      // প্রতিস্থাপন করা হবে না।
    } catch {
      const message =
        "সার্ভারের সঙ্গে সংযোগ করা যায়নি। আবার চেষ্টা করুন।";

      setError(message);
      toast.error(message, { id: toastId });
      setIsLoading(false);
    }
  };

  return (
    <main className="flex w-full flex-1 flex-col items-center bg-[#f0f5f0] px-4 py-9 sm:py-10">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-[#202820]">
          সাইন ইন
        </h1>
        <p className="mt-1 text-xs text-[#697469]">
          বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে একাউন্টে ঢুকুন।
        </p>
      </div>

      <section className="w-full max-w-sm rounded-2xl border border-[#e1e9e1] bg-[#fbfdfb] p-5 sm:p-6">
        {registered && (
          <p
            role="status"
            className="mb-4 rounded-lg bg-green-50 p-3 text-xs text-green-700"
          >
            অ্যাকাউন্ট তৈরি হয়েছে। এবার সাইন ইন করুন।
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-[#202820]"
            >
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
              className="w-full rounded-lg border border-[#dce4dc] bg-transparent px-3 py-2.5 text-sm text-[#202820] outline-none transition placeholder:text-[#697469] focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-[#202820]"
            >
              পাসওয়ার্ড
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="আপনার পাসওয়ার্ড"
              className="w-full rounded-lg border border-[#dce4dc] bg-transparent px-3 py-2.5 text-sm text-[#202820] outline-none transition placeholder:text-[#697469] focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-xs text-red-600"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-[#168442] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "সাইন ইন হচ্ছে..." : "সাইন ইন"}
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
            onClick={() => handleSocialSignIn("google")}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 rounded-lg border border-[#dce4dc] px-2 py-2.5 text-xs font-medium text-[#364136] transition hover:bg-[#f0f5f0] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="text-base font-bold text-blue-600">G</span>
            Google দিয়ে চালিয়ে যান
          </button>

          <button
            type="button"
            onClick={() => handleSocialSignIn("github")}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 rounded-lg border border-[#dce4dc] px-2 py-2.5 text-xs font-medium text-[#364136] transition hover:bg-[#f0f5f0] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 fill-current"
              aria-hidden="true"
            >
              <path d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.77-.24.77-.54v-2.1c-3.13.68-3.79-1.33-3.79-1.33-.5-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 .72 2.63.52 3.27.4.1-.72.39-1.22.71-1.5-2.5-.29-5.13-1.25-5.13-5.56 0-1.23.44-2.24 1.16-3.03-.12-.29-.5-1.44.11-2.99 0 0 .95-.3 3.08 1.16a10.7 10.7 0 0 1 5.6 0c2.13-1.46 3.08-1.16 3.08-1.16.61 1.55.23 2.7.11 2.99.72.79 1.16 1.8 1.16 3.03 0 4.32-2.63 5.27-5.14 5.55.4.35.75 1.03.75 2.08v3.09c0 .3.2.65.78.54A11.2 11.2 0 0 0 12 .8Z" />
            </svg>
            GitHub দিয়ে চালিয়ে যান
          </button>
        </div>

        <p className="mt-5 text-center text-xs text-[#697469]">
          অ্যাকাউন্ট নেই?{" "}
          <Link
            href="/signup"
            className="font-medium text-[#168442] hover:underline"
          >
            সাইন আপ করুন
          </Link>
        </p>
      </section>

      <Link
        href="/"
        className="mt-6 text-xs text-[#697469] transition hover:text-green-700"
      >
        ← হোম পেজে ফিরে যান
      </Link>
    </main>
  );
}