"use client";

import { useState } from "react";

const products = [
  { id: 1, name: "Tailored Blazer", price: 60, category: "Blazers", image: "/blackblazer.jpg" },
  { id: 2, name: "Top", price: 35, category: "Tops", image: "/top.jpg" },
  { id: 3, name: "Dress", price: 75, category: "Dresses", image: "/dress.jpg"  },
  { id: 4, name: "Sweater", price: 32, category: "Shorts", image: "/sweater.jpg" },
  { id: 5, name: "White Blazer", price: 70, category: "Blazers", image: "/blazer.jpg" },
  { id: 6, name: "Jacket", price: 55, category: "Outerwear", image: "/jacket.jpg" },
  { id: 7, name: "Trousers", price: 40, category: "Bottoms", image: "/trouser.jpg"},
  { id: 8, name: "Wide Jeans", price: 45, category: "Bottoms", image: "/jeans.jpg"},
];



const categories = ["All", "Tops", "Bottoms", "Dresses", "Blazers", "Shorts", "Outerwear"];

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState("two");
  const [message, setMessage] = useState("");

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory);

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
      <div className="px-6 md:px-10 py-8 border-b border-gray-200 flex flex-col gap-6 lg:flex-row lg:justify-between lg:items-center">
        <h1 className="text-3xl font-serif">Shop</h1>

        <div className="flex gap-6 text-sm uppercase flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={
                selectedCategory === cat
                  ? "border-b border-black"
                  : "text-gray-500"
              }
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("two")}
            className={viewMode === "two" ? "bg-black text-white px-3 py-1" : "border px-3 py-1"}
          >
            1
          </button>

          <button
            onClick={() => setViewMode("four")}
            className={viewMode === "four" ? "bg-black text-white px-3 py-1" : "border px-3 py-1"}
          >
            2
          </button>
        </div>
      </div>

      {message && (
        <p className="px-6 md:px-10 pt-4 text-sm text-green-600">{message}</p>
      )}

      <div className="px-10 md:px-20 lg:px-40 py-10">
        <div
          className={
            viewMode === "two"
              ? "grid grid-cols-1 sm:grid-cols-2 gap-8"
              : "grid grid-cols-2 lg:grid-cols-4 gap-8"
          }
        >
          {filteredProducts.map((product) => (
            <div key={product.id}>
              <img
                src={product.image}
                alt={product.name}
                className={
                  viewMode === "two"
                    ? "w-full h-[500px] object-cover"
                    : "w-full h-[400px] object-cover"
                }
              />

              <p className="text-sm mt-2 uppercase">{product.name}</p>
              <p className="text-sm text-gray-600 mb-3">${product.price}</p>

              <button
                onClick={() => handleAddToCart(product)}
                className="w-full border border-black py-2 text-sm uppercase hover:bg-black hover:text-white transition"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}