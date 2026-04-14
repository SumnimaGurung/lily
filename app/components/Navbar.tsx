"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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

        <div className="flex items-center gap-6 text-sm uppercase tracking-wider">
          <Link href="/search">Search</Link>

          {user ? (
            <Link href="/account">Account</Link>
          ) : (
            <Link href="/">Account</Link>
          )}

          <Link href="/cart">Cart ({cartCount})</Link>
        </div>
      </div>
    </header>
  );
}