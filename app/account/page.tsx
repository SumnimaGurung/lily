"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("account");

  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      router.push("/");
      return;
    }

    const parsedUser = JSON.parse(savedUser);
    setUser(parsedUser);
    setLoading(false);

    const fetchOrders = async () => {
      try {
        setOrdersLoading(true);

        const res = await fetch("/api/my-orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: parsedUser.email,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          setOrders(data.orders || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("userUpdated"));
    router.push("/");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white text-black px-6 md:px-10 py-10">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-black px-6 md:px-10 py-10">
      <h1 className="text-3xl font-serif mb-8">My Account</h1>

      <div className="grid md:grid-cols-4 gap-10">
        {/* LEFT SIDE */}
        <div className="md:col-span-1 flex flex-col">
          <div className="border p-4 space-y-3">
            <button
              onClick={() => setActiveSection("account")}
              className={`w-full text-left px-3 py-3 border ${
                activeSection === "account"
                  ? "bg-black text-white"
                  : "bg-white text-black"
              }`}
            >
              My Account
            </button>

            <button
              onClick={() => setActiveSection("purchases")}
              className={`w-full text-left px-3 py-3 border ${
                activeSection === "purchases"
                  ? "bg-black text-white"
                  : "bg-white text-black"
              }`}
            >
              Purchases
            </button>

            <button
              onClick={() => setActiveSection("returns")}
              className={`w-full text-left px-3 py-3 border ${
                activeSection === "returns"
                  ? "bg-black text-white"
                  : "bg-white text-black"
              }`}
            >
              Return
            </button>

            <button
              onClick={() => setActiveSection("settings")}
              className={`w-full text-left px-3 py-3 border ${
                activeSection === "settings"
                  ? "bg-black text-white"
                  : "bg-white text-black"
              }`}
            >
              Account Settings
            </button>
          </div>

          {/* LOGOUT OUTSIDE THE BOX */}
          <button
            onClick={handleLogout}
            className="mt-4 text-left underline"
          >
            Logout
          </button>
        </div>

        {/* RIGHT SIDE */}
        <div className="md:col-span-3 border p-6">
          {activeSection === "account" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-medium">My Account</h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Name</p>
                  <p>{user?.full_name || user?.name || "User"}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p>{user?.email}</p>
                </div>
              </div>

              <div className="pt-4">
                <button className="border px-5 py-2">
                  Edit Details
                </button>
              </div>
            </div>
          )}

          {activeSection === "purchases" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-medium">Purchases</h2>

              {ordersLoading ? (
                <p className="text-gray-600">Loading purchases...</p>
              ) : orders.length === 0 ? (
                <div className="border p-5">
                  <h3 className="text-lg font-medium">No purchases yet</h3>
                  <p className="text-gray-600 mt-2">
                    Once you place an order, your purchase details will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.order_id} className="border p-5 space-y-3">
                      <div className="flex flex-col md:flex-row md:justify-between gap-2">
                        <div>
                          <p className="text-sm text-gray-500">Purchase ID</p>
                          <p className="font-medium">#{order.order_id}</p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Total</p>
                          <p className="font-medium">${order.total_amount}</p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Payment</p>
                          <p className="font-medium">
                            {order.payment_method || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row md:justify-between gap-2 pt-2 border-t">
                        <div>
                          <p className="text-sm text-gray-500">Order Status</p>
                          <p>{order.order_status}</p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Payment Status</p>
                          <p>{order.payment_status}</p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Created At</p>
                          <p>
                            {order.created_at
                              ? new Date(order.created_at).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSection === "returns" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-medium">Return</h2>

              <div className="border p-5">
                <h3 className="text-lg font-medium">No return requests</h3>
                <p className="text-gray-600 mt-2">
                  Your return information will appear here when you request a return.
                </p>
              </div>
            </div>
          )}

          {activeSection === "settings" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-medium">Account Settings</h2>

              <div className="space-y-3">
                <button className="w-full text-left border px-4 py-3">
                  My Details
                </button>

                <button className="w-full text-left border px-4 py-3">
                  Add Address
                </button>

                <button className="w-full text-left border px-4 py-3">
                  Change Password
                </button>

                <button className="w-full text-left border px-4 py-3">
                  Payment Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}