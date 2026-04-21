"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, User, Heart, ShoppingBag } from "lucide-react";

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [searchText, setSearchText] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const updateCartCount = () => {
      const savedCart = localStorage.getItem("cart");
      const cart = savedCart ? JSON.parse(savedCart) : [];

      let totalItems = 0;
      for (let i = 0; i < cart.length; i++) {
        totalItems = totalItems + cart[i].quantity;
      }

      setCartCount(totalItems);
    };

    const updateUser = () => {
      const savedUser = sessionStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        setUser(null);
      }
    };

    updateCartCount();
    updateUser();

    window.addEventListener("storage", updateCartCount);
    window.addEventListener("cartUpdated", updateCartCount);
    window.addEventListener("userUpdated", updateUser);

    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("userUpdated", updateUser);
    };
  }, []);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchText.trim() !== "") {
      router.push(`/shop?search=${encodeURIComponent(searchText.trim())}`);
      setMenuOpen(false);
    }
  };

  const handleAccountClick = () => {
    if (user) {
      router.push("/account");
    } else {
      router.push("/");
    }
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 md:px-10 py-5">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setMenuOpen(true)}
              className="text-2xl"
            >
              ☰
            </button>

            <Link href="/home">
              <h1 className="text-3xl font-serif tracking-tight cursor-pointer">
                Lily Studio
              </h1>
            </Link>

            <nav className="hidden md:flex gap-8 text-sm uppercase tracking-wider ml-6">
              <Link href="/newin">New In</Link>
              <Link href="/shop">Shop</Link>
              <Link href="/recommendation">Recommendation</Link>
            </nav>
          </div>

          <div className="flex items-center gap-5 ml-auto">
            <div className="flex items-center rounded-full border border-gray-300 px-4 py-2 cursor-text transition focus-within:border-black focus-within:shadow-sm">
              <Search size={16} className="text-gray-500" />
              <input
                type="text"
                placeholder="Search"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={handleSearch}
                className="ml-2 w-28 bg-transparent text-sm outline-none placeholder:text-gray-400"
              />
            </div>

            <button onClick={handleAccountClick}>
              <User size={20} />
            </button>

            <Link href="/wishlist">
              <Heart size={20} />
            </Link>

            <Link href="/cart" className="relative">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 text-xs">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setMenuOpen(false)}
          ></div>

          <div className="absolute top-0 left-0 h-full w-72 bg-white p-6 shadow-lg overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-medium">Menu</h2>
              <button
                onClick={() => setMenuOpen(false)}
                className="text-xl"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-4 text-sm uppercase tracking-wider mb-8">
              <Link href="/newin" onClick={() => setMenuOpen(false)}>
                New In
              </Link>
              <Link href="/shop" onClick={() => setMenuOpen(false)}>
                Shop
              </Link>
              <Link href="/shop?search=sale" onClick={() => setMenuOpen(false)}>
                Recommendation
              </Link>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <p className="text-xs uppercase text-gray-500 mb-4">
                Shop Categories
              </p>

              <div className="flex flex-col gap-4 text-sm uppercase tracking-wider">
                <Link href="/shop?search=tops" onClick={() => setMenuOpen(false)}>
                  Tops
                </Link>
                <Link href="/shop?search=bottoms" onClick={() => setMenuOpen(false)}>
                  Bottoms
                </Link>
                <Link href="/shop?search=dresses" onClick={() => setMenuOpen(false)}>
                  Dresses
                </Link>
                <Link href="/shop?search=blazers" onClick={() => setMenuOpen(false)}>
                  Blazers
                </Link>
                <Link href="/shop?search=outerwear" onClick={() => setMenuOpen(false)}>
                  Outerwear
                </Link>
                <Link href="/shop?search=jeans" onClick={() => setMenuOpen(false)}>
                  Jeans
                </Link>
                <Link href="/shop?search=cardigan" onClick={() => setMenuOpen(false)}>
                  Cardigan
                </Link>
                <Link href="/shop?search=sweater" onClick={() => setMenuOpen(false)}>
                  Sweater
                </Link>
                <Link href="/shop?search=tank top" onClick={() => setMenuOpen(false)}>
                  Tank Top
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}