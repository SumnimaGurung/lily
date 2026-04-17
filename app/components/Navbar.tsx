"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Search, User, Heart, ShoppingBag } from "lucide-react";

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState<any>(null);

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
      const savedUser = localStorage.getItem("user");
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

    window.addEventListener("storage", updateUser);
    window.addEventListener("userUpdated", updateUser);

    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);

      window.removeEventListener("storage", updateUser);
      window.removeEventListener("userUpdated", updateUser);
    };
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 md:px-10 py-5">
        <div className="flex items-center gap-6">
          <button className="text-2xl">☰</button>

          <Link href="/home">
            <h1 className="text-3xl font-serif tracking-tight cursor-pointer">
              Lily Studio
            </h1>
          </Link>

          <nav className="hidden md:flex gap-8 text-sm uppercase tracking-wider ml-6">
            <Link href="/home">New In</Link>
            <Link href="/shop">Shop</Link>
            <Link href="/trends">Trends</Link>
            <Link href="/sale">Sale</Link>
          </nav>
        </div>

        <div className="flex items-center gap-5 ml-auto">
          <div className="flex items-center rounded-full border border-gray-300 px-4 py-2">
            <Search size={16} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search"
              className="ml-2 w-28 bg-transparent text-sm outline-none placeholder:text-gray-400"
            />
          </div>

          <Link href="/account">
            <User size={20} />
          </Link>

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
  );
}