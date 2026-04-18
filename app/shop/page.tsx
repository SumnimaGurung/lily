"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

const products = [
  { id: 1, name: "Tailored Blazer", price: 60, category: "Blazers", image: "/blackblazer.jpg" },
  { id: 2, name: "Top", price: 35, category: "Tops", image: "/top.jpg" },
  { id: 3, name: "Dress", price: 75, category: "Dresses", image: "/dress.jpg" },
  { id: 4, name: "Sweater", price: 32, category: "Outerwear", image: "/sweater.jpg" },
  { id: 5, name: "White Blazer", price: 70, category: "Blazers", image: "/blazer.jpg" },
  { id: 6, name: "Jacket", price: 55, category: "Outerwear", image: "/jacket.jpg" },
  { id: 7, name: "Trousers", price: 40, category: "Bottoms", image: "/trouser.jpg" },
  { id: 8, name: "Wide Jeans", price: 45, category: "Bottoms", image: "/jeans.jpg" },
  { id: 9, name: "Straight Jeans", price: 50, category: "Bottoms", image: "/jeans2.jpg" },
  { id: 10, name: "Midi Skirt", price: 48, category: "Bottoms", image: "/skirt1.jpg" },
  { id: 11, name: "Polka Midi", price: 52, category: "Bottoms", image: "/skirt2.jpg" },
  { id: 12, name: "Soft Cardigan", price: 42, category: "Outerwear", image: "/cardigan1.jpg" },
  { id: 13, name: "Long Cardigan", price: 45, category: "Outerwear", image: "/cardigan2.jpg" },
  { id: 14, name: "Knit Sweater", price: 38, category: "Outerwear", image: "/sweater2.jpg" },
  { id: 15, name: "Mesh Top", price: 40, category: "Tops", image: "/top2.jpg" },
  { id: 16, name: "silk Top", price: 36, category: "Tops", image: "/top3.jpg" },
  { id: 17, name: "Mini Dress", price: 65, category: "Dresses", image: "/dress2.jpg" },
  { id: 18, name: "Maxi Dress", price: 80, category: "Dresses", image: "/dress3.jpg" },
  { id: 19, name: "Floral Dress", price: 72, category: "Dresses", image: "/dress4.jpg" },
  { id: 20, name: "Bodycon Dress", price: 68, category: "Dresses", image: "/dress5.jpg" },
  { id: 21, name: "Shirt", price: 25, category: "Tops", image: "/shirt.jpg" },
  { id: 22, name: "Ribbed Tank", price: 28, category: "Tops", image: "/tank2.jpg" },
  { id: 23, name: "Ballet", price: 26, category: "Tops", image: "/ballet.jpg" },
  { id: 24, name: "Flats", price: 27, category: "Tops", image: "/flat.jpg" },
  { id: 25, name: "Sandal", price: 24, category: "Tops", image: "/sandal.jpg" },
];

const categories = ["All", "Tops", "Bottoms", "Dresses", "Blazers", "Outerwear"];

export default function ShopPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [message, setMessage] = useState("");

  let filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  if (search.trim() !== "") {
    filteredProducts = filteredProducts.filter((product) => {
      return (
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase())
      );
    });
  }

  const handleAddToCart = (product: any) => {
    const existingCart = localStorage.getItem("cart");
    const cart = existingCart ? JSON.parse(existingCart) : [];

    const existingProduct = cart.find((item: any) => item.id === product.id);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));

    setMessage(`${product.name} added to cart`);

    setTimeout(() => setMessage(""), 1500);
  };

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="px-6 md:px-10 py-8 border-b border-gray-200 flex flex-col gap-6 lg:flex-row lg:justify-between lg:items-center">
        <div>
          <h1 className="text-3xl font-serif">Shop</h1>
          {search && (
            <p className="text-sm text-gray-500 mt-2">
              Search result for: <span className="text-black">{search}</span>
            </p>
          )}
        </div>

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
      </div>

      {message && (
        <p className="px-6 md:px-10 pt-4 text-sm text-green-600">{message}</p>
      )}

      <div className="px-10 md:px-20 lg:px-40 py-10">
        {filteredProducts.length === 0 ? (
          <p className="text-center text-gray-500">No products found.</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div key={product.id}>
                
                {/* Image with WHITE background */}
                <div className="bg-white p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-[400px] object-contain"
                  />
                </div>

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
        )}
      </div>
    </main>
  );
}