"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = sessionStorage.getItem("user");

    if (!savedUser) {
      router.push("/");
      return;
    }

    const user = JSON.parse(savedUser);

    if (user.role !== "admin") {
      router.push("/home");
      return;
    }

    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("userUpdated"));
    router.push("/");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f5f6fa] flex items-center justify-center">
        <p className="text-gray-600">Loading admin panel...</p>
      </main>
    );
  }

  const menuItems = [
    { name: "Dashboard", href: "/admin" },
    { name: "Purchases", href: "/admin/orders" },
    { name: "Products", href: "/admin/products" },
    { name: "Customers", href: "/admin/customers" },
    { name: "Payments", href: "/admin/payments" },
  ];

  return (
    <div className="min-h-screen bg-[#f5f6fa] text-black flex">
      <aside className="w-[270px] min-h-screen bg-white border-r border-gray-200 flex flex-col justify-between px-5 py-6">
        <div>
          <Link href="/admin">
            <div className="mb-10 cursor-pointer">
              <p className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-2">
                Lily Studio
              </p>
              <h1 className="text-2xl font-semibold">Admin Panel</h1>
            </div>
          </Link>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-4 py-3 rounded-xl transition border ${
                    isActive
                      ? "bg-black text-white border-black shadow-sm"
                      : "bg-white text-black border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-8 border-t border-gray-200 space-y-2">
          <Link
            href="/home"
            className="block px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition"
          >
            Back to Website
          </Link>

          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition"
          >
            Logout
          </button>
        </div>
      </aside>

      <section className="flex-1 p-6 md:p-8 lg:p-10">
        {children}
      </section>
    </div>
  );
}