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
    <main className="min-h-screen bg-white text-black flex items-center justify-center px-6">
      <div className="relative max-w-md w-full border p-10 text-center bg-white">

        {/* 🔥 BIG SUCCESS STICKER */}
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
          <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-6xl">✓</span>
          </div>
        </div>

        {/* spacing for sticker */}
        <div className="mt-16">
          <h1 className="text-3xl font-serif mb-4">
            Payment Successful
          </h1>

          <p className="mb-6 text-gray-600">
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
      </div>
    </main>
  );
}