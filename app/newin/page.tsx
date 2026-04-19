"use client";

import { useEffect, useState } from "react";

export default function NewInPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewProducts = async () => {
      try {
        const res = await fetch("/api/newin");
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNewProducts();
  }, []);

  const handleAddToCart = (product: any) => {
    const existingCart = localStorage.getItem("cart");
    const cart = existingCart ? JSON.parse(existingCart) : [];

    const existingProduct = cart.find(
      (item: any) => item.id === product.product_id
    );

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({
        id: product.product_id,
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
      <div className="px-6 md:px-10 py-10 border-b border-gray-200">
        <h1 className="text-3xl font-serif">New In</h1>
        <p className="text-sm text-gray-500 mt-2">
          Discover the latest arrivals at Lily Studio
        </p>
      </div>

      {message && (
        <p className="px-6 md:px-10 pt-4 text-sm text-green-600">{message}</p>
      )}

      <div className="px-10 md:px-20 lg:px-40 py-10">
        {loading ? (
          <p className="text-center text-gray-500">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500">No new products available.</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product.product_id}>
                <div className="bg-white p-4 relative">
                  <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 uppercase">
                    {product.display_label}
                  </span>

                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-[400px] object-contain"
                  />
                </div>

                <p className="text-sm mt-2 uppercase">{product.name}</p>
                <p className="text-sm text-gray-600">
                  Rs {Number(product.price).toLocaleString()}
                </p>

                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full mt-3 border border-black py-2 text-sm uppercase hover:bg-black hover:text-white transition"
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