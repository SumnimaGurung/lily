"use client";

import { useEffect, useState } from "react";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("wishlist");
    if (stored) {
      setWishlist(JSON.parse(stored));
    }
  }, []);

  const removeItem = (id: number) => {
    const updated = wishlist.filter((item) => item.id !== id);
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
    setMessage("Item removed from wishlist");

    setTimeout(() => {
      setMessage("");
    }, 1500);
  };

  const handleAddToCart = (product: any) => {
    const existingCart = localStorage.getItem("cart");
    const cart = existingCart ? JSON.parse(existingCart) : [];

    const existingProduct = cart.find((item: any) => item.id === product.id);

    if (existingProduct) {
      existingProduct.quantity = existingProduct.quantity + 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    setMessage(`${product.name} added to cart`);

    setTimeout(() => {
      setMessage("");
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="px-6 md:px-10 py-8 border-b border-gray-200">
        <h1 className="text-3xl font-serif">Wishlist</h1>
        <p className="text-sm text-gray-500 mt-2">
          {wishlist.length} {wishlist.length === 1 ? "item" : "items"}
        </p>
      </div>

      {message && (
        <p className="px-6 md:px-10 pt-4 text-sm text-green-600">{message}</p>
      )}

      <div className="px-10 md:px-20 lg:px-40 py-10">
        {wishlist.length === 0 ? (
          <p className="text-center text-gray-500">Your wishlist is empty</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {wishlist.map((product) => (
              <div key={product.id}>
                <div className="bg-white p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-[400px] object-contain"
                  />
                </div>

                <p className="text-sm mt-2 uppercase">{product.name}</p>

                {/* ✅ PRICE FIXED */}
                <p className="text-sm text-gray-600 mb-3">
                  Rs {Number(product.price).toLocaleString()}
                </p>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full border border-black py-2 text-sm uppercase hover:bg-black hover:text-white transition"
                  >
                    Add to Cart
                  </button>

                  <button
                    onClick={() => removeItem(product.id)}
                    className="w-full border border-gray-300 py-2 text-sm uppercase hover:bg-gray-100 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}