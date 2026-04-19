"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Heart } from "lucide-react";

const hardcodedProducts = [
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

const categories = ["All", "Tops", "Bottoms", "Dresses", "Blazers", "Outerwear", "Admin"];

export default function ShopPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [message, setMessage] = useState("");
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [loadingDb, setLoadingDb] = useState(true);
  const [wishlist, setWishlist] = useState<any[]>([]);

  useEffect(() => {
    const fetchDbProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();

        const mappedProducts = Array.isArray(data)
          ? data.map((product: any) => ({
              id: `db-${product.product_id}`,
              product_id: product.product_id,
              name: product.name,
              price: product.price,
              category: "Admin",
              image: product.image,
              display_label: product.display_label,
            }))
          : [];

        setDbProducts(mappedProducts);
      } catch (error) {
        console.error(error);
        setDbProducts([]);
      } finally {
        setLoadingDb(false);
      }
    };

    fetchDbProducts();

    const storedWishlist = localStorage.getItem("wishlist");
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }
  }, []);

  const allProducts = [...hardcodedProducts, ...dbProducts];

  let filteredProducts =
    selectedCategory === "All"
      ? allProducts
      : allProducts.filter((product) => product.category === selectedCategory);

  if (search.trim() !== "") {
    filteredProducts = filteredProducts.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  const handleAddToCart = (product: any) => {
    const existingCart = localStorage.getItem("cart");
    const cart = existingCart ? JSON.parse(existingCart) : [];

    const cartId = product.product_id ? `db-${product.product_id}` : product.id;

    const existingProduct = cart.find((item: any) => item.id === cartId);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({
        id: cartId,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));

    setMessage(`${product.name} added to cart`);
    setTimeout(() => setMessage(""), 1500);
  };

  const handleWishlist = (product: any) => {
    const existing = localStorage.getItem("wishlist");
    const wishlistItems = existing ? JSON.parse(existing) : [];

    const id = product.product_id ? `db-${product.product_id}` : product.id;

    const exists = wishlistItems.find((item: any) => item.id === id);

    let updated;

    if (exists) {
      updated = wishlistItems.filter((item: any) => item.id !== id);
      setMessage("Removed from wishlist");
    } else {
      updated = [...wishlistItems, { ...product, id }];
      setMessage("Added to wishlist");
    }

    localStorage.setItem("wishlist", JSON.stringify(updated));
    setWishlist(updated);

    setTimeout(() => setMessage(""), 1500);
  };

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="px-6 md:px-10 py-8 border-b border-gray-200 flex justify-between items-center">
        <h1 className="text-3xl font-serif">Shop</h1>
      </div>

      {message && (
        <p className="px-6 md:px-10 pt-4 text-sm text-green-600">{message}</p>
      )}

      <div className="px-10 md:px-20 lg:px-40 py-10">
        {loadingDb ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => {
              const id = product.product_id ? `db-${product.product_id}` : product.id;
              const isSaved = wishlist.find((item: any) => item.id === id);

              return (
                <div key={id}>
                  <div className="relative bg-white p-4">
                    <button
                      onClick={() => handleWishlist(product)}
                      className="absolute top-2 right-2"
                    >
                      <Heart
                        size={20}
                        className={isSaved ? "fill-black text-black" : "text-black"}
                      />
                    </button>

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
                    className="w-full border border-black py-2 text-sm uppercase hover:bg-black hover:text-white transition"
                  >
                    Add to Cart
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}