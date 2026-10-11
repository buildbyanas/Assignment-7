"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (!isPending && !user) {
      router.replace("/signin");
    }
  }, [isPending, user, router]);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
    }
  }, [user]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSaving || isLoggingOut) return;

    const trimmedName = name.trim();

    if (!trimmedName) {
      toast.error("আপনার নাম লিখুন।");
      return;
    }

    if (trimmedName.length > 100) {
      toast.error("নাম সর্বোচ্চ ১০০ অক্ষরের হতে পারবে।");
      return;
    }

    if (trimmedName === user?.name) {
      toast("আপনার তথ্যে কোনো পরিবর্তন করা হয়নি।", {
        icon: "ℹ️",
      });
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("নাম আপডেট হচ্ছে...");

    try {
      const { error: updateError } = await authClient.updateUser({
        name: trimmedName,
      });

      if (updateError) {
        toast.error(
          updateError.message || "তথ্য আপডেট করা যায়নি। আবার চেষ্টা করুন।",
          { id: toastId }
        );
        return;
      }

      toast.success("আপনার নাম সফলভাবে আপডেট হয়েছে।", {
        id: toastId,
      });

      router.refresh();
    } catch {
      toast.error("সার্ভারের সঙ্গে সংযোগ করা যায়নি। আবার চেষ্টা করুন।", {
        id: toastId,
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleLogout() {
    if (isSaving || isLoggingOut) return;

    setIsLoggingOut(true);
    const toastId = toast.loading("সাইন আউট হচ্ছে...");

    try {
      const { error: logoutError } = await authClient.signOut();

      if (logoutError) {
        toast.error("সাইন আউট করা যায়নি। আবার চেষ্টা করুন।", {
          id: toastId,
        });
        return;
      }

      toast.success("সফলভাবে সাইন আউট হয়েছে।", {
        id: toastId,
      });

      router.replace("/signin");
      router.refresh();
    } catch {
      toast.error("সার্ভারের সঙ্গে সংযোগ করা যায়নি।", {
        id: toastId,
      });
    } finally {
      setIsLoggingOut(false);
    }
  }

  if (isPending || !user) {
    return (
      <main className="flex flex-1 items-center justify-center bg-[#f0f5f0] px-4 py-16">
        <p className="text-sm text-gray-500">প্রোফাইল লোড হচ্ছে...</p>
      </main>
    );
  }

  const avatarLetter = (user.name?.trim().charAt(0) || "U").toUpperCase();

  return (
    <main className="w-full flex-1 bg-[#f0f5f0] px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="text-sm text-green-700 hover:underline"
        >
          ← হোম পেজে ফিরে যান
        </Link>

        <h1 className="mt-4 text-2xl font-bold text-[#202820]">
          আমার প্রোফাইল
        </h1>

        <p className="mt-2 text-sm text-[#697469]">
          আপনার অ্যাকাউন্টের তথ্য দেখুন ও নাম আপডেট করুন।
        </p>

        <section className="mt-6 overflow-hidden rounded-2xl border border-[#e1e9e1] bg-[#fbfdfb]">
          <div className="flex flex-col items-center gap-4 border-b border-[#e1e9e1] px-5 py-8 sm:flex-row sm:px-7">
            {user.image ? (
              <Image
                src={user.image}
                alt={`${user.name || "ব্যবহারকারী"} avatar`}
                width={80}
                height={80}
                unoptimized
                className="h-20 w-20 rounded-full border border-[#e1e9e1] object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-3xl font-bold text-green-800">
                {avatarLetter}
              </div>
            )}

            <div className="min-w-0 text-center sm:text-left">
              <h2 className="break-words text-xl font-bold text-[#202820]">
                {user.name || "ব্যবহারকারী"}
              </h2>

              <p className="mt-1 break-all text-sm text-[#697469]">
                {user.email}
              </p>

              <span className="mt-3 inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                {user.emailVerified
                  ? "ইমেইল যাচাই করা হয়েছে"
                  : "সক্রিয় অ্যাকাউন্ট"}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-7">
            <h3 className="text-base font-semibold text-[#202820]">
              তথ্য পরিবর্তন
            </h3>

            <div>
              <label
                htmlFor="profile-name"
                className="mb-2 block text-sm font-medium text-[#202820]"
              >
                আপনার নাম
              </label>

              <input
                id="profile-name"
                type="text"
                autoComplete="name"
                required
                maxLength={100}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="আপনার নাম লিখুন"
                className="w-full rounded-lg border border-[#dce4dc] bg-white px-3 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div>
              <label
                htmlFor="profile-email"
                className="mb-2 block text-sm font-medium text-[#202820]"
              >
                ইমেইল
              </label>

              <input
                id="profile-email"
                type="email"
                readOnly
                value={user.email}
                className="w-full cursor-not-allowed rounded-lg border border-[#e1e9e1] bg-gray-50 px-3 py-3 text-sm text-gray-500"
              />

              <p className="mt-1 text-xs text-[#697469]">
                ইমেইল পরিবর্তনের সুবিধা এখনো যোগ করা হয়নি।
              </p>
            </div>

            <button
              type="submit"
              disabled={isSaving || isLoggingOut}
              className="w-full rounded-lg bg-[#168442] px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "আপডেট হচ্ছে..." : "পরিবর্তন সংরক্ষণ করুন"}
            </button>

            <button
              type="button"
              onClick={handleLogout}
              disabled={isSaving || isLoggingOut}
              className="w-full rounded-lg border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoggingOut ? "সাইন আউট হচ্ছে..." : "সাইন আউট"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}