"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const updateCart = (updatedCart: any[]) => {
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleQuantityChange = (id: number, quantity: number) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === id) {
        return { ...item, quantity: quantity };
      }
      return item;
    });

    updateCart(updatedCart);
  };

  const removeItem = (id: number) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    updateCart(updatedCart);
  };

  const total = cartItems.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  return (
    <main className="min-h-screen bg-white text-black px-6 md:px-10 py-10">
      <h1 className="text-3xl font-serif mb-8">Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-10">

          {/* LEFT SIDE */}
          <div className="md:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 border-b pb-6">

                {/* IMAGE */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-28 h-36 object-cover"
                />

                {/* DETAILS */}
                <div className="flex-1">
                  <h2 className="text-lg">{item.name}</h2>

                  {/* ✅ PRICE */}
                  <p className="text-gray-600">
                    Rs {item.price.toLocaleString()}
                  </p>

                  {/* QUANTITY */}
                  <div className="mt-3">
                    <label className="text-sm block mb-1">Quantity</label>
                    <select
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.id, Number(e.target.value))
                      }
                      className="border px-3 py-2 text-sm"
                    >
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                    </select>
                  </div>

                  {/* ✅ ITEM TOTAL */}
                  <p className="mt-3 text-sm">
                    Item Total: Rs {(item.price * item.quantity).toLocaleString()}
                  </p>

                  {/* DELETE + SAVE */}
                  <div className="flex items-center gap-3 mt-4 text-sm uppercase">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="hover:opacity-70"
                    >
                      DELETE
                    </button>

                    <span>|</span>

                    <button className="hover:opacity-70">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.25 3H6.75A2.25 2.25 0 004.5 5.25v15L12 17.25l7.5 3V5.25A2.25 2.25 0 0017.25 3z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT SIDE */}
          <div className="border p-6 h-fit">
            <h2 className="text-xl mb-4">Order Summary</h2>

            <div className="flex justify-between mb-3">
              <span>Total</span>
              <span>Rs {total.toLocaleString()}</span>
            </div>

            <Link href="/checkout">
              <button className="w-full bg-black text-white py-3 mt-4">
                Checkout
              </button>
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}