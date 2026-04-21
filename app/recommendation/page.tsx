"use client";

import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";


const products = [
  { id: 1, name: "Tailored Blazer", price: 6000, category: "Blazers", image: "/blackblazer.jpg" },
  { id: 2, name: "Top", price: 3500, category: "Tops", image: "/top.jpg" },
  { id: 3, name: "Dress", price: 7500, category: "Dresses", image: "/dress.jpg" },
  { id: 4, name: "Sweater", price: 3200, category: "Outerwear", image: "/sweater.jpg" },
  { id: 5, name: "White Blazer", price: 7000, category: "Blazers", image: "/blazer.jpg" },
  { id: 6, name: "Jacket", price: 5500, category: "Outerwear", image: "/jacket.jpg" },
  { id: 7, name: "Trousers", price: 4000, category: "Bottoms", image: "/trouser.jpg" },
  { id: 8, name: "Wide Jeans", price: 4500, category: "Bottoms", image: "/jeans.jpg" },
  { id: 9, name: "Straight Jeans", price: 5000, category: "Bottoms", image: "/jeans2.jpg" },
  { id: 10, name: "Midi Skirt", price: 4800, category: "Bottoms", image: "/skirt1.jpg" },
  { id: 11, name: "Polka Midi", price: 5200, category: "Bottoms", image: "/skirt2.jpg" },
  { id: 12, name: "Soft Cardigan", price: 4200, category: "Outerwear", image: "/cardigan1.jpg" },
  { id: 13, name: "Long Cardigan", price: 4500, category: "Outerwear", image: "/cardigan2.jpg" },
  { id: 14, name: "Knit Sweater", price: 3800, category: "Outerwear", image: "/sweater2.jpg" },
  { id: 15, name: "Mesh Top", price: 4000, category: "Tops", image: "/top2.jpg" },
  { id: 16, name: "Silk Top", price: 3600, category: "Tops", image: "/top3.jpg" },
  { id: 17, name: "Mini Dress", price: 6500, category: "Dresses", image: "/dress2.jpg" },
  { id: 18, name: "Maxi Dress", price: 8000, category: "Dresses", image: "/dress3.jpg" },
  { id: 19, name: "Floral Dress", price: 7200, category: "Dresses", image: "/dress4.jpg" },
  { id: 20, name: "Bodycon Dress", price: 6800, category: "Dresses", image: "/dress5.jpg" },
  { id: 21, name: "Shirt", price: 2500, category: "Tops", image: "/shirt.jpg" },
  { id: 22, name: "Ribbed Tank", price: 2800, category: "Tops", image: "/tank2.jpg" },
  { id: 23, name: "Ballet", price: 2600, category: "Tops", image: "/ballet.jpg" },
  { id: 24, name: "Flats", price: 2700, category: "Tops", image: "/flat.jpg" },
  { id: 25, name: "Sandal", price: 2400, category: "Tops", image: "/sandal.jpg" },
];

const occasions = [
  { key: "casual", title: "Casual Hangout", subtitle: "Easy everyday pieces for relaxed outings." },
  { key: "brunch", title: "Brunch", subtitle: "Soft and polished looks for daytime plans." },
  { key: "night", title: "Night Dinner", subtitle: "Elegant pieces for refined evening styling." },
  { key: "office", title: "Office", subtitle: "Clean and structured looks for workwear dressing." },
  { key: "weekend", title: "Weekend", subtitle: "Comfortable essentials for slow and stylish weekends." },
  { key: "date", title: "Date", subtitle: "Feminine and elegant styles for special moments." },
];

export default function RecommendationPage() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "";
  const [message, setMessage] = useState("");

  let allowedCategories: string[] = [];
  let title = "Recommendation";
  let subtitle = "Choose an occasion to discover styled pieces.";

  if (type === "casual") {
    title = "Casual Hangout";
    subtitle = "Easy everyday pieces for relaxed outings.";
    allowedCategories = ["Tops", "Bottoms", "Outerwear"];
  } else if (type === "brunch") {
    title = "Brunch";
    subtitle = "Soft and polished looks for daytime plans.";
    allowedCategories = ["Dresses", "Tops", "Bottoms", "Blazers"];
  } else if (type === "night") {
    title = "Night Dinner";
    subtitle = "Elegant pieces for refined evening styling.";
    allowedCategories = ["Dresses", "Blazers", "Tops"];
  } else if (type === "office") {
    title = "Office";
    subtitle = "Clean and structured looks for workwear dressing.";
    allowedCategories = ["Blazers", "Bottoms", "Tops"];
  } else if (type === "weekend") {
    title = "Weekend";
    subtitle = "Comfortable essentials for slow and stylish weekends.";
    allowedCategories = ["Tops", "Bottoms", "Outerwear"];
  } else if (type === "date") {
    title = "Date";
    subtitle = "Feminine and elegant styles for special moments.";
    allowedCategories = ["Dresses", "Tops", "Blazers"];
  }

  const filteredProducts =
    allowedCategories.length === 0
      ? []
      : products.filter((product) => allowedCategories.includes(product.category));

  const handleAddToCart = (product: any) => {
    const existingCart = localStorage.getItem("cart");
    const cart = existingCart ? JSON.parse(existingCart) : [];

    const existingProduct = cart.find((item: any) => item.id === product.id);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      });
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
        <h1 className="text-3xl font-serif">{title}</h1>
        <p className="text-sm text-gray-500 mt-2">{subtitle}</p>
      </div>

      {message && (
        <p className="px-6 md:px-10 pt-4 text-sm text-green-600">{message}</p>
      )}

      <div className="px-10 md:px-20 lg:px-40 py-10">
        {type === "" ? (
          <>
            <p className="text-center text-gray-500 mb-10">
              Select an occasion to get style recommendations.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {occasions.map((occasion) => (
                <Link
                  key={occasion.key}
                  href={`/recommendation?type=${occasion.key}`}
                  className="relative h-[260px] rounded-2xl overflow-hidden group"
                >
                  <img
                    src="/flowers.jpg"
                    alt="Occasion background"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />

                  <div className="absolute inset-0 bg-white/10" />

                  <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
                    <h2 className="text-white text-2xl md:text-3xl font-serif mb-2">
                      {occasion.title}
                    </h2>
                    <p className="text-white/90 text-sm">
                      {occasion.subtitle}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : filteredProducts.length === 0 ? (
          <p className="text-center text-gray-500">
            No recommendations available.
          </p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div key={product.id}>
                <div className="bg-white p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-[400px] object-contain"
                  />
                </div>

                <p className="text-sm mt-2 uppercase">{product.name}</p>
                <p className="text-sm text-gray-600 mb-3">
                  Rs {product.price.toLocaleString()}
                </p>

                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-black text-white py-2 text-sm uppercase hover:opacity-90 transition"
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