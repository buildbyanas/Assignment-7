
import { Suspense } from "react";
import SignInClient from "./SignInClient";

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[60vh] items-center justify-center">
          <p>সাইন ইন পেজ লোড হচ্ছে...</p>
        </main>
      }
    >
      <SignInClient />
    </Suspense>
  );
}
