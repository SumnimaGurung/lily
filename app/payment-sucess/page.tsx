"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PaymentSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem("cart");
    window.dispatchEvent(new Event("cartUpdated"));
  }, []);

  return (
    <main className="min-h-screen bg-white text-black px-6 py-16 flex items-center justify-center">
      <div className="max-w-md w-full border p-8 text-center bg-white">
        <h1 className="text-3xl font-serif mb-4">Payment Successful</h1>
        <p className="mb-6">
          Your eSewa payment was completed successfully.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push("/account")}
            className="bg-black text-white px-6 py-3"
          >
            Go to My Account
          </button>

          <button
            onClick={() => router.push("/shop")}
            className="border border-black px-6 py-3"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </main>
  );
}